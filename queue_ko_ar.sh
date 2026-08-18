#!/bin/bash
WORKDIR="/data/data/com.termux/files/home/sensemate/sensemate"
LOGDIR="/data/data/com.termux/files/home/sensemate"
cd "$WORKDIR"
log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOGDIR/queue_ko_ar.log"; }

log "=== Cola ko/ar iniciada ==="

# Esperar que de←fr termine (es el más largo activo ahora)
log "⏳ Esperando que de←fr termine..."
while pgrep -f "generate_vocab_contextual.*target=de\|target=fr.*source=de\|target=fr.*from=pt\|target=de.*from=en" > /dev/null; do
  sleep 20
done
log "✅ de←fr libre"

# Lanzar coreano
log "▶ Lanzando ko↔es (desde cero)..."
nohup bash gen_ctx_pair.sh ko es "" "" > "$LOGDIR/gen_ko_es_ctx_master.log" 2>&1 &
KO_PID=$!
log "▶ ko↔es PID $KO_PID"

wait $KO_PID
log "✅ ko↔es COMPLETADO"

# Lanzar árabe
log "▶ Lanzando ar↔es (desde cero)..."
nohup bash gen_ctx_pair.sh ar es "" "" > "$LOGDIR/gen_ar_es_ctx_master.log" 2>&1 &
AR_PID=$!
log "▶ ar↔es PID $AR_PID"

wait $AR_PID
log "✅ ar↔es COMPLETADO"
log "=== Todo listo ✅ ==="
