#!/usr/bin/env bash
# Cola de generación de misiones — corre los pares en orden, uno a uno
# Uso: bash run_missions_queue.sh [desde_numero]

LOOP="bash /data/data/com.termux/files/home/sensemate/sensemate/run_missions_loop.sh"
START_FROM=${1:-1}

declare -a PAIRS=(
  # Recuperación A1 dañado — solo falta A1, usar --from=en (es←en intacto)
  "es de en"    # 1  — recupera A1 de es←de
  "es fr en"    # 2  — recupera A1 de es←fr
  "es it en"    # 3  — recupera A1 de es←it
  # Continuación es←ja (A2-C1)
  "es ja en"    # 4  — es←ja usando --from=en
  # Cola original
  "pt es"       # 5  — fresh (portugues no tiene referencia)
  "fr en es"    # 6
  "de en es"    # 7
  "it en es"    # 8
  "pt en es"    # 9  — usa pt←es del paso 5
  "pt fr es"    # 10
  "pt it es"    # 11
  "ja pt es"    # 12
  "ja fr es"    # 13
  "ja de es"    # 14
  "ja it es"    # 15
)

total=${#PAIRS[@]}

for i in "${!PAIRS[@]}"; do
  num=$((i + 1))
  [ $num -lt $START_FROM ] && continue

  pair=(${PAIRS[$i]})
  target=${pair[0]}
  source=${pair[1]}
  from=${pair[2]}

  echo ""
  echo "══════════════════════════════════════"
  echo "  [$num/$total] $target ← $source $([ -n "$from" ] && echo "--from=$from" || echo "(fresh)")"
  echo "══════════════════════════════════════"

  if [ -n "$from" ]; then
    $LOOP $target $source --from=$from
  else
    $LOOP $target $source
  fi

  echo "  ✅ Par $num/$total completado: $target ← $source"
done

echo ""
echo "🎉 COLA COMPLETA — todos los pares generados"
