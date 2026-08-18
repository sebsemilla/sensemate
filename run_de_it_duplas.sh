#!/usr/bin/env bash
# Cola de → it: completa duplas faltantes para alemán e italiano

LOOP="bash /data/data/com.termux/files/home/sensemate/sensemate/run_missions_loop.sh"
LOG_DIR="/data/data/com.termux/files/home"

echo ""
echo "══════════════════════════════════════"
echo "  BLOQUE 1: de (Alemán)"
echo "══════════════════════════════════════"

for src in en fr it zh; do
  echo ""
  echo "  ── de ← $src --from=es ──"
  $LOOP de $src --from=es 2>&1 | tee "$LOG_DIR/gen_de_${src}_ctx.log"
  echo "  ✅ de ← $src completado"
done

echo ""
echo "══════════════════════════════════════"
echo "  BLOQUE 2: it (Italiano)"
echo "══════════════════════════════════════"

for src in en de zh; do
  echo ""
  echo "  ── it ← $src --from=es ──"
  $LOOP it $src --from=es 2>&1 | tee "$LOG_DIR/gen_it_${src}_ctx.log"
  echo "  ✅ it ← $src completado"
done

echo ""
echo "🎉 COLA de+it COMPLETA"
