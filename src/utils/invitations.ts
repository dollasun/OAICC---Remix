/**
 * Inviting people to a school: one entry point for a single invite (`inviteOne`) and a CSV pipeline for
 * many (`parseInviteCsv` → `runBulkInvite`). Both share `inviteOne`, so single and bulk invites behave the
 * same. Which roles can be bulk-invited, and which CSV columns each one takes, is declared once in
 * `ROLE_SPECS`; adding a role means adding an entry there.
 */
import Papa from 'papaparse';
import type { School, SchoolClass } from '../types';
import {
  addExistingStudentToSchool, assignTeacher, createInvite, linkParentToStudents, moveStudentToClass, studentsStore,
  type Result,
} from './schoolData';
import { sendInviteEmails } from './inviteEmail';

export type InviteRole = 'teacher' | 'student' | 'parent';

const ok = <T,>(value: T): Result<T> => ({ ok: true, value });
const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });
const norm = (s: string) => s.trim().toLowerCase();

/* ───────────── single invite ───────────── */

export interface InviteRequest {
  role: InviteRole;
  email: string;
  /** Students join one class; teachers can be assigned to several. */
  classIds?: string[];
  /** Parents can be linked to a child at invite time. */
  childId?: string;
}

export type InviteOutcome =
  | { kind: 'invited'; link: string }
  | { kind: 'added' | 'moved'; message: string };

/** Invites one person, or attaches them directly when they already have an OAICC account. */
export function inviteOne(school: Pick<School, 'id' | 'name'>, req: InviteRequest): Result<InviteOutcome> {
  const classIds = req.classIds ?? [];

  if (req.role === 'student') {
    const existing = studentsStore.all().find(s => norm(s.email) === norm(req.email));
    if (existing) {
      if (existing.schoolId === school.id) {
        if (classIds[0] && existing.classId !== classIds[0]) {
          moveStudentToClass(existing.id, classIds[0]);
          return ok({ kind: 'moved', message: 'Already in your school, moved to the selected class.' });
        }
        return fail('This student is already in your school.');
      }
      if (existing.schoolId) return fail('This student belongs to another school.');
      const added = addExistingStudentToSchool(school.id, existing.id, classIds[0]);
      if (added.ok === false) return fail(added.error);
      return ok({ kind: 'added', message: 'Already has an OAICC account, added to your school and notified.' });
    }
  }

  const created = createInvite({
    role: req.role,
    email: req.email,
    classId: req.role === 'student' ? classIds[0] : undefined,
    invitedBy: { role: 'school', userId: school.id },
  });
  if (created.ok === false) return fail(created.error);
  const { invite, link } = created.value;

  if (req.role === 'parent' && req.childId) linkParentToStudents(invite.userId, [req.childId]);
  if (req.role === 'teacher') classIds.forEach(id => assignTeacher(id, invite.userId));
  sendInviteEmails([{ to: invite.email, role: req.role, schoolName: school.name, link }]);
  return ok({ kind: 'invited', link });
}

/* ───────────── bulk invite: role specs ───────────── */

interface RoleSpec {
  label: string;
  /** CSV columns, in order, when invited from the dashboard. */
  columns: string[];
  /** 'one' = exactly one class name, 'many' = optional list separated by ";", 'none' = no class column. */
  classColumn: 'one' | 'many' | 'none';
  classRequired: boolean;
}

export const ROLE_SPECS: Record<InviteRole, RoleSpec> = {
  student: { label: 'Student', columns: ['email', 'role', 'class'], classColumn: 'one', classRequired: true },
  teacher: { label: 'Teacher', columns: ['email', 'role', 'class'], classColumn: 'many', classRequired: false },
  parent: { label: 'Parent / Guardian', columns: ['email', 'role'], classColumn: 'none', classRequired: false },
};

export const BULK_ROLES = Object.keys(ROLE_SPECS) as InviteRole[];
export const MAX_BULK_ROWS = 500;
export const MAX_FILE_BYTES = 1_000_000;

/** When bulk-adding from inside a class, the class is fixed and the CSV is just a list of emails. */
export interface BulkContext {
  role: InviteRole;
  fixedClass?: SchoolClass;
}

const columnsFor = (ctx: BulkContext) => (ctx.fixedClass ? ['email'] : ROLE_SPECS[ctx.role].columns);

/** The downloadable template: header plus one example row. */
export function buildTemplateCsv(ctx: BulkContext, classes: SchoolClass[]): string {
  const fields = columnsFor(ctx);
  const example: Record<string, string> = {
    email: `${ctx.role}@example.com`,
    role: ctx.role,
    class: classes[0]?.name ?? 'Class name',
  };
  return Papa.unparse({ fields, data: [fields.map(f => example[f])] });
}

export const templateFileName = (ctx: BulkContext) =>
  `oaicc-${ctx.role}-invite-template${ctx.fixedClass ? `-${ctx.fixedClass.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : ''}.csv`;

/* ───────────── bulk invite: parse + validate ───────────── */

export interface PreviewRow {
  /** Line number in the file, counting the header as line 1. */
  line: number;
  email: string;
  classNames: string[];
  classIds: string[];
  errors: string[];
}

export interface ParsedInviteCsv {
  /** A problem with the file as a whole (wrong columns, too large, empty). */
  fileError?: string;
  rows: PreviewRow[];
}

const HEADER_ALIASES: Record<string, string> = {
  'email address': 'email', 'e-mail': 'email',
  'user type': 'role', usertype: 'role', user_type: 'role',
  'class name': 'class', classes: 'class',
};
const canonicalHeader = (h: string) => {
  const k = h.replace(/^﻿/, '').trim().toLowerCase();
  return HEADER_ALIASES[k] ?? k;
};
const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/** Reads and validates a CSV against the role's rules and the school's real classes. */
export function parseInviteCsv(file: File, ctx: BulkContext, classes: SchoolClass[]): Promise<ParsedInviteCsv> {
  const spec = ROLE_SPECS[ctx.role];
  if (!/\.csv$/i.test(file.name)) return Promise.resolve({ rows: [], fileError: 'Upload a .csv file.' });
  if (file.size > MAX_FILE_BYTES) return Promise.resolve({ rows: [], fileError: 'This file is too large. Keep it under 1 MB.' });

  return new Promise(resolve => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: canonicalHeader,
      complete: ({ data, meta }) => {
        const required = columnsFor(ctx).filter(c => c === 'email' || (c === 'class' && spec.classRequired));
        const missing = required.filter(c => !meta.fields?.includes(c));
        if (missing.length) return resolve({ rows: [], fileError: `The CSV is missing the "${missing.join('", "')}" column. Download the template to see the expected format.` });
        if (!data.length) return resolve({ rows: [], fileError: 'The CSV has no rows.' });
        if (data.length > MAX_BULK_ROWS) return resolve({ rows: [], fileError: `A single upload can contain up to ${MAX_BULK_ROWS} rows. Split the file and upload it in parts.` });
        resolve({ rows: validateRows(data, ctx, classes) });
      },
      error: () => resolve({ rows: [], fileError: 'Could not read this file.' }),
    });
  });
}

function validateRows(data: Record<string, string>[], ctx: BulkContext, classes: SchoolClass[]): PreviewRow[] {
  const spec = ROLE_SPECS[ctx.role];
  const classByName = new Map<string, SchoolClass[]>();
  classes.forEach(c => classByName.set(norm(c.name), [...(classByName.get(norm(c.name)) ?? []), c]));
  const seenEmails = new Set<string>();
  const claimedByTeacher = new Map<string, string>(); // classId -> email that claimed it in this file

  return data.map((raw, i) => {
    const errors: string[] = [];
    const email = norm(raw.email ?? '');
    if (!email) errors.push('Email is missing.');
    else if (!isEmail(email)) errors.push('Not a valid email address.');
    else if (seenEmails.has(email)) errors.push('Duplicate of an earlier row.');
    seenEmails.add(email);

    const roleCell = norm(raw.role ?? '');
    if (!ctx.fixedClass && roleCell && roleCell !== ctx.role) errors.push(`Role is "${raw.role.trim()}" but this upload is for ${ctx.role}s.`);

    const classNames: string[] = [];
    const classIds: string[] = [];
    if (ctx.fixedClass) {
      classNames.push(ctx.fixedClass.name);
      classIds.push(ctx.fixedClass.id);
    } else if (spec.classColumn !== 'none') {
      const names = (raw.class ?? '').split(spec.classColumn === 'many' ? ';' : '\u0000').map(s => s.trim()).filter(Boolean);
      if (!names.length && spec.classRequired) errors.push('Class is missing.');
      names.forEach(name => {
        const matches = classByName.get(norm(name)) ?? [];
        if (matches.length === 0) return errors.push(`Class "${name}" does not exist in your school.`);
        if (matches.length > 1) return errors.push(`More than one class is named "${name}".`);
        const cls = matches[0];
        classNames.push(cls.name);
        classIds.push(cls.id);
        if (ctx.role === 'teacher') {
          if (cls.teacherId) errors.push(`${cls.name} already has a teacher. Reassign it from the class page first.`);
          else if (claimedByTeacher.has(cls.id) && claimedByTeacher.get(cls.id) !== email) errors.push(`${cls.name} is already assigned to ${claimedByTeacher.get(cls.id)} in this file.`);
          else claimedByTeacher.set(cls.id, email);
        }
      });
    }
    return { line: i + 2, email, classNames, classIds, errors };
  });
}

/* ───────────── bulk invite: run ───────────── */

export interface BulkResult {
  invited: number;
  /** Existing OAICC students added straight to the school. */
  attached: number;
  failed: { line: number; email: string; error: string }[];
}

/** Invites every valid row. Rows with validation errors are skipped and reported, never silently dropped. */
export function runBulkInvite(school: Pick<School, 'id' | 'name'>, role: InviteRole, rows: PreviewRow[]): BulkResult {
  const result: BulkResult = { invited: 0, attached: 0, failed: [] };
  rows.forEach(row => {
    if (row.errors.length) { result.failed.push({ line: row.line, email: row.email, error: row.errors.join(' ') }); return; }
    const r = inviteOne(school, { role, email: row.email, classIds: row.classIds });
    if (r.ok === false) { result.failed.push({ line: row.line, email: row.email, error: r.error }); return; }
    if (r.value.kind === 'invited') result.invited++;
    else result.attached++;
  });
  return result;
}

/** A CSV listing rows that could not be imported, so they can be fixed and re-uploaded. */
export const failedRowsCsv = (failed: BulkResult['failed']) =>
  Papa.unparse({ fields: ['line', 'email', 'problem'], data: failed.map(f => [f.line, f.email, f.error]) }, { escapeFormulae: true });
