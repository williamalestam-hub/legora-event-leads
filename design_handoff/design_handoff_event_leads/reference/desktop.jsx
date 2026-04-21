// Manager + Admin desktop artboards (1200x820)

function ManagerArtboard({ tweaks }) {
  const snap = useSnap();
  const evId = window.EL.activeEventId();
  const ev = snap.events.find(e=>e.id===evId);
  const leads = window.EL.leadsFor(evId);
  const booth = window.EL.boothFor(evId);
  const attendees = window.EL.attendeesFor(evId);

  const by = (r) => leads.filter(l=>l.rating===r).length;
  const hot = by('hot'), warm = by('warm'), cold = by('cold');
  const total = leads.length;
  const reach = attendees.length ? Math.round(total/attendees.length*100) : 0;

  const byRep = snap.reps.map(r => {
    const mine = leads.filter(l=>l.repId===r.id);
    return { ...r, count: mine.length, hot: mine.filter(l=>l.rating==='hot').length, warm: mine.filter(l=>l.rating==='warm').length, cold: mine.filter(l=>l.rating==='cold').length };
  }).sort((a,b)=>b.count-a.count);

  return (
    <div className="el-root" style={{ width:1200, height:820, display:'flex', flexDirection:'column', background:'var(--surface-secondary)' }}>
      {/* topbar */}
      <div className="el-topbar">
        <div style={{ display:'flex', alignItems:'center', gap:24 }}>
          <LegoraMark size={20}/>
          <span style={{ fontSize:13, color:'var(--color-text-subtle)' }}>Event Leads · Manager</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Badge variant="copper" dot>LIVE · {ev?.code}</Badge>
          <button className="el-btn el-btn-secondary">{elIcons.download} Export CSV</button>
          <Avatar name="Klara Berg" size={28}/>
        </div>
      </div>

      {/* content */}
      <div style={{ flex:1, overflow:'auto', padding:'28px 40px' }} className="el-scroll">
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <div className="el-eyebrow" style={{ marginBottom:6 }}>LIVE · APR 28, 14:22 CET</div>
            <h1 className="serif" style={{ fontSize:32, fontWeight:500, margin:0, letterSpacing:'-0.02em' }}>LegalXchange · Munich</h1>
          </div>
          <div className="el-segtabs">
            <span className="el-segtab el-segtab-active">Today</span>
            <span className="el-segtab">Event-to-date</span>
            <span className="el-segtab">By rep</span>
          </div>
        </div>

        {/* stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr 1fr', gap:12, marginBottom:20 }}>
          <StatCard label="Leads logged" value={total} sub={`${reach}% of ${attendees.length} attendees`} copper/>
          <StatCard label="🔥 Hot" value={hot} sub={`${total?Math.round(hot/total*100):0}% of leads`} tone="hot"/>
          <StatCard label="☀ Warm" value={warm} sub={`${total?Math.round(warm/total*100):0}% of leads`} tone="warm"/>
          <StatCard label="❄ Cold" value={cold} sub={`${total?Math.round(cold/total*100):0}% of leads`} tone="cold"/>
          <StatCard label="Booth captures" value={booth.length} sub="self-service form"/>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:20 }}>
          {/* reps */}
          <div className="el-card" style={{ overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <h3 className="serif" style={{ fontSize:18, fontWeight:600, margin:0 }}>Leaderboard</h3>
                <p style={{ margin:'2px 0 0', fontSize:12, color:'var(--color-text-subtlest)' }}>Who's on the floor right now</p>
              </div>
              <span className="el-eyebrow">LAST 2H</span>
            </div>
            <div style={{ padding:'6px 10px 12px' }}>
              {byRep.map((r,i) => (
                <div key={r.id} style={{ display:'grid', gridTemplateColumns:'20px 1fr 120px 160px', gap:16, alignItems:'center', padding:'12px 10px', borderRadius:6 }}>
                  <span className="mono" style={{ fontSize:12, color:'var(--color-text-subtlest)' }}>0{i+1}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Avatar name={r.name} size={28}/>
                    <div>
                      <div style={{ fontSize:14, fontWeight:475 }}>{r.name}</div>
                      <div style={{ fontSize:12, color:'var(--color-text-subtlest)' }}>{r.count} leads · {r.count > 0 ? Math.round(r.hot/r.count*100) : 0}% hot</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    <Badge variant="hot">{r.hot}</Badge>
                    <Badge variant="warm">{r.warm}</Badge>
                    <Badge variant="cold">{r.cold}</Badge>
                  </div>
                  <MiniBar count={r.count} max={Math.max(...byRep.map(x=>x.count),1)}/>
                </div>
              ))}
            </div>
          </div>

          {/* recent */}
          <div className="el-card" style={{ overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <h3 className="serif" style={{ fontSize:18, fontWeight:600, margin:0 }}>Live feed</h3>
                <p style={{ margin:'2px 0 0', fontSize:12, color:'var(--color-text-subtlest)' }}>Newest leads first</p>
              </div>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:'var(--color-brand-dark-copper)' }}>
                <span style={{ width:6, height:6, borderRadius:99, background:'var(--color-brand-dark-copper)', animation:'elPulse 1.4s ease infinite' }}/>
                Streaming
              </span>
            </div>
            <div style={{ flex:1, overflow:'auto', padding:'4px 8px 8px' }} className="el-scroll">
              {leads.slice(0, 8).map(l => {
                const att = window.EL.attendeeById(evId, l.attendeeId);
                const rep = window.EL.repById(l.repId);
                if (!att) return null;
                return (
                  <div key={l.id} style={{ padding:'10px 12px', borderBottom:'1px solid rgba(0,0,0,.05)', display:'flex', alignItems:'flex-start', gap:10 }}>
                    <Avatar name={att.first+' '+att.last} size={28}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:13, fontWeight:475 }}>{att.first} {att.last}</span>
                        {ratingBadge(l.rating)}
                      </div>
                      <div style={{ fontSize:12, color:'var(--color-text-subtlest)', marginTop:1 }}>{att.company}</div>
                      {l.notes && <div style={{ fontSize:12, color:'var(--color-text-subtle)', marginTop:4, lineHeight:'17px' }}>"{l.notes}"</div>}
                      <div style={{ fontSize:11, color:'var(--color-text-disabled)', marginTop:4 }}>{rep?.name} · {fmtMinsAgo(l.timestamp)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, copper, tone }){
  const bg = copper ? 'var(--rb-copper-bg)' : undefined;
  const color = tone === 'hot' ? 'var(--rb-red-text)' : tone === 'warm' ? 'var(--rb-orange-text)' : 'var(--color-text)';
  return (
    <div className="el-card" style={{ padding:'16px 18px', background: bg || '#fff', borderColor: copper ? 'rgba(206,95,39,.25)' : undefined }}>
      <div className="el-eyebrow" style={{ fontSize:10, marginBottom:8, color: copper ? 'var(--color-brand-dark-copper)' : undefined }}>{label}</div>
      <div className="mono" style={{ fontSize:36, fontWeight:500, lineHeight:1, color, letterSpacing:'-0.02em' }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--color-text-subtlest)', marginTop:8 }}>{sub}</div>
    </div>
  );
}

function MiniBar({ count, max }){
  const bars = 12;
  return (
    <div style={{ display:'flex', gap:3, alignItems:'flex-end', height:28 }}>
      {Array.from({length:bars}).map((_,i) => {
        const t = (i+1)/bars;
        const on = t <= count/max;
        const h = 8 + Math.round(((i%4)+1) * 4 + (i*3%9));
        return <div key={i} style={{ width:6, height: Math.min(h, 24), borderRadius:1,
          background: on ? 'var(--color-brand-dark-copper)' : 'rgba(0,0,0,.08)' }}/>;
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
function AdminArtboard({ tweaks, tabOverride }) {
  const snap = useSnap();
  const [tab, setTab] = React.useState(tabOverride || 'events');
  const [evId, setEvId] = React.useState(window.EL.activeEventId());
  const attendees = window.EL.attendeesFor(evId);

  return (
    <div className="el-root" style={{ width:1200, height:820, display:'flex', flexDirection:'column', background:'var(--surface-secondary)' }}>
      <div className="el-topbar">
        <div style={{ display:'flex', alignItems:'center', gap:24 }}>
          <LegoraMark size={20}/>
          <span style={{ fontSize:13, color:'var(--color-text-subtle)' }}>Event Leads · Admin</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <label className="el-input" style={{ minWidth:260, height:30 }}>
            {elIcons.search}
            <input placeholder="Search events, attendees…" />
            <span className="el-kbd">⌘</span><span className="el-kbd">K</span>
          </label>
          <Avatar name="Klara Berg" size={28}/>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', flex:1, minHeight:0 }}>
        {/* sidebar */}
        <div style={{ borderRight:'1px solid rgba(0,0,0,.08)', padding:'20px 12px', background:'#fff' }}>
          <div className="el-eyebrow" style={{ margin:'4px 8px 10px' }}>WORKSPACE</div>
          {[
            ['events','Events', elIcons.chart],
            ['attendees','Attendees', elIcons.user],
            ['leads','Leads', elIcons.fire],
            ['booth','Booth captures', elIcons.mail],
          ].map(([k,l,icon])=>(
            <button key={k} onClick={()=>setTab(k)}
              style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'8px 10px',
                       borderRadius:6, border:'none', background: tab===k?'rgba(0,0,0,.04)':'transparent',
                       color: tab===k?'#1c1c1c':'var(--color-text-subtle)', fontSize:13, fontWeight: tab===k?500:450, cursor:'pointer', textAlign:'left', marginBottom:2 }}>
              <span style={{ width:14, height:14, display:'flex', color:'var(--color-text-subtlest)' }}>{icon}</span>
              {l}
            </button>
          ))}
          <div className="el-hairline" style={{ margin:'16px 4px' }}/>
          <div className="el-eyebrow" style={{ margin:'4px 8px 10px' }}>EVENTS</div>
          {snap.events.map(ev => (
            <button key={ev.id} onClick={()=>setEvId(ev.id)}
              style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 10px',
                       borderRadius:6, border:'none', background: evId===ev.id?'rgba(206,95,39,.1)':'transparent',
                       color: evId===ev.id?'var(--color-brand-dark-copper)':'var(--color-text)', fontSize:13, fontWeight: 450, cursor:'pointer', textAlign:'left', marginBottom:2 }}>
              <span style={{ width:6, height:6, borderRadius:99, background: evId===ev.id?'var(--color-brand-dark-copper)':'rgba(0,0,0,.2)' }}/>
              <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.name}</span>
            </button>
          ))}
          <button className="el-btn el-btn-ghost" style={{ width:'100%', justifyContent:'flex-start', padding:'7px 10px', marginTop:4, color:'var(--color-text-subtle)' }}>
            {elIcons.plus} New event
          </button>
        </div>

        {/* main */}
        <div style={{ overflow:'auto', padding:'32px 44px' }} className="el-scroll">
          {tab==='attendees' && <AdminAttendees eventId={evId} attendees={attendees}/>}
          {tab==='events' && <AdminEvents snap={snap}/>}
          {tab==='leads' && <AdminLeads eventId={evId}/>}
          {tab==='booth' && <AdminBooth eventId={evId}/>}
          {tab==='design' && <AdminBoothDesigner/>}
        </div>
      </div>
    </div>
  );
}

function AdminEvents({ snap }){
  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <div className="el-eyebrow" style={{ marginBottom:6 }}>ADMIN · EVENTS</div>
        <h1 className="serif" style={{ fontSize:30, fontWeight:500, margin:0, letterSpacing:'-0.02em' }}>Events</h1>
        <p style={{ fontSize:14, color:'var(--color-text-subtle)', margin:'6px 0 0' }}>Each event gets its own attendee list, lead log and booth stream.</p>
      </div>
      <div className="el-card" style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr 60px', padding:'12px 20px', background:'var(--surface-subtle)', borderBottom:'1px solid rgba(0,0,0,.08)' }}>
          {['Event','Code','Date','Attendees','Leads',''].map(h=><span key={h} className="el-eyebrow" style={{ fontSize:10 }}>{h}</span>)}
        </div>
        {snap.events.map(ev => (
          <div key={ev.id} style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr 60px', padding:'14px 20px', borderBottom:'1px solid rgba(0,0,0,.06)', alignItems:'center', fontSize:13 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ color: ev.active?'var(--color-brand-dark-copper)':'var(--color-text-subtlest)' }}><LegoraStar size={14}/></span>
              <span style={{ fontWeight:500 }}>{ev.name}</span>
              {ev.active && <Badge variant="copper" dot>Live</Badge>}
            </div>
            <span className="mono" style={{ fontSize:12, color:'var(--color-text-subtle)' }}>{ev.code}</span>
            <span style={{ color:'var(--color-text-subtle)' }}>{ev.date}</span>
            <span className="mono">{(snap.attendees[ev.id]||[]).length}</span>
            <span className="mono">{(snap.leads[ev.id]||[]).length}</span>
            <button className="el-btn el-btn-ghost" style={{ width:28, height:28, padding:0, justifyContent:'center' }}>{elIcons.more}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminAttendees({ eventId, attendees }){
  const [q, setQ] = React.useState('');
  const filt = attendees.filter(a => (a.first+' '+a.last+' '+a.company+' '+a.email).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div className="el-eyebrow" style={{ marginBottom:6 }}>ADMIN · ATTENDEES</div>
        <h1 className="serif" style={{ fontSize:30, fontWeight:500, margin:0, letterSpacing:'-0.02em' }}>Attendee list</h1>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
        <label className="el-input" style={{ flex:1 }}>{elIcons.search}<input placeholder="Search attendees…" value={q} onChange={e=>setQ(e.target.value)}/></label>
        <button className="el-btn el-btn-secondary">{elIcons.download} Import CSV</button>
        <button className="el-btn el-btn-primary">{elIcons.plus} Add attendee</button>
      </div>
      <div className="el-card" style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 2fr 1.3fr 80px', padding:'10px 20px', background:'var(--surface-subtle)', borderBottom:'1px solid rgba(0,0,0,.08)' }}>
          {['Name','Email','Firm','Title',''].map(h=><span key={h} className="el-eyebrow" style={{ fontSize:10 }}>{h}</span>)}
        </div>
        <div style={{ maxHeight: 520, overflow:'auto' }} className="el-scroll">
          {filt.map(a => (
            <div key={a.id} style={{ display:'grid', gridTemplateColumns:'2fr 2fr 2fr 1.3fr 80px', padding:'11px 20px', borderBottom:'1px solid rgba(0,0,0,.05)', alignItems:'center', fontSize:13 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}><Avatar name={a.first+' '+a.last} size={26}/><span style={{ fontWeight:475 }}>{a.first} {a.last}</span></div>
              <span className="mono" style={{ fontSize:12, color:'var(--color-text-subtle)' }}>{a.email}</span>
              <span>{a.company}</span>
              <span style={{ color:'var(--color-text-subtle)' }}>{a.title}</span>
              <button className="el-btn el-btn-ghost" style={{ width:28, height:28, padding:0, justifyContent:'center' }} onClick={()=>window.EL.removeAttendee(eventId,a.id)}>{elIcons.trash}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminLeads({ eventId }){
  const leads = window.EL.leadsFor(eventId);
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div className="el-eyebrow" style={{ marginBottom:6 }}>ADMIN · LEADS</div>
        <h1 className="serif" style={{ fontSize:30, fontWeight:500, margin:0, letterSpacing:'-0.02em' }}>Logged leads</h1>
      </div>
      <div className="el-card" style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1.3fr 2fr 1fr', padding:'10px 20px', background:'var(--surface-subtle)', borderBottom:'1px solid rgba(0,0,0,.08)' }}>
          {['Attendee','Firm','Rating','Rep','Notes','When'].map(h=><span key={h} className="el-eyebrow" style={{ fontSize:10 }}>{h}</span>)}
        </div>
        {leads.map(l => {
          const a = window.EL.attendeeById(eventId, l.attendeeId);
          const r = window.EL.repById(l.repId);
          if(!a) return null;
          return (
            <div key={l.id} style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1.3fr 2fr 1fr', padding:'12px 20px', borderBottom:'1px solid rgba(0,0,0,.05)', alignItems:'center', fontSize:13 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}><Avatar name={a.first+' '+a.last} size={26}/><span style={{ fontWeight:475 }}>{a.first} {a.last}</span></div>
              <span>{a.company}</span>
              <span>{ratingBadge(l.rating)}</span>
              <span style={{ color:'var(--color-text-subtle)' }}>{r?.name}</span>
              <span style={{ color:'var(--color-text-subtle)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{l.notes}</span>
              <span className="mono" style={{ fontSize:12, color:'var(--color-text-subtlest)' }}>{fmtMinsAgo(l.timestamp)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminBooth({ eventId }){
  const caps = window.EL.boothFor(eventId);
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div className="el-eyebrow" style={{ marginBottom:6 }}>ADMIN · BOOTH</div>
        <h1 className="serif" style={{ fontSize:30, fontWeight:500, margin:0, letterSpacing:'-0.02em' }}>Booth captures</h1>
        <p style={{ fontSize:14, color:'var(--color-text-subtle)', margin:'6px 0 0' }}>Self-service email drops at the booth kiosk.</p>
      </div>
      <div className="el-card" style={{ overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 2fr 1fr', padding:'10px 20px', background:'var(--surface-subtle)', borderBottom:'1px solid rgba(0,0,0,.08)' }}>
          {['Name','Email','Firm','When'].map(h=><span key={h} className="el-eyebrow" style={{ fontSize:10 }}>{h}</span>)}
        </div>
        {caps.map(c => (
          <div key={c.id} style={{ display:'grid', gridTemplateColumns:'2fr 2fr 2fr 1fr', padding:'12px 20px', borderBottom:'1px solid rgba(0,0,0,.05)', alignItems:'center', fontSize:13 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}><Avatar name={c.first+' '+c.last} size={26}/><span style={{ fontWeight:475 }}>{c.first} {c.last}</span></div>
            <span className="mono" style={{ fontSize:12, color:'var(--color-text-subtle)' }}>{c.email}</span>
            <span>{c.company}</span>
            <span className="mono" style={{ fontSize:12, color:'var(--color-text-subtlest)' }}>{fmtMinsAgo(c.timestamp)}</span>
          </div>
        ))}
        {caps.length===0 && <div style={{ padding:'40px', textAlign:'center', color:'var(--color-text-subtlest)' }}>No captures yet.</div>}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Booth designer — marketers edit the kiosk copy, accent + hero image
function AdminBoothDesigner(){
  const snap = useSnap();
  const d = snap.boothDesign || {};
  const fileRef = React.useRef(null);
  const [uploaded, setUploaded] = React.useState(null); // data URL preview

  const update = (patch) => window.EL.updateBoothDesign(patch);

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      setUploaded(url);
      update({ heroImage: url });
    };
    reader.readAsDataURL(f);
  };

  const presetImages = [
    ['Jude (default)', 'assets/jude.png'],
  ];

  const Field = ({label, children, hint}) => (
    <div style={{ marginBottom: 18 }}>
      <div className="el-eyebrow" style={{ marginBottom:6 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize:11, color:'var(--color-text-subtlest)', marginTop:6 }}>{hint}</div>}
    </div>
  );

  const input = (key, placeholder, opts={}) => (
    <label className="el-input" style={{ width:'100%', ...(opts.style||{}) }}>
      <input placeholder={placeholder} value={d[key]||''} onChange={e=>update({[key]: e.target.value})}/>
    </label>
  );

  const textarea = (key, placeholder) => (
    <label className="el-input" style={{ width:'100%', height:'auto', alignItems:'stretch', padding:'10px 12px' }}>
      <textarea value={d[key]||''} onChange={e=>update({[key]: e.target.value})}
        placeholder={placeholder} rows={3}
        style={{ width:'100%', border:0, outline:0, background:'transparent', font:'inherit', color:'inherit', resize:'vertical', minHeight:60 }}/>
    </label>
  );

  return (
    <div>
      <div style={{ marginBottom:20, display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16 }}>
        <div>
          <div className="el-eyebrow" style={{ marginBottom:6 }}>ADMIN · BOOTH DESIGNER</div>
          <h1 className="serif" style={{ fontSize:30, fontWeight:500, margin:0, letterSpacing:'-0.02em' }}>Booth designer</h1>
          <p style={{ fontSize:14, color:'var(--color-text-subtle)', margin:'6px 0 0' }}>
            Shape the kiosk visitors see — copy, accent, hero image. Changes go live on every booth iPad instantly.
          </p>
        </div>
        <button className="el-btn el-btn-ghost" onClick={()=>{ if(confirm('Reset booth design to defaults?')) window.EL.resetBoothDesign(); }}>
          Reset to default
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 430px', gap: 36, alignItems:'flex-start' }}>
        {/* EDITOR */}
        <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,.08)', borderRadius:10, padding:'24px 26px' }}>
          <div style={{ fontSize:11, fontWeight:550, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--color-text-subtlest)', marginBottom:16 }}>
            1 · Form screen
          </div>
          <Field label="HEADLINE">{input('heading', "There's him looking at you.")}</Field>
          <Field label="SUBTEXT">{textarea('subhead', 'Drop your email…')}</Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:12 }}>
            <Field label="CTA BUTTON">{input('cta', 'Submit →')}</Field>
          </div>

          <div style={{ height:1, background:'rgba(0,0,0,.06)', margin:'18px 0 22px' }}/>

          <div style={{ fontSize:11, fontWeight:550, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--color-text-subtlest)', marginBottom:16 }}>
            2 · Film screen
          </div>
          <Field label="EYEBROW">{input('filmEyebrow', 'e.g. NOW FILMING · NEW CAMPAIGN')}</Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            <Field label="LINE 1">{input('filmLine1','')}</Field>
            <Field label="LINE 2">{input('filmLine2','')}</Field>
            <Field label="LINE 3">{input('filmLine3','')}</Field>
          </div>
          <Field label="SHOW QR CODE">
            <label className="el-input" style={{ cursor:'pointer', userSelect:'none', width:'fit-content' }}
                   onClick={()=>update({showQR: !d.showQR})}>
              <span className={`toggle ${d.showQR?'toggle--on':''}`}
                    style={{ width:30, height:18, borderRadius:99, position:'relative',
                             background: d.showQR ? '#1c1c1c' : '#d9d9d9', transition:'background .15s', marginRight:10 }}>
                <span style={{ position:'absolute', top:2, left: d.showQR ? 14 : 2, width:14, height:14,
                               borderRadius:99, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,.2)', transition:'left .15s' }}/>
              </span>
              <span style={{ fontSize:13 }}>QR is {d.showQR?'visible':'hidden'}</span>
            </label>
          </Field>

          <div style={{ height:1, background:'rgba(0,0,0,.06)', margin:'18px 0 22px' }}/>

          <div style={{ fontSize:11, fontWeight:550, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--color-text-subtlest)', marginBottom:16 }}>
            3 · Thank-you
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12 }}>
            <Field label="HEADLINE">{input('thanksHeadline','Got it.')}</Field>
            <Field label="BODY">{textarea('thanksBody','The film is on its way…')}</Field>
          </div>

          <div style={{ height:1, background:'rgba(0,0,0,.06)', margin:'18px 0 22px' }}/>

          <div style={{ fontSize:11, fontWeight:550, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--color-text-subtlest)', marginBottom:16 }}>
            4 · Visuals
          </div>

          <Field label="HERO IMAGE" hint="Shown on the film screen. Default is the Jude Law campaign shot. Upload your own — PNG or JPG, min 900×1600.">
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'stretch' }}>
              {presetImages.map(([name, src])=>{
                const on = (d.heroImage||'') === src;
                return (
                  <button key={name} onClick={()=>{ setUploaded(null); update({heroImage: src}); }}
                    style={{ width:72, height:96, borderRadius:6, cursor:'pointer', padding:0,
                             border: on ? '2px solid #1c1c1c' : '1px solid rgba(0,0,0,.12)',
                             background: src ? `url(${src}) center/cover` : 'linear-gradient(135deg, #ce5f27, #1c1c1c)',
                             position:'relative', overflow:'hidden' }}>
                    <span style={{ position:'absolute', bottom:4, left:0, right:0, textAlign:'center',
                                   fontSize:9, color:'#fff', textShadow:'0 1px 2px rgba(0,0,0,.6)', fontWeight:500 }}>{name}</span>
                  </button>
                );
              })}
              {uploaded && (
                <button onClick={()=>update({heroImage: uploaded})}
                  style={{ width:72, height:96, borderRadius:6, cursor:'pointer', padding:0,
                           border: d.heroImage === uploaded ? '2px solid #1c1c1c' : '1px solid rgba(0,0,0,.12)',
                           background: `url(${uploaded}) center/cover`, position:'relative', overflow:'hidden' }}>
                  <span style={{ position:'absolute', bottom:4, left:0, right:0, textAlign:'center',
                                 fontSize:9, color:'#fff', textShadow:'0 1px 2px rgba(0,0,0,.6)', fontWeight:500 }}>Custom</span>
                </button>
              )}
              <button onClick={()=>fileRef.current && fileRef.current.click()}
                style={{ width:72, height:96, borderRadius:6, cursor:'pointer', padding:0,
                         border:'1px dashed rgba(0,0,0,.25)', background:'rgba(0,0,0,.02)',
                         display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                         gap:4, color:'var(--color-text-subtle)', fontSize:10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg>
                Upload
              </button>
              <input type="file" accept="image/*" ref={fileRef} onChange={onFile} style={{ display:'none' }}/>
            </div>
          </Field>
        </div>

        {/* LIVE PREVIEW */}
        <div style={{ position:'sticky', top: 20 }}>
          <div className="el-eyebrow" style={{ marginBottom:10 }}>LIVE PREVIEW</div>
          <div style={{ background:'linear-gradient(180deg, #f5f3ee 0%, #ecece7 100%)',
                         borderRadius: 14, padding: 28,
                         display:'flex', justifyContent:'center',
                         boxShadow:'0 10px 40px rgba(0,0,0,.06), inset 0 0 0 1px rgba(0,0,0,.05)' }}>
            <AdminBoothPreview/>
          </div>
          <div style={{ display:'flex', gap:6, marginTop:12, justifyContent:'center' }}>
            {['form','jude','done'].map(s => (
              <button key={s} onClick={()=>window.dispatchEvent(new CustomEvent('el-preview-step',{detail:s}))}
                className="el-btn el-btn-ghost" style={{ fontSize:11, padding:'4px 10px' }}>
                {s === 'form' ? '1 · Form' : s === 'jude' ? '2 · Film' : '3 · Thanks'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Small scaled-down version of the booth for inline preview
function AdminBoothPreview(){
  const [step, setStep] = React.useState('form');
  React.useEffect(()=>{
    const h = (e)=> setStep(e.detail);
    window.addEventListener('el-preview-step', h);
    return ()=> window.removeEventListener('el-preview-step', h);
  },[]);
  return (
    <div style={{ width: 402*.85, height: 874*.85, borderRadius: 28, overflow:'hidden',
                  boxShadow:'0 20px 50px rgba(0,0,0,.18), 0 0 0 8px #1c1c1c',
                  transformOrigin:'top center' }}>
      <div style={{ transform:'scale(.85)', transformOrigin:'top left', width: 402, height: 874 }}>
        <BoothArtboard stepOverride={step}/>
      </div>
    </div>
  );
}

Object.assign(window, { ManagerArtboard, AdminArtboard });
