#!/bin/bash
# Cola 2: completa todos los archivos parciales hasta 0 "Faltan"

LOG=/data/data/com.termux/files/home/sensemate/queue_igbo_wolof_pulaar2.log
SC_T="node /data/data/com.termux/files/home/sensemate/sensemate/generate_vocab_contextual.js"
SC_M="node /data/data/com.termux/files/home/sensemate/sensemate/generate_missions.js"
P="--provider=openrouter"

run_until_done() {
  local CMD="$@ $P"
  local LABEL="$@"
  local TRIES=0
  while true; do
    TRIES=$((TRIES+1))
    echo "[$(date '+%H:%M:%S')] Intento $TRIES: $LABEL" >> $LOG
    OUT=$(eval "$CMD" 2>&1)
    echo "$OUT" >> $LOG
    if echo "$OUT" | grep -q "Faltan"; then
      echo "[$(date '+%H:%M:%S')] Parcial, reintentando..." >> $LOG
    else
      echo "[$(date '+%H:%M:%S')] ✅ COMPLETO: $LABEL" >> $LOG
      break
    fi
    if [ $TRIES -ge 25 ]; then
      echo "[$(date '+%H:%M:%S')] ⚠️ MAX INTENTOS alcanzado: $LABEL" >> $LOG
      break
    fi
  done
}

echo "[$(date)] INICIO COLA 2" >> $LOG

# ── FASE 1: igbo pendientes ───────────────────────────────────
run_until_done $SC_T --target=ig --source=en --level=B2 --category=conversacion
run_until_done $SC_T --target=ig --source=en --level=B2 --category=funciones_comunicativas
run_until_done $SC_T --target=ig --source=en --level=B2 --category=vocabulario_contextual
run_until_done $SC_T --target=ig --source=en --level=C1 --category=conversacion
run_until_done $SC_T --target=ig --source=en --level=C1 --category=vocabulario_contextual
run_until_done $SC_T --target=en --source=ig --level=B2 --category=vocabulario_contextual --from=es
run_until_done $SC_T --target=en --source=ig --level=C1 --category=vocabulario_contextual --from=es

# ── FASE 2: Wolof aprende inglés (sc-tarjetas) ───────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion vocabulario_contextual; do
    run_until_done $SC_T --target=wo --source=en --level=$LEVEL --category=$CAT
  done
done

# ── FASE 3: Inglés aprende Wolof (sc-tarjetas) ───────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion vocabulario_contextual; do
    run_until_done $SC_T --target=en --source=wo --level=$LEVEL --category=$CAT --from=es
  done
done

# ── FASE 4: Wolof aprende inglés (sc-misiones) ───────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion; do
    run_until_done $SC_M --target=wo --source=en --level=$LEVEL --category=$CAT
  done
done

# ── FASE 5: Inglés aprende Wolof (sc-misiones) ───────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion; do
    run_until_done $SC_M --target=en --source=wo --level=$LEVEL --category=$CAT --from=es
  done
done

# ── FASE 6: Pulaar aprende inglés (sc-tarjetas) ──────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion vocabulario_contextual; do
    run_until_done $SC_T --target=ff --source=en --level=$LEVEL --category=$CAT
  done
done

# ── FASE 7: Inglés aprende Pulaar (sc-tarjetas) ──────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion vocabulario_contextual; do
    run_until_done $SC_T --target=en --source=ff --level=$LEVEL --category=$CAT --from=es
  done
done

# ── FASE 8: Pulaar aprende inglés (sc-misiones) ──────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion; do
    run_until_done $SC_M --target=ff --source=en --level=$LEVEL --category=$CAT
  done
done

# ── FASE 9: Inglés aprende Pulaar (sc-misiones) ──────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion; do
    run_until_done $SC_M --target=en --source=ff --level=$LEVEL --category=$CAT --from=es
  done
done

echo "[$(date)] ✅ COLA 2 COMPLETADA" >> $LOG
