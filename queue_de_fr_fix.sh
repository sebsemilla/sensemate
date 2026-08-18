#!/bin/bash
WORKDIR="/data/data/com.termux/files/home/sensemate/sensemate"
LOGDIR="/data/data/com.termux/files/home/sensemate"
cd "$WORKDIR"
log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOGDIR/queue_de_fr_fix.log"; }

log "=== Esperando que ko y ar terminen... ==="
while pgrep -f "generate_vocab_contextual.*(ko|ar)" > /dev/null 2>&1; do
  sleep 20
done
log "✅ ko/ar libres — relanzando de↔fr con refs correctas"

# de←fr usa --from=en (existe en alemán) ✅
# fr←de usa --from=es (existe en francés) ✅
bash gen_ctx_pair.sh de fr en es >> "$LOGDIR/gen_de_fr_ctx_master.log" 2>&1
log "✅ de↔fr COMPLETADO"
