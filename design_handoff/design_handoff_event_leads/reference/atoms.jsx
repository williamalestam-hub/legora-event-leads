// Shared UI atoms for Event Leads. Exported to window for cross-script use.

const elIcons = {
  star: (c) => (
    <svg viewBox="0 0 389 389" fill="none" aria-hidden="true">
      <path fill="currentColor" d="M199.81,0v188.71h188.71v11.1c-127.12,4.82-183.88,61.61-188.71,188.71h-11.1c-4.83-127.1-61.59-183.89-188.71-188.71v-11.1C127.11,183.9,183.86,127.07,188.71,0h11.1Z"/>
    </svg>
  ),
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.35-4.35"/></svg>,
  plus:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  check:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 6"/></svg>,
  chev:   (d='m6 9 6 6 6-6') => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>,
  back:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,
  more:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>,
  close:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M6 18L18 6"/></svg>,
  fire:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c3 4 5 6 5 10a5 5 0 1 1-10 0c0-2 1-3 2-4-1 3 1 4 2 4 0-2 0-4 1-5 0-2 0-3 0-5Z"/></svg>,
  sun:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>,
  snow:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 3v18M5 7l14 10M5 17l14-10M3 12h18"/></svg>,
  mail:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>,
  copy:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>,
  user:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c1-4 5-6 8-6s7 2 8 6"/></svg>,
  download:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16"/></svg>,
  trash:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>,
  chart:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>,
  clock:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
};

function LegoraStar({ size=18 }) {
  return (
    <span className="el-logo-mark" style={{ width: size, height: size }}>{elIcons.star()}</span>
  );
}

function LegoraMark({ size=18 }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:8, color:'rgb(0, 49, 28)' }}>
      <LegoraStar size={size} />
      <span className="el-wordmark">Legora</span>
    </span>
  );
}

function Badge({ variant='grey', children, dot=false }){
  const cls = {
    hot:'el-badge-hot', warm:'el-badge-warm', cold:'el-badge-cold',
    copper:'el-badge-copper', green:'el-badge-green', grey:'el-badge-grey',
  }[variant] || 'el-badge-grey';
  return <span className={`el-badge ${cls}`}>{dot && <span className="dot"/>}{children}</span>;
}

function ratingLabel(r){ return { hot:'Hot', warm:'Warm', cold:'Cold' }[r] || r; }
function ratingBadge(r){
  if(!r) return null;
  const variant = r === 'hot' ? 'hot' : r === 'warm' ? 'warm' : 'cold';
  return <Badge variant={variant} dot>{ratingLabel(r)}</Badge>;
}

function Avatar({ name, idx=0, size=28 }){
  const swatches = ['#e68846','#a1c699','#bdd4f0','#967868','#4260a8','#ce5f27','#e1d5b6'];
  const bg = swatches[(name||'').charCodeAt(0) % swatches.length || idx % swatches.length];
  const darkText = ['#bdd4f0','#e1d5b6','#a1c699'].includes(bg);
  const initials = (name||'?').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
  return (
    <span className="el-avatar" style={{
      background: bg, color: darkText ? '#1c1c1c' : '#fff',
      width: size, height: size, fontSize: Math.round(size*0.39)
    }}>{initials}</span>
  );
}

function fmtMinsAgo(ts){
  const m = Math.floor((Date.now()-ts)/60000);
  if (m<1) return 'just now';
  if (m<60) return m+'m ago';
  const h = Math.floor(m/60); if (h<24) return h+'h ago';
  return Math.floor(h/24)+'d ago';
}

function useSnap(){
  const [, set] = React.useState(0);
  React.useEffect(() => window.EL.subscribe(() => set(x=>x+1)), []);
  return window.EL.state;
}

Object.assign(window, { elIcons, LegoraStar, LegoraMark, Badge, ratingBadge, ratingLabel, Avatar, fmtMinsAgo, useSnap });
