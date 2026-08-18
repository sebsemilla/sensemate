#!/bin/bash
WORKDIR="/data/data/com.termux/files/home/sensemate/sensemate"
LOGDIR="/data/data/com.termux/files/home/sensemate"
cd "$WORKDIR"
log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOGDIR/queue_final.log"; }

log "=== Cola final iniciada ==="

# 1. Esperar que ar termine
log "Esperando ar↔es..."
while pgrep -f "target=ar\|source=ar" > /dev/null 2>&1; do sleep 20; done
log "ar libre"

# 2. ko B2 C1 (faltan esos niveles)
log "Retomando ko↔es B2 C1..."
bash gen_ctx_pair.sh ko es "" "" B2 C1 >> "$LOGDIR/gen_ko_es_ctx_master.log" 2>&1
log "ko↔es B2 C1 listo"

# 3. de↔fr (de←fr --from=en, fr←de --from=es)
log "Lanzando de↔fr con refs correctas..."
bash gen_ctx_pair.sh de fr en es >> "$LOGDIR/gen_de_fr_ctx_master.log" 2>&1
log "de↔fr COMPLETADO"

log "=== Todo listo ==="
