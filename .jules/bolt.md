## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2024-05-22 - Template Pre-compilation
**Learning:** String.replace with regex in hot loops is costly. Pre-splitting the string into static parts and tokens allows for much faster reconstruction using simple concatenation.
**Action:** When optimizing template engines, cache the parsed structure, not just the raw string.
