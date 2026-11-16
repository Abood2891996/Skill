# Notes for Claude

- Search skills: `npx -y skills find <query> 2>&1 | head -30`. The env in `.claude/settings.json` makes it work behind the proxy; without `NODE_USE_ENV_PROXY=1` it falsely prints "No skills found".
- Keep answers and tool output short; cap long output with `head`/`tail`.
