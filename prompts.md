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
Vas a trabajar sobre el requisito «Lo que cada tarea muestra de su responsable», que está en openspec/specs/tasks/spec.md. Trabaja solo ese requisito, no la capability entera. El primer objetivo es construir una matriz de trazabilidad: revisar, scenario a scenario, si cada uno tiene un test que lo cubre, y escribir los que falten. La matriz de trazabilidad debes escribirla en docs/verificacion/raul-martin.md. Los tests que escribas van en backend/tests/functional/tasks/, siguiendo el estilo de los que ya hay en backend/tests/functional/auth/. No toques nada fuera de backend/tests/. 

La matriz mapea, scenario a scenario, si el requisito está cubierto por los tests. El formato no es negociable: una fila por scenario y cuatro columnas. Encima, dos números: cuántos scenarios tiene el requisito y cuántos resultaron cubiertos — el primero se anota al empezar, el segundo al terminar.

1. El scenario, en una línea. Qué se espera y en qué situación. Si no cabe en una línea, es que estás juntando dos.
2. Qué test lo cubre, con el nombre exacto que aparece en la suite. Sin el nombre concreto, la columna va vacía: "seguro que algo lo cubre" no es una fila.
3. Cubierto · No cubierto · No lo sé. Los tres estados son válidos, y el tercero no es un fallo: es el resultado más informativo de los tres.
Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo.

Así queda la tabla. Los dos números van encima — el primero antes de empezar, el segundo al terminar:

Scenarios en el requisito: 4 · Cubiertos: ___

Scenario Test que lo cubre Estado Qué te faltó (ejemplo) La tarea muestra el nombre del responsable cuando tiene uno asignado show_assignee_name_when_present Cubierto — … … … …

⚠ El nombre de un test no es prueba de cobertura. Un test puede llamarse igual que el scenario y comprobar otra cosa, o solo la mitad. Para marcar cubierto hay que abrir el test y leer lo que afirma. Es la columna que más caro sale rellenar de memoria, y es justo la que esta tarea quiere que mires.
Vas a trabajar sobre el requisito «Lo que cada tarea muestra de su responsable», que está en openspec/specs/tasks/spec.md. Trabaja solo ese requisito, no la capability entera. El primer objetivo es construir una matriz de trazabilidad: revisar, scenario a scenario, si cada uno tiene un test que lo cubre, y escribir los que falten. La matriz de trazabilidad debes escribirla en docs/verificacion/raul-martin.md. Los tests que escribas van en backend/tests/functional/tasks/, siguiendo el estilo de los que ya hay en backend/tests/functional/auth/. No toques nada fuera de backend/tests/. 

La matriz mapea, scenario a scenario, si el requisito está cubierto por los tests. El formato no es negociable: una fila por scenario y cuatro columnas. Encima, dos números: cuántos scenarios tiene el requisito y cuántos resultaron cubiertos — el primero se anota al empezar, el segundo al terminar.

1. El scenario, en una línea. Qué se espera y en qué situación. Si no cabe en una línea, es que estás juntando dos.
2. Qué test lo cubre, con el nombre exacto que aparece en la suite. Sin el nombre concreto, la columna va vacía: "seguro que algo lo cubre" no es una fila.
3. Cubierto · No cubierto · No lo sé. Los tres estados son válidos, y el tercero no es un fallo: es el resultado más informativo de los tres.
Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo.

Así queda la tabla. Los dos números van encima — el primero antes de empezar, el segundo al terminar:

Scenarios en el requisito: 4 · Cubiertos: ___

Scenario Test que lo cubre Estado Qué te faltó (ejemplo) La tarea muestra el nombre del responsable cuando tiene uno asignado show_assignee_name_when_present Cubierto — … … … …

Una puntualización a tener en cuenta. El nombre de un test no es prueba de cobertura. Un test puede llamarse igual que el scenario y comprobar otra cosa, o solo la mitad. Para marcar cubierto hay que comprobar su contenido y leer lo que afirma. 

Por cada fila en No cubierto, escribe el test que falta — uno por scenario — siguiendo el estilo de los que ya existen en el proyecto. Sin tocar nada fuera de la carpeta de tests. Cuando los tengas, ejecútalos. Pase lo que pase, no arregles el código ni ajustes el test para que pase
```

**Qué salió:** el requisito tiene 3 scenarios (no 4 como en el ejemplo); ninguno tenía test. Escribí 3 tests en `backend/tests/functional/tasks/assignee.spec.ts` y la matriz en `docs/verificacion/raul-martin.md`. Resultado: 2 pasan, 1 falla — la lista `GET /tasks` expone el email del responsable (`TaskTransformer` usa `UserTransformer`). No se tocó el código.

## Prompt 2

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Añade en docs/verificacion/raul-martin.md la parte b: las 3 líneas. una línea cada uno, no más. 

1. Cuántos scenarios creías cubiertos antes de mirar, y cuántos lo estaban. El primer número se anota antes de lanzar el primer prompt — a ojo, sin abrir nada todavía. El segundo, al terminar. Los dos exactamente como quedaron, sin redondear ni explicar.

2. El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec. Indica cuál fue y qué te hizo dudar. Las dos opciones se confunden fácilmente: en un caso la regla existe pero nadie la comprobó; en el otro, la regla no está escrita en ninguna parte — la estabas definiendo tú.

3. Algo que el scenario no determinaba y tuviste que decidir al escribir el test. Un valor concreto, un límite, qué pasa cuando el dato viene vacío — ese tipo de decisiones. Casi ningún scenario determina su test del todo, y el hueco que cubriste sin notarlo es lo que más se parece a un defecto futuro.
```

**Qué salió:** añadida la parte b con las 3 líneas; la primera queda sin estimación previa porque no se anotó antes de abrir la spec.

## Prompt 3

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
ejecuta el adversarial-reviewer para comprobar si los tests realizados en backend/tests/tasks/assignee.spec.ts realmente cubren los escenarios del requirement "Requirement: Lo que cada tarea muestra de su responsable" de openspec/specs/tasks/spec.md. Dame hallazgos priorizados y que tengan evidencias: dime el archivo, línea y regla que se rompe.
```

**Qué salió:** el reviewer encontró que todos los escenarios no están probados del todo y los tests se quedan cortos con el del escenario 2 siendo el más débil. 

Alta                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                    
  1. El test del scenario 2 dejaría pasar datos de la cuenta que no son el email.                                                                                                                                                                                                                                   
  - Regla: openspec/specs/tasks/spec.md:99: «NO SHALL exponer junto a la tarea ningún otro dato de esa cuenta».                                                                                                                                                                                                     
  - Evidencia: assignee.spec.ts:72-75 solo comprueba que no aparezcan el email y la contraseña.                                                                                                                                                                                                                     
  - Qué falla: el listado también envía las fechas de alta y de modificación del responsable (createdAt y updatedAt). Si alguien quitara solo el email, el test pasaría a verde con esas fechas todavía expuestas.                                                                                                  
  - Qué falta: comprobar exactamente qué campos trae assignee.                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                    
  2. Dos de las vías que devuelven una tarea no tienen test, y también filtran los datos.                                                                                                                                                                                                                           
  - Regla: spec.md:108: «se obtiene cualquier tarea, suelta o dentro de la lista».                                                                                                                                                                                                                                  
  - Evidencia: tasks_controller.ts:80 (POST /tasks) y task_statuses_controller.ts:26 (PATCH /tasks/:id/status) usan TaskTransformer. Ese transformer incluye el email.                                                                                                                                              
  - Qué falla: el test solo prueba el detalle de una tarea y el listado. Si se arreglara solo el listado, el test quedaría en verde y esas dos respuestas seguirían enviando el email.                                                                                                                              
  - Además: la cabecera del test (assignee.spec.ts:12-13) dice que hay «dos vías» de obtener una tarea, y en realidad hay cuatro.                                                                                                                                                                                   

Media                                                                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                                                                    
  3. El test del scenario 1 no distingue al responsable de la persona que consulta.                                                                                                                                                                                                                                 
  - Regla: spec.md:104: «esos datos bastan para saber quién la lleva».                                                                                                                                                                                                                                              
  - Evidencia: en assignee.spec.ts:20-26 la cuenta que inicia sesión y el responsable son la misma.                                                                                                                                                                                                                 
  - Qué falla: si el código devolviera siempre la cuenta de quien consulta en vez del responsable, el test pasaría igual. Falta usar una segunda cuenta como responsable.                                                                                                                                           
                                                                                                                                                                                                                                                                                                                    
  4. El test del listado cae con un error confuso si la tarea no aparece.                                                                                                                                                                                                                                           
  - Evidencia: assignee.spec.ts:42 lee el assignee de lo que devuelve .find(...) sin comprobar antes que haya encontrado la tarea.                                                                                                                                                                                  
  - Qué falla: si la tarea no está en el listado, el test cae con un error de tipo que no apunta al scenario. Y el listado oculta por defecto las tareas hechas (tasks_controller.ts:37), así que basta con que cambie el filtro por defecto. 

Discutibles (el revisor las marcó como críticas)                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                    
  5. En el scenario 3 las iniciales salen del email y el test lo acepta.                                                                                                                                                                                                                                            
  - Evidencia: user.ts:12 calcula las iniciales a partir del email cuando no hay nombre. El test (assignee.spec.ts:92) solo pide que no estén vacías.                                                                                                                                                               
  - Por qué no es un hueco del test: la spec de auth lo exige así (openspec/specs/auth/spec.md:136: «calculadas a partir del nombre cuando lo hay y del email cuando no»).                                                                                                                                          
  - El problema real: las dos specs chocan. Las iniciales de una cuenta sin nombre revelan dos letras del email, que el requisito de tasks dice que no se debe exponer, y además la spec de tasks pide representarlo «sin recurrir a su email». Es el mismo caso de «falta una regla en la spec» de la línea 2 de la
    parte b.                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                    
  6. Ningún test comprueba que una cuenta sin nombre no filtre el email.                                                                                                                                                                                                                                            
  - El test del scenario 2 siempre usa una cuenta con nombre, así que nunca prueba ese caso. Se resuelve con la misma decisión de la spec que el 5.                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                    
Baja                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                    
  - La fecha fija de assignee.spec.ts:18 solo es ruido: ninguna comprobación mira si la tarea está vencida.                                                                                                                                                                                                         
  - Los tests tratan el cliente HTTP como any, y con eso pierden el tipado de las rutas.                                                                                                                                                                                                                            
  - El revisor plantea una duda sobre si la transacción por test aísla bien los datos, pero no la pudo demostrar, así que la descarto.

