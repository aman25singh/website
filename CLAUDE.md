# Repository guidance

This is a static Astro engineering notebook. Read README.md for commands, content rules, and publishing safeguards.

- Use Node 24 LTS and npm ci. On Windows use npm.cmd when needed.
- Keep content in content/blog/ and content/projects/ as Markdown.
- /notebook is the archive; /writing and /projects are filters. Preserve existing detail URLs.
- Shared content logic belongs in src/lib/content.ts; schemas in src/content.config.ts; metadata in src/lib/site.ts.
- Reuse NotebookArchive, PostCard, and PostLayout. Avoid independent project preview implementations.
- Drafts are the default. Do not publish unfinished content or invent personal biography details.
- Keep client JavaScript minimal. No framework hydration is needed for the archive filters. The homepage dots remain opt-in, pointer-transparent, and reduced-motion aware.
- Run npm run verify and npm run format:check before review. Run npm audit --audit-level=high when dependencies change.
- Keep changes focused and reviewable. Do not push or deploy without explicit publishing approval.
