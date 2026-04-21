// Sales rep flow: event picker → attendee list → quick-log bottom sheet
// Mobile 402x874

function RepArtboard({ tweaks, screenOverride, openFirst }) {
  const snap = useSnap();
  const [screen, setScreen] = React.useState(screenOverride || 'list'); // picker | list
  const [evId, setEvId] = React.useState(window.EL.activeEventId());
  const [q, setQ] = React.useState('');
  const initialAtt = openFirst ? (window.EL.attendeesFor(window.EL.activeEventId()).find(a => !window.EL.leadsFor(window.EL.activeEventId()).some(l=>l.attendeeId===a.id))) : null;
  const [openAtt, setOpenAtt] = React.useState(initialAtt);

  const attendees = window.EL.attendeesFor(evId);
  const leads = window.EL.leadsFor(evId);
  const loggedIds = new Set(leads.map(l => l.attendeeId));
  const filtered = attendees.filter(a => {
    const t = (a.first+' '+a.last+' '+a.company+' '+a.email).toLowerCase();
    return t.includes(q.toLowerCase());
  });

  return (
    <div className="el-root" style={{ width: 402, height: 874, display:'flex', flexDirection:'column', background:'var(--surface-secondary)' }}>
      {screen === 'picker' ? (
        <>
          <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(0,0,0,.08)', background:'#fff',
                        display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <LegoraMark size={20}/>
            <span className="el-eyebrow" style={{ fontSize:10 }}>ANNA SVENSSON</span>
          </div>
          <div style={{ padding:'24px 20px 8px' }}>
            <h2 className="serif" style={{ fontSize:26, margin:'0 0 4px', fontWeight:500, letterSpacing:'-0.02em' }}>Choose your event</h2>
            <p style={{ fontSize:13, color:'var(--color-text-subtle)', margin:'0 0 20px' }}>Leads you log are saved to this event.</p>
          </div>
          <div style={{ flex:1, padding:'0 20px', display:'flex', flexDirection:'column', gap:10, overflow:'auto' }} className="el-scroll">
            {snap.events.map(ev => {
              const n = (snap.leads[ev.id]||[]).length;
              return (
                <div key={ev.id} className="el-card" style={{ padding:'14px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}
                     onClick={()=>{ setEvId(ev.id); setScreen('list'); }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:'var(--color-brand-sand-true)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--color-brand-dark-copper)' }}>
                    <LegoraStar size={16}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:500 }}>{ev.name}</div>
                    <div style={{ fontSize:12, color:'var(--color-text-subtlest)', marginTop:2 }}>{ev.code}</div>
                  </div>
                  <span className="mono" style={{ fontSize:12, color:'var(--color-text-subtle)' }}>{n} leads</span>
                  {elIcons.chev()}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* topbar */}
          <div style={{ padding:'14px 16px', background:'#fff', borderBottom:'1px solid rgba(0,0,0,.08)',
                        display:'flex', alignItems:'center', gap:10 }}>
            <button className="el-btn el-btn-ghost" style={{ height:30, padding:'0 6px' }} onClick={()=>setScreen('picker')}>{elIcons.back}</button>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:550, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>LegalXchange · Munich</div>
              <div style={{ fontSize:11, color:'var(--color-text-subtlest)', marginTop:1 }}>Anna Svensson · <span className="mono">{leads.length} logged</span></div>
            </div>
            <Badge variant="copper" dot>LIVE</Badge>
          </div>

          {/* search */}
          <div style={{ padding:'12px 16px 8px', background:'#fff' }}>
            <label className="el-input" style={{ height:38 }}>
              {elIcons.search}
              <input placeholder="Search attendees, firm, email…" value={q} onChange={e=>setQ(e.target.value)} />
            </label>
          </div>

          {/* segmented filter */}
          <div style={{ padding:'0 16px 10px', background:'#fff', borderBottom:'1px solid rgba(0,0,0,.08)' }}>
            <div className="el-segtabs">
              <span className="el-segtab el-segtab-active">All · {attendees.length}</span>
              <span className="el-segtab">Logged · {leads.length}</span>
              <span className="el-segtab">Pending</span>
            </div>
          </div>

          {/* attendee list */}
          <div style={{ flex:1, overflow:'auto', padding:'8px 12px 0' }} className="el-scroll">
            {filtered.map((a, i) => {
              const logged = loggedIds.has(a.id);
              const lead = leads.find(l => l.attendeeId === a.id);
              return (
                <div key={a.id}
                     style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 12px',
                              borderRadius: 10, cursor:'pointer',
                              opacity: logged ? 0.6 : 1,
                              background: logged ? 'transparent' : '#fff',
                              border: logged ? '1px solid transparent' : '1px solid rgba(0,0,0,.06)',
                              marginBottom: 6 }}
                     onClick={()=>{ if (!logged) setOpenAtt(a); }}>
                  <Avatar name={a.first+' '+a.last} size={34}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:475, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.first} {a.last}</div>
                    <div style={{ fontSize:12, color:'var(--color-text-subtlest)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.title} · {a.company}</div>
                  </div>
                  {logged ? ratingBadge(lead.rating) : <span style={{ color:'var(--color-text-disabled)' }}>{elIcons.chev()}</span>}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding:'30px 20px', textAlign:'center', color:'var(--color-text-subtlest)', fontSize:13 }}>No matches.</div>
            )}
            <button className="el-btn el-btn-secondary el-btn-block" style={{ margin:'8px 4px 16px', height:42, borderStyle:'dashed' }}>
              {elIcons.plus} Add walk-in
            </button>
          </div>
        </>
      )}

      {openAtt && <QuickLogSheet attendee={openAtt} eventId={evId} onClose={()=>setOpenAtt(null)}/>}
    </div>
  );
}

function QuickLogSheet({ attendee, eventId, onClose }){
  const [rating, setRating] = React.useState(null);
  const [notes, setNotes] = React.useState('');

  const submit = () => {
    if (!rating) return;
    window.EL.addLead(eventId, { attendeeId: attendee.id, rating, notes, repId:'r1' });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.35)', zIndex:30, display:'flex', alignItems:'flex-end', animation:'elFade .18s ease' }}>
      <div onClick={e=>e.stopPropagation()}
           style={{ width:'100%', background:'#fff', borderRadius:'20px 20px 0 0', padding:'10px 20px 28px',
                    boxShadow:'0 -20px 60px rgba(0,0,0,.2)', animation:'elSheet .26s cubic-bezier(.32,.72,0,1)' }}>
        <div style={{ width:36, height:4, background:'rgba(0,0,0,.12)', borderRadius:99, margin:'4px auto 16px' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <Avatar name={attendee.first+' '+attendee.last} size={40}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="serif" style={{ fontSize:20, fontWeight:500, letterSpacing:'-0.01em' }}>{attendee.first} {attendee.last}</div>
            <div style={{ fontSize:12, color:'var(--color-text-subtlest)' }}>{attendee.title} · {attendee.company}</div>
          </div>
          <button className="el-btn el-btn-ghost" style={{ width:28, height:28, padding:0, justifyContent:'center' }} onClick={onClose}>{elIcons.close}</button>
        </div>

        <div className="el-eyebrow" style={{ marginBottom:10 }}>LEAD QUALITY</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:16 }}>
          <div className={`el-rating-pad ${rating==='hot'?'sel-hot':''}`} onClick={()=>setRating('hot')}>
            {elIcons.fire}<span>Hot</span>
          </div>
          <div className={`el-rating-pad ${rating==='warm'?'sel-warm':''}`} onClick={()=>setRating('warm')}>
            {elIcons.sun}<span>Warm</span>
          </div>
          <div className={`el-rating-pad ${rating==='cold'?'sel-cold':''}`} onClick={()=>setRating('cold')}>
            {elIcons.snow}<span>Cold</span>
          </div>
        </div>

        <div className="el-eyebrow" style={{ marginBottom:8 }}>NOTES</div>
        <label className="el-textarea" style={{ marginBottom:16 }}>
          <textarea placeholder="What did you talk about? Next steps?" value={notes} onChange={e=>setNotes(e.target.value)} rows={3}/>
        </label>

        <button className="el-btn el-btn-xl el-btn-block el-btn-primary" disabled={!rating} onClick={submit}
                style={{ opacity: rating ? 1 : .4 }}>Log lead</button>
      </div>
    </div>
  );
}

Object.assign(window, { RepArtboard, QuickLogSheet });
