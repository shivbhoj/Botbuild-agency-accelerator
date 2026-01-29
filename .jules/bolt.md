## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2025-01-29 - [Compiling Templates to Closures]
**Learning:** `String.replace` with global regex in a hot path is costly because it re-parses the string every time. Compiling the template into a closure that concatenates pre-split string parts and data values reduced execution time by ~50% (20ms -> 10ms).
**Action:** For high-frequency template rendering, parse the template once into static parts and accessor functions, then cache the renderer function instead of the raw string.
