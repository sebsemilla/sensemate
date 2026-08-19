#!/usr/bin/env bash
# Duplas europeas pendientes (post de+it duplas):
# en←zh, fr←zh, de←ru — todas con --from=es

LOOP="bash /data/data/com.termux/files/home/sensemate/sensemate/run_missions_loop.sh"
LOG_DIR="/data/data/com.termux/files/home"

echo ""
echo "══════════════════════════════════════"
echo "  en ← zh  (Inglés para sinohablantes)"
echo "══════════════════════════════════════"
$LOOP en zh --from=es 2>&1 | tee "$LOG_DIR/gen_en_zh_ctx.log"
echo "  ✅ en ← zh completado"

echo ""
echo "══════════════════════════════════════"
echo "  fr ← zh  (Francés para sinohablantes)"
echo "══════════════════════════════════════"
$LOOP fr zh --from=es 2>&1 | tee "$LOG_DIR/gen_fr_zh_ctx.log"
echo "  ✅ fr ← zh completado"

echo ""
echo "══════════════════════════════════════"
echo "  de ← ru  (Alemán para rusohablantes)"
echo "══════════════════════════════════════"
$LOOP de ru --from=es 2>&1 | tee "$LOG_DIR/gen_de_ru_ctx.log"
echo "  ✅ de ← ru completado"

echo ""
echo "🎉 PARES EUROPEOS PENDIENTES COMPLETOS"
