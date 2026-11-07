import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, CheckCheck, MessageSquare, PenSquare, Search, Send, SmilePlus, Trophy, X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { startConversation, toggleReaction, useCrossPortalMessaging, type ChatMessage, type ChatParticipant } from '../../../utils/crossPortalMessaging';
import { currentIdentity, type PortalUserRole } from '../../../utils/portalIdentity';
import { contactsFor, participantFor, type Contact } from '../../../utils/portalContacts';
import { chatStats, KUDOS_BADGES, LEVELS, POINTS, REACTIONS, type ChatStats } from '../../../utils/chatGamification';

const ROLE_LABEL: Record<string, string> = { school: 'School', teacher: 'Teacher', parent: 'Parent / Guardian', student: 'Student', counselor: 'Counsellor', admin: 'OAICC' };
const ROLE_FILTER_LABEL: Record<string, string> = { school: 'School', teacher: 'Teachers', parent: 'Parents' };

const QUICK_REPLIES: Record<PortalUserRole, string[]> = {
  school: ['Thank you for the update!', 'Can we meet this week?', 'Please check the latest report on OAICC.', 'Great work, keep it up! 🎉'],
  teacher: ['Thanks for letting me know.', 'Your child is making good progress! 📈', 'Could we talk after class this week?', 'Happy to discuss at the PTA meeting.'],
  parent: ['Thank you so much!', 'Could we schedule a quick call?', "Noted, we'll follow up at home.", 'How is my child doing this term?'],
};

type Filter = 'all' | 'unread' | 'school' | 'teacher' | 'parent';

const dayLabel = (ts: number) => {
  const d = new Date(ts); const today = new Date(); today.setHours(0, 0, 0, 0);
  if (ts >= today.getTime()) return 'Today';
  if (ts >= today.getTime() - 86_400_000) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
};

export default function PortalMessages({ role }: { role: PortalUserRole }) {
  const { showToast } = useToast();
  const identity = currentIdentity(role);
  const me = identity ? participantFor(identity) : null;
  const { threads, activeThread, selectThread } = useCrossPortalMessaging(me?.id ?? '', role);
  const contacts = useMemo(() => (identity ? contactsFor(identity) : []), [identity?.id, identity?.schoolId]);
  const contactById = useMemo(() => new Map(contacts.map(c => [c.id, c])), [contacts]);
  const stats = useMemo(() => chatStats(threads, me?.id ?? ''), [threads, me?.id]);

  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [picking, setPicking] = useState(false);
  const [contactQuery, setContactQuery] = useState('');
  const [draft, setDraft] = useState<Contact | null>(null);
  const [kudosOpen, setKudosOpen] = useState(false);
  const [pointsPop, setPointsPop] = useState<{ id: number; label: string } | null>(null);
  const [celebrate, setCelebrate] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const kudosRef = useRef<HTMLDivElement>(null);

  // Close the kudos picker on an outside click or Escape.
  useEffect(() => {
    if (!kudosOpen) return;
    const onDown = (e: MouseEvent) => { if (!kudosRef.current?.contains(e.target as Node)) setKudosOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setKudosOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [kudosOpen]);

  // Celebrate a level-up (not on first load).
  const prevLevel = useRef<number | null>(null);
  useEffect(() => {
    if (prevLevel.current !== null && stats.level > prevLevel.current) {
      setCelebrate(c => c + 1);
      showToast(`Level up! You're now a ${stats.levelName} 🎉`);
    }
    prevLevel.current = stats.level;
  }, [stats.level]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeId = draft ? `draft-${draft.id}` : activeThread?.id;
  const messageCount = activeThread?.messages.length ?? 0;
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [activeId, messageCount]);

  if (!me) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="font-bold text-slate-700">Sign in to see your messages.</p>
      </div>
    );
  }

  const other = (participants: ChatParticipant[]) => participants.find(p => p.id !== me.id) ?? participants[0];
  const subtitleOf = (p: ChatParticipant) => contactById.get(p.id)?.subtitle ?? ROLE_LABEL[p.role] ?? p.role;

  const roleFilters = [...new Set<string>(threads.map(t => other(t.participants).role))].filter((r): r is 'school' | 'teacher' | 'parent' => r in ROLE_FILTER_LABEL);
  const unreadTotal = threads.reduce((n, t) => n + (t.unreadCount[me.id] || 0), 0);
  const q = search.trim().toLowerCase();
  const visibleThreads = threads.filter(t => {
    const c = other(t.participants);
    if (filter === 'unread' && !(t.unreadCount[me.id] > 0)) return false;
    if (filter !== 'all' && filter !== 'unread' && c.role !== filter) return false;
    return !q || c.name.toLowerCase().includes(q) || t.lastMessage.toLowerCase().includes(q);
  });

  const openContact = (c: Contact) => {
    setPicking(false);
    setContactQuery('');
    const existing = threads.find(t => t.participants.some(p => p.id === c.id));
    if (existing) { setDraft(null); selectThread(existing.id); } else setDraft(c);
  };

  const chatWith: ChatParticipant | null = draft ?? (activeThread ? other(activeThread.participants) : null);

  const deliver = (body: string, extra: Pick<ChatMessage, 'kind' | 'kudos'> = {}) => {
    if (!chatWith) return;
    const threadId = startConversation(me, chatWith, body, extra);
    setDraft(null);
    selectThread(threadId);
    setText('');
    setKudosOpen(false);
    setPointsPop({ id: Date.now(), label: `+${extra.kind === 'kudos' ? POINTS.kudosSent : POINTS.message} pts` });
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) deliver(text.trim());
  };

  const sendKudos = (badge: string) => {
    const b = KUDOS_BADGES[badge];
    const note = text.trim() || `Sending you kudos ${b.line}!`;
    deliver(note, { kind: 'kudos', kudos: { badge } });
  };

  const messages = draft ? [] : [...(activeThread?.messages ?? [])].sort((a, b) => a.timestamp - b.timestamp);
  const cq = contactQuery.trim().toLowerCase();
  const pickable = contacts.filter(c => !cq || c.name.toLowerCase().includes(cq) || c.subtitle.toLowerCase().includes(cq));
  const initials = me.name.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[600px] flex flex-col lg:flex-row gap-6">
      {/* Left column: progress + conversations */}
      <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-4 min-h-0 max-h-[50vh] lg:max-h-none">
        <ProgressCard stats={stats} name={me.name} />

        <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 pb-3 border-b border-slate-50 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand" /> Messages
                {unreadTotal > 0 && <span className="px-2 py-0.5 rounded-full bg-brand text-white text-[11px] font-bold">{unreadTotal} new</span>}
              </h2>
              <button onClick={() => setPicking(p => !p)} aria-expanded={picking} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-xs font-bold hover:bg-brand-hover transition-all shadow-sm">
                {picking ? <X className="w-4 h-4" /> : <PenSquare className="w-4 h-4" />} {picking ? 'Close' : 'New chat'}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={picking ? contactQuery : search} autoFocus={picking}
                onChange={e => (picking ? setContactQuery(e.target.value) : setSearch(e.target.value))}
                placeholder={picking ? 'Who would you like to message?' : 'Search conversations...'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/30 font-medium text-sm text-slate-900 dark:text-slate-100" />
            </div>
            {!picking && (
              <div className="flex gap-1.5 mt-3 overflow-x-auto pb-0.5" role="tablist" aria-label="Filter conversations">
                {(['all', 'unread', ...roleFilters] as Filter[]).map(f => (
                  <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-brand text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                    {f === 'all' ? 'All' : f === 'unread' ? `Unread${unreadTotal ? ` · ${unreadTotal}` : ''}` : ROLE_FILTER_LABEL[f]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {picking ? (
              <>
                {pickable.map(c => (
                  <button key={c.id} onClick={() => openContact(c)} className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-brand/5 transition-all">
                    <img src={c.image} alt="" className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{c.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.subtitle}</p>
                    </div>
                  </button>
                ))}
                {pickable.length === 0 && <p className="text-center text-sm text-slate-500 py-8">{contacts.length ? 'No one matches your search.' : 'There is no one to message yet.'}</p>}
              </>
            ) : (
              <>
                {visibleThreads.map(thread => {
                  const contact = other(thread.participants);
                  const unread = thread.unreadCount[me.id] || 0;
                  const isSelected = !draft && thread.id === activeThread?.id;
                  return (
                    <button key={thread.id} onClick={() => { setDraft(null); selectThread(thread.id); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left border ${isSelected ? 'bg-brand/10 border-brand/30' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}>
                      <div className="relative shrink-0">
                        <img src={contact.image} alt="" className={`w-12 h-12 rounded-xl object-cover ${unread ? 'ring-2 ring-brand ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''}`} />
                        {contact.online && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <h4 className={`font-bold truncate text-sm ${isSelected ? 'text-brand' : 'text-slate-900 dark:text-slate-100'}`}>{contact.name}</h4>
                          <span className="text-[10px] font-bold text-slate-400 shrink-0">{thread.lastMessageTime}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{subtitleOf(contact)}</p>
                        <p className={`text-xs truncate ${unread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>{thread.lastMessage}</p>
                      </div>
                      {unread > 0 && <span className="min-w-5 h-5 px-1.5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">{unread}</span>}
                    </button>
                  );
                })}
                {visibleThreads.length === 0 && (
                  <div className="text-center py-10 px-4">
                    <div className="text-3xl mb-2">{filter === 'unread' ? '🎯' : '💬'}</div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{filter === 'unread' ? "Inbox zero! You're all caught up." : 'No conversations here yet'}</p>
                    {contacts.length > 0 && filter !== 'unread' && <button onClick={() => setPicking(true)} className="mt-2 text-sm font-bold text-brand hover:underline">Start a conversation</button>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Chat window */}
      {chatWith ? (
        <section className="relative flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          <Confetti trigger={celebrate} />
          <header className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4 bg-gradient-to-r from-brand/5 to-transparent">
            <div className="relative">
              <img src={chatWith.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
              {chatWith.online && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg truncate">{chatWith.name}</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{subtitleOf(chatWith)}{chatWith.online ? ' · Online now' : ''}</p>
            </div>
            <div ref={kudosRef} className="relative">
              <button onClick={() => setKudosOpen(o => !o)} aria-expanded={kudosOpen} aria-haspopup="true"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 text-sm font-bold hover:bg-amber-100 transition-all">
                <Trophy className="w-4 h-4" /> <span className="hidden sm:inline">Send kudos</span>
              </button>
              <AnimatePresence>
                {kudosOpen && (
                  <motion.div role="menu" aria-label="Choose a kudos badge" initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    className="absolute right-0 top-full mt-2 z-30 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl p-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 px-1">Recognise {chatWith.name.split(' ')[0]}</p>
                    <p className="text-xs text-slate-500 px-1 mb-2">Anything you've typed is added as a note. +{POINTS.kudosSent} pts</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(KUDOS_BADGES).map(([id, b]) => (
                        <button key={id} role="menuitem" onClick={() => sendKudos(id)}
                          className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-brand hover:bg-brand/5 transition-all">
                          <span className="text-2xl" aria-hidden>{b.emoji}</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{b.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-1 bg-[radial-gradient(circle_at_1px_1px,rgba(0,180,216,0.07)_1px,transparent_0)] [background-size:22px_22px]">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">👋</div>
                <p className="font-bold text-slate-700 dark:text-slate-200">Say hello to {chatWith.name}</p>
                <p className="text-sm text-slate-500 mt-1">Your first message earns +{POINTS.message} pts and the “First hello” badge if it's your first.</p>
              </div>
            )}
            {messages.map((msg, idx) => {
              const isMe = msg.senderId === me.id;
              const prev = messages[idx - 1];
              const newDay = !prev || dayLabel(prev.timestamp) !== dayLabel(msg.timestamp);
              const grouped = !newDay && prev && prev.senderId === msg.senderId && msg.timestamp - prev.timestamp < 30 * 60_000;
              return (
                <React.Fragment key={`${msg.id}-${idx}`}>
                  {newDay && (
                    <div className="flex justify-center py-3">
                      <span className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">{dayLabel(msg.timestamp)}</span>
                    </div>
                  )}
                  <MessageRow msg={msg} isMe={isMe} grouped={Boolean(grouped)} meId={me.id} avatar={chatWith.image} initials={initials}
                    onReact={emoji => activeThread && toggleReaction(activeThread.id, msg.id, emoji, me.id)} />
                </React.Fragment>
              );
            })}
          </div>

          <form onSubmit={send} className="p-4 sm:p-5 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900">
            {!text && (
              <div className="flex gap-2 overflow-x-auto pb-3" aria-label="Quick replies">
                {QUICK_REPLIES[role].map(r => (
                  <button key={r} type="button" onClick={() => setText(r)}
                    className="px-3 py-1.5 rounded-full border border-brand/30 text-brand text-xs font-bold whitespace-nowrap hover:bg-brand/10 transition-all">{r}</button>
                ))}
              </div>
            )}
            <div className="relative">
              <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder={`Message ${chatWith.name}...`}
                className="w-full pl-5 pr-16 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/15 font-medium text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400" />
              <button type="submit" disabled={!text.trim()} aria-label="Send message"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-brand text-white rounded-xl shadow-sm hover:bg-brand-hover hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100">
                <Send className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {pointsPop && (
                  <motion.span key={pointsPop.id} initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -34 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
                    onAnimationComplete={() => setTimeout(() => setPointsPop(p => (p?.id === pointsPop.id ? null : p)), 500)}
                    className="absolute right-3 top-0 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-extrabold shadow pointer-events-none">
                    {pointsPop.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>
        </section>
      ) : (
        <section className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center p-8 text-center">
          <div>
            <div className="text-5xl mb-3">💬</div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Pick a conversation</h3>
            <p className="text-sm text-slate-500 mt-1">Every reply earns points towards your next level.</p>
          </div>
        </section>
      )}
    </div>
  );
}

/* ───────────── pieces ───────────── */

function ProgressCard({ stats, name }: { stats: ChatStats; name: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br from-brand via-[#0096B4] to-brand-dark shadow-sm shrink-0">
      <div className="absolute -right-8 -top-10 w-36 h-36 rounded-full bg-white/10" aria-hidden />
      <div className="absolute -right-2 bottom-[-40px] w-24 h-24 rounded-full bg-white/5" aria-hidden />
      <div className="relative flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex flex-col items-center justify-center shrink-0" aria-label={`Level ${stats.level + 1}`}>
          <span className="text-[9px] font-bold uppercase tracking-wider leading-none text-white/80">Lv</span>
          <span className="text-xl font-extrabold leading-none">{stats.level + 1}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/75 truncate">{name}</p>
          <p className="text-lg font-extrabold leading-tight">{stats.levelName}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold tabular-nums leading-none">{stats.points}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/75">points</p>
        </div>
      </div>
      <div className="relative mt-4">
        <div className="h-2 rounded-full bg-white/25 overflow-hidden" role="progressbar" aria-valuenow={stats.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next level">
          <motion.div className="h-full rounded-full bg-white" initial={{ width: 0 }} animate={{ width: `${stats.progress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
        </div>
        <p className="text-[11px] font-semibold text-white/85 mt-1.5">
          {stats.nextLevelName ? `${stats.toNext} pts to ${stats.nextLevelName}` : `Top level reached: ${LEVELS[LEVELS.length - 1].name}!`}
        </p>
      </div>
      <div className="relative grid grid-cols-3 gap-2 mt-4">
        <Stat value={`🔥 ${stats.streak}`} label="day streak" />
        <Stat value={`${stats.replyRate}%`} label="replied" />
        <Stat value={`🏆 ${stats.kudosSent + stats.kudosReceived}`} label="kudos" />
      </div>
      <ul className="relative flex justify-between mt-4" aria-label="Achievements">
        {stats.achievements.map(a => (
          <li key={a.id} title={`${a.label}${a.earned ? ' · earned' : ` · ${a.hint}`}`}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all ${a.earned ? 'bg-white shadow-md' : 'bg-white/15 grayscale opacity-60'}`}>
            <span aria-hidden>{a.emoji}</span>
            <span className="sr-only">{a.label}: {a.earned ? 'earned' : a.hint}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/15 px-2 py-2 text-center">
      <p className="text-sm font-extrabold tabular-nums">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">{label}</p>
    </div>
  );
}

function MessageRow({ msg, isMe, grouped, meId, avatar, initials, onReact }: {
  msg: ChatMessage; isMe: boolean; grouped: boolean; meId: string; avatar: string; initials: string; onReact: (emoji: string) => void;
}) {
  const reactions = Object.entries(msg.reactions ?? {}).filter(([, ids]) => ids.length > 0);
  const kudos = msg.kind === 'kudos' && msg.kudos ? KUDOS_BADGES[msg.kudos.badge] : undefined;
  return (
    <div className={`group flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''} ${grouped ? 'mt-1' : 'mt-4'}`}>
      <div className="w-8 shrink-0">
        {!grouped && (isMe
          ? <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white text-[10px] font-bold">{initials}</div>
          : <img src={avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />)}
      </div>
      <div className={`relative flex flex-col gap-1 max-w-[75%] sm:max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Reaction picker: shows on hover or keyboard focus */}
        <div className={`absolute -top-9 ${isMe ? 'right-0' : 'left-0'} z-10 flex gap-0.5 p-1 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto transition-opacity`}>
          <SmilePlus className="w-4 h-4 text-slate-400 m-1.5" aria-hidden />
          {REACTIONS.map(e => (
            <button key={e} type="button" onClick={() => onReact(e)} aria-label={`React with ${e}`} className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-125 transition-transform text-base">{e}</button>
          ))}
        </div>

        {kudos ? (
          <div className="rounded-2xl p-4 min-w-[220px] text-white bg-gradient-to-br from-amber-400 via-orange-400 to-brand shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-6xl opacity-25" aria-hidden>{kudos.emoji}</div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/90">{isMe ? 'You sent kudos' : 'Kudos for you'}</p>
            <p className="text-lg font-extrabold flex items-center gap-2 mt-0.5"><span aria-hidden>{kudos.emoji}</span>{kudos.label}</p>
            <p className="text-sm font-medium mt-1 text-white/95">{msg.text}</p>
          </div>
        ) : (
          <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${isMe
            ? `bg-gradient-to-br from-brand to-[#0096B4] text-white shadow-sm ${grouped ? '' : 'rounded-br-md'}`
            : `bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 shadow-sm ${grouped ? '' : 'rounded-bl-md'}`}`}>
            {msg.text}
          </div>
        )}

        {reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 ${isMe ? 'justify-end' : ''}`}>
            {reactions.map(([emoji, ids]) => {
              const mine = ids.includes(meId);
              return (
                <button key={emoji} type="button" onClick={() => onReact(emoji)} aria-pressed={mine} aria-label={`${emoji} ${ids.length}`}
                  className={`px-2 py-0.5 rounded-full text-xs font-bold border transition-all ${mine ? 'bg-brand/10 border-brand/40 text-brand' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {emoji} {ids.length}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-1.5 px-1">
          <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
          {isMe && (msg.status === 'read'
            ? <span className="flex items-center text-brand" title="Read"><CheckCheck className="w-3.5 h-3.5" /></span>
            : msg.status === 'delivered'
              ? <span className="flex items-center text-slate-400" title="Delivered"><CheckCheck className="w-3.5 h-3.5" /></span>
              : <span className="flex items-center text-slate-400" title="Sent"><Check className="w-3.5 h-3.5" /></span>)}
        </div>
      </div>
    </div>
  );
}

const CONFETTI = ['🎉', '✨', '⭐', '💙', '🎊', '🏆'];
function Confetti({ trigger }: { trigger: number }) {
  const [burst, setBurst] = useState(0);
  useEffect(() => { if (trigger) { setBurst(trigger); const t = setTimeout(() => setBurst(0), 1600); return () => clearTimeout(t); } }, [trigger]);
  if (!burst) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => {
        const x = (i / 17) * 100;
        return (
          <motion.span key={`${burst}-${i}`} className="absolute bottom-10 text-2xl" style={{ left: `${x}%` }}
            initial={{ y: 0, opacity: 1, rotate: 0 }} animate={{ y: -260 - (i % 5) * 40, opacity: 0, rotate: (i % 2 ? 1 : -1) * 200 }} transition={{ duration: 1.4, ease: 'easeOut' }}>
            {CONFETTI[i % CONFETTI.length]}
          </motion.span>
        );
      })}
    </div>
  );
}
