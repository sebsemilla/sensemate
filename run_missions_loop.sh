#!/usr/bin/env bash
# Uso: bash run_missions_loop.sh <target> <source> [--from=<lang>] [--provider=<provider>] [...]
SCRIPT="node /data/data/com.termux/files/home/sensemate/sensemate/generate_missions.js"
TARGET=$1
SOURCE=$2
shift 2
EXTRA_ARGS="$@"   # captura todos los flags restantes: --from=es --provider=gemini etc.

cd /data/data/com.termux/files/home/sensemate/sensemate

for level in A1 A2 B1 B2 C1; do
  echo ""
  echo "========== $level =========="
  while true; do
    output=$($SCRIPT --target=$TARGET --source=$SOURCE --level=$level $EXTRA_ARGS 2>&1)
    echo "$output"
    if echo "$output" | grep -q "Nivel $level completo"; then
      echo ">>> $level COMPLETO"
      break
    fi
    sleep 2
  done
done

echo ""
echo "✅ TODO COMPLETO: $TARGET <- $SOURCE"
