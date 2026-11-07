/**
 * The playful layer on top of messaging: points, levels, a daily streak and achievements, all derived
 * from the person's real conversations (nothing extra is stored). It rewards the behaviour a school
 * community needs: replying to people, recognising good work and keeping conversations going.
 */
import type { ChatThread } from './crossPortalMessaging';

const DAY = 86_400_000;

export const REACTIONS = ['👍', '🎉', '❤️', '👏'] as const;

export const KUDOS_BADGES: Record<string, { emoji: string; label: string; line: string }> = {
  star: { emoji: '⭐', label: 'Star effort', line: 'for outstanding effort' },
  progress: { emoji: '📈', label: 'Great progress', line: 'for great progress' },
  team: { emoji: '🤝', label: 'Team player', line: 'for being a brilliant team player' },
  thanks: { emoji: '💙', label: 'Thank you', line: 'with a big thank you' },
};

export const POINTS = { message: 5, kudosSent: 15, kudosReceived: 10, reaction: 2 } as const;

export const LEVELS = [
  { name: 'Newcomer', min: 0 },
  { name: 'Connector', min: 50 },
  { name: 'Collaborator', min: 120 },
  { name: 'Champion', min: 250 },
  { name: 'Community Star', min: 500 },
] as const;

export interface Achievement { id: string; emoji: string; label: string; hint: string; earned: boolean }

export interface ChatStats {
  points: number;
  level: number;
  levelName: string;
  nextLevelName?: string;
  /** Points still needed for the next level, and progress towards it (0-100). */
  toNext: number;
  progress: number;
  streak: number;
  replyRate: number;
  kudosSent: number;
  kudosReceived: number;
  achievements: Achievement[];
}

const dayKey = (ts: number) => new Date(ts).toDateString();

export function levelFor(points: number) {
  let i = 0;
  LEVELS.forEach((l, idx) => { if (points >= l.min) i = idx; });
  return i;
}

export function chatStats(threads: ChatThread[], meId: string, now = Date.now()): ChatStats {
  let sent = 0; let kudosSent = 0; let kudosReceived = 0; let reactionsGiven = 0; let quickReplies = 0;
  const sentDays = new Set<string>();
  const people = new Set<string>();
  let awaiting = 0; let answered = 0;

  threads.forEach(t => {
    const msgs = [...t.messages].sort((a, b) => a.timestamp - b.timestamp);
    msgs.forEach((m, i) => {
      if (m.senderId === meId) {
        sent++;
        sentDays.add(dayKey(m.timestamp));
        if (m.kind === 'kudos') kudosSent++;
        const prev = msgs[i - 1];
        if (prev && prev.senderId !== meId && m.timestamp - prev.timestamp <= 3_600_000) quickReplies++;
      } else if (m.kind === 'kudos') {
        kudosReceived++;
      }
      Object.values(m.reactions ?? {}).forEach(ids => { if (ids.includes(meId)) reactionsGiven++; });
    });
    if (msgs.some(m => m.senderId === meId)) t.participants.forEach(p => { if (p.id !== meId) people.add(p.id); });
    if (msgs.some(m => m.senderId !== meId)) {
      awaiting++;
      if (msgs[msgs.length - 1]?.senderId === meId) answered++;
    }
  });

  // Consecutive days with at least one message sent, ending today (or yesterday, so it isn't lost before you've posted today).
  let streak = 0;
  const start = sentDays.has(dayKey(now)) ? 0 : 1;
  for (let d = start; sentDays.has(dayKey(now - d * DAY)); d++) streak++;

  const points = sent * POINTS.message + kudosSent * (POINTS.kudosSent - POINTS.message) + kudosReceived * POINTS.kudosReceived + reactionsGiven * POINTS.reaction;
  const level = levelFor(points);
  const next = LEVELS[level + 1];
  const floor = LEVELS[level].min;

  return {
    points, level, levelName: LEVELS[level].name, nextLevelName: next?.name,
    toNext: next ? next.min - points : 0,
    progress: next ? Math.round(((points - floor) / (next.min - floor)) * 100) : 100,
    streak, replyRate: awaiting ? Math.round((answered / awaiting) * 100) : 100,
    kudosSent, kudosReceived,
    achievements: [
      { id: 'hello', emoji: '👋', label: 'First hello', hint: 'Send your first message', earned: sent >= 1 },
      { id: 'quick', emoji: '⚡', label: 'Quick responder', hint: 'Reply within an hour 3 times', earned: quickReplies >= 3 },
      { id: 'cheer', emoji: '🎉', label: 'Cheerleader', hint: 'React to 5 messages', earned: reactionsGiven >= 5 },
      { id: 'kudos', emoji: '🏆', label: 'Kudos giver', hint: 'Send 3 kudos', earned: kudosSent >= 3 },
      { id: 'streak', emoji: '🔥', label: 'On fire', hint: 'Message on 3 days in a row', earned: streak >= 3 },
      { id: 'connector', emoji: '🌍', label: 'Connector', hint: 'Talk with 5 different people', earned: people.size >= 5 },
    ],
  };
}
