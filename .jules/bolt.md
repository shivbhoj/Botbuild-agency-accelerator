## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2026-01-30 - [Template Compilation Strategy]
**Learning:** Pre-splitting templates into static parts and compiling them into closure functions that concatenate strings proved ~20-25% faster than using `String.replace` with regex on every call.
**Action:** For all text generation hot paths, prefer compiling templates into array-based concatenation functions over runtime regex replacement.
