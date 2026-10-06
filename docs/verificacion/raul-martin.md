# Parte A: Matriz de trazabilidad

Requisito «Lo que cada tarea muestra de su responsable» de `openspec/specs/tasks/spec.md`. 

Tests añadidos en
`backend/tests/functional/tasks/assignee.spec.ts` (grupo `Tasks | responsable`).

Scenarios en el requisito: 3 · Cubiertos: 3

| Scenario | Test que lo cubre | Estado   | Qué te faltó                  |
|---|---|----------|-------------------------------|
| El `assignee` de una tarea cuyo responsable es «Ada Lovelace» trae ese nombre y sus iniciales | `el assignee trae el nombre y las iniciales del responsable` | Cubierto | —                             |
| El `assignee` de cualquier tarea, suelta o en la lista, no trae el email ni datos de acceso | `el assignee no incluye el email ni datos de acceso de la cuenta` | No lo sé | El test está en rojo, no pasa |
| Si el responsable se registró sin nombre, el `assignee` trae nombre nulo y sigue trayendo iniciales | `un responsable sin nombre llega con nombre nulo y con iniciales` | Cubierto | —                             |

## Notas

- **Punto de partida:** al empezar, los tres scenarios estaban **No cubierto**: en `backend/tests/`
  no había ningún test que tocara `tasks` ni `assignee` (solo existían los de `auth`). Los tres
  tests de la tabla se escribieron en esta tarea, uno por scenario.
- **Cubierto no es lo mismo que en verde.** El test del scenario 2 **falla**:
  `GET /api/v1/tasks` devuelve el `assignee` con `email`, `createdAt` y `updatedAt`, porque
  `TaskTransformer` lo serializa con `UserTransformer` en vez de con `TaskAssigneeTransformer`
  (el que sí usa el detalle `GET /api/v1/tasks/:id`, que pasa). Afecta también a la respuesta
  de `POST /api/v1/tasks`, que usa el mismo transformer. No se ha tocado el código ni el test.
- Resultado de `node ace test functional --files=tasks/assignee`: 2 passed, 1 failed (3).
- Cada test comprueba las dos vías de obtener una tarea: suelta (`GET /tasks/:id`) y en la
  lista (`GET /tasks`).
- El scenario 3 no fija el valor de las iniciales (solo que «siguen llegando»), así que el test
  afirma que son un texto no vacío, no un valor concreto.

## Parte B: las tres líneas

1. Creídos cubiertos antes de mirar: 2 de 3 · Cubiertos de verdad: 0 de 3.
2. Scenario 2: No había test y escribió uno la IA por mi pero fallaba. La regla prohíbe «cualquier otro dato de la cuenta», pero el scenario solo nombra el email y los «datos de acceso», así que no sé si `createdAt`/`updatedAt` que llegan en el `assignee` es un hueco del test o una regla que la spec no escribe.
3. Scenario 3: no fija qué iniciales esperar de una cuenta sin nombre; decidí afirmar solo que llegan como texto no vacío, sin exigir que salgan del email (`SE`).
