# Lista de idiomas que quieres descargar
languages=("en" "fr" "de" "it" "pt" "zh" "uk" "ja" "ko" "sr" "ru" "af" "ar" "sv" "pl" "no" "nl" "ca" "tr" "cs" "da" "el")

# Recorre cada idioma y ejecuta el comando
for lang in "${languages[@]}"; do
    simplelocalize download --path "./locales/${lang}.json" --format single-language-json
done


