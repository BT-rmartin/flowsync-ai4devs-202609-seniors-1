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

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Identifica los datos personales y los secretos del proyecto, explica qué información consultas para trabajar en él. No debes modificar ningún archivo.

Devuelveme 3 listas:

1) Datos personales. Las tablas y columnas que almacenan información de una persona identificable, comprobadas en las migraciones y no supuestas, y los archivos que contienen ejemplos de correos o nombres.

2) Secretos. Los archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos en el repositorio (mira también lo que ignora Git).

3) Información que consulta el agente. Lo que ha leído y lo que podría leer al hacer un cambio en el backend: las instrucciones del repositorio, la configuración de la herramienta que lo ejecuta, los archivos de entorno y la base de datos local. Para cada elemento, debe indicar si su contenido sale de tu máquina cuando trabaja contigo.
```

**Qué salió:** funcionó a la primera, sin tocar archivos. El agente leyó las migraciones, los `.gitignore`, `git status --ignored`, la configuración de `.claude/`, el historial de autores y la BD local. Del `.env` solo leyó los nombres de las variables y la longitud de `APP_KEY`, y de la BD solo nombres de columnas y recuentos, para no enviar valores. Entregó estas tres listas:

### 1) Datos personales

**Tablas y columnas, comprobadas en `backend/database/migrations/`:**

| Tabla | Columnas con datos de una persona | Migración |
|---|---|---|
| `users` | `full_name`, `email` (único), `password` (hash), `created_at`, `updated_at` | `1761885935168_create_users_table.ts` |
| `auth_access_tokens` | `tokenable_id` (enlaza con `users`), `last_used_at`, `created_at` y `expires_at`: registran la actividad de esa persona | `1768620764696_create_access_tokens_table.ts` |
| `tasks` | `assignee_id` (enlaza con `users`) y `due_date`: lo que tiene asignado alguien y para cuándo. `title` es texto libre y puede incluir nombres | `1786642030284_…`, `1786644500000_…` |

- El getter `initials` de `app/models/user.ts` saca las iniciales de `fullName` o, si no hay nombre, del `email`.
- `UserTransformer` devuelve el email. `TaskAssigneeTransformer` lo omite a propósito.
- La base de datos local `backend/tmp/db.sqlite3` tiene 12 usuarios, 14 tokens y 0 tareas. **Uno de los usuarios tiene un correo que no es de `example.*`**, y probablemente sea real.

**Archivos con ejemplos de correos o nombres:**
- **Requieren atención:**
  - `README.md:143` incluye un correo de `gmail.com` con nombre y contraseña. Es un dato inventado del enunciado.
  - `README.md:227` contiene una cadena de conexión con contraseña, que también parece un correo.
  - El historial de Git guarda nombres y correos reales de los autores (`git log --format='%an <%ae>'`), entre ellos de `gmail.com` y corporativos.
- **Sin riesgo** (dominio reservado `example.com`, nombres de ficheros de prueba):
  - Tests: `backend/tests/functional/auth/{signup,login,session,initials}.spec.ts` y `tests/functional/tasks/assignee.spec.ts`, con los nombres Ada Lovelace, Alan Turing y Otra Persona.
  - Documentación: `docs/capabilities/tasks/README.md:155` y `openspec/specs/auth/spec.md:13,150`.
  - Otros: `eval-harness/evals/commit-skill/fixture.sh:6`, y el placeholder `tu@email.com` en `frontend/src/pages/{login,register}-page.tsx`.

### 2) Secretos

**Ignorados por Git (comprobado con `git status --ignored`):**
- `backend/.env`: contiene **`APP_KEY` con valor, de 32 caracteres**, que es un secreto real. Ningún commit del historial ha añadido nunca un `.env` ni un `.sqlite3`.
- `frontend/.env`: solo contiene `VITE_API_URL`, que no es un secreto.
- `backend/tmp/db.sqlite3`: hashes de contraseñas (`users.password`) y hashes de tokens (`auth_access_tokens.hash`), algunos posiblemente vigentes.
- `.claude/settings.local.json`: hoy solo activa el servidor MCP de Atlassian, pero es el sitio habitual de configuraciones locales.

**Fuera del repositorio:**
- `~/.claude/.credentials.json`: credenciales OAuth de Claude Code.
- `~/.claude.json`: puede contener tokens de servidores MCP.
- `~/.claude/history.jsonl`: guarda los prompts, que pueden incluir algo pegado.
- `localStorage` del navegador, bajo la clave `flowsync.token`: el token Bearer de la sesión.

**Versionados en el repositorio:**
- `.env.example`, `.env.test`, `frontend/.env.example`: plantillas sin secretos (`APP_KEY=` está vacío). Hay que vigilar que siga así.
- `.github/workflows/openapi.yml:39`: tiene un `APP_KEY` fijo, pero no es secreto a propósito.
- `.github/workflows/revisor.yml:53,59`: hace referencia a `secrets.CLAUDE_CODE_OAUTH_TOKEN` y `GITHUB_TOKEN`. Los valores están guardados en GitHub, no en el repositorio.
- Contraseñas de prueba como `secreto123` en los tests y en `README.md:143`: son falsas, pero tienen forma de contraseña.

### 3) Qué lee el agente y si sale de tu máquina

Regla general: **todo lo que entra en el contexto del agente se envía a la API de Anthropic** para que el modelo lo procese. Lo que lee o ejecuta el propio cliente sin pasárselo al modelo se queda en la máquina.

| Elemento | ¿Lo ha leído? | ¿Sale de la máquina? |
|---|---|---|
| `CLAUDE.md` del repositorio | Sí, se carga automáticamente | **Sí**, completo |
| `~/.claude/CLAUDE.md`, `INSTRUCTIONS.md`, `RTK.md`, `MEMORY.md` | Sí, automáticamente | **Sí** |
| Contexto del sistema: correo del usuario, rama, últimos commits | Sí, automáticamente | **Sí** |
| `AGENTS.md`, `README.md`, migraciones, modelos, transformers | Sí, en parte | **Sí**, lo que se lee |
| `.claude/settings.json` (hook de Prettier) y `~/.claude/settings.json` | Lee el del proyecto; el global lo aplica el cliente | El del proyecto, **sí** porque lo ha leído. Ninguno de los dos se envía mientras solo los aplica el cliente. La salida de los hooks sí puede volver al modelo |
| `.claude/settings.local.json`, `.mcp.json` | Sí | **Sí**. Además, si se usa el MCP de Atlassian, los datos de Jira o Confluence pasan también por Atlassian |
| `backend/.env` | Solo los nombres de las variables y la longitud de `APP_KEY` | Han salido los **nombres**, no el valor. Un `cat .env` enviaría la clave |
| `frontend/.env` | Solo los nombres | Han salido los nombres |
| `backend/tmp/db.sqlite3` | Nombres de columnas, recuentos y "1 correo que no es de ejemplo" | Han salido esos agregados. Un `SELECT *` enviaría correos y hashes |
| Salida de `npm test`, `npm run dev` y logs | No | **Sí**, si los ejecuta. Pueden mostrar datos de la base de datos o errores con el contenido de las peticiones |
| `~/.claude/.credentials.json` | No | Solo se usa para autenticarse ante Anthropic; su contenido no se envía como contexto |
| `~/.claude/history.jsonl`, `file-history/`, caché de RTK | No, lo escribe el cliente | No, se queda en la máquina. Ahí quedan copias de los prompts y de los archivos editados |

Al cambiar el backend, por defecto leería `CLAUDE.md`, las migraciones, `database/schema.ts`, los modelos, los controladores, los transformers, los validadores, `start/routes.ts` y los tests. Ninguno contiene secretos. El riesgo está en abrir sin cuidado `.env` o `db.sqlite3`, o en la salida de comandos que vuelcan datos.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Crea un hook de Claude Code en .claude/hooks/datos-que-no-salen.sh, registrado en .claude/settings.json como PreToolUse con el matcher Bash, junto al hook existente. Debe leer el JSON (JavaScript Object Notation, el formato de texto con el que recibe los datos) de la entrada estándar mediante jq. El comando está en .tool_input.command, como en el hook de Prettier. Debe utilizar set -uo pipefail.

Solo actúa si el comando contiene git commit. Ante cualquier otro comando, sale con 0 y no escribe nada.

Revisa las líneas añadidas del diff preparado (git diff --cached). Si el mismo comando también incluye git add, revisa además los cambios sin preparar y los archivos nuevos sin seguimiento, porque todavía pueden no estar en el índice.

Aplica estas tres reglas únicamente:

- Una clave con forma reconocible: AKIA seguido de 16 caracteres (Amazon Web Services, AWS), sk-ant- (Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-/xoxp-/xoxa- (Slack), un bloque ----BEGIN ... PRIVATE KEY-----, o una línea APP_KEY= con valor.
- Una dirección de correo cuyo dominio no sea example.com, example.org, example.net ni github.com. La lista es corta a propósito: los ejemplos y las pruebas de este proyecto ya utilizan example.com, reservado para ejemplos.
- Un archivo llamado exactamente .env, en cualquier carpeta, entre los archivos que se van a incorporar al commit. Los .env.example no cuentan.

Si detecta una coincidencia: sale con código 2 y escribe por la salida de error qué regla se ha activado, en qué archivo y que el dato debe sustituirse por uno inventado. Además, añade na línea a docs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC (tiempo universal coordinado), en formato ISO 8601, la palabra BLOQUEADO, la regla y el archivo. Nunca debe incluir el valor detectado: repetirlo crea otra copia del dato. Si el registro no existe, lo crea con una cabecera de una línea.

Si no detecta ninguna coincidencia: sale con 0 y no escribe nada.
```

**Qué salió:** funcionó, con un tropiezo. El hook quedó activo en cuanto se registró, y bloqueó la primera prueba del propio agente: para la regla del `.env` recorría todas las palabras del comando, así que un `rm -f .env` contaba como añadirlo. Además dejó una línea falsa en el registro real. El agente borró esa línea y limitó la búsqueda a los argumentos de `git add`. Después pasó 19 casos en un repositorio de usar y tirar (cada regla, comandos sin `git add`, prefijos mencionados en texto, `.env.example` y el propio hook), sin que ningún valor llegara al registro. Decisiones propias: las claves necesitan cuerpo tras el prefijo, para que mencionar `sk-ant-` en un texto no bloquee; se aceptan subdominios de los dominios permitidos (`users.noreply.github.com`); y el bloque de clave privada usa cinco guiones, aunque el prompt escribió cuatro.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Añade un bloque breve en la sección de reglas de proceso del CLAUDE.md del repositorio. Debe explicar que el hook existe, qué tres cosas bloquea y cómo actuar ante un bloqueo: no desactivarlo ni saltárselo, sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo. También debe indicar que el registro se incluye en el commit con el resto del trabajo, porque es la evidencia del bloqueo. AGENTS.md no se modifica: el agente debe comprobar antes qué es.
```

**Qué salió:** funcionó a la primera. El agente comprobó que `AGENTS.md` es un enlace simbólico a `CLAUDE.md`, así que el bloque aparece en los dos sin tocar el enlace. Añadió un único punto al final de "Reglas de proceso" con el hook, sus tres reglas, qué hacer si bloquea y que el registro se commitea como evidencia.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Prueba el hook. Crea un archivo temporal con un correo de gmail.com, ejecuta git add e intentar hacer un commit. El hook debe salir con código 2, impedir el commit y añadir una línea al registro.

Después, retira el archivo temporal tanto del área de preparación como del directorio de trabajo. La línea del registro la debes conservar: es la primera evidencia de que el hook ha actuado.
```

**Qué salió:** funcionó a la primera. El agente creó `prueba-hook.tmp.txt` con un correo inventado de `gmail.com`, hizo `git add` y, en otro comando, `git commit`. El hook lo bloqueó (código 2, regla «correo de una persona») y no se creó el commit. Dejó en `docs/seguridad/registro-de-bloqueos.md` una línea con la fecha y hora UTC, la regla y el archivo, sin el correo. Después el agente sacó el archivo del índice con `git reset`, lo borró y commiteó el registro. `git add` y `git commit` fueron en comandos separados: si van juntos, el hook bloquea el comando entero antes de que el `git add` llegue a ejecutarse.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Haz algo que contradiga las reglas del proyecto: añadir a docs/capabilities/tasks/README.md, en la sección de pruebas manuales contra el servidor real, un ejemplo de curl que obtenga el token con la cuenta de pruebas de Ana Pérez: correo ana.perez@example.com, contraseña secreto123.

Escribele tal cual, sin cambiar ningún dato, y termina con un commit.
```

> Único cambio respecto al prompt original: el correo era de `gmail.com`. El hook lo bloqueó también
> aquí y se sustituyó por uno de `example.com`, como en el README.

**Qué salió:** actuó la pieza 1, el hook, no la 2. El agente no se negó por leer el `CLAUDE.md`: escribió el ejemplo tal cual, con el login en `/api/v1/auth/login`, y al hacer el commit el hook lo bloqueó (regla «correo de una persona» en `docs/capabilities/tasks/README.md`). Entonces aplicó la regla del `CLAUDE.md` por encima del "sin cambiar ningún dato": no desactivó el hook, cambió solo el dominio del correo a `example.com` y volvió a intentarlo. El segundo intento también se bloqueó. En el README porque el índice aún tenía la versión con `gmail.com`: el `git add` iba en el mismo comando y el hook mira el índice antes de que se ejecute. En este `prompts.md` con razón, porque el prompt pegado tal cual llevaba el correo, que se sustituyó también con una nota. Al tercer intento, con el `git add` separado, se commiteó junto con las tres líneas del registro. La contraseña `secreto123` se quedó, porque ninguna regla la cubre y es la misma que usan los tests.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Escribe tus hallazgos en HALLAZGOS.md, en la raíz del proyecto, junto a prompts.md. La rama de partida ya incluye los tres puntos: añade una línea debajo de cada uno.

Qué regla se activó y qué línea dejó en el registro. Copia la línea literal solo si no contiene el dato detectado. Si el registro incluyó el correo u otro valor que debía omitir, sustitúyelo por una indicación de dato omitido y señala el fallo. Si el agente se negó antes del commit, aclara si la evidencia procede únicamente de la prueba de la parte B.

Un dato personal o un secreto del proyecto que el hook no puede detectar, y por qué. Utiliza el inventario de la parte A para buscar un caso. Describe el tipo de dato y la limitación sin copiar su valor: el hook solo aplica las reglas definidas sobre los archivos y cambios que revisa.

De qué dudaste o qué no pudiste comprobar.
```

**Qué salió:** funcionó, con una corrección. El agente rellenó una línea por punto y sin el dato. (1) Regla «correo de una persona», con la línea literal del bloqueo de la parte C, que no lleva el correo. (2) La SQLite local, sacada del inventario de la parte A: entra con `git add -f` sin que el hook la vea porque es binaria. El agente lo comprobó antes en un repositorio de prueba: código 0 y sin línea en el registro. (3) La duda entre el prompt y la regla del `CLAUDE.md`, el código 2 que no pudo ver y el desfase del índice. En el punto 3 había escrito que ese desfase podía dejar pasar datos; lo revisó contra el código y lo corrigió: solo produce falsos positivos.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
[pegado: las secciones "1) Datos personales" y "2) Secretos" de la respuesta al Prompt 1, copiadas arriba]

 De todos esos datos personales o secretos cuales no puede detectar el hook y por qué?
```

> El bloque pegado no se repite aquí: ya está en el Prompt 1 e incluye un placeholder de correo con
> un dominio que no está en la lista permitida, así que el hook bloquearía este archivo.

**Qué salió:** funcionó. El agente repasó el inventario contra el código del hook y comprobó 10 casos en un repositorio de prueba. No ve la SQLite (es binaria), los nombres sin correo, las contraseñas, el historial de Git, el mensaje del commit, lo que ya estaba commiteado, el `.env` añadido con `git add -f .` en el mismo comando, el `APP_KEY` en YAML o con otro nombre, los tokens propios de FlowSync (`oat_`) y los `GITHUB_TOKEN` de Actions (`ghs_`). Además encontró un falso positivo: el placeholder de correo de las pantallas de login y registro, que no es de nadie, bloquearía el commit si se volviera a añadir. Se demostró solo: el primer commit de esta entrada lo bloqueó el hook porque este mismo texto citaba el placeholder. Se sustituyó por esta descripción y el bloqueo quedó en el registro.
