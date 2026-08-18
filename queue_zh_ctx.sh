#!/bin/bash
# Cola: vocab contextual zh↔ es/it/pt (A1-C1)
cd /data/data/com.termux/files/home/sensemate/sensemate
LOGDIR=/data/data/com.termux/files/home/sensemate
QLOG="$LOGDIR/queue_zh_ctx.log"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$QLOG"; }

log "=== INICIO COLA zh↔(es/it/pt) ==="

log "--- zh↔es ---"
bash gen_ctx_pair.sh zh es ja es 2>&1 | tee -a "$QLOG"
log "✅ zh↔es COMPLETO"

log "--- zh↔it ---"
bash gen_ctx_pair.sh zh it ja es 2>&1 | tee -a "$QLOG"
log "✅ zh↔it COMPLETO"

log "--- zh↔pt ---"
bash gen_ctx_pair.sh zh pt ja es 2>&1 | tee -a "$QLOG"
log "✅ zh↔pt COMPLETO"

log "=== COLA zh COMPLETA ==="
