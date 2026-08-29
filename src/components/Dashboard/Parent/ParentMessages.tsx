import React, { useState } from 'react';
import { MessageSquare, Search, Send, Phone, Video, Info, CheckCheck, Check } from 'lucide-react';
import { 
  useCrossPortalMessaging, 
  ChatParticipant, 
  UserRole 
} from '../../../utils/crossPortalMessaging';

export default function ParentMessages() {
  const currentUserId = 'parent-1';
  const currentUserRole: UserRole = 'parent';

  const { 
    threads, 
    activeThread, 
    activeThreadId, 
    selectThread, 
    sendMessage 
  } = useCrossPortalMessaging(currentUserId, currentUserRole);

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const getOtherParticipant = (threadParticipants: ChatParticipant[]): ChatParticipant => {
    return threadParticipants.find(p => p.id !== currentUserId) || threadParticipants[0];
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage, 'Mrs. Kemi Ahmed');
    setNewMessage('');
  };

  const filteredThreads = threads.filter(thread => {
    const contact = getOtherParticipant(thread.participants);
    return contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeContact = activeThread ? getOtherParticipant(activeThread.participants) : null;

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-8">
      {/* Chat List */}
      <div className="w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-brand" /> Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredThreads.map((thread) => {
            const contact = getOtherParticipant(thread.participants);
            const unread = thread.unreadCount[currentUserId] || 0;
            const isSelected = thread.id === activeThreadId;

            return (
              <button 
                key={thread.id}
                onClick={() => selectThread(thread.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group border ${
                  isSelected 
                    ? 'bg-brand/5 border-brand/20 dark:bg-brand/10 dark:border-brand/30' 
                    : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={contact.image} alt={contact.name} className="w-12 h-12 rounded-xl object-cover" />
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-bold truncate ${isSelected ? 'text-brand' : 'text-slate-900 dark:text-slate-100'}`}>
                      {contact.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-1">{thread.lastMessageTime}</span>
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
            <div className="text-center py-12">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No conversations</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      {activeThread && activeContact ? (
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={activeContact.image} alt={activeContact.name} className="w-12 h-12 rounded-xl object-cover" />
                {activeContact.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{activeContact.name}</h3>
                <p className={`text-xs font-bold uppercase tracking-widest ${activeContact.online ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {activeContact.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-[10px] font-bold text-slate-500 dark:text-slate-400">
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
              <button className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="flex justify-center">
              <span className="px-4 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100 dark:border-slate-700">
                Conversation Started
              </span>
            </div>

            {activeThread.messages.map((msg, idx) => {
              const isMe = msg.senderId === currentUserId || msg.senderRole === 'parent';
              return (
                <div 
                  key={`p-msg-${msg.id}-${idx}`}
                  className={`flex items-start gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  {isMe ? (
                    <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white text-[10px] font-bold mt-1 shrink-0">
                      KA
                    </div>
                  ) : (
                    <img src={activeContact.image} alt={activeContact.name} className="w-8 h-8 rounded-lg object-cover mt-1 shrink-0" />
                  )}
                  <div className={`flex flex-col gap-1 max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm font-medium ${
                      isMe 
                        ? 'bg-brand text-white rounded-tr-none shadow-sm shadow-brand/5' 
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

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Reply to ${activeContact.name}...`} 
                className="w-full pl-6 pr-16 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-brand text-white rounded-lg shadow-sm shadow-brand/5 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
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
