#!/bin/bash
# Cola: vocab contextual ja↔ es/en/pt/it/fr/de (A1-C1)
cd /data/data/com.termux/files/home/sensemate/sensemate
LOGDIR=/data/data/com.termux/files/home/sensemate
QLOG="$LOGDIR/queue_ja_ctx.log"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$QLOG"; }

log "=== INICIO COLA ja↔(es/en/pt/it/fr/de) ==="

# Fase 1: es, en, pt
log "--- FASE 1: ja↔es ---"
bash gen_ctx_pair.sh ja es zh en 2>&1 | tee -a "$QLOG"
log "✅ ja↔es COMPLETO"

log "--- FASE 1: ja↔en ---"
bash gen_ctx_pair.sh ja en zh es 2>&1 | tee -a "$QLOG"
log "✅ ja↔en COMPLETO"

log "--- FASE 1: ja↔pt ---"
bash gen_ctx_pair.sh ja pt zh es 2>&1 | tee -a "$QLOG"
log "✅ ja↔pt COMPLETO"

# Fase 2: it, fr, de
log "--- FASE 2: ja↔it ---"
bash gen_ctx_pair.sh ja it zh es 2>&1 | tee -a "$QLOG"
log "✅ ja↔it COMPLETO"

log "--- FASE 2: ja↔fr ---"
bash gen_ctx_pair.sh ja fr zh es 2>&1 | tee -a "$QLOG"
log "✅ ja↔fr COMPLETO"

log "--- FASE 2: ja↔de ---"
bash gen_ctx_pair.sh ja de zh es 2>&1 | tee -a "$QLOG"
log "✅ ja↔de COMPLETO"

log "=== COLA ja COMPLETA ==="
