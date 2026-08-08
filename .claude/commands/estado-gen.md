Ejecuta el protocolo de inicio de sesión para la generación de módulos MisionMate (source=pt).

Pasos que debes realizar EN ORDEN:

1. Lee el archivo `gen_progress_status.json` en el directorio del proyecto para ver qué niveles completaron.

2. Corre `node generate_missions.js --status --target=en --source=pt` para ver el estado detallado de la dupla en progreso.

3. Corre `ps aux | grep "run_level" | grep -v grep` para ver si hay procesos nohup corriendo de la sesión anterior.

4. Lee las últimas 10 líneas de los logs activos: `gen_en_pt_b1.log`, `gen_en_pt_b2.log`, `gen_en_pt_c1.log` (u otros según el idioma en progreso).

5. Con toda esa información, presenta un resumen claro:
   - Qué niveles/duplas están COMPLETOS
   - Qué está CORRIENDO ahora mismo (procesos vivos)
   - Qué está PENDIENTE
   - Si hay procesos muertos que hay que relanzar, muestra el comando exacto para hacerlo

6. Actualiza el task list (Tasks) para reflejar el estado real encontrado.

7. Pregunta al usuario cómo quiere continuar.

El directorio de trabajo es `/data/data/com.termux/files/home/sensemate/sensemate`.
