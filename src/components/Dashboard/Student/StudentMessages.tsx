import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Search, Send, Phone, Video, Info, Plus, X, UserCheck, Shield, Users, GraduationCap, HeartHandshake } from 'lucide-react';
import { studentMessagesStorage, messagesStorage } from '../../../utils/storage';

interface Message {
  id: number;
  sender: 'student' | 'contact';
  text: string;
  time: string;
}

interface Chat {
  id: number;
  name: string;
  role: 'Counselor' | 'School Admin' | 'Parent' | 'Teacher';
  lastMessage: string;
  time: string;
  unread: number;
  image: string;
  online: boolean;
  messages: Message[];
}

const AVAILABLE_CONTACTS = [
  { id: 101, name: 'Mr. Alfred Funmbi', role: 'Counselor' as const, image: 'https://picsum.photos/seed/c1/100/100', online: true },
  { id: 102, name: 'Mrs. Janet Okon', role: 'Counselor' as const, image: 'https://picsum.photos/seed/c2/100/100', online: false },
  { id: 103, name: 'Dr. Sarah Ojo', role: 'School Admin' as const, image: 'https://picsum.photos/seed/admin1/100/100', online: true },
  { id: 104, name: 'System Administrator', role: 'School Admin' as const, image: 'https://picsum.photos/seed/admin2/100/100', online: true },
  { id: 105, name: 'Mrs. Kemi Ahmed', role: 'Parent' as const, image: 'https://picsum.photos/seed/parent1/100/100', online: false },
  { id: 106, name: 'Mr. Tunde Ahmed', role: 'Parent' as const, image: 'https://picsum.photos/seed/parent2/100/100', online: true },
  { id: 107, name: 'Mr. Mason Biyi', role: 'Teacher' as const, image: 'https://picsum.photos/seed/teacher1/100/100', online: false },
  { id: 108, name: 'Mrs. Folake Davies', role: 'Teacher' as const, image: 'https://picsum.photos/seed/teacher2/100/100', online: true },
];

export default function StudentMessages() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number>(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  useEffect(() => {
    const storedChats = studentMessagesStorage.get();
    setChats(storedChats);
    if (storedChats.length > 0) {
      setSelectedChatId(storedChats[0].id);
    }
  }, []);

  const selectedChat = chats.find(c => c.id === selectedChatId) || chats[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChatId) {
        const updatedMessages: Message[] = [
          ...chat.messages,
          {
            id: chat.messages.length + 1,
            sender: 'student',
            text: newMessage.trim(),
            time: currentTime
          }
        ];
        return {
          ...chat,
          lastMessage: newMessage.trim(),
          time: 'Just now',
          messages: updatedMessages
        };
      }
      return chat;
    });

    setChats(updatedChats);
    studentMessagesStorage.save(updatedChats);

    // If selected chat is counselor, sync to counselor messages storage
    if (selectedChat.role === 'Counselor') {
      const counselorChats = messagesStorage.get([]);
      const osayukiChatIndex = counselorChats.findIndex((c: any) => c.name === 'Osayuki Yuki' || c.id === 1);
      if (osayukiChatIndex !== -1) {
        counselorChats[osayukiChatIndex].lastMessage = newMessage.trim();
        counselorChats[osayukiChatIndex].time = 'Just now';
        counselorChats[osayukiChatIndex].messages.push({
          id: counselorChats[osayukiChatIndex].messages.length + 1,
          sender: 'student',
          text: newMessage.trim(),
          time: currentTime
        });
        messagesStorage.save(counselorChats);
      }
    }

    setNewMessage('');
  };

  const selectChat = (id: number) => {
    setSelectedChatId(id);
    const updatedChats = chats.map(c => c.id === id ? { ...c, unread: 0 } : c);
    setChats(updatedChats);
    studentMessagesStorage.save(updatedChats);
  };

  const startNewChat = (contact: typeof AVAILABLE_CONTACTS[0]) => {
    setIsNewChatModalOpen(false);
    
    // Check if chat already exists
    const existingChat = chats.find(c => c.name.toLowerCase() === contact.name.toLowerCase());
    if (existingChat) {
      selectChat(existingChat.id);
      return;
    }

    // Create new chat
    const newChatId = Date.now();
    const newChat: Chat = {
      id: newChatId,
      name: contact.name,
      role: contact.role,
      lastMessage: `Conversation started with ${contact.name}`,
      time: 'Just now',
      unread: 0,
      image: contact.image,
      online: contact.online,
      messages: [
        {
          id: 1,
          sender: 'contact',
          text: `Hello Bolu, I am your assigned ${contact.role}. How can I assist you today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    const updated = [newChat, ...chats];
    setChats(updated);
    studentMessagesStorage.save(updated);
    setSelectedChatId(newChatId);
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || chat.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Counselor':
        return 'bg-brand/10 text-brand border-brand/20';
      case 'School Admin':
        return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      case 'Parent':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Teacher':
        return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Counselor':
        return UserCheck;
      case 'School Admin':
        return Shield;
      case 'Parent':
        return HeartHandshake;
      case 'Teacher':
        return GraduationCap;
      default:
        return Users;
    }
  };

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
          {filteredChats.map((chat) => {
            const RoleIcon = getRoleIcon(chat.role);
            return (
              <button 
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left group border ${
                  chat.id === selectedChatId 
                    ? 'bg-brand/5 border-brand/20 dark:bg-brand/10 dark:border-brand/30' 
                    : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={chat.image} alt={chat.name} className="w-11 h-11 rounded-xl object-cover" />
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className={`font-bold text-sm truncate ${chat.id === selectedChatId ? 'text-brand' : 'text-slate-900 dark:text-slate-100'}`}>
                      {chat.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-1">{chat.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border flex items-center gap-1 ${getRoleBadgeColor(chat.role)}`}>
                      <RoleIcon className="w-2.5 h-2.5" />
                      {chat.role}
                    </span>
                  </div>

                  <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    {chat.unread}
                  </div>
                )}
              </button>
            );
          })}

          {filteredChats.length === 0 && (
            <div className="text-center py-10 px-4">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No conversations found</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting search or start a new chat.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      {selectedChat ? (
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={selectedChat.image} alt={selectedChat.name} className="w-12 h-12 rounded-xl object-cover" />
                {selectedChat.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">{selectedChat.name}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getRoleBadgeColor(selectedChat.role)}`}>
                    {selectedChat.role}
                  </span>
                </div>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${selectedChat.online ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {selectedChat.online ? 'Online now' : 'Offline'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
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

            {selectedChat.messages.map((msg, idx) => (
              <div 
                key={`msg-${msg.id}-${idx}`}
                className={`flex items-start gap-3 ${msg.sender === 'student' ? 'flex-row-reverse' : ''}`}
              >
                {msg.sender === 'student' ? (
                  <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 shadow-sm">
                    BA
                  </div>
                ) : (
                  <img src={selectedChat.image} alt={selectedChat.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                )}

                <div className={`flex flex-col gap-1 max-w-[80%] sm:max-w-md ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                    msg.sender === 'student' 
                      ? 'bg-brand text-white rounded-tr-none shadow-sm shadow-brand/10' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 px-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Type a message to ${selectedChat.name}...`} 
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
                      onClick={() => startNewChat(contact)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all text-left group"
                    >
                      <img src={contact.image} alt={contact.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-brand transition-colors">
                          {contact.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border inline-flex items-center gap-1 mt-0.5 ${getRoleBadgeColor(contact.role)}`}>
                          <RoleIcon className="w-2.5 h-2.5" />
                          {contact.role}
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
