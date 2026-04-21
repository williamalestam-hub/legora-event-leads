// Booth artboard — mobile. Flow: form → Jude Law QR moment → success.
// 402x874 iPhone-sized. Content + branding read from state.boothDesign (editable by Admin).

function BoothArtboard({ tweaks, stepOverride }) {
  const snap = useSnap();
  const evId = window.EL.activeEventId();
  const event = snap.events.find(e => e.id === evId);
  const d = snap.boothDesign || {};
  const gray3 = '#E1DFDB';
  const ink = '#1c1c1c';

  const [step, setStep] = React.useState(stepOverride || 'form'); // form | jude | done
  const [form, setForm] = React.useState(
    stepOverride === 'jude' || stepOverride === 'done'
      ? { email:'lena.w@freshfields.com' }
      : { email:'' }
  );
  const [focusEmail, setFocusEmail] = React.useState(false);

  const canSubmit = form.email.includes('@') && form.email.includes('.');

  const submit = () => {
    if (!canSubmit) return;
    window.EL.addBoothCapture(evId, { email: form.email });
    setStep('jude');
    setTimeout(() => setStep('done'), 3200);
    setTimeout(() => { setStep('form'); setForm({ email:'' }); }, 6200);
  };

  return (
    <div className="el-root" style={{ width: 402, height: 874, background:'#fff', display:'flex', flexDirection:'column' }}>
      {/* top bar */}
      <div style={{ padding:'20px 24px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <LegoraMark size={22} />
        <span className="el-eyebrow" style={{ fontSize:10, color:'rgb(0, 49, 28)', fontFamily:'system-ui' }}>BOOTH · MUNICH</span>
      </div>

      {step === 'form' && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'44px 28px 24px', overflow:'auto' }} className="el-scroll">
          <h1 className="serif" style={{ fontSize: 38, lineHeight:'44px', margin:'0 0 10px', fontWeight:500, letterSpacing:'-0.02em', color:'rgb(0, 49, 28)' }}>
            {d.heading}
          </h1>
          <p style={{ fontSize:15, lineHeight:'22px', color:'var(--color-text-subtle)', margin:'0 0 28px' }}>
            {d.subhead}
          </p>

          <label className="el-input" style={{ marginBottom:18, height: 48, borderColor: focusEmail ? ink :'rgba(0,0,0,.15)' }}>
            {elIcons.mail}
            <input placeholder="Email address" type="email"
              value={form.email}
              onFocus={()=>setFocusEmail(true)} onBlur={()=>setFocusEmail(false)}
              onChange={e=>setForm({ email:e.target.value })}
              onKeyDown={e=>{ if(e.key==='Enter') submit(); }} />
          </label>

          <button className="el-btn el-btn-xl el-btn-block" disabled={!canSubmit} onClick={submit}
            style={{ opacity: canSubmit ? 1 : .4, cursor: canSubmit ? 'pointer' : 'not-allowed',
                     background: gray3, color: ink, borderColor: 'rgba(0,0,0,.08)' }}>
            {d.cta}
          </button>

          <div style={{ marginTop:'auto', paddingTop: 36, display:'flex', alignItems:'center', gap:10, color:'var(--color-text-subtlest)', fontSize:12 }}>
            <LegoraStar size={14}/><span>{event?.name}</span><span style={{ marginLeft:'auto' }} className="mono">{(snap.boothCaptures[evId]||[]).length} today</span>
          </div>
        </div>
      )}

      {step === 'jude' && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'20px 24px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'relative', borderRadius: 14, overflow:'hidden', background:'#1c1c1c',
                        flex:1, minHeight:0, display:'flex', alignItems:'flex-end',
                        boxShadow:'0 30px 60px rgba(0,0,0,.15)' }}>
            {d.heroImage ? (
              <img src={d.heroImage} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
            ) : (
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #005230 0%, #00311C 100%)' }}/>
            )}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.78) 100%)' }}/>
            <div style={{ position:'relative', padding:'20px 20px 22px', color:'#fff', width:'100%' }}>
              <div className="el-eyebrow" style={{ color:'rgba(255,255,255,.7)', marginBottom:8 }}>{d.filmEyebrow}</div>
              <div className="serif" style={{ fontSize:22, lineHeight:'28px', fontWeight:500, letterSpacing:'-0.01em' }}>
                {d.filmLine1}<br/>{d.filmLine2}<br/>{d.filmLine3}
              </div>
            </div>
            {d.showQR && (
              <div style={{ position:'absolute', top:14, right:14, background:'#fff', padding:8, borderRadius: 8 }}>
                <FauxQR size={72}/>
              </div>
            )}
          </div>
          <div style={{ marginTop: 16, textAlign:'center' }}>
            <div className="el-eyebrow" style={{ marginBottom:6 }}>SCAN TO WATCH THE FILM</div>
            <div style={{ fontSize:13, color:'var(--color-text-subtle)' }}>Also sent to <span style={{ color:'rgb(0, 49, 28)', fontWeight:500 }}>{form.email || 'your inbox'}</span></div>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 36px', textAlign:'center' }}>
          <div style={{ width:56, height:56, borderRadius:999, background: gray3, color: ink,
                        display:'flex', alignItems:'center', justifyContent:'center', marginBottom: 20 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 6"/></svg>
          </div>
          <h2 className="serif" style={{ fontSize:28, fontWeight:500, margin:'0 0 8px', letterSpacing:'-0.01em', color:'rgb(0, 49, 28)' }}>{d.thanksHeadline}</h2>
          <p style={{ fontSize:15, color:'var(--color-text-subtle)', margin:0, lineHeight:'22px', whiteSpace:'pre-line' }}>
            {d.thanksBody}
          </p>
        </div>
      )}

      {/* footer bar */}
      <div style={{ padding:'10px 24px', borderTop:'1px solid rgba(0,0,0,.06)', fontSize:11, color:'var(--color-text-subtlest)', display:'flex', justifyContent:'space-between' }}>
        <span>Self-service booth</span>
        <span>{(snap.boothCaptures[evId]||[]).length + (step==='jude'?1:0)} captured today</span>
      </div>
    </div>
  );
}

function FauxQR({ size=80 }) {
  const cells = 21;
  const s = size / cells;
  const bits = [];
  for (let r=0; r<cells; r++) for (let c=0; c<cells; c++) {
    const v = ((r*7 + c*3 + (r*c%5)) % 3) === 0;
    bits.push(v);
  }
  const isFinder = (r,c) => (r<7 && c<7) || (r<7 && c>=cells-7) || (r>=cells-7 && c<7);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block' }}>
      <rect x={0} y={0} width={size} height={size} fill="#fff"/>
      {bits.map((v,i)=>{
        const r = Math.floor(i/cells), c = i%cells;
        if (isFinder(r,c)) return null;
        return v ? <rect key={i} x={c*s} y={r*s} width={s} height={s} fill="#1c1c1c"/> : null;
      })}
      {[[0,0],[0,cells-7],[cells-7,0]].map(([r,c],i)=>(
        <g key={i} transform={`translate(${c*s} ${r*s})`}>
          <rect width={s*7} height={s*7} fill="#1c1c1c"/>
          <rect x={s} y={s} width={s*5} height={s*5} fill="#fff"/>
          <rect x={s*2} y={s*2} width={s*3} height={s*3} fill="#1c1c1c"/>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, { BoothArtboard });
