import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Search, Send, Phone, Video, Info, Plus, X, UserCheck, Shield, Users, GraduationCap, HeartHandshake, CheckCheck, Check, Clock } from 'lucide-react';
import { 
  useCrossPortalMessaging, 
  DEMO_USERS, 
  ChatParticipant, 
  UserRole 
} from '../../../utils/crossPortalMessaging';

const AVAILABLE_CONTACTS: ChatParticipant[] = [
  DEMO_USERS.counselor1,
  DEMO_USERS.counselor2,
  DEMO_USERS.admin1,
  DEMO_USERS.admin2,
  DEMO_USERS.parent1,
  DEMO_USERS.parent2,
  DEMO_USERS.teacher1,
  DEMO_USERS.teacher2,
];

export default function StudentMessages() {
  const currentUserId = 'student-1';
  const currentUserRole: UserRole = 'student';

  const { 
    threads, 
    activeThread, 
    activeThreadId, 
    selectThread, 
    sendMessage, 
    startChatWithContact 
  } = useCrossPortalMessaging(currentUserId, currentUserRole);

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Helper to extract the opposing contact from a thread
  const getOtherParticipant = (threadParticipants: ChatParticipant[]): ChatParticipant => {
    return threadParticipants.find(p => p.id !== currentUserId) || threadParticipants[0];
  };

  const formatRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 'counselor': return 'Counselor';
      case 'admin': return 'School Admin';
      case 'parent': return 'Parent';
      case 'teacher': return 'Teacher';
      default: return 'Student';
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage, 'Bolu Ahmed');
    setNewMessage('');
  };

  const handleStartNewChat = (contact: ChatParticipant) => {
    setIsNewChatModalOpen(false);
    startChatWithContact(contact, DEMO_USERS.student1);
  };

  const filteredThreads = threads.filter(thread => {
    const contact = getOtherParticipant(thread.participants);
    const roleLabel = formatRoleLabel(contact.role);
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || roleLabel === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'counselor':
        return 'bg-brand/10 text-brand border-brand/20';
      case 'admin':
        return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      case 'parent':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'teacher':
        return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'counselor': return UserCheck;
      case 'admin': return Shield;
      case 'parent': return HeartHandshake;
      case 'teacher': return GraduationCap;
      default: return Users;
    }
  };

  const activeContact = activeThread ? getOtherParticipant(activeThread.participants) : null;

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-6">
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand" /> Messages
            </h2>
            <button 
              onClick={() => setIsNewChatModalOpen(true)}
              className="p-2 bg-brand text-white rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
              title="New Message"
            >
              <Plus className="w-4 h-4" /> New
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Counselor', 'School Admin', 'Parent', 'Teacher'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  roleFilter === role
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredThreads.map((thread) => {
            const contact = getOtherParticipant(thread.participants);
            const RoleIcon = getRoleIcon(contact.role);
            const unread = thread.unreadCount[currentUserId] || 0;
            const isSelected = thread.id === activeThreadId;

            return (
              <button 
                key={thread.id}
                onClick={() => selectThread(thread.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left group border ${
                  isSelected 
                    ? 'bg-brand/5 border-brand/20 dark:bg-brand/10 dark:border-brand/30' 
                    : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={contact.image} alt={contact.name} className="w-11 h-11 rounded-xl object-cover" />
                  {contact.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-brand' : 'text-slate-900 dark:text-slate-100'}`}>
                      {contact.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-1">{thread.lastMessageTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border flex items-center gap-1 ${getRoleBadgeColor(contact.role)}`}>
                      <RoleIcon className="w-2.5 h-2.5" />
                      {formatRoleLabel(contact.role)}
                    </span>
                  </div>

                  <p className={`text-xs truncate ${unread > 0 ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
                    {thread.lastMessage}
                  </p>
                </div>
                {unread > 0 && (
                  <div className="w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    {unread}
                  </div>
                )}
              </button>
            );
          })}

          {filteredThreads.length === 0 && (
            <div className="text-center py-10 px-4">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No conversations found</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting search or start a new chat.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      {activeThread && activeContact ? (
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeContact.image} alt={activeContact.name} className="w-12 h-12 rounded-xl object-cover" />
                {activeContact.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">{activeContact.name}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getRoleBadgeColor(activeContact.role)}`}>
                    {formatRoleLabel(activeContact.role)}
                  </span>
                </div>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${activeContact.online ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {activeContact.online ? 'Online now' : 'Offline'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Sync Active</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="flex items-center gap-0.5 text-sky-500 font-bold" title="Read status indicator">
                  <CheckCheck className="w-3.5 h-3.5" /> Read
                </span>
                <span className="flex items-center gap-0.5 text-slate-400 font-bold" title="Delivered status indicator">
                  <CheckCheck className="w-3.5 h-3.5" /> Delivered
                </span>
              </div>
              <button className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="flex justify-center">
              <span className="px-4 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100 dark:border-slate-700">
                Conversation Started
              </span>
            </div>

            {activeThread.messages.map((msg, idx) => {
              const isMe = msg.senderId === currentUserId || msg.senderRole === 'student';
              return (
                <div 
                  key={`msg-${msg.id}-${idx}`}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  {isMe ? (
                    <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 shadow-sm">
                      BA
                    </div>
                  ) : (
                    <img src={activeContact.image} alt={activeContact.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                  )}

                  <div className={`flex flex-col gap-1 max-w-[80%] sm:max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                      isMe 
                        ? 'bg-brand text-white rounded-tr-none shadow-sm shadow-brand/10' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[10px] font-bold text-slate-400">
                        {msg.time}
                      </span>
                      {isMe && (
                        <div className="flex items-center gap-1">
                          {msg.status === 'read' ? (
                            <span className="flex items-center gap-0.5 text-sky-500 font-bold" title="Read by recipient">
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span className="text-[9px] uppercase tracking-wider font-extrabold">Read</span>
                            </span>
                          ) : msg.status === 'delivered' ? (
                            <span className="flex items-center gap-0.5 text-slate-400 font-bold" title="Delivered to recipient">
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span className="text-[9px] uppercase tracking-wider font-extrabold">Delivered</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-slate-400 font-bold" title="Sent">
                              <Check className="w-3.5 h-3.5" />
                              <span className="text-[9px] uppercase tracking-wider font-extrabold">Sent</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Type a message to ${activeContact.name}...`} 
                className="w-full pl-5 pr-14 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="absolute right-2 p-2.5 bg-brand text-white rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center p-8 text-center">
          <div>
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Select a conversation</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
              Choose a counselor, school admin, parent, or teacher from the list to start messaging.
            </p>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      <AnimatePresence>
        {isNewChatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewChatModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 z-10"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">New Message</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Select an assigned contact to start messaging</p>
                </div>
                <button 
                  onClick={() => setIsNewChatModalOpen(false)}
                  className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                {AVAILABLE_CONTACTS.map((contact) => {
                  const RoleIcon = getRoleIcon(contact.role);
                  return (
                    <button
                      key={contact.id}
                      onClick={() => handleStartNewChat(contact)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all text-left group"
                    >
                      <img src={contact.image} alt={contact.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-brand transition-colors">
                          {contact.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border inline-flex items-center gap-1 mt-0.5 ${getRoleBadgeColor(contact.role)}`}>
                          <RoleIcon className="w-2.5 h-2.5" />
                          {formatRoleLabel(contact.role)}
                        </span>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400 group-hover:text-brand transition-colors" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
