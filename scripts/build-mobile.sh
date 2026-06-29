#!/bin/bash
# Build: copia la app web a www/ para Capacitor Android

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/www"

echo "🧹 Limpiando www/..."
rm -rf "$DEST"
mkdir -p "$DEST"

echo "📋 Copiando archivos JS/CSS/HTML..."
for f in index.html app.js styles.css practice_styles.css simple_mode_styles.css \
          auth.js onboarding.js famous.js musicians.js writers.js practice.js \
          immersion.js content_library.js settings.js admin.js contributors.js \
          membership.js themes.js misionmate.js school.js classroom.js \
          flashcard_data.js flashcard_data_a1.js flashcard_data_pron.js \
          manifest.json sw.js privacy.html terms.html; do
    [ -f "$ROOT/$f" ] && cp "$ROOT/$f" "$DEST/" || echo "  ⚠️  SKIP $f"
done

echo "📁 Copiando carpetas..."
cp -r "$ROOT/data" "$DEST/"
[ -d "$ROOT/images" ] && cp -r "$ROOT/images" "$DEST/" || true
[ -d "$ROOT/audio"  ] && cp -r "$ROOT/audio"  "$DEST/" || true

echo "✅ www/ listo — $(find "$DEST" -type f | wc -l) archivos"
