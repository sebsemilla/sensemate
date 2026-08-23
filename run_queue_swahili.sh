#!/bin/bash
# Cola: Idiomas africanos + amerindios — sc-tarjetas + sc-misiones
# Orden: Swahili → Amharic → Oromo → Lingala → Somali → Zulu → Kinyarwanda → Twi → Bambara → Quechua → Nahuatl

LOG=/data/data/com.termux/files/home/sensemate/queue_africa.log
SC_T="node /data/data/com.termux/files/home/sensemate/sensemate/generate_vocab_contextual.js --provider=cohere"
SC_M="node /data/data/com.termux/files/home/sensemate/sensemate/generate_missions.js --provider=cohere"

run_until_done() {
  local TRIES=0
  while true; do
    TRIES=$((TRIES+1))
    echo "[$(date '+%H:%M:%S')] Intento $TRIES: $@" >> $LOG
    OUT=$(eval "$@" 2>&1)
    echo "$OUT" >> $LOG
    if echo "$OUT" | grep -q "Faltan"; then
      echo "[$(date '+%H:%M:%S')] Parcial, reintentando..." >> $LOG
    else
      echo "[$(date '+%H:%M:%S')] ✅ COMPLETO: $@" >> $LOG
      break
    fi
    if [ $TRIES -ge 30 ]; then
      echo "[$(date '+%H:%M:%S')] ⚠️ MAX INTENTOS: $@" >> $LOG
      break
    fi
  done
}

run_lang() {
  local CODE=$1
  local NAME=$2
  echo "" >> $LOG
  echo "════════════════════════════════════════" >> $LOG
  echo "[$(date)] INICIANDO: $NAME ($CODE)" >> $LOG
  echo "════════════════════════════════════════" >> $LOG

  # sc-tarjetas: idioma aprende inglés
  for LEVEL in A1 A2 B1 B2 C1; do
    for CAT in gramatica funciones_comunicativas conversacion vocabulario_contextual; do
      run_until_done $SC_T --target=$CODE --source=en --level=$LEVEL --category=$CAT
    done
  done

  # sc-tarjetas: inglés aprende idioma (--from=es)
  for LEVEL in A1 A2 B1 B2 C1; do
    for CAT in gramatica funciones_comunicativas conversacion vocabulario_contextual; do
      run_until_done $SC_T --target=en --source=$CODE --level=$LEVEL --category=$CAT --from=es
    done
  done

  # sc-misiones: idioma aprende inglés
  for LEVEL in A1 A2 B1 B2 C1; do
    for CAT in gramatica funciones_comunicativas conversacion; do
      run_until_done $SC_M --target=$CODE --source=en --level=$LEVEL --category=$CAT
    done
  done

  # sc-misiones: inglés aprende idioma (--from=es)
  for LEVEL in A1 A2 B1 B2 C1; do
    for CAT in gramatica funciones_comunicativas conversacion; do
      run_until_done $SC_M --target=en --source=$CODE --level=$LEVEL --category=$CAT --from=es
    done
  done

  echo "[$(date)] ✅ $NAME COMPLETO" >> $LOG
}

echo "[$(date)] INICIO COLA AFRICA" >> $LOG

run_lang sw  "Swahili"
run_lang am  "Amharic"
run_lang om  "Oromo"
run_lang ln  "Lingala"
run_lang so  "Somali"
run_lang zu  "Zulu"
run_lang rw  "Kinyarwanda"
run_lang tw  "Twi"
run_lang bm  "Bambara"
run_lang qu  "Quechua"
run_lang nah "Nahuatl"

echo "[$(date)] ✅ COLA AFRICA COMPLETADA" >> $LOG
