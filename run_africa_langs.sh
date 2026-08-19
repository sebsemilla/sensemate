#!/usr/bin/env bash
# Generación fresca (sin --from) para idiomas africanos nuevos:
# Darija (ary), Yoruba (yo), Hausa (ha), Igbo (ig)
# Source: español (es) como referencia base para cada target

LOOP="bash /data/data/com.termux/files/home/sensemate/sensemate/run_missions_loop.sh"
LOG_DIR="/data/data/com.termux/files/home"

echo ""
echo "══════════════════════════════════════"
echo "  BLOQUE 1: Darija / Árabe Marroquí (ary)"
echo "══════════════════════════════════════"
echo ""
echo "  ── ary ← es (fresco) ──"
$LOOP ary es 2>&1 | tee "$LOG_DIR/gen_ary_es.log"
echo "  ✅ ary ← es completado"

echo ""
echo "══════════════════════════════════════"
echo "  BLOQUE 2: Yoruba (yo)"
echo "══════════════════════════════════════"
echo ""
echo "  ── yo ← es (fresco) ──"
$LOOP yo es 2>&1 | tee "$LOG_DIR/gen_yo_es.log"
echo "  ✅ yo ← es completado"

echo ""
echo "══════════════════════════════════════"
echo "  BLOQUE 3: Hausa (ha)"
echo "══════════════════════════════════════"
echo ""
echo "  ── ha ← es (fresco) ──"
$LOOP ha es 2>&1 | tee "$LOG_DIR/gen_ha_es.log"
echo "  ✅ ha ← es completado"

echo ""
echo "══════════════════════════════════════"
echo "  BLOQUE 4: Igbo (ig)"
echo "══════════════════════════════════════"
echo ""
echo "  ── ig ← es (fresco) ──"
$LOOP ig es 2>&1 | tee "$LOG_DIR/gen_ig_es.log"
echo "  ✅ ig ← es completado"

echo ""
echo "🎉 COLA AFRICA COMPLETA: ary + yo + ha + ig"
