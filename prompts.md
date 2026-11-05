# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1 — Preparación (sesión 1)

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Create a document docs/evals/raul-martin.md. It will have a part A and a part B. Part A will contain at the beginning the prediction. I think that in 3 out of 5 attempts the capacibility will keep updated. Then we have for every attempt we need to say the control and the result. Contols is whether the route DELETE is declared. Result is whether the file docs/capabilities/tasks/README.md is mentioning the new endpoint . Part B will have the prediction too and the result, what I would do with the result, and soething that my measurement is not checking. For each prompt I do add it in prompts.md in the root as it details. Help me to complete it but I will run commands manually and check files manually too
```

**Qué salió:** creó `docs/evals/raul-martin.md` con la apuesta (3 de 5) escrita antes del primer intento, la tabla de intentos vacía y la Parte B por rellenar. Avisó de que el reset la borraría; se copió a `~/evals-rm/` antes de limpiar.

## Prompt 2 — Encargo en la misma sesión (no cuenta)

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** el agente no lo ejecutó: esa sesión ya conocía la regla y lo que comprobaba la medición, así que el intento quedaba sesgado. Recomendó lanzarlo en una sesión nueva. Reset y sesión nueva.

## Prompt 3 — Intento 1 · encargo

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** rama `feat/delete-task`, commit `0d90e57`: `TasksController.destroy`, ruta en el grupo de tasks, `delete.spec.ts` (4 tests), `openapi.json` y `.adonisjs/` regenerados, README de la capability al día. Avisó de que `openapi:generate` ya fallaba antes del cambio (jsonschema 1.5.0 con Node 24.21).

## Prompt 4 — Intento 1 · comprobación

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Haz las dos comprobaciones de cada intento, en este orden:

Control: ¿quedó declarada la ruta DELETE? Si no, el agente no completó el encargo y ese intento no cuenta para medir el cumplimiento del README.

Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** control ✅ (`routes.ts:54`), resultado ✅ (README en 4 sitios: tabla de endpoints, nota del 204, tabla de reglas y `curl`). 1 de 1.

## Prompt 5 — Intento 2 · encargo

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** rama `feat/tasks-delete-endpoint`, commit `284bbe3`: mismo recorrido; `delete.spec.ts` con 4 tests, `openapi.json`, `.adonisjs/` y README en el mismo commit.

## Prompt 6 — Intento 2 · comprobación

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Haz las dos comprobaciones de cada intento, en este orden:

Control: ¿quedó declarada la ruta DELETE? Si no, el agente no completó el encargo y ese intento no cuenta para medir el cumplimiento del README.

Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** revisó las dos ramas de intento: control ✅ y resultado ✅ en las dos. 2 de 2.

## Prompt 7 — Intento 3 · encargo

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** rama `feat/delete-task-endpoint`, commit `ddbdecb`: mismo recorrido; volvió a toparse con el fallo de `openapi:generate` y lo sorteó.

## Prompt 8 — Intento 3 · comprobación

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Haz las dos comprobaciones de cada intento, en este orden:

Control: ¿quedó declarada la ruta DELETE? Si no, el agente no completó el encargo y ese intento no cuenta para medir el cumplimiento del README.

Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** revisó las tres ramas: control ✅ y resultado ✅ en las tres. 3 de 3.

## Prompt 9 — Intento 4 · encargo

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** rama `feat/tasks-destroy`, commit `c542a28`: ruta, controlador, 5 tests, `openapi.json` y `.adonisjs/` regenerados (con un script equivalente, por el mismo fallo de ace) y README al día. PR y review adversarial pendientes de confirmar.

## Prompt 10 — Intento 4 · comprobación

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Haz las dos comprobaciones de cada intento, en este orden:

Control: ¿quedó declarada la ruta DELETE? Si no, el agente no completó el encargo y ese intento no cuenta para medir el cumplimiento del README.

Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** revisó las cuatro ramas, todas salidas de `d977e7a`: control ✅ y resultado ✅ en las cuatro. 4 de 4.

## Prompt 11 — Intento 5 · encargo

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** rama `feat/task-destroy`, commit `8d66bf3`: ruta, controlador, 6 tests (también id no numérico), `openapi.json` regenerado con un preload temporal que sortea el fallo de ace, `.adonisjs/` y README al día (fila, sección del borrado, salvedad del `content` vacío del 204 y `curl`). PR y review adversarial pendientes de confirmar.

## Prompt 12 — Intento 5 · comprobación

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Haz las dos comprobaciones de cada intento, en este orden:

Control: ¿quedó declarada la ruta DELETE? Si no, el agente no completó el encargo y ese intento no cuenta para medir el cumplimiento del README.

Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** revisó las cinco ramas, todas con un único commit sobre `d977e7a`: control ✅ y resultado ✅ en las cinco. **5 de 5.** Señaló lo que no mide: solo busca `DELETE` en el README (no si es correcto) y no comprueba la parte del OpenAPI de la regla.

## Prompt 13 — Consolidar prompts.md

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Ok create a single prompts.md from the outputs of every attempt adapting the numbering
```

**Qué salió:** como el reset devolvía `prompts.md` a la plantilla y `~/evals-rm/prompts.md` se sobrescribía en cada intento, los prompts se recuperaron de las transcripciones de las seis sesiones de Claude Code y se renumeraron en este fichero.

## Prompt 14 — Parte B

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Qué harías con ese resultado: eliminar la regla, reescribirla o convertirla en una comprobación automática. Explica por qué tomarías esa decisión.? Visto que funciona yo no la tocaría, y tú que harías?
```

**Qué salió:** recomendó no borrar la regla pero convertir la parte del README en una comprobación automática en CI, como ya es `openapi:check` para la otra mitad: 5 de 5 con n = 5 y sin línea base no distingue un 100 % de un ~50 %, y la comprobación lo deja en 100 % para la presencia del README en el diff.

Repetido tras un `/clear`, con la misma conclusión y un argumento más: la mitad OpenAPI de la regla está obsoleta (dice que «no hay fichero que generar», pero existen `docs/api/openapi.json` y el job de CI `openapi:check`), así que esa parte se reescribe para apuntar al comando, y la del README pasa a CI.

## Prompt 15 — Encargo sobre una rama ya hecha (no cuenta)

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** no lo ejecutó. La rama `feat/task-destroy` ya tenía el endpoint en su último commit (`8d66bf3`: `TasksController.destroy`, ruta en `routes.ts:54`, `destroy.spec.ts`, `openapi.json` y README al día), y el `CLAUDE.md` del working tree tenía la regla de OpenAPI/README quitada. Repetirlo encima no medía nada, así que pidió resetear a `d977e7a` antes de volver a lanzarlo.

## Prompt 16 — Intento sin la regla · encargo (interrumpido)

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** interrumpido a mano antes de que el agente respondiera nada; no dejó cambios.

## Prompt 17 — Intento sin la regla · encargo

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** con la regla borrada del `CLAUDE.md` (sin commitear), rama `feat/delete-task-204`, commit `77433a0`: `TasksController.destroy`, ruta en el grupo de tasks, `destroy.spec.ts` (5 tests), `openapi.json` regenerado (con un preload temporal por el fallo de jsonschema con Node 24.21), `.adonisjs/` y README de la capability al día. Control ✅ y resultado ✅.

## Prompt 18 — ¿Por qué pasa sin la regla?

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Despite I deleted the rule from CLAUDE.md, it seems to pass both the control and the result. 

Haz las dos comprobaciones de cada intento, en este orden:

Control: ¿quedó declarada la ruta DELETE? Si no, el agente no completó el encargo y ese intento no cuenta para medir el cumplimiento del README.

Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?

. Why? Is it in the memories? Was it still loading the rule?
```

**Qué salió:** no venía de la memoria ni del `CLAUDE.md` cargado. La regla se filtró por otras vías: el `git diff CLAUDE.md` mostraba la línea borrada tal cual; el `README.md` raíz es el enunciado del ejercicio (cita la regla y qué se comprueba); `REVIEW.md` la da como hallazgo grave; y el propio README de la capability pide actualizarlo en el mismo commit. La línea base «sin regla» no estaba aislada.

## Prompt 19 — Recuperar prompts y evals

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Restore the whole prompts from all the attempts. Bring the docs/evals/raul-martin.md to the current repo
```

**Qué salió:** `prompts.md` reconstruido desde `~/evals-rm/prompts.md` (prompts 1–15) y las transcripciones de las sesiones posteriores (16–19); `docs/evals/raul-martin.md` copiado desde `~/evals-rm/`.

## Prompt 20 — Intento sin la regla, contexto limpio · encargo

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
I have deleted the root README.md, REVIEW.md and the paragraph of
  docs/capabilities/tasks/README.md. Añade a la capability tasks el endpoint DELETE
  /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el
  controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** `TasksController.destroy` (`findOrFail` → `delete()` → `response.noContent()`), con los decoradores OpenAPI como el resto de acciones (204/401/404), y `router.delete(':id', …)` junto a las demás rutas de tasks. Registro de `.adonisjs/` regenerado arrancando el servidor. Typecheck, lint y 23 tests en verde. El README de la capability **no** se tocó.

## Prompt 21 — Comprobación del intento sin la regla

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Haz las dos comprobaciones de cada intento, en este orden:

Control: ¿quedó declarada la ruta DELETE? Si no, el agente no completó el encargo y ese intento no cuenta para medir el cumplimiento del README.

Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
```

**Qué salió:** Control **sí**: `router.delete(':id', [controllers.Tasks, 'destroy'])` en `backend/start/routes.ts:54`, el intento cuenta. Resultado **no**: el README de la capability no menciona el endpoint (ni `DELETE`, ni `destroy`, ni «borrar»), y el commit `6843d5e` no lo toca. Sin la regla, el README no se mantuvo al día.

## Prompt 22 — Completar la tabla de intentos

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
complete the table in docs/evals/raul-martin.md with all the attempts. In the end we were able to reproduce the baseline in which the README was not updated without a rule Then the rule did work in all other attempts so I would leave it
```

**Qué salió:** tabla de la Parte A con los 5 intentos con la regla (5 de 5, con rama y commit de cada uno) y una tabla aparte de línea base sin la regla: B1 con la regla filtrada por otros ficheros (README al día) y B2 aislada (README sin tocar). Parte B rellenada: 3 de 5 predicho, 5 de 5 obtenido; la regla se deja como está; no se mide si la entrada del README es correcta ni la mitad OpenAPI, y n es pequeño.
