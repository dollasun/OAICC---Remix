import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckCircle2, ChevronRight, Clock, MapPin, Search, Star, Users, Video, X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { currentIdentity, type PortalUserRole } from '../../../utils/portalIdentity';
import { attendeeCount, eventsFor, hostName, isRegistered, toggleRegistration, type PortalEvent } from '../../../utils/portalEvents';

type Tab = 'upcoming' | 'registered' | 'past';

interface Props {
  role: PortalUserRole;
  subtitle: string;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const timeRange = (e: PortalEvent) => `${fmtTime(e.start)} - ${fmtTime(e.end)}`;
const isPast = (e: PortalEvent) => new Date(e.end).getTime() < Date.now();

export default function PortalEvents({ role, subtitle }: Props) {
  const { showToast } = useToast();
  const me = currentIdentity(role);
  const [tab, setTab] = useState<Tab>('upcoming');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<PortalEvent | null>(null);
  const [version, setVersion] = useState(0); // re-read registrations after a change

  const all = useMemo(() => eventsFor(role, me?.schoolId), [role, me?.schoolId]);
  const registered = (e: PortalEvent) => (me ? isRegistered(e.id, role, me.id) : false);
  void version;

  const categories = [...new Set(all.map(e => e.category))].sort();
  const q = query.trim().toLowerCase();
  const visible = all
    .filter(e => (tab === 'past' ? isPast(e) : !isPast(e)))
    .filter(e => tab !== 'registered' || registered(e))
    .filter(e => !category || e.category === category)
    .filter(e => !q || [e.title, e.category, e.description, hostName(e), e.location].some(v => v.toLowerCase().includes(q)))
    .sort((a, b) => (tab === 'past' ? b.start.localeCompare(a.start) : a.start.localeCompare(b.start)));
  const featured = all.filter(e => e.featured && !isPast(e)).sort((a, b) => a.start.localeCompare(b.start))[0];

  const toggle = (e: PortalEvent) => {
    if (!me) { showToast('Sign in to register for events.', 'error'); return; }
    const now = toggleRegistration(e.id, role, me.id);
    setVersion(v => v + 1);
    showToast(now ? `You're registered for ${e.title}.` : `Registration for ${e.title} cancelled.`);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'registered', label: 'Registered' },
    { id: 'past', label: 'Past Events' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events & Workshops</h1>
          <p className="text-slate-500 font-medium mt-1">{subtitle}</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${tab === t.id ? 'bg-brand text-white shadow-sm shadow-brand/5' : 'text-slate-400 hover:text-slate-600'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search events by title, host, category or venue..." value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category"
          className="px-5 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 outline-none focus:ring-4 focus:ring-brand/10">
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700">{tab === 'registered' ? "You haven't registered for any upcoming events." : 'No events match your search.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {visible.map((event, index) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 6) * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all group flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden shrink-0">
                <img src={event.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand rounded-lg text-[10px] font-bold uppercase tracking-widest">{event.category}</span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand mb-1">Hosted by {hostName(event)}</p>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand transition-colors">{event.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {fmtDate(event.start)}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {timeRange(event)}</span>
                      <span className="flex items-center gap-1.5">{event.mode === 'Online' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />} {event.location}</span>
                    </div>
                  </div>
                  {registered(event) && (
                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> {isPast(event) ? 'Attended' : 'Registered'}
                    </div>
                  )}
                </div>
                <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">{event.description}</p>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><Users className="w-4 h-4" /> {attendeeCount(event)} {isPast(event) ? 'attended' : 'attending'}</span>
                  <button onClick={() => setSelected(event)} className="flex items-center gap-2 text-brand font-bold text-sm hover:underline">
                    {isPast(event) || registered(event) ? 'View Details' : 'Register Now'} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {featured && tab !== 'past' && (
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-brand font-bold text-sm uppercase tracking-widest mb-4"><Star className="w-5 h-5 fill-brand" /> Featured {featured.category}</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">{featured.title}</h2>
            <p className="text-white/70 text-lg font-medium mb-8">{featured.description}</p>
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
                <div><p className="text-xs font-bold text-white/50 uppercase">Date</p><p className="font-bold">{fmtDate(featured.start)}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">{featured.mode === 'Online' ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}</div>
                <div><p className="text-xs font-bold text-white/50 uppercase">{featured.mode === 'Online' ? 'Platform' : 'Venue'}</p><p className="font-bold">{featured.location}</p></div>
              </div>
            </div>
            <button onClick={() => (registered(featured) ? setSelected(featured) : toggle(featured))}
              className="bg-brand text-white px-10 py-4 rounded-xl font-bold shadow-sm shadow-brand/5 hover:scale-105 transition-all flex items-center gap-2">
              {registered(featured) ? <><CheckCircle2 className="w-5 h-5" /> You're registered</> : 'Register for Free'}
            </button>
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-brand/20 to-transparent hidden lg:block" />
          <Users className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div role="dialog" aria-modal="true" aria-label={selected.title} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-sm">
              <img src={selected.image} alt="" className="w-full h-44 object-cover" />
              <button onClick={() => setSelected(null)} aria-label="Close" className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg text-slate-600 hover:bg-white"><X className="w-5 h-5" /></button>
              <div className="p-8 space-y-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brand mb-1">{selected.category} · Hosted by {hostName(selected)}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{selected.title}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 font-medium"><Calendar className="w-4 h-4 text-slate-400" /> {fmtDate(selected.start)}</div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium"><Clock className="w-4 h-4 text-slate-400" /> {timeRange(selected)}</div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium sm:col-span-2">{selected.mode === 'Online' ? <Video className="w-4 h-4 text-slate-400" /> : <MapPin className="w-4 h-4 text-slate-400" />} {selected.mode} · {selected.location}</div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium sm:col-span-2"><Users className="w-4 h-4 text-slate-400" /> {attendeeCount(selected)} {isPast(selected) ? 'attended' : 'attending'}</div>
                </div>
                <p className="text-slate-600 leading-relaxed">{selected.description}</p>
                {isPast(selected) ? (
                  <p className="text-sm font-bold text-slate-400">This event has ended.</p>
                ) : (
                  <button onClick={() => toggle(selected)}
                    className={registered(selected) ? 'w-full px-6 py-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all' : 'btn-primary w-full py-4'}>
                    {registered(selected) ? 'Cancel registration' : 'Register for this event'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
