# sellerpilot

Vite + React + TypeScript landing/marketing site. Tailwind, deployed on Vercel.

## Code discovery: query the graph before reading files

`App.tsx` (118KB) and `LandingV2.tsx` (72KB) hold most of the components. Reading
either one in full costs 20-30k tokens; pulling a single symbol from the codebase
graph costs 1-2k. For "where is X", "who calls X", or "what does X look like",
use the `codebase-memory` MCP server instead of Read/Grep:

- `search_graph(project, query)` — find a component or function
- `get_code_snippet(project, qualified_name)` — exact source of one symbol
- `trace_path(project, function_name)` — callers and callees
- `get_architecture(project, aspects)` — structure overview

The project id is `home-user-sellerpilot-we_test` (derived from the absolute repo
path, so it differs on other machines — confirm with `list_projects`).

The graph lives in `~/.cache`, which does not survive a fresh container. If a
query reports the project is not indexed, run `index_repository` with this repo's
path first; it is incremental afterwards.

Read/Grep/Glob remain the right tools for configs, blog content, the `public/*.html`
legal pages, and any non-code text — and always Read a file before editing it.

## Layout

- `App.tsx` — router plus most page and section components
- `LandingV2.tsx` — the v2 landing page; highest fan-in, treated as shared UI by
  `App.tsx` and `BlogPages.tsx`
- `BlogPages.tsx` — blog list and post pages
- `blogContent1.ts` / `blogContent2.ts` — blog post bodies
- `constants.ts`, `types.ts` — shared data and types
- `backend-script.js` — Google Apps Script backend, not bundled with the site
- `public/*.html` — standalone Turkish legal pages, served as-is

## Setup

`.mcp.json` registers the graph server via `.claude/bin/cbm-launch`, which installs
the binary on first use if the machine does not have it. Nothing to run by hand.
