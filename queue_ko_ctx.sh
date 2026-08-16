#!/bin/bash
# Cola: vocab contextual ko↔ en/pt/it/fr/de (A1-C1)
cd /data/data/com.termux/files/home/sensemate/sensemate
LOGDIR=/data/data/com.termux/files/home/sensemate
QLOG="$LOGDIR/queue_ko_ctx.log"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$QLOG"; }

log "=== INICIO COLA ko↔(en/pt/it/fr/de) ==="

# Fase 1: en, pt
log "--- FASE 1: ko↔en ---"
bash gen_ctx_pair.sh ko en es es 2>&1 | tee -a "$QLOG"
log "✅ ko↔en COMPLETO"

log "--- FASE 1: ko↔pt ---"
bash gen_ctx_pair.sh ko pt es es 2>&1 | tee -a "$QLOG"
log "✅ ko↔pt COMPLETO"

# Fase 2: it, fr, de
log "--- FASE 2: ko↔it ---"
bash gen_ctx_pair.sh ko it es es 2>&1 | tee -a "$QLOG"
log "✅ ko↔it COMPLETO"

log "--- FASE 2: ko↔fr ---"
bash gen_ctx_pair.sh ko fr es es 2>&1 | tee -a "$QLOG"
log "✅ ko↔fr COMPLETO"

log "--- FASE 2: ko↔de ---"
bash gen_ctx_pair.sh ko de es es 2>&1 | tee -a "$QLOG"
log "✅ ko↔de COMPLETO"

log "=== COLA ko COMPLETA ==="
