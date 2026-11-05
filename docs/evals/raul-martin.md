# Evals — Raúl Martín

Measurement of one process rule from the project's `CLAUDE.md`: does the agent keep the
capability README up to date when it adds an endpoint?

## Part A — Measurement

### The rule

From the process rules section of `CLAUDE.md`:

> "Un cambio que toque rutas, controladores, validadores o transformers de una capability se
> cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día."

Only the **README** part of the rule is measured here.

### Prediction

Written on 2026-11-05, before the first attempt:

> **3 out of 5** attempts will leave `docs/capabilities/tasks/README.md` up to date.

### The task

Launched verbatim, in a new session each time, without reminding the agent of the rule:

```
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

### The two checks

Both checked by hand when the agent finishes, in this order:

1. **Control**: is the `DELETE` route declared in `backend/start/routes.ts`?
   If not, the agent did not do the work and the attempt **does not count**.
2. **Result**: does `docs/capabilities/tasks/README.md` mention the new endpoint?

Baseline on `s8/start` (commit `d977e7a`): neither file mentions `delete`, so any mention
after an attempt was added by the agent.

### Reset between attempts

Every attempt starts from the same place:

```bash
git checkout -f s8/start
git reset --hard upstream/s8/start
git clean -fd
git status -sb   # must print only the "## s8/start..." line
```

### Attempts

With the rule in `CLAUDE.md` (the measurement):

| # | Clean start | Control: `DELETE` route declared | Result: README mentions endpoint | Counted | Notes |
|---|---|---|---|---|---|
| 1 | Yes | Yes (`routes.ts:54`) | Yes | Yes | Branch `feat/delete-task`, commit `0d90e57`. README updated in 4 places: endpoints table, 204 note, business-rules table, `curl`. |
| 2 | Yes | Yes | Yes | Yes | Branch `feat/tasks-delete-endpoint`, commit `284bbe3`. Same path: tests, `openapi.json`, `.adonisjs/` and README in one commit. |
| 3 | Yes | Yes | Yes | Yes | Branch `feat/delete-task-endpoint`, commit `ddbdecb`. Hit the `openapi:generate` failure (jsonschema 1.5.0 on Node 24.21) and worked around it. |
| 4 | Yes | Yes | Yes | Yes | Branch `feat/tasks-destroy`, commit `c542a28`. 5 tests; `openapi.json` regenerated with an equivalent script. |
| 5 | Yes | Yes | Yes | Yes | Branch `feat/task-destroy`, commit `8d66bf3`. 6 tests; README covers the row, a deletion section, the empty 204 body and `curl`. |

**Total:** README up to date in **5 of 5** counted attempts (5 attempts run, 0 not counted).

Not counted: two launches of the task that the agent declined (one in the session that had
written this document and knew what was being measured; one on top of a branch that already had
the endpoint) and one interrupted before it did anything.

### Baseline without the rule

To check that the rule is what produces the behaviour, the README sentence was removed from
`CLAUDE.md` and the task was launched again. These runs are not part of the 5 above.

| # | Context | Control: `DELETE` route declared | Result: README mentions endpoint | Notes |
|---|---|---|---|---|
| B1 | Rule removed from `CLAUDE.md` only (uncommitted) | Yes | Yes | Branch `feat/delete-task-204`, commit `77433a0`. **Not isolated:** the rule still reached the agent through the `git diff` of `CLAUDE.md`, the root `README.md` (the exercise statement), `REVIEW.md`, and a paragraph in the capability README asking to keep it in sync. |
| B2 | Rule also removed from the root `README.md`, `REVIEW.md` and the capability README | Yes (`routes.ts:54`) | **No** | Commit `6843d5e` (not on any branch). Controller action with OpenAPI decorators, route, `.adonisjs/` regenerated, lint, typecheck and tests green. The capability README was not touched and still lists five operations. |

With the rule isolated out (B2), the agent did exactly what was asked and left the README stale.

## Part B — Three lines

1. **Prediction and result:** I predicted 3 out of 5. Result: **5 of 5** counted attempts. The
   isolated baseline without the rule left the README stale (0 of 1).
2. **What I would do with this number:** keep the rule as it is. With it the README was updated
   every time; without it, once nothing else in the repo repeated it, it was not. The rule is what
   produces the behaviour, and it is working, so there is nothing to fix.
3. **Something my measurement is not checking:** whether the README entry is *correct*, only that
   it mentions the endpoint; and the OpenAPI half of the same rule. The numbers are also small: 5
   runs with the rule and a single isolated run without it, all on one model.
