## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2026-02-04 - [Template String Replacement]
**Learning:** Replacing `String.replace` with a pre-compiled array of static parts and keys reduced execution time by ~34% (37ms -> 24ms) for 1000 iterations. Regex overhead is significant even for simple replacements in hot paths.
**Action:** Use pre-compiled structural arrays (split/join or loop) for template generation instead of regex replacement when the template is reused.
