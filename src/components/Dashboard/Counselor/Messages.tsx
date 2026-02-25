import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Search, Send, MoreVertical, Phone, Video, Info, X } from 'lucide-react';

const initialChats = [
  {
    id: 1,
    name: 'Favour Aina',
    lastMessage: 'Thank you for the session today, it was really helpful!',
    time: '2m ago',
    unread: 2,
    image: 'https://picsum.photos/seed/s1/100/100',
    online: true,
    messages: [
      { id: 1, sender: 'student', text: 'Hello Mr. Alfred, I just wanted to ask about the next steps for my computer science application.', time: '10:00 AM' },
      { id: 2, sender: 'counselor', text: 'Hi Favour! We\'ll discuss that in our session today at 2:00 PM. Make sure you have your transcripts ready.', time: '10:15 AM' },
      { id: 3, sender: 'student', text: 'Thank you for the session today, it was really helpful!', time: '3:30 PM' }
    ]
  },
  {
    id: 2,
    name: 'Adebayo Samuel',
    lastMessage: 'When is our next meeting scheduled?',
    time: '1h ago',
    unread: 0,
    image: 'https://picsum.photos/seed/s2/100/100',
    online: false,
    messages: [
      { id: 1, sender: 'student', text: 'When is our next meeting scheduled?', time: '11:00 AM' }
    ]
  },
  {
    id: 3,
    name: 'Chioma Okeke',
    lastMessage: 'I have updated my career interests.',
    time: '3h ago',
    unread: 0,
    image: 'https://picsum.photos/seed/s3/100/100',
    online: true,
    messages: [
      { id: 1, sender: 'student', text: 'I have updated my career interests.', time: '9:00 AM' }
    ]
  }
];

export default function Messages() {
  const [chats, setChats] = useState(initialChats);
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const selectedChat = chats.find(c => c.id === selectedChatId) || chats[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          lastMessage: newMessage,
          time: 'Just now',
          messages: [
            ...chat.messages,
            {
              id: chat.messages.length + 1,
              sender: 'counselor',
              text: newMessage,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setNewMessage('');
  };

  const selectChat = (id: number) => {
    setSelectedChatId(id);
    // Mark as read
    setChats(chats.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-8">
      {/* Chat List */}
      <div className="w-96 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.map((chat) => (
            <button 
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left group ${
                chat.id === selectedChatId ? 'bg-brand/5' : 'hover:bg-slate-50'
              }`}
            >
              <div className="relative">
                <img src={chat.image} alt={chat.name} className="w-12 h-12 rounded-2xl object-cover" />
                {chat.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className={`font-bold truncate ${chat.id === selectedChatId ? 'text-brand' : 'text-slate-900'}`}>{chat.name}</h4>
                  <span className="text-[10px] font-bold text-slate-400">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-lg flex items-center justify-center shrink-0">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={selectedChat.image} alt={selectedChat.name} className="w-12 h-12 rounded-2xl object-cover" />
            <div>
              <h3 className="font-bold text-slate-900">{selectedChat.name}</h3>
              <p className={`text-xs font-bold uppercase tracking-widest ${selectedChat.online ? 'text-emerald-500' : 'text-slate-400'}`}>
                {selectedChat.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex justify-center">
            <span className="px-4 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-lg">Conversation Started</span>
          </div>

          {selectedChat.messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-4 ${msg.sender === 'counselor' ? 'flex-row-reverse' : ''}`}
            >
              {msg.sender === 'counselor' ? (
                <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center text-white text-[10px] font-bold mt-1 shrink-0">AF</div>
              ) : (
                <img src={selectedChat.image} alt={selectedChat.name} className="w-8 h-8 rounded-xl object-cover mt-1 shrink-0" />
              )}
              <div className="flex flex-col gap-1">
                <div className={`max-w-md p-4 rounded-3xl text-sm font-medium ${
                  msg.sender === 'counselor' 
                    ? 'bg-brand text-white rounded-tr-none shadow-lg shadow-brand/20' 
                    : 'bg-slate-50 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <span className={`text-[10px] font-bold text-slate-400 ${msg.sender === 'counselor' ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-50">
          <div className="relative">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Reply to ${selectedChat.name}...`} 
              className="w-full pl-6 pr-16 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-brand/10 font-medium text-slate-700 transition-all"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-brand text-white rounded-xl shadow-lg shadow-brand/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
