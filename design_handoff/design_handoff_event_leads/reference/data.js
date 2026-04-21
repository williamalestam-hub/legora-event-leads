// Shared in-memory state + seed data for the Event Leads prototype.
// Uses a tiny pub/sub so every artboard in the canvas stays in sync.

(function(){
  const LS_KEY = 'legora_eventleads_v5';
  // Clean up old versions so stale schemas don't linger
  try { localStorage.removeItem('legora_eventleads_v1'); } catch(e){}
  try { localStorage.removeItem('legora_eventleads_v2'); } catch(e){}
  try { localStorage.removeItem('legora_eventleads_v3'); } catch(e){}
  try { localStorage.removeItem('legora_eventleads_v4'); } catch(e){}

  const SEED = {
    events: [
      { id: 'ev1', name: 'LegalXchange Munich', code: '26Q2 · Munich · LegalXchange · Apr 28', date: '2026-04-28', active: true },
      { id: 'ev2', name: 'Presidenten 2025',     code: '25Q4 · Stockholm · Presidenten · Nov 12', date: '2025-11-12', active: false },
    ],
    attendees: {
      ev1: [
        { id:'a1',  first:'Annika',   last:'Hoffmann',  email:'annika.hoffmann@hengeler.de',   company:'Hengeler Mueller',       title:'Partner',            lawyers: 620 },
        { id:'a2',  first:'Maximilian',last:'Becker',   email:'m.becker@linklaters.com',       company:'Linklaters',             title:'Counsel',            lawyers: 2800 },
        { id:'a3',  first:'Sophie',   last:'Weber',     email:'sophie.weber@noerr.com',        company:'Noerr',                  title:'Senior Associate',   lawyers: 540 },
        { id:'a4',  first:'Johannes', last:'Müller',    email:'j.mueller@gleisslutz.com',      company:'Gleiss Lutz',            title:'Partner',            lawyers: 350 },
        { id:'a5',  first:'Clara',    last:'Fischer',   email:'clara.fischer@freshfields.com', company:'Freshfields',            title:'Knowledge Lawyer',   lawyers: 2500 },
        { id:'a6',  first:'Lukas',    last:'Wagner',    email:'l.wagner@cms-hs.com',           company:'CMS Hasche Sigle',       title:'Associate',          lawyers: 620 },
        { id:'a7',  first:'Elena',    last:'Koch',      email:'e.koch@bakermckenzie.com',      company:'Baker McKenzie',         title:'Partner',            lawyers: 6500 },
        { id:'a8',  first:'Markus',   last:'Schmitt',   email:'markus.schmitt@luther.de',      company:'Luther',                 title:'Senior Associate',   lawyers: 380 },
        { id:'a9',  first:'Isabella', last:'Richter',   email:'i.richter@whitecase.com',       company:'White & Case',           title:'Counsel',            lawyers: 2400 },
        { id:'a10', first:'Felix',    last:'Braun',     email:'f.braun@dlapiper.com',          company:'DLA Piper',              title:'Partner',            lawyers: 4500 },
        { id:'a11', first:'Hannah',   last:'Schulz',    email:'hannah.schulz@clifford.com',    company:'Clifford Chance',        title:'Trainee',            lawyers: 3100 },
        { id:'a12', first:'David',    last:'Zimmermann',email:'d.zimmermann@taylorwessing.com',company:'Taylor Wessing',         title:'Partner',            lawyers: 1100 },
        { id:'a13', first:'Mia',      last:'Krüger',    email:'mia.krueger@heuking.de',        company:'Heuking Kühn Lüer',      title:'Associate',          lawyers: 400 },
        { id:'a14', first:'Paul',     last:'Neumann',   email:'p.neumann@poellath.com',        company:'POELLATH',               title:'Senior Associate',   lawyers: 180 },
        { id:'a15', first:'Lena',     last:'Hoffmann',  email:'lena.h@kirkland.com',           company:'Kirkland & Ellis',       title:'Partner',            lawyers: 3500 },
        { id:'a16', first:'Tobias',   last:'Graf',      email:'tobias.graf@shearman.com',      company:'A&O Shearman',           title:'Counsel',            lawyers: 4100 },
        { id:'a17', first:'Charlotte',last:'Vogt',      email:'c.vogt@dentons.com',            company:'Dentons',                title:'Associate',          lawyers: 12000},
        { id:'a18', first:'Jonas',    last:'Lange',     email:'jonas.lange@mayer.com',         company:'Mayer Brown',            title:'Partner',            lawyers: 1800 },
        { id:'a19', first:'Amelie',   last:'Bauer',     email:'amelie.bauer@ey.com',           company:'EY Law',                 title:'Senior Manager',     lawyers: 3800 },
        { id:'a20', first:'Sebastian',last:'Schröder',  email:'s.schroeder@kpmg-law.com',      company:'KPMG Law',               title:'Director',           lawyers: 1600 },
      ],
      ev2: []
    },
    // leads: keyed by event id
    leads: {
      ev1: [
        { id:'l1', attendeeId:'a1',  rating:'hot',  notes:'Very interested in agentic contract review. Wants pilot with M&A team Q3.', repId:'r1', timestamp: Date.now() - 1000*60*7 },
        { id:'l2', attendeeId:'a7',  rating:'hot',  notes:'Global rollout candidate. Intro to CIO set for next week.',                 repId:'r2', timestamp: Date.now() - 1000*60*22 },
        { id:'l3', attendeeId:'a4',  rating:'warm', notes:'Curious, needs internal champion. Follow up with case study.',              repId:'r1', timestamp: Date.now() - 1000*60*45 },
        { id:'l4', attendeeId:'a19', rating:'warm', notes:'Big 4 alt-legal — budget decided in Q3.',                                    repId:'r2', timestamp: Date.now() - 1000*60*63 },
        { id:'l5', attendeeId:'a3',  rating:'warm', notes:'Likes the review agent. Wants benchmarks vs competitors.',                   repId:'r3', timestamp: Date.now() - 1000*60*88 },
        { id:'l6', attendeeId:'a11', rating:'cold', notes:'Just grabbed swag, not a buyer.',                                             repId:'r3', timestamp: Date.now() - 1000*60*110 },
        { id:'l7', attendeeId:'a15', rating:'hot',  notes:'Firm-wide mandate to evaluate AI tools by year end.',                         repId:'r1', timestamp: Date.now() - 1000*60*134 },
        { id:'l8', attendeeId:'a10', rating:'warm', notes:'Interested in citations agent specifically.',                                  repId:'r2', timestamp: Date.now() - 1000*60*160 },
      ],
      ev2: []
    },
    boothCaptures: {
      ev1: [
        { id:'b1', first:'Julia', last:'Richter', email:'j.richter@oppenhoff.eu',   company:'Oppenhoff',  timestamp: Date.now() - 1000*60*15 },
        { id:'b2', first:'Anton', last:'Lehmann', email:'anton@raue.com',           company:'Raue',       timestamp: Date.now() - 1000*60*41 },
        { id:'b3', first:'Nora',  last:'Keller',  email:'n.keller@noerr.com',       company:'Noerr',      timestamp: Date.now() - 1000*60*72 },
        { id:'b4', first:'Ben',   last:'Klein',   email:'ben.klein@allen-overy.com',company:'A&O Shearman',timestamp: Date.now() - 1000*60*90 },
        { id:'b5', first:'Saskia',last:'Walter',  email:'saskia.w@graf-pitkowitz.com',company:'Graf Pitkowitz',timestamp: Date.now() - 1000*60*130 },
      ]
    },
    reps: [
      { id:'r1', name:'Anna Svensson',   leadsToday: 4 },
      { id:'r2', name:'Oliver Lindqvist',leadsToday: 3 },
      { id:'r3', name:'Mira Eriksson',   leadsToday: 2 },
    ],
    boothDesign: {
      heading: "There's him looking at you.",
      subhead: "Drop your email. We'll send a short film from Jude - and get in touch about Legora.",
      cta: 'Submit →',
      filmLine1: "There's him looking at you,",
      filmLine2: "you looking at him,",
      filmLine3: "him looking at Legora.",
      filmEyebrow: '',
      thanksHeadline: 'Got it.',
      thanksBody: 'The film is on its way to your inbox.\nSee you on the other side.',
      heroImage: 'assets/jude.png',
      showQR: true,
      askFirm: true,
    },
  };

  let state;
  try {
    const raw = localStorage.getItem(LS_KEY);
    state = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(SEED));
  } catch(e) {
    state = JSON.parse(JSON.stringify(SEED));
  }
  // Forward-compat: ensure new top-level keys always exist
  if (!state.boothDesign) state.boothDesign = JSON.parse(JSON.stringify(SEED.boothDesign));

  const subs = new Set();
  function emit(){ for (const fn of subs) try { fn(state); } catch(e){} }
  function persist(){ try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch(e){} }

  window.EL = {
    get state(){ return state; },
    activeEventId(){ return state.events.find(e=>e.active)?.id || state.events[0].id; },
    subscribe(fn){ subs.add(fn); fn(state); return () => subs.delete(fn); },
    reset(){ state = JSON.parse(JSON.stringify(SEED)); persist(); emit(); },
    addLead(eventId, lead){
      const full = { id:'l'+Math.random().toString(36).slice(2,8), timestamp: Date.now(), ...lead };
      state.leads[eventId] = state.leads[eventId] || [];
      state.leads[eventId].unshift(full);
      persist(); emit();
      return full;
    },
    addBoothCapture(eventId, cap){
      const full = { id:'b'+Math.random().toString(36).slice(2,8), timestamp: Date.now(), ...cap };
      state.boothCaptures[eventId] = state.boothCaptures[eventId] || [];
      state.boothCaptures[eventId].unshift(full);
      persist(); emit();
      return full;
    },
    addAttendee(eventId, att){
      const full = { id:'a'+Math.random().toString(36).slice(2,8), ...att };
      state.attendees[eventId] = state.attendees[eventId] || [];
      state.attendees[eventId].unshift(full);
      persist(); emit();
      return full;
    },
    removeAttendee(eventId, id){
      state.attendees[eventId] = (state.attendees[eventId]||[]).filter(a=>a.id!==id);
      persist(); emit();
    },
    addEvent(ev){
      const full = { id:'ev'+Math.random().toString(36).slice(2,6), active:false, ...ev };
      state.events.push(full);
      state.attendees[full.id] = [];
      state.leads[full.id] = [];
      state.boothCaptures[full.id] = [];
      persist(); emit();
      return full;
    },
    removeEvent(id){
      state.events = state.events.filter(e=>e.id!==id);
      delete state.attendees[id];
      delete state.leads[id];
      delete state.boothCaptures[id];
      persist(); emit();
    },
    setActiveEvent(id){
      state.events = state.events.map(e => ({...e, active: e.id===id}));
      persist(); emit();
    },
    updateBoothDesign(patch){
      state.boothDesign = { ...(state.boothDesign||{}), ...patch };
      persist(); emit();
    },
    resetBoothDesign(){
      state.boothDesign = JSON.parse(JSON.stringify(SEED.boothDesign));
      persist(); emit();
    },
    // aggregate helpers
    leadsFor(eventId){ return state.leads[eventId] || []; },
    attendeesFor(eventId){ return state.attendees[eventId] || []; },
    boothFor(eventId){ return state.boothCaptures[eventId] || []; },
    repById(id){ return state.reps.find(r=>r.id===id); },
    attendeeById(eventId, id){ return (state.attendees[eventId]||[]).find(a=>a.id===id); },
  };
})();
