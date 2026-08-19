#!/usr/bin/env bash
# Inglés como target para hablantes de idiomas africanos/Darija
# en←ary, en←yo, en←ha, en←ig — todas con --from=es

LOOP="bash /data/data/com.termux/files/home/sensemate/sensemate/run_missions_loop.sh"
LOG_DIR="/data/data/com.termux/files/home"

echo ""
echo "══════════════════════════════════════"
echo "  en ← ary  (Inglés para darijafonos)"
echo "══════════════════════════════════════"
$LOOP en ary --from=es 2>&1 | tee "$LOG_DIR/gen_en_ary_ctx.log"
echo "  ✅ en ← ary completado"

echo ""
echo "══════════════════════════════════════"
echo "  en ← yo  (Inglés para yorubafonos)"
echo "══════════════════════════════════════"
$LOOP en yo --from=es 2>&1 | tee "$LOG_DIR/gen_en_yo_ctx.log"
echo "  ✅ en ← yo completado"

echo ""
echo "══════════════════════════════════════"
echo "  en ← ha  (Inglés para hausafonos)"
echo "══════════════════════════════════════"
$LOOP en ha --from=es 2>&1 | tee "$LOG_DIR/gen_en_ha_ctx.log"
echo "  ✅ en ← ha completado"

echo ""
echo "══════════════════════════════════════"
echo "  en ← ig  (Inglés para igbofonos)"
echo "══════════════════════════════════════"
$LOOP en ig --from=es 2>&1 | tee "$LOG_DIR/gen_en_ig_ctx.log"
echo "  ✅ en ← ig completado"

echo ""
echo "🎉 COLA EN←AFRICA COMPLETA"
