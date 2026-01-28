## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2026-01-28 - [Pre-compilation vs Regex Replacement]
**Learning:** For high-frequency template rendering, `String.replace` with regex is significantly slower (~35%) than pre-splitting the string and concatenating parts.
**Action:** Use a "compile once, execute many" pattern for templates where the template string is parsed into static parts and variable accessors.
