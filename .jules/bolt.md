## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2025-10-07 - [Template Pre-compilation vs Regex]
**Learning:** For template substitution in hot paths, pre-splitting strings and concatenating parts is ~24% faster than using `String.replace` with regex, even for simple templates.
**Action:** When implementing a template engine or frequent string interpolation, compile the template into a structure of static and dynamic parts instead of running regex repeatedly.

## 2025-10-24 - [Compile to Function]
**Learning:** Compiling templates into `new Function` bodies that perform direct string concatenation is significantly faster (~34%) than iterating over an array of parts and keys at runtime. This avoids loop overhead and repeated property lookups.
**Action:** For high-performance templating, avoid runtime interpretation loops. Compile to a native JS function.
