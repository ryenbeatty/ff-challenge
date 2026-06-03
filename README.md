# Fireflies Challenge

### 🎥 [Watch the intro Loom](https://www.loom.com/share/a6da8e660a7f41e4947a2502f562a67d) 👀 

**Live demo:** https://firefliesdotfun.vercel.app

![fireflies.fun app screenshot](./firefliesdotfun.png)

A small app for browsing meetings, viewing transcripts, and chatting with the Fireflies assistant.

## Setup and run

**Prerequisites:** Node.js 20+ and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

<details>
<summary><strong>Other commands</strong></summary>

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run build`   | Production build         |
| `npm run start`   | Run the production build |
| `npm run lint`    | Run ESLint               |
| `npm test`        | Run tests (Vitest)       |

</details>

## Submission write-up

### Time spent

~9h total
- ~1h planning
- ~7h implementation
- ~1h deployment & submission

### Tech stack
[Architecture](./ARCHITECTURE.md)

- Next.js, React, Typescript, Tailwind
- Radix UI, TanStack Query, Lucide icons, Sonner, Vitest
- *AI tools*: Cursor

### Approach
I approached this challenge with the mindset that it's a prototype to demonstrate the core Fireflies product loop of recording a meeting on an external platform.

I put effort into making the different workflows feel as interactive as possible by using delays and streaming simulations where required.

Additional Fireflies features like search, channels, and integrations were cut out so the prototype could focus on demonstrating the core capture > live notes > summary loop.

When evaluating the prototype I suggest you start with:
- Capture a new meeting, enter any text as the URL, and check out the live notes page
- Ask the assistant a couple of questions on the live notes page
- Stop the meeting, and then check out the meeting summary page
- Finish with the meetings overview page and use the stress-test button to add sample meetings (note that is a demo only feature)

### Assumptions

- Single demo user, no authentication
- Simulated behaviour: Live transcript and post-stop delay are simulated 
- Capture URL isn't validated
- Stubs: Most menu actions are stubs
- `localStorage`: All meeting data is stored offline in the browser, with no auth or server connection
- Canned responses: Ask Fireflies assistant uses canned responses, no LLM connection
- Demo code: Fixtures/simulation code scoped to `demo/` directory, in case this prototype gets hooked up to data sources later on
- Accessibility: basic accessibility requirements should be fulfilled (colour palette and HTML semantics)

