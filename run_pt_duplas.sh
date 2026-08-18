#!/usr/bin/env bash
# Cola pt ← (de/en/fr/it/zh) — gramatica + funciones + conversacion (A1-C1)
# Uso: bash run_pt_duplas.sh

LOOP="bash /data/data/com.termux/files/home/sensemate/sensemate/run_missions_loop.sh"
LOG_DIR="/data/data/com.termux/files/home"

declare -a SOURCES=(de en fr it zh)

for src in "${SOURCES[@]}"; do
  echo ""
  echo "══════════════════════════════════════"
  echo "  pt ← $src --from=es"
  echo "══════════════════════════════════════"
  $LOOP pt $src --from=es 2>&1 | tee "$LOG_DIR/gen_pt_${src}_ctx.log"
  echo "  ✅ Completado: pt ← $src"
done

echo ""
echo "🎉 COLA pt COMPLETA"
