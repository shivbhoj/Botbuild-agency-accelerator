## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2025-01-23 - [Regex vs Pre-compiled Concatenation]
**Learning:** Replacing repeated `String.replace` calls with a pre-compiled array concatenation strategy reduced template generation time by ~50% in hot paths. Regex overhead adds up quickly even for simple replacements.
**Action:** For high-frequency string manipulation, pre-parse templates into parts and use simple string concatenation (or array joins) instead of regex replacement.
