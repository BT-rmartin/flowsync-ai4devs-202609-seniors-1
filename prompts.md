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

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Crea la spec del código que ya está escrito sobre cuentas y acceso (registro, inicio de sesión, sesión y perfil) en docs/spec-viva/raul-martin.md. Tienes 2 capas, un backend con sus rutas, sus controladores, el modelo de usuario, sus validadores y sus middlewares; y un frontend con las pantallas de acceso, el estado de sesión y la protección de rutas. Céntrate sólo en sólo ese vertical, Lo que pasa por la API y lo que se ve en pantalla, y nada que no sea cuentas y acceso.  El formato de la spec es:
- Arriba, un ## Purpose de una o dos frases: para qué existe esta capability.
- Debajo, ## Requirements, y colgando de él ### Requirement: en los que el sistema SHALL hacer algo.
- Bajo cada requisito, al menos un #### Scenario: de cuatro almohadillas, con dos viñetas: **WHEN** y **THEN**. No hay casilla para el GIVEN: la precondición se mete dentro del WHEN.
- Hazlo en castellano, salvo las mayúsculas de la RFC.

Tres reglas duras a cumplir: 1) Nada de ADDED, MODIFIED ni REMOVED. Eso es el vocabulario de un delta, y esto no es un delta: es la verdad actual del sistema. Si tu archivo tiene una de esas secciones, has escrito otra cosa.
2) Solo comportamiento observable desde fuera. Ni un nombre de clase, ni un nombre de archivo, ni una ruta de código. En la API, observable es la petición y la respuesta. En la pantalla, observable es lo que una persona ve y puede hacer.
3) No toques el código. Ni siquiera para arreglar lo que encuentres
```

**Qué salió:** Funcionó a la primera. Leyó backend y frontend, verificó con curl contra el servidor de desarrollo los códigos y cuerpos reales de la API (creando cuentas de prueba `spec-probe-*@example.com` en la BD local) y escribió `docs/spec-viva/raul-martin.md` con 13 requisitos (7 de API, 6 de pantalla), sin secciones de delta ni nombres de código. Destacó comportamientos raros que recoge tal cual: email sensible a mayúsculas, `fullName` obligatorio como clave aunque sea opcional, iniciales sin nombre sacadas de usuario + dominio del email y mensajes de longitud en minúscula. Hizo commit local (`096ed80`); el PR quedó pendiente porque el guardrail bloquea `git push`.

## Prompt 2

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
También hay que completar esto. 

Debajo de la spec, en el mismo archivo. Esta parte no se puede fallar, y es la que hay que traer sí o sí.

1. Cuántos requisitos escribió el agente, y cuántos comprobaste tú abriendo el código. Los dos números, tal cual salieron. No los redondees ni los expliques. Comprobar significa haber ido a mirar si el código hace eso; leer el requisito y que suene razonable no cuenta.

2. Las incoherencias que aparecieron al escribirla. Una línea cada una, con dónde se ve. No las busques a propósito: aparecen solas, porque una regla que se cumple en casi todas partes canta en cuanto intentas escribirla como si se cumpliera siempre.

3. Lo que no supiste decidir si era un bug o el contrato. Al menos una, y en una frase, qué dos lecturas se contradecían. Esta es la lista que importa. No es lo que estaba mal: es lo que podría estar bien o mal según a quién le preguntes, y no había forma de decidirlo leyendo el código.
```

**Qué salió:** Añadió al final de la spec la sección «Revisión de la spec»: 13 requisitos escritos y 13 comprobados por el agente contra el código (la línea de los comprobados por mí queda en blanco, para rellenarla yo); 9 incoherencias, cada una con el requisito o escenario donde se ve (logout sin `data`, `fullName` obligatoria como clave, email sensible a mayúsculas, precisión distinta de `createdAt`, iniciales, traducción global de 400/401, «caducado» sin caducidad real, minúsculas, idioma API frente a pantalla); y 4 dudas de bug o contrato (mayúsculas del email, logout sin envoltorio, clave `fullName`, token conservado con el servidor caído).

## Prompt 3

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
"- Servidor inaccesible al arrancar: o conservar el token mientras se muestra la pantalla de login es la resiliencia buscada (contrato), o es un bug, porque la persona se ve fuera, vuelve a entrar y deja un token anterior vivo que nunca se revoca." no aparece como incoherencia- Por qué aparece como bug o contrato?
```

**Qué salió:** Explicó que el caso va en «bug o contrato» porque el código conserva el token a propósito y no hay forma de saber si esa decisión es correcta. Reconoció que también es una incoherencia (la pantalla de login aparece con una sesión guardada) y que la había omitido en el punto 2. Añadió allí la línea que faltaba.

## Prompt 4

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Qué propones para estás incoherencias 

- Las iniciales con nombre de una palabra son sus dos primeras letras, pero sin nombre se toman del usuario y del dominio del email, no de las dos primeras letras del email (Requirement: Cálculo de las iniciales, Scenario: Sin nombre).
- En pantalla, todo `400` se traduce como «El email o la contraseña no son correctos.» y todo `401` como «Tu sesión ha caducado…», con independencia de qué petición lo produzca (Requirement: Pantalla de inicio de sesión y Persistencia y restauración de la sesión).
- Los mensajes de error de pantalla empiezan en mayúscula, salvo los de longitud: «la contraseña debe tener al menos 8 caracteres.» (Requirement: Pantalla de registro).
- La pantalla de login solo se muestra a quien no tiene sesión, salvo cuando el servidor está caído al arrancar: se muestra aunque la sesión sigue guardada y vuelve sola al recargar (Requirement: Navegación según el estado de sesión frente a Scenario: Servidor inaccesible al arrancar).
- La API responde con mensajes en inglés y la pantalla los muestra en castellano, así que la API y la pantalla no dan el mismo mensaje (Requirement: Registro de cuenta por API frente a Pantalla de registro).

? Crees que son bug o contrato?
```

**Qué salió:** Dio una propuesta y un veredicto para cada una, sin tocar código ni spec. Bug: iniciales sin nombre (la rama de las dos primeras letras nunca se ejecuta con emails) y minúsculas en los mensajes de longitud. Bug latente: traducción global de 400/401. Mixto: servidor caído al arrancar (conservar el token es contrato, mostrar el login es bug; propone un estado «sin conexión» con reintento). Contrato: idioma de la API frente a la pantalla. Reconoció que el del idioma no es una incoherencia y propuso sacarlo de la lista.

## Prompt 5

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
estoy de acuerdo 1 bug, 2 bug, 3 bug, 4 contrato+bug 5 quita de incoherencias y que cliente se fie de rule y field no de message
```

**Qué salió:** Quitó de las incoherencias la del idioma de la API frente a la pantalla. Añadió a la spec el requisito «Errores identificables por `rule` y `field`», con un escenario para errores de validación y otro para errores de credenciales o autenticación, que solo traen `message`. Anotó el veredicto en cada incoherencia (bug en iniciales, 400/401 y minúsculas; contrato+bug en servidor caído) y la decisión en el caso equivalente del punto 3. Subió el recuento a 14 requisitos escritos y 14 comprobados por el agente.

## Prompt 6

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
No, no pongas en la seccion de incoherencias el veredicto. Ponen la sección 3 porque crees que es bug o contrato como en las 4 que ya están escritas
```

**Qué salió:** Quitó los veredictos de la sección de incoherencias y la «Decisión» del caso del servidor caído. Añadió a la sección 3 las iniciales sin nombre, la traducción global de 400/401 y las minúsculas de los mensajes de longitud, en el mismo formato de dos lecturas (contrato / bug) que los 4 que ya había.

## Prompt 7

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
revisa de nuevo toda secccion 3 de bug o contrato. Para cada una de ellas dame tu veredicto pero no lo escribas todavía
```

**Qué salió:** Dio un veredicto para cada una de las 7 entradas de la sección 3, sin escribirlos en la spec. Bug: email con mayúsculas, logout sin `data`, iniciales sin nombre, traducción global de 400/401 y minúsculas. Contrato: clave `fullName` obligatoria. Contrato + bug: servidor caído al arrancar.

## Prompt 8

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Reescribe la sección 3 dando el título para cada problema e inspirate en la siguiente justificacion  1) Bug porque los buzones de correo no distinguen mayúsculas y es el comportamiento que se debería mdoelar. Con la implementación actual se distinguen mayúsculas y además no se avisa de ello en la pantalla. 2) Bug no grave porque todas respuestas van envueltas menos ésta. Por coherencia se debería envover aunque no es bloqueante ahora mismo porque ña pantalla ignora el cuerpo de la respuesta. 3) Contrato. La API admite null pero pide que la clave esté, y el cliente la envía siempre con un comentario que lo explica. Si un día se permite omitirla desde el cliente, la API ya está preparada. 4) Contrato y bug Conservar el token es contrato, porque el propio código deja escrita esa intención. Mostrar el login con la sesión guardada es bug, por el token huérfano y porque la persona cree que está fuera. 5) Bug, en un email siempre hay más de una palabra porque hay @ y sacar la segunda inicial del dominio no tiene sentido 6) Bug, el mensaje debería depender de la petición que falla, no solo del código de estado. Y «caducado» no es verdad, porque los tokens no caducan. 7) Bug, debería comenzar con mayúscula, es un efecto secundario de reutilizar la etiqueta del campo
```

**Qué salió:** Reescribió la sección 3 con un título en negrita por problema y, debajo de cada uno, las dos lecturas enfrentadas y el veredicto con la justificación dada (corrigiendo erratas). Matizó el 3: la API no está preparada para que se omita la clave (hoy responde `422`), así que lo dejó como «bastaría con aceptar su ausencia, un cambio compatible».

## Prompt 9

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Podrías comprobar las specs de pantalla no sólo leyendo código sino directamente desde el cliente? Con playwright o algo así?
```

**Qué salió:** En vez de Playwright usó Chrome (extensión Claude in Chrome) contra el frontend en marcha, rellenando formularios y leyendo la pantalla. Confirmó redirecciones, login, registro, perfil, persistencia al recargar, sesión revocada y logout. Encontró tres diferencias con lo escrito leyendo código y las corrigió en la spec: el error de longitud bajo «Repite la contraseña» tiene otro texto; el aviso de sesión perdida vuelve a aparecer tras un fallo que solo tiene errores de campo; «Cerrando sesión…» nunca llega a verse. Quedaron sin comprobar los escenarios que necesitan el backend caído o fallando (arranque sin servidor, error 500, envío sin servidor, logout sin servidor) y el indicador de carga.

## Prompt 10

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
sí finaliza las pruebas con el backend caído
```

**Qué salió:** Pausó el backend (SIGSTOP) para ver el indicador «Cargando…» al restaurar la sesión, lo reanudó y confirmó que la sesión se restauraba. Después lo apagó dos veces y comprobó: arranque sin servidor (login con aviso de conexión y sesión conservada), envío de login y de registro sin servidor, y logout sin servidor (llega a `/login` sin aviso y borra la sesión local). Al volver el servidor, recargar recupera la sesión sin credenciales. Todo coincidía con la spec, así que no hubo cambios. Levantó el backend de nuevo tocando la fecha de `start/routes.ts`, sin cambiar su contenido. El escenario de error 500 al arrancar quedó sin comprobar: habría que tocar código o datos.

## Prompt 11

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
ok con los fallos de la spec detectados aquí 

Corregido en la spec (tres fallos míos):
1. Error de longitud bajo «Repite la contraseña». No es el mismo texto que el de la contraseña: dice «la confirmación de la contraseña debe tener al menos 8 caracteres.»
2. Aviso de sesión perdida. No desaparece con el siguiente intento. Un aviso general lo tapa, pero vuelve a salir en cuanto un intento falla solo con errores de campo, y solo se va al iniciar sesión con éxito. Puede ser un candidato más para la sección 3; no lo he añadido.
3. «Cerrando sesión…». Nunca llega a verse, porque la pantalla cambia antes. Lo he quitado del escenario.

 hay alguna incoherencia nueva? Y si es así crees que es bug o contrato?
```

**Qué salió:** Vio tres incoherencias nuevas, una por fallo, y dio un veredicto para cada una sin escribirlas en la spec. Bug leve: el error de longitud sale repetido bajo la confirmación. Bug leve: el aviso de sesión perdida reaparece tras intentos posteriores. Contrato: «Cerrando sesión…» nunca se ve porque el cierre local es inmediato a propósito, y el texto es código muerto.

## Prompt 12

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
ok añade las incoherencias en el el apartado 2 y la propuesta de bug o contrato en el apartado 3 siguiendo el formato de las anteriores (no metas las lecturas)
```

**Qué salió:** Añadió las tres incoherencias nuevas al apartado 2 (error de longitud duplicado, aviso de sesión perdida que reaparece y «Cerrando sesión…» que nunca se ve) y sus veredictos al apartado 3 como puntos 8 a 10, con título y veredicto y sin lecturas. Avisó de que la introducción del apartado 3 ya no encaja: dice que solo el nombre opcional es contrato, y el punto 10 también lo es.

## Prompt 13

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Comprueba que en la spec no aparece ni un nombre de archivo ni un nombre de clase
```

**Qué salió:** Pasó varios grep a la spec: extensiones y rutas de fichero, nombres de piezas de código conocidas del repo (controladores, transformers, validadores, middlewares, componentes, hooks, clave del almacenamiento del navegador) e identificadores en PascalCase o camelCase, y revisó todo lo que va entre backticks. Ninguno encontró nombres de archivo ni de clase. Lo que hay entre backticks son rutas HTTP, URLs de pantalla, claves JSON de petición y respuesta, códigos de estado, cabeceras y valores de ejemplo, todo observable. Señaló que la sección 3 menciona «el código» en genérico, sin nombrar ningún archivo ni clase.

## Prompt 14

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
"### Requirement: Errores identificables por `rule` y `field`

El sistema SHALL identificar cada error de validación con `rule` y `field`, que son el contrato para los clientes; `message` es un texto informativo en inglés y los clientes no deben depender de él." => El texto dice que rule y field "son el contrato para los clientes" y que "los clientes no deben depender de message". Eso viene de tu Prompt 5 ("que cliente se fie de rule y field no de message"). Es una decisión de diseño, no una descripción de lo que el sistema hace hoy; el README: "es la verdad actual del sistema". Lo descriptivo sí es correcto y verificable (la pantalla traduce a partir de rule y field; los 400/401 solo traen message). Deja esa parte y pasa la recomendación a la parte de bugs y contrato en parte b3
```

**Qué salió:** Reescribió el requisito en descriptivo: la API acompaña cada error de validación de `rule`, `field` y un `message` en inglés, y la pantalla construye su mensaje a partir de `rule` y `field`, nunca de `message`. Quitó también el «estables», que no se podía verificar. Pasó la recomendación a B3 como punto 11, «contrato propuesto», enlazado con el punto 6.

## Prompt 15

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
"Prácticamente todas las incoherencias son bugs, salvo la del nombre opcional, que es un contrato." contradice los ítems 3, 4 y 10. El propio agente te avisó en el Prompt 12 y quedó sin corregir. Además, los 10 ítems llevan veredicto; Reordenalo y pon lo primero lo que no supe decidir (punto 4) y los demás detrás. Distingue lo decidido de lo indeciso.
```

**Qué salió:** Reescribió la introducción de B3 (una sin decidir, siete bugs y tres contratos) y reordenó la sección en tres bloques: «Sin decidir», con el servidor inaccesible al arrancar como punto 1 y «Sin veredicto: las dos lecturas se sostienen» en lugar de veredicto; «Decidido: bugs» (2 a 8); y «Decidido: contratos» (9 a 11). Renumeró los puntos y corrigió la referencia cruzada del punto 11, que ahora apunta al 5.
