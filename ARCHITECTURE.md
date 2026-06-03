# Architecture

Client-only Next.js prototype: no backend, no auth, meetings persisted in the browser.

```mermaid
flowchart TB
  subgraph routes["app/ — routes & bootstrap"]
    R0["/"]
    R1["/meetings"]
    R2["/live/[meetingId]"]
    R3["/view/[meetingId]"]
    P["providers.tsx — TanStack Query + registerDemoBindings()"]
  end

  subgraph ui["components/ — feature UI"]
    shell["shell/"]
    home["home/"]
    live["live/"]
    view["view/"]
    capture["capture/"]
    meeting["meeting/"]
    assistant["assistant/"]
    transcript["transcript/"]
    uistate["ui/ · states/"]
    shell --> home & live & view & capture
    live & view --> meeting & assistant & transcript
    meeting & assistant --> uistate
  end

  subgraph domain["lib/ — domain (no React)"]
    meetings["meetings/ — types, storage, queries"]
    tlib["transcript/ · formatting/ · shared/"]
    asstlib["assistant/ — canned + streaming helpers"]
    meetings --> tlib & asstlib
  end

  subgraph demo["demo/ — fixtures & simulation"]
    reg["register.ts"]
    bind["bindings.ts — registry API"]
    fix["meetings · users · assistant · notifications"]
    reg -->|registerDemo| bind
    fix --> reg
  end

  store[("localStorage")]

  routes --> ui
  ui --> domain
  bind -.->|getters only| domain
  meetings --> store

  R0 --> home
  R1 --> home
  R2 --> live
  R3 --> view
  P --> bind
```

**Product flow:** capture (dialog) → live notes (`/live`) → stop & summarise → meeting detail (`/view`) → list (`/meetings`). Simulated transcript, delays, and Ask Fireflies replies come from `demo/` via the bindings registry so `lib/` can stay swappable for real APIs later.
