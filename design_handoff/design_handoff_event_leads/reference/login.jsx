// PIN gate — shown before the design canvas. Persists "unlocked" to sessionStorage
// so refreshes during a demo don't force re-auth.

const PIN_CORRECT = '2604'; // Munich, Apr 28

function LoginScreen({ onUnlock }) {
  const [pin, setPin] = React.useState('');
  const [error, setError] = React.useState(false);
  const [shake, setShake] = React.useState(false);

  const submit = (val) => {
    if (val === PIN_CORRECT) {
      try { sessionStorage.setItem('legora_el_unlocked','1'); } catch(e){}
      onUnlock();
    } else {
      setError(true); setShake(true);
      setTimeout(() => setShake(false), 420);
      setTimeout(() => setPin(''), 260);
    }
  };

  const press = (d) => {
    if (pin.length >= 4) return;
    setError(false);
    const next = pin + d;
    setPin(next);
    if (next.length === 4) setTimeout(() => submit(next), 160);
  };
  const back = () => { setError(false); setPin(p => p.slice(0,-1)); };

  React.useEffect(() => {
    const onKey = (e) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') back();
      else if (e.key === 'Enter' && pin.length === 4) submit(pin);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'#f0eee9',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color:'#1c1c1c',
    }}>
      {/* faint star motif bg */}
      <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', opacity:.05 }}>
        <svg width="100%" height="100%" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
          <g fill="#1c1c1c">
            {[[120,160,40],[640,120,28],[720,540,52],[80,620,36],[430,720,30]].map(([x,y,s],i)=>(
              <path key={i} transform={`translate(${x} ${y}) scale(${s/389})`}
                d="M199.81,0v188.71h188.71v11.1c-127.12,4.82-183.88,61.61-188.71,188.71h-11.1c-4.83-127.1-61.59-183.89-188.71-188.71v-11.1C127.11,183.9,183.86,127.07,188.71,0h11.1Z"/>
            ))}
          </g>
        </svg>
      </div>

      <div style={{
        width: 380,
        background:'#fff',
        border:'1px solid rgba(0,0,0,.08)',
        borderRadius: 14,
        boxShadow: '0 40px 120px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.04)',
        padding: '36px 32px 28px',
        textAlign:'center',
        position:'relative',
        animation: shake ? 'elShake .42s cubic-bezier(.36,.07,.19,.97)' : 'none',
      }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, marginBottom: 24 }}>
          <span style={{ width: 28, height: 28, color:'#1c1c1c' }}>
            <svg viewBox="0 0 389 389" width="100%" height="100%"><path fill="currentColor" d="M199.81,0v188.71h188.71v11.1c-127.12,4.82-183.88,61.61-188.71,188.71h-11.1c-4.83-127.1-61.59-183.89-188.71-188.71v-11.1C127.11,183.9,183.86,127.07,188.71,0h11.1Z"/></svg>
          </span>
          <div style={{ fontSize: 11, letterSpacing:'.1em', textTransform:'uppercase', color:'#6b6b6b', fontWeight:550 }}>
            Legora · Event Leads
          </div>
        </div>

        <h1 style={{
          fontFamily:"'Noto Serif', ui-serif, Georgia, serif",
          fontSize: 24, fontWeight: 500, margin:'0 0 6px', letterSpacing:'-0.01em',
        }}>Enter access code</h1>
        <p style={{ fontSize: 13, color:'#595959', margin:'0 0 24px', lineHeight:'20px' }}>
          Four-digit pin shared with field reps<br/>and booth staff.
        </p>

        {/* pin dots */}
        <div style={{ display:'flex', gap:14, justifyContent:'center', marginBottom: 24, height: 14 }}>
          {[0,1,2,3].map(i => {
            const filled = i < pin.length;
            return (
              <span key={i} style={{
                width: 12, height: 12, borderRadius: 99,
                background: error ? '#c52925' : filled ? '#1c1c1c' : 'transparent',
                border: `1.5px solid ${error ? '#c52925' : filled ? '#1c1c1c' : 'rgba(0,0,0,.2)'}`,
                transition:'all .12s',
              }}/>
            );
          })}
        </div>

        {/* numpad */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 8, maxWidth: 260, margin: '0 auto' }}>
          {keys.map((k,i) => {
            if (!k) return <span key={i}/>;
            const isBack = k === '⌫';
            return (
              <button key={i}
                onClick={()=> isBack ? back() : press(k)}
                style={{
                  height: 56, border: '1px solid rgba(0,0,0,.08)',
                  background: '#fcfcfc',
                  borderRadius: 10,
                  fontSize: isBack ? 18 : 22, fontWeight: 400, color: '#1c1c1c',
                  fontFamily: 'inherit', cursor:'pointer',
                  transition:'background .1s, transform .06s',
                }}
                onMouseDown={e => e.currentTarget.style.background = 'rgba(0,0,0,.06)'}
                onMouseUp={e => e.currentTarget.style.background = '#fcfcfc'}
                onMouseLeave={e => e.currentTarget.style.background = '#fcfcfc'}
              >{k}</button>
            );
          })}
        </div>

        <div style={{ marginTop: 22, fontSize: 11, color:'#949494' }}>
          Forgot the code? Ask Klara in <span style={{ color:'#ce5f27' }}>#gtm-events</span>.
        </div>

        {/* hint for demo */}
        <div style={{
          marginTop: 14, padding: '6px 10px', display:'inline-flex', alignItems:'center', gap:6,
          background:'rgba(206,95,39,.08)', borderRadius: 99,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 10, letterSpacing:'.04em',
          color:'#ce5f27',
        }}>
          <span style={{ width:5, height:5, background:'#ce5f27', borderRadius:99 }}/>
          DEMO PIN · {PIN_CORRECT}
        </div>
      </div>

      <style>{`
        @keyframes elShake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { LoginScreen });
