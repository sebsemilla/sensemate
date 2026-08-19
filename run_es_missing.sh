#!/usr/bin/env bash
# Completa misiones faltantes para target=es
# Fuentes sin cobertura o parciales. Usa Mistral (DeepSeek sin saldo).

LOOP="bash /data/data/com.termux/files/home/sensemate/sensemate/run_missions_loop.sh"
LOG_DIR="/data/data/com.termux/files/home/sensemate"
PROVIDER="--provider=mistral"

sources=(zh ko ru ar gn qu wo ha yo ig ary)

for src in "${sources[@]}"; do
  echo ""
  echo "══════════════════════════════════════"
  echo "  es ← $src"
  echo "══════════════════════════════════════"
  $LOOP es $src $PROVIDER 2>&1 | tee "$LOG_DIR/gen_es_${src}_misiones.log"
  echo "  ✅ es ← $src completado"
done

echo ""
echo "🎉 TODAS LAS DUPLAS es←* COMPLETADAS"
