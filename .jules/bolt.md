## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2026-02-03 - [Pre-splitting Templates]
**Learning:** Repeatedly using `String.replace` with regex on the same template string is inefficient because it rescans the string every time. Pre-splitting the string into static parts and keys allows for faster reconstruction using simple concatenation or loops, avoiding regex overhead in the hot path.
**Action:** When a string template is used repeatedly, parse it once into a structural representation (like an array of parts) and reconstruct it by filling in the blanks.
