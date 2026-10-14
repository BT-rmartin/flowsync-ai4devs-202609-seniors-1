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
Abre el archivo de instrucciones del agente CLAUDE.md y localiza las reglas de proceso. Contrasta las reglas con los últimos 15 commits del repositorio y el estado actual de los archivos del proyecto. Con la información debes crear una tabla en  la sección A2 del archivo docs/auditoria/raul-martin.md. Usa una fila por regla y completa estas cinco columnas: 

1) Qué pide la regla. Resúmela en una frase y con tus propias palabras. Si necesitas varias frases, puede que estés mezclando más de una regla.
2) Qué se revisó para comprobarla. Indica el comando ejecutado o el archivo consultado. Sin esta información no hay forma de saber en qué se apoya el veredicto.
3) Veredicto. Solo puede ser se cumple, no se cumple o no se puede comprobar con la información disponible. Este último caso también es un resultado válido. Significa que la regla no deja suficiente evidencia para verificarla.
4) Evidencia. Escríbela en una línea. Si la regla no se cumple, indica dónde se incumple. Si no se puede comprobar, explica qué información falta.
5) Qué harías con ella. Elige una opción: dejarla, borrarla o convertirla en una comprobación automática.

Esto es una auditoría, no debes modificar ningún archivo excepto docs/auditoria/raul-martin.md.
```

**Qué salió:** Tabla A2 con 6 filas (partió en dos la regla de ramas, cosa que no pedí): 1 «se cumple» (OpenAPI + README en el mismo commit) y 5 «no se puede comprobar» por falta de rastro en git, PRs o sesiones.

## Prompt 2

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
No hagas el split de la primera regla en 2. Mezcla las 2 primeras filas para cumplir la espeficiación de una tabla con una fila por regla
```

**Qué salió:** Filas 1 y 2 fusionadas en una (rama por unidad + no commitear en `main`/`sN/*`, «no se puede comprobar»); la tabla queda en 5 filas, una por regla.

## Prompt 3

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Añade en el documento docs/auditoria/raul-martin.md tras la seccion A2 una nueva sección "Parte B: las tres líneas", al mismo nivel que la Parte A. 
Añade tu propuesta para estas tres líneas:
1) La regla en la que más te equivocaste. Compara tu expectativa inicial con el veredicto final y elige la que más se alejó de lo que pensabas. Si acertaste todas, indícalo y explica en una frase en qué te apoyaste para acertar. Si solo era una impresión, también conviene dejarlo por escrito.
2) Una regla que no se puede comprobar con la información disponible. Explica en una frase qué tendría que cambiar para poder verificarla. Puede ser reformularla, convertirla en una comprobación automática o aceptar que no deja una evidencia clara.
3) La regla que eliminarías y por qué. Hay dos casos habituales: una regla que ya garantiza otra herramienta o una que nadie sigue y que tampoco aporta valor. Elige una y explica a cuál de los dos casos pertenece.
```

**Qué salió:** Sección «Parte B» añadida con la propuesta: la regla en la que más fallé es la 2 (esperaba «Sí», sale «no se puede comprobar»); la que no se puede comprobar es la 4 (el revisor debería comentar en el PR); y eliminaría la 5 (no deja rastro y no aporta valor).

## Prompt 4

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
analizando manualmente la historia de commit y la estructura de ramas veo que no hay ramas feat/<slug> si no s1/start and s1/end para cada ejercicio. Tampoco hay rama main. Así que es muy difícil que siga esa regla, aunque cuando la leí tenía sentido aunque ya preveía que era difícil de seguir porque esta regla no evita que hagas commit y push a una rama sN/*, dependes de lo que interprete el LLM. Sí que veo que todos commits de una misma unidad de trabajo están realizados la misma fecha y hora y el último de cada una tiene un formato "docs(sX): ...". Podría indicar que se trajeron de una rama a ésta con rebase o cherry-pick. El autor Earvin Saúl Pérez Ramos <earhackerdem@gmail.com> difiere del comiteador que es LIDR Academy <direccion.ai4devs@lidr.co>. Estoy de acuerdo que si queremos asegurar sobre todo que no se comitee a main (que no existe) o sN/* tendría que ser un hook o incluso se puede configurar en Github como protected branches o como que sólo ciertos usuarios pueden hacer push en ellas.
```

**Qué salió:** Verificó mi análisis con git (main existe pero es solo un «Initial commit» desconectado; los commits de la unidad van en una ventana de ~25 min, no a la misma hora; el `docs(sN)` marca la frontera de cada ejercicio). Actualizó la evidencia y la acción de la fila 1 (añade la protección de ramas en GitHub); el veredicto sigue en «no se puede comprobar».

## Prompt 5

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Respecto a regla 2 no podemos asegurar que se haga commit con cada petición pero basado en la historia de commits sí vemos que hay varios commits para cada sN y todos siguen el formato tipo(scope): ... como pide la skill. No hay evidencia de la petición y no podemos saber si fue un solo commit o se hizo por ejemplo squash de varios o si el commit se hizo manualment o con la skill de commit. Aquí también dependemos actualmente de la interprestación del LLM así que no podemos garantizar que con cada petición se usó la skill commit. Tampoco es fácil determinar cuando la petición está cerrada, porque quizá iteras sobre la misma en conversación con el agente hasta obtener lo que buscas o haces cambios manuales. Para forzarlo debería ser un hook en base a algun trigger que no sea en cuanto acaba la petición al agentes, si no cuando tú decidas que ese apartado o feature está hecha. No es validar el formato es realizar un commit a través de la skill con lo que se cumplirá el formato.
```

**Qué salió:** Actualizó la fila 2: la evidencia recoge que no se distingue un commit único de un squash ni `/commit` de un commit manual, y que «cerrar la petición» no está definido; la acción pasa de validar el formato con `commit-msg` a un hook que lance `/commit` cuando el usuario da la feature por terminada. El veredicto sigue en «no se puede comprobar».

## Prompt 6

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Sí, que /commit añada al mensaje una línea al final del tipo Request: …. Así el historial mostraría la petición y que el commit se hizo con la skill.
```

**Qué salió:** Añadió a la acción de la fila 2 que `/commit` ponga al final del mensaje una línea `Request: …`. No tocó la skill, porque la auditoría solo modifica el documento.

## Prompt 7

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
sobre la regla 3, creo que están mal los commits referenciados. El commit que veo que hace cambios es cbe9617f. Actualiza el README de la capability y el openapi pero no el .adonisjs. Por otra parte el commit ea5db1f0 actualiza  el .adonisjs y el openapi pero no el README  de la capability. La regla dice "Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día. El documento se construye en cada petición y no hay fichero que generar, así que lo que se commitea es el diff regenerado de .adonisjs/; el README es docs/capabilities/<nombre>/README.md.". No soy experto en el tema para saber si debería cambiar lo que detecto que no ha cambiado. Compruebalo y valida si se está cumpliendo o no la regla, yo creo que no. En cualquier caso, estoy de acuerdo que es algo principal ya que toca la especificación viva y que puede afectar de formar importante al equipo así que mejor hacer que sea un CI. En qué haría con ella te falta decir que actualice las 3 cosas: ya ponía README de capability y .adonisjs, pero faltaba openapi.
```

**Qué salió:** Regeneró `.adonisjs/` sobre una copia de `cbe9617` y el diff salió vacío, así que no tenía que cambiar; `ea5db1f` es anterior a la regla y solo añade las rutas de la documentación. El veredicto sigue en «se cumple» (yo creía que no). Actualizó la fila 3: qué se revisó, la evidencia y la acción del CI con las tres cosas (README, OpenAPI y `.adonisjs/`).

## Prompt 8

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Respecto a regla 4 no tenemos evidencias de PRs, y el comando el gh pr list -R BT-rmartin/… --state algh pr list -R BT-rmartin/… --state all no tiene sentido, pues yo seguro que no las generé. Además actualmente el upstream da 404 y no está disponible así que no lo podemos ver. Respecto al adversarial reviewer sí hay un commit 8f9e7159 que lo modifica pero tampoco podemos tener evidencias de que se ejecutó. No tengo claro cómo hacer que se cumpla. Habría que tener algún trigger que marque que estás listo para acabar todo unidad de trabajo. Creo que sería más una skill a lanzar manualmente, o un hook con un trigger manual, que entonces genere la PR con reusmen de todo su contenido en el cuerpo. Creo que además está mal redactado y deberíamos ejecutar el adversarial antes de crear la PR para solucionar lo que nos diga antes de hacer la PR. Otra opción sería hacer el adversarial ya sobre la PR con lo que estaría en el CI y así ya aseguramos que sea al final, pero malgastamos recursos ya que podría y debería lanzarse primero en local. ¿Cuál crees que es mejor approach? ¿Qué posibles hooks hay?
```

**Qué salió:** Corrigió en la fila 4 qué se revisó (quita el `gh pr list` del fork, añade `8f9e715` y la definición del agente) y la evidencia: el `adversarial-reviewer` solo tiene `Read, Grep, Glob`, así que no puede revisar un PR. Recomendó una skill manual de cierre que pase el revisor en local, corrija y cree el PR con el resultado en el cuerpo, más un hook `PreToolUse` que bloquee `gh pr create` sin esa revisión. No cambió la acción de la fila hasta que yo decida.

## Prompt 9

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
sí añade esa propuesta. Si entiendo bien sería una skill /cerrar-unidad que pase adversarial reviewer, corrija cambios y repita revision. Pongamos máximo 3 iteraciones. Luego ya hacer el PR con resumen completo y detalles de la(s) revision(es) adversarial(es). Además un hook PreToolUse para esa ghpr create que asegure que hay info de las revisiones adversariales en el body. Por último añade CI que compruebe el cuerpo de la PR y que en el body tenga info de revisiones adversariales
```

**Qué salió:** La acción de la fila 4 pasa de «Dejarla» a comprobación automática, con la regla reformulada para revisar antes del PR: skill `/cerrar-unidad` (revisión, corrección y nueva revisión, máximo 3 iteraciones, y después PR con resumen y detalle de las revisiones), hook `PreToolUse` sobre `gh pr create` y CI que comprueba el cuerpo del PR.

## Prompt 10

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
por último la regla 5 no la podemos comprobar porque ni tenemos sesiones ni PRs. Tampoco está del todo bien formulada, pero entiendo que se refiere al chat con el agente. Eso como bien dice no está en el repo porque las conversaciones con el agente no van allí. Además sería repetir lo que dice el body de la PR que sí es persistente. Veo bien dejarla para evitar tokens de salida, pero sería parte de la skill que decimos en la regla 4. ¿O ves una alternativa mejor? Allí dependería de lo que interprete el LLM pero no es algo crítico, si repite en el chat lo mismo lo único que provoca es gasto de tokens.
```

**Qué salió:** Coincidió en meterla en `/cerrar-unidad` sin buscar otra alternativa. Actualizó la fila 5: reformula qué pide (el chat con el agente), añade la falta de PRs y que solo cuesta tokens, y como acción la borra de `CLAUDE.md` para que sea el último paso de la skill. Ajustó la línea 3 de la Parte B para que cuadre.

## Prompt 11

**Modelo:** Opus 5.5 (1M context)
**Herramienta:** Claude Code

```
Cambia la línea 2 con el approach actual de la tabla. Comprueba las 3 lineas de la parte B si están alineadas con la tabla
```

**Qué salió:** Reescribió la línea 2 con el enfoque de la fila 4 (revisión antes del PR, `/cerrar-unidad`, hook y CI, y el PR como evidencia). La línea 1 se ajustó a la evidencia de la fila 2 (squash y commit manual) y la línea 3 ya cuadraba con la fila 5.
