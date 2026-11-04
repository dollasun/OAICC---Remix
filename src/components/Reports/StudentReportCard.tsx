/**
 * Student report card (PDF). Visual language follows the OAICC landing page: deep navy canvas,
 * rounded Quicksand type, a cyan "highlighter" chip, tilted colour pills, tinted cards with
 * numbered tilted badges, and coloured progress bars.
 */
import React from 'react';
import { Circle, Document, Font, G, Page, Path, Polygon, Rect, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';
import q400 from '@fontsource/quicksand/files/quicksand-latin-400-normal.woff?url';
import q500 from '@fontsource/quicksand/files/quicksand-latin-500-normal.woff?url';
import q600 from '@fontsource/quicksand/files/quicksand-latin-600-normal.woff?url';
import q700 from '@fontsource/quicksand/files/quicksand-latin-700-normal.woff?url';
import type { ReportData } from '../../utils/studentReport';

Font.register({
  family: 'Quicksand',
  fonts: [{ src: q400, fontWeight: 400 }, { src: q500, fontWeight: 500 }, { src: q600, fontWeight: 600 }, { src: q700, fontWeight: 700 }],
});
Font.registerHyphenationCallback(word => [word]); // never split words mid-way

const C = {
  bg: '#05071A', card: '#0C1430', cardLine: '#1A2547', text: '#FFFFFF', muted: '#8E9BC6', faint: '#5C6896',
  cyan: '#00B4D8', cyanSoft: '#06283A', orange: '#F97316', orangeSoft: '#2A1608', yellow: '#FBBF24', yellowSoft: '#2A2008',
  purple: '#8B5CF6', purpleSoft: '#1D1240', red: '#EF4444', green: '#10B981', greenSoft: '#06261D', blue: '#3B82F6', blueSoft: '#0B1D45',
};
const BAR_COLORS = [C.green, C.cyan, C.orange, C.purple, C.yellow];
const PILL_COLORS = [C.red, C.orange, C.yellow, C.purple, C.cyan, C.green, C.blue, C.orange];
const PILL_TILT = [-3, 2, -2, 3, -1.5, 2.5, -2.5, 1.5];

const s = StyleSheet.create({
  page: { backgroundColor: C.bg, fontFamily: 'Quicksand', color: C.text, padding: 30, paddingBottom: 22 },
  row: { flexDirection: 'row' },
  card: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.cardLine, padding: 12 },
  eyebrow: { fontSize: 7.5, fontWeight: 700, letterSpacing: 1.2, color: C.cyan, textTransform: 'uppercase' },
  h2: { fontSize: 12.5, fontWeight: 700, color: C.text },
  muted: { fontSize: 8.5, fontWeight: 500, color: C.muted },
});

/** The playful numbered badge used on each section card. */
function Badge({ n, color, tilt = -6 }: { n: number; color: string; tilt?: number }) {
  return (
    <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: color, alignItems: 'center', justifyContent: 'center', transform: `rotate(${tilt}deg)`, marginRight: 9 }}>
      <Text style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{n}</Text>
    </View>
  );
}

function CardHeader({ n, color, title, tilt }: { n: number; color: string; title: string; tilt?: number }) {
  return (
    <View style={[s.row, { alignItems: 'center', marginBottom: 8 }]}>
      <Badge n={n} color={color} tilt={tilt} />
      <Text style={s.h2}>{title}</Text>
    </View>
  );
}

function Pill({ label, color, tilt, size = 9 }: { label: string; color: string; tilt: number; size?: number }) {
  return (
    <View style={{ backgroundColor: color, borderRadius: 11, paddingHorizontal: 10, paddingVertical: 4.5, marginRight: 7, marginBottom: 7, transform: `rotate(${tilt}deg)` }}>
      <Text style={{ fontSize: size, fontWeight: 700, color: color === C.yellow ? '#3A2A00' : C.text }} maxLines={1}>{label.length > 30 ? `${label.slice(0, 29)}…` : label}</Text>
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

/** Cartoon turtle mascot (simplified), drawn as vector shapes. */
function Turtle() {
  return (
    <Svg width={34} height={22} viewBox="0 0 68 44">
      <Rect x="14" y="30" width="9" height="11" rx="4" fill="#34D399" />
      <Rect x="40" y="30" width="9" height="11" rx="4" fill="#34D399" />
      <Path d="M6 34 C6 8, 52 8, 54 34 Z" fill="#2A6DF4" />
      <Circle cx="22" cy="22" r="5" fill="#FF6A00" />
      <Circle cx="34" cy="17" r="5" fill="#FFB400" />
      <Circle cx="44" cy="25" r="4.5" fill="#EF4444" />
      <Circle cx="58" cy="26" r="9" fill="#34D399" />
      <Circle cx="61" cy="23" r="2.2" fill="#05071A" />
      <Path d="M2 34 L-3 30 L4 28 Z" fill="#34D399" />
    </Svg>
  );
}

function Logo() {
  const L = ({ ch, color }: { ch: string; color: string }) => <Text style={{ fontSize: 24, fontWeight: 700, color, letterSpacing: -1 }}>{ch}</Text>;
  return (
    <View style={[s.row, { alignItems: 'center' }]}>
      <L ch="o" color="#3B6BFF" /><L ch="a" color="#00ADEF" /><L ch="i" color="#FF3B00" /><L ch="c" color="#FF6A00" /><L ch="c" color="#FFB400" />
      <View style={{ marginLeft: 4, marginTop: 2 }}><Turtle /></View>
    </View>
  );
}

function ProgressRing({ percent, color }: { percent: number; color: string }) {
  const r = 31;
  const circ = 2 * Math.PI * r;
  return (
    <View style={{ width: 70, height: 70 }}>
      <Svg width={70} height={70} viewBox="0 0 76 76">
        <Circle cx="38" cy="38" r={r} stroke={C.cardLine} strokeWidth={8} fill="none" />
        {percent > 0 && (
          <G transform="rotate(-90 38 38)">
            <Circle cx="38" cy="38" r={r} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={`${Math.max(0.5, (circ * Math.min(percent, 100)) / 100)} ${circ}`} />
          </G>
        )}
      </Svg>
      <View style={{ position: 'absolute', top: 0, left: 0, width: 70, height: 70, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 17, fontWeight: 700 }}>{percent}%</Text>
      </View>
    </View>
  );
}

export default function StudentReportCard({ data }: { data: ReportData }) {
  const quizColor = data.quiz.status === 'Complete' ? C.green : data.quiz.status === 'In progress' ? C.orange : C.faint;
  const top = data.recommended[0];
  const heroSize = data.firstName.length <= 8 ? 31 : data.firstName.length <= 12 ? 26 : data.firstName.length <= 16 ? 21 : 17;
  const nameSize = data.name.length > 26 ? 8.5 : data.name.length > 18 ? 9.5 : 11.5;
  const rest = data.recommended.slice(1, 4);
  const shownFavs = data.favourites.slice(0, 6);
  const floatFav = data.favourites.find(f => f !== top?.title) ?? data.favourites[0];
  const moreFavs = data.favourites.length - shownFavs.length;

  return (
    <Document title={`${data.name} – OAICC Report Card`} author="OAICC" subject="Student report card">
      <Page size="A4" style={s.page}>
        {/* decorative blobs (small, absolutely positioned so they never affect layout) */}
        {([
          { top: -60, right: -60, size: 200, color: C.cyan, o: 0.09 },
          { top: 400, left: -50, size: 130, color: C.purple, o: 0.08 },
          { bottom: -70, right: -60, size: 210, color: C.orange, o: 0.08 },
        ] as const).map((b, i) => (
          <Svg key={i} fixed width={b.size} height={b.size} viewBox="0 0 100 100" style={{ position: 'absolute', ...('top' in b ? { top: b.top } : { bottom: b.bottom }), ...('right' in b ? { right: b.right } : { left: b.left }) }}>
            <Circle cx="50" cy="50" r="50" fill={b.color} opacity={b.o} />
          </Svg>
        ))}

        {/* header */}
        <View style={[s.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <Logo />
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ borderWidth: 1, borderColor: C.cyan, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3.5 }}>
              <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.2, color: C.cyan }}>STUDENT REPORT CARD</Text>
            </View>
            <Text style={[s.muted, { marginTop: 4, fontSize: 7.5 }]}>Generated {data.generatedOn}</Text>
          </View>
        </View>

        {/* hero */}
        <View style={[s.row, { marginTop: 14, alignItems: 'flex-start' }]}>
          <View style={{ flex: 1, paddingRight: 14 }}>
            <Text style={s.eyebrow} maxLines={1}>{data.schoolName}</Text>
            <Text style={{ fontSize: heroSize, fontWeight: 700, lineHeight: 1.1, marginTop: 6 }} maxLines={1}>{data.firstName}’s</Text>
            <View style={{ alignSelf: 'flex-start', backgroundColor: C.cyan, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 3, marginTop: 4, transform: 'rotate(-2deg)' }}>
              <Text style={{ fontSize: Math.min(heroSize, 31), fontWeight: 700, lineHeight: 1.15 }}>report card.</Text>
            </View>
            <Text style={[s.muted, { marginTop: 10, fontSize: 9, lineHeight: 1.45 }]}>
              How {data.firstName} is exploring careers on OAICC: quiz progress, top matches, favourites and support.
            </Text>
          </View>

          {/* identity card with floating pills */}
          <View style={{ width: 232, marginTop: 8 }}>
            <View style={[s.card, { padding: 13 }]}>
              <View style={[s.row, { alignItems: 'center' }]}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: 700 }}>{data.initials}</Text>
                </View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ fontSize: nameSize, fontWeight: 700 }} maxLines={2}>{data.name}</Text>
                  <Text style={s.muted}>{data.className} · Student</Text>
                </View>
                <View style={{ backgroundColor: data.accountStatus === 'active' ? C.greenSoft : C.orangeSoft, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2.5 }}>
                  <Text style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: 0.8, color: data.accountStatus === 'active' ? C.green : C.orange }}>{data.accountStatus === 'active' ? 'ACTIVE' : 'INVITED'}</Text>
                </View>
              </View>
              <View style={{ height: 1, backgroundColor: C.cardLine, marginVertical: 10 }} />
              <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: C.faint }}>LAST LOGIN</Text>
              <Text style={{ fontSize: 12, fontWeight: 700, marginTop: 3 }}>{data.lastLogin ? data.lastLogin.label : 'Not logged in yet'}</Text>
              <Text style={{ fontSize: 8.5, fontWeight: 600, color: data.lastLogin ? C.cyan : C.faint, marginTop: 1 }}>{data.lastLogin ? data.lastLogin.relative : 'Waiting for their first sign-in'}</Text>
            </View>
            {top && (
              <View style={{ position: 'absolute', top: -7, right: -4, backgroundColor: C.red, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 4, transform: 'rotate(4deg)' }}>
                <Text style={{ fontSize: 8, fontWeight: 700 }} maxLines={1}>{top.title}</Text>
              </View>
            )}
            {floatFav && (
              <View style={{ position: 'absolute', bottom: -10, left: -8, backgroundColor: C.yellow, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 4, transform: 'rotate(-4deg)' }}>
                <Text style={{ fontSize: 8, fontWeight: 700, color: '#3A2A00' }} maxLines={1}>{floatFav}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 1 quiz + 2 counsellor */}
        <View style={[s.row, { marginTop: 16 }]}>
          <View style={[s.card, { flex: 1.35, backgroundColor: C.cyanSoft, borderColor: '#0B4A63', marginRight: 10 }]} wrap={false}>
            <CardHeader n={1} color={C.cyan} title="Quiz completed" />
            <View style={[s.row, { alignItems: 'center' }]}>
              <ProgressRing percent={data.quiz.percent} color={quizColor} />
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: 700 }}>{data.quiz.answered} <Text style={{ fontSize: 9.5, color: C.muted, fontWeight: 500 }}>of {data.quiz.total} questions</Text></Text>
                <View style={{ alignSelf: 'flex-start', backgroundColor: quizColor, borderRadius: 9, paddingHorizontal: 8, paddingVertical: 3, marginTop: 6 }}>
                  <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 0.6 }}>{data.quiz.status.toUpperCase()}</Text>
                </View>
                <Text style={[s.muted, { marginTop: 6, fontSize: 8 }]}>{data.quiz.unlocked ? 'Career matches are unlocked.' : 'Matches unlock after 25 questions.'}</Text>
              </View>
            </View>
          </View>

          <View style={[s.card, { flex: 1, backgroundColor: C.orangeSoft, borderColor: '#5A2E0F' }]} wrap={false}>
            <CardHeader n={2} color={C.orange} title="Assigned counsellor" tilt={5} />
            <View style={[s.row, { alignItems: 'center' }]}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: data.counsellor ? C.orange : C.cardLine, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: 700 }}>{data.counsellor ? data.counsellor.initials : '?'}</Text>
              </View>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ fontSize: data.counsellor && data.counsellor.name.length > 22 ? 9.5 : 11.5, fontWeight: 700 }} maxLines={1}>{data.counsellor ? data.counsellor.name : 'Not assigned yet'}</Text>
                <Text style={[s.muted, { marginTop: 2 }]}>{data.counsellor ? 'Career counsellor' : 'Booked on their first session'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3 recommended careers */}
        <View style={[s.card, { marginTop: 10 }]} wrap={false}>
          <View style={[s.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
            <CardHeader n={3} color={C.purple} title="Recommended careers" tilt={-4} />
            <Text style={[s.muted, { fontSize: 7.5 }]}>Ranked by how well they fit</Text>
          </View>
          {!top ? (
            <View style={{ backgroundColor: C.bg, borderRadius: 12, padding: 14 }}>
              <Text style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>No matches yet. Recommendations appear once {data.firstName} has answered 25 quiz questions.</Text>
            </View>
          ) : (
            <View>
              <View style={[s.row, { alignItems: 'center', backgroundColor: C.bg, borderRadius: 12, padding: 10, marginBottom: 10 }]}>
                <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)' }}><Star size={16} color="#7A4B00" /></View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ fontSize: 7.5, color: C.muted, fontWeight: 600 }}>#1 career match</Text>
                  <Text style={{ fontSize: top.title.length > 26 ? 10.5 : 12.5, fontWeight: 700 }} maxLines={1}>{top.title} <Text style={{ color: C.yellow }}>· {top.match}%</Text></Text>
                </View>
                <Text style={{ fontSize: 8, color: C.muted, fontWeight: 600, maxWidth: 110 }} maxLines={1}>{top.category}</Text>
              </View>
              {rest.map((c, i) => (
                <View key={c.title} style={{ marginBottom: i === rest.length - 1 ? 0 : 7 }}>
                  <View style={[s.row, { justifyContent: 'space-between', marginBottom: 3 }]}>
                    <Text style={{ fontSize: 9.5, fontWeight: 600, flex: 1, paddingRight: 8 }} maxLines={1}>{c.title} <Text style={{ fontSize: 7.5, color: C.faint }}>  {c.category}</Text></Text>
                    <Text style={{ fontSize: 9.5, fontWeight: 700 }}>{c.match}%</Text>
                  </View>
                  <View style={{ height: 6, borderRadius: 3, backgroundColor: C.cardLine }}>
                    <View style={{ height: 6, borderRadius: 3, width: `${Math.max(4, Math.min(c.match, 100))}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 4 favourites */}
        <View style={[s.card, { marginTop: 10 }]} wrap={false}>
          <CardHeader n={4} color={C.red} title="Favourited careers" tilt={5} />
          {shownFavs.length === 0 ? (
            <Text style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>{data.firstName} hasn’t saved any careers yet.</Text>
          ) : (
            <View style={[s.row, { flexWrap: 'wrap', paddingTop: 2 }]}>
              {shownFavs.map((f, i) => <React.Fragment key={f}><Pill label={f} color={PILL_COLORS[i % PILL_COLORS.length]} tilt={PILL_TILT[i % PILL_TILT.length]} /></React.Fragment>)}
              {moreFavs > 0 && <Pill label={`+${moreFavs} more`} color={C.cardLine} tilt={0} />}
            </View>
          )}
        </View>

        {/* 5 + 6 session stat tiles */}
        <View style={[s.row, { marginTop: 10 }]}>
          <View style={[s.card, { flex: 1, marginRight: 10, backgroundColor: C.orangeSoft, borderColor: '#5A2E0F' }]} wrap={false}>
            <CardHeader n={5} color={C.orange} title="Sessions with counsellor" />
            <View style={[s.row, { alignItems: 'flex-end' }]}>
              <Text style={{ fontSize: 34, fontWeight: 700, lineHeight: 1, color: C.orange }}>{data.counsellorSessions.total}</Text>
              <Text style={[s.muted, { marginLeft: 8, marginBottom: 5 }]}>{data.counsellorSessions.total === 1 ? 'session' : 'sessions'} · {data.counsellorSessions.completed} completed</Text>
            </View>
          </View>
          <View style={[s.card, { flex: 1, backgroundColor: C.purpleSoft, borderColor: '#3B2A78' }]} wrap={false}>
            <CardHeader n={6} color={C.purple} title="Sessions with mentor" tilt={5} />
            <View style={[s.row, { alignItems: 'flex-end' }]}>
              <Text style={{ fontSize: 34, fontWeight: 700, lineHeight: 1, color: '#A78BFA' }}>{data.mentorSessions.total}</Text>
              <Text style={[s.muted, { marginLeft: 8, marginBottom: 5, flex: 1 }]} maxLines={2}>{data.mentorSessions.total === 0 ? 'no sessions yet' : data.mentorSessions.mentors.slice(0, 2).join(' & ')}</Text>
            </View>
          </View>
        </View>

        {/* footer */}
        <View style={[s.row, { justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }]}>
          <View style={s.row}>
            {[C.cyan, C.orange, C.yellow, C.purple, C.green].map(c => <View key={c} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: c, marginRight: 4 }} />)}
          </View>
          <Text style={{ fontSize: 7.5, fontWeight: 500, color: C.faint }}>Prepared by {data.schoolName} · Powered by OAICC · oaiccglobal.com</Text>
        </View>
      </Page>
    </Document>
  );
}
