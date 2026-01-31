## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2025-01-23 - [Compiling Templates to Closures]
**Learning:** Repeatedly using `String.replace` with regex on the same template string is inefficient in hot paths. Pre-splitting the string into static parts and keys, and returning a closure that concatenates them, avoids the overhead of regex parsing and string searching on every call.
**Action:** For high-frequency string interpolation, compile templates into reusable functions (closures) instead of using repeated regex replacements.
