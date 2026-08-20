#!/bin/bash
# Cola: igbo pendientes + wolof + pulaar (sc-tarjetas + sc-misiones)
# Provider: Mistral

LOG=/data/data/com.termux/files/home/sensemate/queue_igbo_wolof_pulaar.log
SC_T="node /data/data/com.termux/files/home/sensemate/sensemate/generate_vocab_contextual.js"
SC_M="node /data/data/com.termux/files/home/sensemate/sensemate/generate_missions.js"
P="--provider=mistral"

run() {
  echo "" >> $LOG
  echo "========================================" >> $LOG
  echo "[$(date '+%H:%M:%S')] $@" >> $LOG
  echo "========================================" >> $LOG
  eval "$@ $P" >> $LOG 2>&1
  echo "[$(date '+%H:%M:%S')] DONE: $@" >> $LOG
}

echo "[$(date)] INICIO COLA" >> $LOG

# ── FASE 1: igbo pendientes (sc-tarjetas) ────────────────────
run "$SC_T --target=ig --source=en --level=B2 --category=conversacion"
run "$SC_T --target=ig --source=en --level=B2 --category=funciones_comunicativas"
run "$SC_T --target=ig --source=en --level=B2 --category=vocabulario_contextual"
run "$SC_T --target=ig --source=en --level=C1 --category=conversacion"
run "$SC_T --target=ig --source=en --level=C1 --category=vocabulario_contextual"
run "$SC_T --target=en --source=ig --level=B2 --category=vocabulario_contextual --from=es"
run "$SC_T --target=en --source=ig --level=C1 --category=vocabulario_contextual --from=es"

# ── FASE 2: Wolof aprende inglés (sc-tarjetas) ───────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion vocabulario_contextual; do
    run "$SC_T --target=wo --source=en --level=$LEVEL --category=$CAT"
  done
done

# ── FASE 3: Inglés aprende Wolof (sc-tarjetas, --from=es) ────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion vocabulario_contextual; do
    run "$SC_T --target=en --source=wo --level=$LEVEL --category=$CAT --from=es"
  done
done

# ── FASE 4: Wolof aprende inglés (sc-misiones) ───────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion; do
    run "$SC_M --target=wo --source=en --level=$LEVEL --category=$CAT"
  done
done

# ── FASE 5: Inglés aprende Wolof (sc-misiones, --from=es) ────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion; do
    run "$SC_M --target=en --source=wo --level=$LEVEL --category=$CAT --from=es"
  done
done

# ── FASE 6: Pulaar aprende inglés (sc-tarjetas) ──────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion vocabulario_contextual; do
    run "$SC_T --target=ff --source=en --level=$LEVEL --category=$CAT"
  done
done

# ── FASE 7: Inglés aprende Pulaar (sc-tarjetas, --from=es) ───
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion vocabulario_contextual; do
    run "$SC_T --target=en --source=ff --level=$LEVEL --category=$CAT --from=es"
  done
done

# ── FASE 8: Pulaar aprende inglés (sc-misiones) ──────────────
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion; do
    run "$SC_M --target=ff --source=en --level=$LEVEL --category=$CAT"
  done
done

# ── FASE 9: Inglés aprende Pulaar (sc-misiones, --from=es) ───
for LEVEL in A1 A2 B1 B2 C1; do
  for CAT in gramatica funciones_comunicativas conversacion; do
    run "$SC_M --target=en --source=ff --level=$LEVEL --category=$CAT --from=es"
  done
done

echo "[$(date)] ✅ COLA COMPLETADA" >> $LOG
