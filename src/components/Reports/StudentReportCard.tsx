/**
 * Student report card (PDF), in a dark and a light edition. The visual language follows the OAICC
 * landing page: rounded Quicksand type, a cyan "highlighter" chip, tilted colour pills, numbered
 * tilted badges, coloured progress bars, and tinted cards (navy-tinted in dark, pastel in light).
 */
import React, { createContext, useContext } from 'react';
import { Circle, Document, Font, G, Image, Page, Polygon, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';
import logoPng from '../../assets/logo/oaicc-logo-green.png?url';
import q400 from '@fontsource/quicksand/files/quicksand-latin-400-normal.woff?url';
import q500 from '@fontsource/quicksand/files/quicksand-latin-500-normal.woff?url';
import q600 from '@fontsource/quicksand/files/quicksand-latin-600-normal.woff?url';
import q700 from '@fontsource/quicksand/files/quicksand-latin-700-normal.woff?url';
import type { ReportData } from '../../utils/studentReport';

export type ReportTheme = 'dark' | 'light';

Font.register({
  family: 'Quicksand',
  fonts: [{ src: q400, fontWeight: 400 }, { src: q500, fontWeight: 500 }, { src: q600, fontWeight: 600 }, { src: q700, fontWeight: 700 }],
});
Font.registerHyphenationCallback(word => [word]); // never split words mid-way

/* ───────── palettes ───────── */
const ACCENTS = { cyan: '#00B4D8', orange: '#F97316', yellow: '#FBBF24', purple: '#8B5CF6', red: '#EF4444', green: '#10B981', blue: '#3B82F6' };

const DARK = {
  ...ACCENTS,
  name: 'dark' as ReportTheme,
  bg: '#05071A', card: '#0C1430', cardLine: '#1A2547', inset: '#05071A', track: '#1A2547',
  text: '#FFFFFF', muted: '#8E9BC6', faint: '#5C6896', cyanText: '#00B4D8', purpleNum: '#A78BFA',
  quizBg: '#06283A', quizLine: '#0B4A63', counselBg: '#2A1608', counselLine: '#5A2E0F', mentorBg: '#1D1240', mentorLine: '#3B2A78',
  chipText: '#FFFFFF', statusActiveBg: '#06261D', statusInvitedBg: '#2A1608', neutralPill: '#1A2547', neutralPillText: '#FFFFFF',
  blobOpacity: [0.09, 0.08, 0.08], logoSticker: true,
};

const LIGHT: typeof DARK = {
  ...ACCENTS,
  name: 'light',
  bg: '#F6F8FC', card: '#FFFFFF', cardLine: '#E3E9F4', inset: '#F1F4FA', track: '#E6EBF5',
  text: '#0E1736', muted: '#66718F', faint: '#98A2BE', cyanText: '#0891B2', purpleNum: '#7C3AED',
  quizBg: '#E3F3FC', quizLine: '#C5E6F7', counselBg: '#FDEBDC', counselLine: '#F8D3B5', mentorBg: '#EDE8FD', mentorLine: '#D9CFFA',
  chipText: '#FFFFFF', statusActiveBg: '#D9F5E9', statusInvitedBg: '#FDEBDC', neutralPill: '#E6EBF5', neutralPillText: '#4B5675',
  blobOpacity: [0.12, 0.1, 0.1], logoSticker: false,
};

type Theme = typeof DARK;
const THEMES: Record<ReportTheme, Theme> = { dark: DARK, light: LIGHT };
const ThemeContext = createContext<Theme>(DARK);
const useTheme = () => useContext(ThemeContext);

const styleCache = new Map<ReportTheme, ReturnType<typeof makeStyles>>();
function makeStyles(T: Theme) {
  return StyleSheet.create({
    page: { backgroundColor: T.bg, fontFamily: 'Quicksand', color: T.text, padding: 30, paddingBottom: 24 },
    row: { flexDirection: 'row' },
    card: { backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.cardLine, padding: 12 },
    eyebrow: { fontSize: 7.5, fontWeight: 700, letterSpacing: 1.2, color: T.cyanText, textTransform: 'uppercase' },
    h2: { fontSize: 12.5, fontWeight: 700, color: T.text },
    muted: { fontSize: 8.5, fontWeight: 500, color: T.muted },
  });
}
const useStyles = () => {
  const T = useTheme();
  if (!styleCache.has(T.name)) styleCache.set(T.name, makeStyles(T));
  return styleCache.get(T.name)!;
};

const BAR_COLORS = [ACCENTS.green, ACCENTS.cyan, ACCENTS.orange, ACCENTS.purple, ACCENTS.yellow];
const PILL_COLORS = [ACCENTS.red, ACCENTS.orange, ACCENTS.yellow, ACCENTS.purple, ACCENTS.cyan, ACCENTS.green, ACCENTS.blue, ACCENTS.orange];
const PILL_TILT = [-3, 2, -2, 3, -1.5, 2.5, -2.5, 1.5];
const WHITE = '#FFFFFF';

/* ───────── small building blocks ───────── */

/** The playful numbered badge used on each section card. */
function Badge({ n, color, tilt = -6 }: { n: number; color: string; tilt?: number }) {
  return (
    <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: color, alignItems: 'center', justifyContent: 'center', transform: `rotate(${tilt}deg)`, marginRight: 9 }}>
      <Text style={{ fontSize: 11, fontWeight: 700, color: WHITE }}>{n}</Text>
    </View>
  );
}

function CardHeader({ n, color, title, tilt }: { n: number; color: string; title: string; tilt?: number }) {
  const s = useStyles();
  return (
    <View style={[s.row, { alignItems: 'center', marginBottom: 8 }]}>
      <Badge n={n} color={color} tilt={tilt} />
      <Text style={s.h2}>{title}</Text>
    </View>
  );
}

function Pill({ label, color, tilt, textColor }: { label: string; color: string; tilt: number; textColor?: string }) {
  const ink = textColor ?? (color === ACCENTS.yellow ? '#3A2A00' : WHITE);
  return (
    <View style={{ backgroundColor: color, borderRadius: 11, paddingHorizontal: 10, paddingVertical: 4.5, marginRight: 7, marginBottom: 7, transform: `rotate(${tilt}deg)` }}>
      <Text style={{ fontSize: 9, fontWeight: 700, color: ink }} maxLines={1}>{label.length > 30 ? `${label.slice(0, 29)}…` : label}</Text>
    </View>
  );
}

function Star({ size, color }: { size: number; color: string }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? 12 : 5;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${12 + r * Math.cos(a)},${12 + r * Math.sin(a)}`;
  }).join(' ');
  return <Svg width={size} height={size} viewBox="0 0 24 24"><Polygon points={pts} fill={color} /></Svg>;
}

/** The real OAICC logo. On the dark edition it sits on a white sticker so the navy "o" stays visible. */
function Logo() {
  const T = useTheme();
  const image = <Image src={logoPng} style={{ height: 24, width: 94.5 }} />;
  if (!T.logoSticker) return <View style={{ paddingVertical: 2 }}>{image}</View>;
  return <View style={{ backgroundColor: WHITE, borderRadius: 12, paddingVertical: 6, paddingHorizontal: 11, transform: 'rotate(-1.5deg)' }}>{image}</View>;
}

function ProgressRing({ percent, color }: { percent: number; color: string }) {
  const T = useTheme();
  const r = 31;
  const circ = 2 * Math.PI * r;
  return (
    <View style={{ width: 70, height: 70 }}>
      <Svg width={70} height={70} viewBox="0 0 76 76">
        <Circle cx="38" cy="38" r={r} stroke={T.track} strokeWidth={8} fill="none" />
        {percent > 0 && (
          <G transform="rotate(-90 38 38)">
            <Circle cx="38" cy="38" r={r} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={`${Math.max(0.5, (circ * Math.min(percent, 100)) / 100)} ${circ}`} />
          </G>
        )}
      </Svg>
      <View style={{ position: 'absolute', top: 0, left: 0, width: 70, height: 70, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{percent}%</Text>
      </View>
    </View>
  );
}

/* ───────── the report ───────── */

function Report({ data }: { data: ReportData }) {
  const T = useTheme();
  const s = useStyles();
  const quizColor = data.quiz.status === 'Complete' ? T.green : data.quiz.status === 'In progress' ? T.orange : T.faint;
  const top = data.recommended[0];
  const rest = data.recommended.slice(1, 4);
  const shownFavs = data.favourites.slice(0, 6);
  const moreFavs = data.favourites.length - shownFavs.length;
  const floatFav = data.favourites.find(f => f !== top?.title) ?? data.favourites[0];
  const heroSize = data.firstName.length <= 8 ? 31 : data.firstName.length <= 12 ? 26 : data.firstName.length <= 16 ? 21 : 17;
  const nameSize = data.name.length > 26 ? 8.5 : data.name.length > 18 ? 9.5 : 11.5;
  const active = data.accountStatus === 'active';

  return (
    <Page size="A4" style={s.page}>
      {/* decorative blobs (small and absolutely positioned so they never affect layout) */}
      {([
        { top: -60, right: -60, size: 200, color: T.cyan, o: T.blobOpacity[0] },
        { top: 400, left: -50, size: 130, color: T.purple, o: T.blobOpacity[1] },
        { bottom: -70, right: -60, size: 210, color: T.orange, o: T.blobOpacity[2] },
      ] as const).map((b, i) => (
        <Svg key={i} fixed width={b.size} height={b.size} viewBox="0 0 100 100" style={{ position: 'absolute', ...('top' in b ? { top: b.top } : { bottom: b.bottom }), ...('right' in b ? { right: b.right } : { left: b.left }) }}>
          <Circle cx="50" cy="50" r="50" fill={b.color} opacity={b.o} />
        </Svg>
      ))}

      {/* sections spread out to fill the sheet; margins act as the minimum gap */}
      <View style={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <View>
          {/* header */}
          <View style={[s.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <Logo />
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ borderWidth: 1, borderColor: T.cyan, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3.5 }}>
                <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.2, color: T.cyanText }}>STUDENT REPORT CARD</Text>
              </View>
              <Text style={[s.muted, { marginTop: 4, fontSize: 7.5 }]}>Generated {data.generatedOn}</Text>
            </View>
          </View>

          {/* hero */}
          <View style={[s.row, { marginTop: 16, alignItems: 'flex-start' }]}>
            <View style={{ flex: 1, paddingRight: 14 }}>
              <Text style={s.eyebrow} maxLines={1}>{data.schoolName}</Text>
              <Text style={{ fontSize: heroSize, fontWeight: 700, lineHeight: 1.1, marginTop: 6, color: T.text }} maxLines={1}>{data.firstName}’s</Text>
              <View style={{ alignSelf: 'flex-start', backgroundColor: T.cyan, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 3, marginTop: 4, transform: 'rotate(-2deg)' }}>
                <Text style={{ fontSize: Math.min(heroSize, 31), fontWeight: 700, lineHeight: 1.15, color: T.chipText }}>report card.</Text>
              </View>
              <Text style={[s.muted, { marginTop: 10, fontSize: 9, lineHeight: 1.45 }]}>
                How {data.firstName} is exploring careers on OAICC: quiz progress, top matches, favourites and support.
              </Text>
            </View>

            {/* identity card with floating pills */}
            <View style={{ width: 232, marginTop: 8 }}>
              <View style={[s.card, { padding: 13 }]}>
                <View style={[s.row, { alignItems: 'center' }]}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: T.blue, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>{data.initials}</Text>
                  </View>
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={{ fontSize: nameSize, fontWeight: 700, color: T.text }} maxLines={2}>{data.name}</Text>
                    <Text style={s.muted}>{data.className} · Student</Text>
                  </View>
                  <View style={{ backgroundColor: active ? T.statusActiveBg : T.statusInvitedBg, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2.5 }}>
                    <Text style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: 0.8, color: active ? (T.name === 'dark' ? T.green : '#0B7A55') : (T.name === 'dark' ? T.orange : '#C2570C') }}>{active ? 'ACTIVE' : data.accountStatus === 'inactive' ? 'INACTIVE' : 'INVITED'}</Text>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: T.cardLine, marginVertical: 10 }} />
                <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: T.faint }}>LAST LOGIN</Text>
                <Text style={{ fontSize: 12, fontWeight: 700, marginTop: 3, color: T.text }}>{data.lastLogin ? data.lastLogin.label : 'Not logged in yet'}</Text>
                <Text style={{ fontSize: 8.5, fontWeight: 600, color: data.lastLogin ? T.cyanText : T.faint, marginTop: 1 }}>{data.lastLogin ? data.lastLogin.relative : 'Waiting for their first sign-in'}</Text>
              </View>
              {top && (
                <View style={{ position: 'absolute', top: -7, right: -4, backgroundColor: T.red, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 4, transform: 'rotate(4deg)' }}>
                  <Text style={{ fontSize: 8, fontWeight: 700, color: WHITE }} maxLines={1}>{top.title}</Text>
                </View>
              )}
              {floatFav && (
                <View style={{ position: 'absolute', bottom: -10, left: -8, backgroundColor: T.yellow, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 4, transform: 'rotate(-4deg)' }}>
                  <Text style={{ fontSize: 8, fontWeight: 700, color: '#3A2A00' }} maxLines={1}>{floatFav}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 1 quiz + 2 counsellor */}
        <View style={[s.row, { marginTop: 16 }]}>
          <View style={[s.card, { flex: 1.35, backgroundColor: T.quizBg, borderColor: T.quizLine, marginRight: 10 }]} wrap={false}>
            <CardHeader n={1} color={T.cyan} title="Quiz completed" />
            <View style={[s.row, { alignItems: 'center' }]}>
              <ProgressRing percent={data.quiz.percent} color={quizColor} />
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{data.quiz.answered} <Text style={{ fontSize: 9.5, color: T.muted, fontWeight: 500 }}>of {data.quiz.total} questions</Text></Text>
                <View style={{ alignSelf: 'flex-start', backgroundColor: data.quiz.status === 'Not started' && T.name === 'light' ? T.faint : quizColor, borderRadius: 9, paddingHorizontal: 8, paddingVertical: 3, marginTop: 6 }}>
                  <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 0.6, color: WHITE }}>{data.quiz.status.toUpperCase()}</Text>
                </View>
                <Text style={[s.muted, { marginTop: 6, fontSize: 8 }]}>{data.quiz.unlocked ? 'Career matches are unlocked.' : 'Matches unlock after 25 questions.'}</Text>
              </View>
            </View>
          </View>

          <View style={[s.card, { flex: 1, backgroundColor: T.counselBg, borderColor: T.counselLine }]} wrap={false}>
            <CardHeader n={2} color={T.orange} title="Assigned counsellor" tilt={5} />
            <View style={[s.row, { alignItems: 'center' }]}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: data.counsellor ? T.orange : T.track, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: 700, color: data.counsellor ? WHITE : T.muted }}>{data.counsellor ? data.counsellor.initials : '?'}</Text>
              </View>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ fontSize: data.counsellor && data.counsellor.name.length > 22 ? 9.5 : 11.5, fontWeight: 700, color: T.text }} maxLines={1}>{data.counsellor ? data.counsellor.name : 'Not assigned yet'}</Text>
                <Text style={[s.muted, { marginTop: 2 }]}>{data.counsellor ? 'Career counsellor' : 'Booked on their first session'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3 recommended careers */}
        <View style={[s.card, { marginTop: 10 }]} wrap={false}>
          <View style={[s.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
            <CardHeader n={3} color={T.purple} title="Recommended careers" tilt={-4} />
            <Text style={[s.muted, { fontSize: 7.5 }]}>Ranked by how well they fit</Text>
          </View>
          {!top ? (
            <View style={{ backgroundColor: T.inset, borderRadius: 12, padding: 14 }}>
              <Text style={{ fontSize: 10, fontWeight: 600, color: T.muted }}>No matches yet. Recommendations appear once {data.firstName} has answered 25 quiz questions.</Text>
            </View>
          ) : (
            <View>
              <View style={[s.row, { alignItems: 'center', backgroundColor: T.inset, borderRadius: 12, padding: 10, marginBottom: 10 }]}>
                <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: T.yellow, alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)' }}><Star size={16} color="#7A4B00" /></View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ fontSize: 7.5, color: T.muted, fontWeight: 600 }}>#1 career match</Text>
                  <Text style={{ fontSize: top.title.length > 26 ? 10.5 : 12.5, fontWeight: 700, color: T.text }} maxLines={1}>{top.title} <Text style={{ color: T.name === 'dark' ? T.yellow : '#B45309' }}>· {top.match}%</Text></Text>
                </View>
                <Text style={{ fontSize: 8, color: T.muted, fontWeight: 600, maxWidth: 110 }} maxLines={1}>{top.category}</Text>
              </View>
              {rest.map((c, i) => (
                <View key={c.title} style={{ marginBottom: i === rest.length - 1 ? 0 : 7 }}>
                  <View style={[s.row, { justifyContent: 'space-between', marginBottom: 3 }]}>
                    <Text style={{ fontSize: 9.5, fontWeight: 600, flex: 1, paddingRight: 8, color: T.text }} maxLines={1}>{c.title} <Text style={{ fontSize: 7.5, color: T.faint }}>  {c.category}</Text></Text>
                    <Text style={{ fontSize: 9.5, fontWeight: 700, color: T.text }}>{c.match}%</Text>
                  </View>
                  <View style={{ height: 6, borderRadius: 3, backgroundColor: T.track }}>
                    <View style={{ height: 6, borderRadius: 3, width: `${Math.max(4, Math.min(c.match, 100))}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 4 favourites */}
        <View style={[s.card, { marginTop: 10 }]} wrap={false}>
          <CardHeader n={4} color={T.red} title="Favourited careers" tilt={5} />
          {shownFavs.length === 0 ? (
            <Text style={{ fontSize: 10, fontWeight: 600, color: T.muted }}>{data.firstName} hasn’t saved any careers yet.</Text>
          ) : (
            <View style={[s.row, { flexWrap: 'wrap', paddingTop: 2 }]}>
              {shownFavs.map((f, i) => <React.Fragment key={f}><Pill label={f} color={PILL_COLORS[i % PILL_COLORS.length]} tilt={PILL_TILT[i % PILL_TILT.length]} /></React.Fragment>)}
              {moreFavs > 0 && <Pill label={`+${moreFavs} more`} color={T.neutralPill} textColor={T.neutralPillText} tilt={0} />}
            </View>
          )}
        </View>

        {/* 5 + 6 session stat tiles */}
        <View style={[s.row, { marginTop: 10 }]}>
          <View style={[s.card, { flex: 1, marginRight: 10, backgroundColor: T.counselBg, borderColor: T.counselLine }]} wrap={false}>
            <CardHeader n={5} color={T.orange} title="Sessions with counsellor" />
            <View style={[s.row, { alignItems: 'flex-end' }]}>
              <Text style={{ fontSize: 34, fontWeight: 700, lineHeight: 1, color: T.orange }}>{data.counsellorSessions.total}</Text>
              <Text style={[s.muted, { marginLeft: 8, marginBottom: 5 }]}>{data.counsellorSessions.total === 1 ? 'session' : 'sessions'} · {data.counsellorSessions.completed} completed</Text>
            </View>
          </View>
          <View style={[s.card, { flex: 1, backgroundColor: T.mentorBg, borderColor: T.mentorLine }]} wrap={false}>
            <CardHeader n={6} color={T.purple} title="Sessions with mentor" tilt={5} />
            <View style={[s.row, { alignItems: 'flex-end' }]}>
              <Text style={{ fontSize: 34, fontWeight: 700, lineHeight: 1, color: T.purpleNum }}>{data.mentorSessions.total}</Text>
              <Text style={[s.muted, { marginLeft: 8, marginBottom: 5, flex: 1 }]} maxLines={2}>{data.mentorSessions.total === 0 ? 'no sessions yet' : data.mentorSessions.mentors.slice(0, 2).join(' & ')}</Text>
            </View>
          </View>
        </View>

        {/* footer */}
        <View style={[s.row, { justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }]}>
          <View style={s.row}>
            {[T.cyan, T.orange, T.yellow, T.purple, T.green].map(c => <View key={c} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: c, marginRight: 4 }} />)}
          </View>
          <Text style={{ fontSize: 7.5, fontWeight: 500, color: T.faint }}>Prepared by {data.schoolName} · Powered by OAICC · oaiccglobal.com</Text>
        </View>
      </View>
    </Page>
  );
}

export default function StudentReportCard({ data, theme = 'dark' }: { data: ReportData; theme?: ReportTheme }) {
  return (
    <Document title={`${data.name} – OAICC Report Card`} author="OAICC" subject="Student report card">
      <ThemeContext.Provider value={THEMES[theme]}>
        <Report data={data} />
      </ThemeContext.Provider>
    </Document>
  );
}
