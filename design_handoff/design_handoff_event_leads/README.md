# Handoff: Legora Event Leads

A four-surface event-capture app that the Legora GTM team uses at conferences. It replaces the paper clipboard with an iPad booth, a phone-based sales-rep tool, a live manager dashboard, and an admin console for marketing.

---

## About the design files

The files in `reference/` are **design references built in HTML + inline React (Babel)** — interactive prototypes meant to show intended look, feel, copy, and behaviour. They are **not production code**. Your task is to recreate them inside the existing Claude Code project's stack (React + Firebase, per the user's setup) using its established patterns, libraries, and file structure.

Use the reference files as the **source of truth for visual design, copy, flow, and state shape**. Swap in the project's real component library, routing, and Firestore integration.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, radii, shadows, interactions, and copy. Recreate pixel-accurately. If something conflicts with the target codebase's design system, follow the design system — but keep the Legora brand colors (Dark Green accent) in play.

---

## Scope — four surfaces + auth

1. **PIN login** — 4-digit gate so the public URL isn't open-access
2. **Booth (mobile iPad)** — self-serve email capture → Jude Law campaign moment → thank you
3. **Sales Rep (mobile)** — pick event → search attendees → log lead (Hot / Warm / Cold + notes)
4. **Manager Dashboard (desktop)** — live leaderboard, Hot/Warm/Cold breakdown, streaming feed
5. **Admin (desktop)** — events, attendees, leads, booth captures, **Booth Designer** (edit kiosk copy/image)

All surfaces share state. When a rep logs a lead on mobile, the manager dashboard updates instantly. Booth captures appear in admin immediately.

---

## Data model (Firestore mapping)

Reference state lives in `reference/data.js` (`window.EL`). Map it to Firestore:

```
/config/booth                  ← boothDesign doc (copy, hero image URL, flags)
/config/accessCode             ← pin: "2604"
/events/{eventId}              ← { name, code, date, active }
/events/{eventId}/attendees/{attendeeId}    ← { first, last, email, company, title, lawyers }
/events/{eventId}/leads/{leadId}            ← { attendeeId, rating, notes, repId, timestamp }
/events/{eventId}/boothCaptures/{captureId} ← { email, timestamp }
/reps/{repId}                  ← { name }
```

Subscribe to `onSnapshot` on each event's subcollections for live dashboard updates. The reference uses a pub/sub (`EL.subscribe`) that is a direct analog.

**Mutation API** (match these names in your service layer):
- `addLead(eventId, lead)`
- `addBoothCapture(eventId, { email })`
- `addAttendee(eventId, att)` / `removeAttendee`
- `addEvent(ev)` / `removeEvent` / `setActiveEvent(id)`
- `updateBoothDesign(patch)` / `resetBoothDesign()`
- `leadsFor(eventId)` / `attendeesFor(eventId)` / `boothFor(eventId)`

---

## Design tokens

All from the Legora Design System. Use CSS custom properties.

### Colors

| Token | Hex | Use |
|---|---|---|
| `--color-legora-green` | `#005230` | Wordmark fill, future brand moments |
| `--color-legora-dark-green` | `#00311C` | **Primary text accent** — booth headlines, wordmark, booth eyebrow |
| `--color-gray-1` | `#FAFAF9` | Subtle surface fills |
| `--color-gray-2` | `#F3F2EE` | Quiet surface, booth bg gradient top |
| `--color-gray-3` | `#E1DFDB` | **Booth CTA button background** |
| `--color-ink` | `#1C1C1C` | Body text, primary buttons on desktop |
| `--color-grey-700` | `#595959` | Subtle text |
| `--color-grey-600` | `#6B6B6B` | Subtlest text |
| `--color-border` | `rgba(0,0,0,.08)` | Hairlines |
| `--rating-hot` | `#c52925` | Lead rating |
| `--rating-warm` | `#975d1f` | Lead rating |
| `--rating-cold` | `#367b2c` | Lead rating |

### Typography

- **Sans (UI)**: `Inter` — weights 400 / 450 / 475 / 500 / 550 / 675
- **Serif (prose + booth headlines)**: `Noto Serif` — 400 / 500 / 600
- **Mono (data, eyebrows, counts)**: `JetBrains Mono` — 400 / 500

Scale (key sizes actually used):
- Booth H1: 38 / 44, weight 500, letter-spacing −0.02em, Noto Serif, **Dark Green (#00311C)**
- Booth subhead: 15 / 22, weight 425, `--color-grey-700`
- Thank-you H2: 28 / 36, weight 500, Noto Serif, Dark Green
- Section titles (desktop): 30, weight 500, Noto Serif, letter-spacing −0.02em
- Body: 13 / 20 weight 450, 14 / 20 weight 475
- Eyebrow: 11 / 16 weight 550, `.06em` tracking, UPPERCASE, mono or sans

### Spacing / radius / shadow

- 4px grid. Common: 4, 8, 12, 16, 20, 24, 28, 36, 48
- Radii: 4, 6, 8, 10 (cards), 14 (booth hero), 28 (phone screen)
- Shadow (elevated card): `0 10px 40px rgba(0,0,0,.06), inset 0 0 0 1px rgba(0,0,0,.05)`
- Shadow (popover/sheet): `0 40px 120px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.04)`

---

## Surface specs

### 1 · PIN Login (`reference/login.jsx`)

- **Full-viewport** centered card, 380px wide, white on `#f0eee9` with a faint star-motif SVG background (opacity 0.05).
- Card: `14px` radius, subtle multi-layer shadow, 36/32/28 padding.
- Legora mark at top, eyebrow "LEGORA · EVENT LEADS", serif H1 "Enter access code", grey subcopy.
- **4 PIN dots** — transition to ink fill when filled, red (`#c52925`) shake on wrong code (420ms cubic-bezier shake keyframe).
- **Numpad 1–9, 0, backspace** — 56px tall buttons, 10px radius, subtle hover.
- Supports keyboard entry and Enter-to-submit (when 4 digits entered).
- On success: set `sessionStorage.legora_el_unlocked = '1'` and mount main app. Persist across refresh for the demo session only.
- **Demo PIN chip** at bottom — only show when in demo mode, never ship to production.

Firebase swap: replace `PIN_CORRECT` constant with a Firestore doc read at mount, or Firebase Auth Custom Token.

### 2 · Booth (`reference/booth.jsx`)

Three states rendered in a 402×874 viewport (iPhone 14 Pro-ish). State machine:

```
form ─(valid email, submit)─→ jude ─(3.2s)─→ done ─(3.0s)─→ form
```

**Form state:**
- Top bar: Legora wordmark (left, Dark Green) / "BOOTH · MUNICH" eyebrow (right, Dark Green, system-ui)
- H1 "There's him looking at you." — Noto Serif, 38/44, weight 500, **color `rgb(0, 49, 28)`**, letter-spacing −0.02em
- Subhead: 15/22, `--color-grey-700`
- Single email input, 48px tall, 10px radius, focus border `#1c1c1c`
- CTA button: full-width, **background `#E1DFDB` (Gray 3)**, text `#1c1c1c`, 1px soft border. Disabled at 40% opacity when email invalid. Copy: "Submit →"
- Footer: event name + today's capture count (mono)

All copy is editable in Admin → Booth Designer (reads from `state.boothDesign`).

**Jude state:**
- Full-bleed hero image (`assets/jude.png` by default) with dark gradient from 40% down
- Eyebrow text + 3-line serif caption bottom-left, white on gradient
- QR code overlay top-right (72px, white bg, 8px padding), only shown when `d.showQR` is true
- Below hero: "SCAN TO WATCH THE FILM" eyebrow + "Also sent to `email`" with email in Dark Green

**Done state:**
- Centered 56px check-in-circle, Gray 3 bg + Dark Green check
- Serif H2 "Got it." in Dark Green
- Two-line body (`whiteSpace: pre-line` so `\n` in admin copy renders)

### 3 · Sales Rep (`reference/rep.jsx`)

402×874, mobile. Steps:
1. Event picker list
2. Attendee search + list (filter by name / company / email)
3. Bottom-sheet rating (Hot 🔥 / Warm ☀ / Cold ❄) + textarea → save

On save: `addLead(eventId, { attendeeId, rating, notes, repId, timestamp: Date.now() })`.

Use iOS-frame wrapping from `ios-frame.jsx` for the phone bezel.

### 4 · Manager Dashboard (`reference/desktop.jsx` — `ManagerArtboard`)

1200×820. Three-column layout:

- **Left rail**: event picker (active event highlighted with copper dot)
- **Main**:
  - Big number card: today's leads, delta vs yesterday
  - Hot / Warm / Cold segmented bar
  - Leaderboard (reps ranked by leads logged today, avatar + name + count)
  - Live "Latest activity" feed — captures + leads interleaved, timestamp relative
- **Right column**: booth stream — latest 10 booth emails, reverse-chronological

Live-updates via subscription. When a new lead lands, prepend with a soft fade-in.

### 5 · Admin (`reference/desktop.jsx` — `AdminArtboard`)

1200×820. Sidebar + main.

**Sidebar**: WORKSPACE section (Events / Attendees / Leads / Booth captures / **Booth designer**) + EVENTS list + "New event" ghost button.

**Tabs**:
- **Events** — table of events, active indicator, new/archive actions
- **Attendees** — searchable attendee list for the active event
- **Leads** — all logged leads with rep, rating, notes, attendee
- **Booth captures** — table of self-serve email drops, timestamp
- **Booth designer** — see below

#### Booth Designer

Two-column: left is the editor (4 sections), right is a **live-scaled preview** of the actual booth artboard with 1·Form / 2·Film / 3·Thanks state toggles.

Editor fields (all persist to `boothDesign` via `updateBoothDesign` with debounced writes):

| Section | Fields |
|---|---|
| **1 · Form screen** | HEADLINE (text), SUBTEXT (textarea), CTA BUTTON (text) |
| **2 · Film screen** | EYEBROW (text, may be empty), LINE 1 / 2 / 3 (text), SHOW QR CODE (toggle) |
| **3 · Thank-you** | HEADLINE (text), BODY (textarea, supports `\n`) |
| **4 · Visuals** | HERO IMAGE — "Jude (default)" preset tile + upload button. No color picker. |

On upload: convert to data URL (or Firebase Storage `putFile` in prod) and set `heroImage`. "Reset to default" restores seed copy and Jude Law image.

---

## Interactions & behavior

- **PIN login shake**: 420ms cubic-bezier(.36,.07,.19,.97) on wrong code, then clear input. Persist success to `sessionStorage`.
- **Booth submit**: email validation (contains `@` and `.`), `setTimeout` chain for auto-advance — but in production, the Jude step should last as long as the video actually plays; don't auto-return to form unless the attendee taps.
- **Rep log**: optimistic UI — show the lead in the list before Firestore confirms.
- **Designer → Booth live preview**: every keystroke updates preview immediately (shared React state reading from Firestore). Dispatches `CustomEvent('el-preview-step', {detail: 'form'|'jude'|'done'})` to flip the mini-booth state.

## State persistence

Reference uses `localStorage` (keyed `legora_eventleads_v5`). Replace with Firestore in production; keep no client-side copy of `boothDesign` beyond a subscription cache.

---

## Tweaks panel (design-time only — drop for production)

The prototype has a Tweaks panel (signal color, density, serif toggle, Jude moment on/off, live-pulse, reset demo). **Do not port** — it's design exploration scaffolding.

---

## Assets

- `reference/assets/jude.png` — the Jude Law campaign hero. Replace with final campaign shot when available. Default asset shipped.
- Legora wordmark & star: drawn inline as SVG in `atoms.jsx` (`LegoraStar`, `LegoraMark`). Copy the SVG path to your icon library.

---

## Files

- `reference/Event Leads.html` — shell with `<script type="text/babel">` entry point + Tweaks + design canvas wrapper. The scaffolding (design-canvas, ios-frame, tweaks) is **not** part of the product — skip those when porting.
- `reference/data.js` — full seed data, pub/sub, mutation API. **Port shape, swap to Firestore.**
- `reference/login.jsx` — PIN login.
- `reference/booth.jsx` — 3-state booth flow.
- `reference/rep.jsx` — sales rep flow.
- `reference/desktop.jsx` — Manager + Admin + Booth Designer.
- `reference/atoms.jsx` — shared primitives (Legora mark, Badge, Avatar, Icons, `useSnap` subscription hook).
- `reference/legora.css` — class-based CSS for `.el-btn`, `.el-input`, `.el-badge`, etc. Copy selectors you need or rewrite in your styling system.
- `reference/ios-frame.jsx` / `design-canvas.jsx` — **design-only**, skip in production port.

## Out of scope for the developer

- Don't rebuild the design canvas / pan-zoom wrapper
- Don't rebuild the Tweaks panel
- Don't keep the demo PIN chip visible
- Don't ship mock seed data (events, attendees, leads) — those are for preview only

---

## Brand colors reference card

```
#005230   Legora Green
#00311C   Dark Green            ← booth headlines, wordmark, accent text
#FAFAF9   Gray 1
#F3F2EE   Gray 2
#E1DFDB   Gray 3                ← booth CTA background
#1C1C1C   Ink
```
