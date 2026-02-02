## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2026-02-02 - [Pre-compiling Templates]
**Learning:** For high-frequency string substitution, `String.replace` with regex is slower than pre-splitting the string into parts and using `Array.join`. This avoids repeated regex engine overhead.
**Action:** When implementing a hot-path template system, parse templates into a structure (like an array of static parts and variables) once, then reconstruct them on demand.
