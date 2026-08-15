#!/bin/bash
# Cola: completa vocab contextual pt↔fr, pt↔ru, fr↔ru
cd /data/data/com.termux/files/home/sensemate/sensemate
LOGDIR=/data/data/com.termux/files/home/sensemate
QLOG="$LOGDIR/queue_pt_fr_ru.log"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$QLOG"; }

log "=== INICIO COLA pt/fr/ru ==="

# 1. pt ↔ fr (cubre pt←fr + fr←pt)
log "--- LANZANDO pt↔fr ---"
bash gen_ctx_pair.sh pt fr es es 2>&1 | tee -a "$QLOG"
log "✅ pt↔fr COMPLETO"

# 2. pt ↔ ru (cubre pt←ru + ru←pt)
log "--- LANZANDO pt↔ru ---"
bash gen_ctx_pair.sh pt ru es es 2>&1 | tee -a "$QLOG"
log "✅ pt↔ru COMPLETO"

# 3. fr ↔ ru (cubre fr←ru + ru←fr)
log "--- LANZANDO fr↔ru ---"
bash gen_ctx_pair.sh fr ru es es 2>&1 | tee -a "$QLOG"
log "✅ fr↔ru COMPLETO"

log "=== COLA COMPLETA ==="
