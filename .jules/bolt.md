## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2025-01-23 - [Pre-compilation vs Regex Replace]
**Learning:** Using `String.replace` with regex in a hot loop is significantly slower than joining an array of pre-parsed strings. For templates, parsing once into an AST/list and reconstructing is ~40% faster even for small templates.
**Action:** When implementing template engines or heavy string manipulation, prefer pre-compilation/parsing over runtime regex replacements.
