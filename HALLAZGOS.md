# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- Saltó «correo de una persona», y la evidencia no viene solo de la parte B: en la parte C el agente no se negó, escribió el dato y fue el hook quien paró el commit, dejando `- 2026-11-12T00:26:52Z BLOQUEADO regla: correo de una persona; archivo: docs/capabilities/tasks/README.md`

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- La base de datos local `backend/tmp/db.sqlite3` (ignorada por Git, con un correo que no es de ejemplo y hashes de contraseñas y tokens) entra con un `git add -f` sin que el hook diga nada: es binaria, `git diff` no muestra líneas añadidas y el hook descarta los binarios, así que sus reglas, que solo leen texto, nunca llegan a ver los datos (comprobado en un repositorio de prueba: código 0 y sin línea en el registro).

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- Dudé entre el "sin cambiar ningún dato" del prompt y la regla del `CLAUDE.md` (sustituirlo), y elegí la regla; no pude ver el código 2 del bloqueo real, solo deducirlo de que el comando no se ejecutó; y descubrí que con `git add` y `git commit` en el mismo comando el hook revisa el índice de antes de ese `git add`, lo que bloqueó una versión ya corregida (un falso positivo: como revisa índice y disco a la vez, ese desfase no deja pasar nada).
