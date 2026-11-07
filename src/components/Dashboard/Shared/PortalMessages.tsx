import React, { useMemo, useState } from 'react';
import { Check, CheckCheck, MessageSquare, PenSquare, Search, Send, X } from 'lucide-react';
import { startConversation, useCrossPortalMessaging, type ChatParticipant } from '../../../utils/crossPortalMessaging';
import { currentIdentity, type PortalUserRole } from '../../../utils/portalIdentity';
import { contactsFor, participantFor, type Contact } from '../../../utils/portalContacts';

const ROLE_LABEL: Record<string, string> = { school: 'School', teacher: 'Teacher', parent: 'Parent / Guardian', student: 'Student', counselor: 'Counsellor', admin: 'OAICC' };

export default function PortalMessages({ role }: { role: PortalUserRole }) {
  const identity = currentIdentity(role);
  const me = identity ? participantFor(identity) : null;
  const { threads, activeThread, selectThread } = useCrossPortalMessaging(me?.id ?? '', role);
  const contacts = useMemo(() => (identity ? contactsFor(identity) : []), [identity?.id, identity?.schoolId]);
  const contactById = useMemo(() => new Map(contacts.map(c => [c.id, c])), [contacts]);

  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [picking, setPicking] = useState(false);
  const [contactQuery, setContactQuery] = useState('');
  /** A contact chosen from "New message" who has no conversation yet. */
  const [draft, setDraft] = useState<Contact | null>(null);

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

  const q = search.trim().toLowerCase();
  const visibleThreads = threads.filter(t => {
    const c = other(t.participants);
    return !q || c.name.toLowerCase().includes(q) || t.lastMessage.toLowerCase().includes(q);
  });

  const openContact = (c: Contact) => {
    setPicking(false);
    setContactQuery('');
    const existing = threads.find(t => t.participants.some(p => p.id === c.id));
    if (existing) { setDraft(null); selectThread(existing.id); } else setDraft(c);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    const target = draft ?? (activeThread ? other(activeThread.participants) : null);
    if (!target) return;
    const threadId = startConversation(me, target, body);
    setDraft(null);
    selectThread(threadId);
    setText('');
  };

  const chatWith: ChatParticipant | null = draft ?? (activeThread ? other(activeThread.participants) : null);
  const messages = draft ? [] : activeThread?.messages ?? [];
  const cq = contactQuery.trim().toLowerCase();
  const pickable = contacts.filter(c => !cq || c.name.toLowerCase().includes(cq) || c.subtitle.toLowerCase().includes(cq));
  const initials = me.name.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-8">
      {/* Conversation list */}
      <div className="w-full lg:w-96 max-h-[40vh] lg:max-h-none bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"><MessageSquare className="w-6 h-6 text-brand" /> Messages</h2>
            <button onClick={() => setPicking(p => !p)} aria-expanded={picking} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand/10 text-brand text-sm font-bold hover:bg-brand/20 transition-all">
              {picking ? <X className="w-4 h-4" /> : <PenSquare className="w-4 h-4" />} {picking ? 'Close' : 'New'}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            {picking ? (
              <input autoFocus type="text" value={contactQuery} onChange={e => setContactQuery(e.target.value)} placeholder="Search people you can message..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm text-slate-900 dark:text-slate-100" />
            ) : (
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm text-slate-900 dark:text-slate-100" />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {picking ? (
            <>
              {pickable.map(c => (
                <button key={c.id} onClick={() => openContact(c)} className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all">
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
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left border ${isSelected ? 'bg-brand/5 border-brand/20 dark:bg-brand/10 dark:border-brand/30' : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}>
                    <div className="relative shrink-0">
                      <img src={contact.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      {contact.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className={`font-bold truncate ${isSelected ? 'text-brand' : 'text-slate-900 dark:text-slate-100'}`}>{contact.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-1">{thread.lastMessageTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mb-0.5">{subtitleOf(contact)}</p>
                      <p className={`text-xs truncate ${unread > 0 ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>{thread.lastMessage}</p>
                    </div>
                    {unread > 0 && <div className="w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-lg flex items-center justify-center shrink-0 shadow-sm">{unread}</div>}
                  </button>
                );
              })}
              {visibleThreads.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No conversations</p>
                  {contacts.length > 0 && <button onClick={() => setPicking(true)} className="mt-3 text-sm font-bold text-brand hover:underline">Start a conversation</button>}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Chat window */}
      {chatWith ? (
        <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4">
            <div className="relative">
              <img src={chatWith.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
              {chatWith.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg truncate">{chatWith.name}</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{subtitleOf(chatWith)}{chatWith.online ? ' · Online' : ''}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-12">Send a message to start your conversation with {chatWith.name}.</p>
            )}
            {messages.map((msg, idx) => {
              const isMe = msg.senderId === me.id;
              return (
                <div key={`${msg.id}-${idx}`} className={`flex items-start gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {isMe
                    ? <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white text-[10px] font-bold mt-1 shrink-0">{initials}</div>
                    : <img src={chatWith.image} alt="" className="w-8 h-8 rounded-lg object-cover mt-1 shrink-0" />}
                  <div className={`flex flex-col gap-1 max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm font-medium ${isMe ? 'bg-brand text-white rounded-tr-none shadow-sm shadow-brand/5' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'}`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                      {isMe && (msg.status === 'read'
                        ? <span className="flex items-center gap-0.5 text-sky-500" title="Read"><CheckCheck className="w-3.5 h-3.5" /><span className="text-[9px] uppercase tracking-wider font-extrabold">Read</span></span>
                        : msg.status === 'delivered'
                          ? <span className="flex items-center gap-0.5 text-slate-400" title="Delivered"><CheckCheck className="w-3.5 h-3.5" /><span className="text-[9px] uppercase tracking-wider font-extrabold">Delivered</span></span>
                          : <span className="flex items-center gap-0.5 text-slate-400" title="Sent"><Check className="w-3.5 h-3.5" /><span className="text-[9px] uppercase tracking-wider font-extrabold">Sent</span></span>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={send} className="p-6 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative">
              <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder={`Message ${chatWith.name}...`}
                className="w-full pl-6 pr-16 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400" />
              <button type="submit" disabled={!text.trim()} aria-label="Send"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-brand text-white rounded-lg shadow-sm shadow-brand/5 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center p-8 text-center">
          <div>
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Select a conversation</h3>
          </div>
        </div>
      )}
    </div>
  );
}
