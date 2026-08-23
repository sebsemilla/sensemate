#!/bin/bash
# Cola: Idiomas europeos — sc-tarjetas + sc-misiones (Cohere AI)
# Orden: griego → catalán → islandés → irlandés → noruego → danés → holandés → sueco →
#        esloveno → eslovaco → checo → turco → polaco → rumano → finlandés →
#        húngaro → búlgaro → croata → ucraniano → serbio

LOG=/data/data/com.termux/files/home/sensemate/queue_europa.log
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

echo "[$(date)] INICIO COLA EUROPA" >> $LOG

run_lang el  "Griego"
run_lang ca  "Catalan"
run_lang is  "Islandes"
run_lang ga  "Irlandes"
run_lang no  "Noruego"
run_lang da  "Danes"
run_lang nl  "Holandes"
run_lang sv  "Sueco"
run_lang sl  "Esloveno"
run_lang sk  "Eslovaco"
run_lang cs  "Checo"
run_lang tr  "Turco"
run_lang pl  "Polaco"
run_lang ro  "Rumano"
run_lang fi  "Finlandes"
run_lang hu  "Hungaro"
run_lang bg  "Bulgaro"
run_lang hr  "Croata"
run_lang uk  "Ucraniano"
run_lang sr  "Serbio"

echo "[$(date)] ✅ COLA EUROPA COMPLETADA" >> $LOG
