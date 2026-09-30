# PARTE A: Spec de Cuentas y acceso

## Purpose

Permitir que una persona cree una cuenta en FlowSync, entre con ella, mantenga la sesión abierta entre visitas, consulte su perfil y cierre la sesión, de forma que solo quien se ha identificado accede a las pantallas privadas.

## Requirements

### Requirement: Registro de cuenta por API

El sistema SHALL aceptar `POST /api/v1/auth/signup` con un cuerpo JSON con las claves `fullName`, `email`, `password` y `passwordConfirmation`, crear la cuenta y devolver, en la misma respuesta, los datos públicos del usuario y un token de acceso ya utilizable.

#### Scenario: Registro correcto

- **WHEN** se envía un `fullName` de texto, un `email` válido no registrado, una `password` de entre 8 y 32 caracteres y una `passwordConfirmation` idéntica
- **THEN** la respuesta es `200` con cuerpo `{ "data": { "user": {...}, "token": "oat_..." } }`, donde `user` contiene exactamente `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y nunca la contraseña

#### Scenario: Nombre nulo o vacío

- **WHEN** `fullName` se envía como `null` o como cadena vacía, y el resto de campos son válidos
- **THEN** la cuenta se crea igualmente y el usuario devuelto tiene `fullName: null`

#### Scenario: Falta la clave del nombre

- **WHEN** el cuerpo no incluye la clave `fullName` en absoluto
- **THEN** la respuesta es `422` con un error de regla `required` sobre el campo `fullName`, aunque el nombre sea opcional

#### Scenario: Email ya registrado

- **WHEN** el `email` coincide exactamente con el de una cuenta existente
- **THEN** la respuesta es `422` con un error de regla `database.unique` sobre el campo `email` y no se crea ninguna cuenta

#### Scenario: El email distingue mayúsculas

- **WHEN** se registra un `email` que solo difiere de uno existente en mayúsculas y minúsculas
- **THEN** se crea una cuenta nueva e independiente, con el email tal cual se envió

#### Scenario: Datos inválidos

- **WHEN** el `email` no tiene formato de email o supera 254 caracteres, o la `password` tiene menos de 8 o más de 32 caracteres, o `passwordConfirmation` no coincide con `password`, o falta algún campo
- **THEN** la respuesta es `422` con cuerpo `{ "errors": [...] }`, con una entrada por cada problema que incluye `message`, `rule` (`email`, `minLength`, `maxLength`, `sameAs`, `required`), `field` y, en las reglas de longitud, `meta` con el límite (`min` o `max`)

### Requirement: Inicio de sesión por API

El sistema SHALL aceptar `POST /api/v1/auth/login` con `email` y `password` y, si las credenciales son correctas, emitir un token de acceso nuevo.

#### Scenario: Credenciales correctas

- **WHEN** se envía el `email` exacto de una cuenta existente y su contraseña
- **THEN** la respuesta es `200` con cuerpo `{ "data": { "user": {...}, "token": "oat_..." } }`, con la misma forma de usuario que en el registro, y el token es distinto de cualquier otro emitido antes

#### Scenario: Credenciales incorrectas

- **WHEN** el `email` no pertenece a ninguna cuenta, o la contraseña no es la de esa cuenta
- **THEN** la respuesta es `400` con cuerpo `{ "errors": [{ "message": "Invalid user credentials" }] }`, idéntica en ambos casos, sin indicar qué dato ha fallado

#### Scenario: Petición mal formada

- **WHEN** falta el `email` o la `password`, alguno llega vacío, o el `email` no tiene formato de email
- **THEN** la respuesta es `422` con un error por campo afectado (`required` o `email`), sin llegar a comprobar las credenciales

### Requirement: Acceso autenticado con token

El sistema SHALL exigir la cabecera `Authorization: Bearer <token>` con un token vigente en las rutas bajo `/api/v1/account/`, y rechazar cualquier otra petición a ellas.

#### Scenario: Sin token o con token no válido

- **WHEN** se llama a `GET /api/v1/account/profile` o `POST /api/v1/account/logout` sin cabecera `Authorization`, con un token inventado o con un token ya revocado
- **THEN** la respuesta es `401` con cuerpo `{ "errors": [{ "message": "Unauthorized access" }] }`

#### Scenario: Varias sesiones simultáneas

- **WHEN** una misma cuenta ha iniciado sesión varias veces y tiene varios tokens emitidos
- **THEN** cada token funciona de forma independiente hasta que se revoque ese token concreto

### Requirement: Consulta del perfil por API

El sistema SHALL devolver en `GET /api/v1/account/profile` los datos públicos del usuario al que pertenece el token.

#### Scenario: Perfil con token válido

- **WHEN** se llama con un token vigente
- **THEN** la respuesta es `200` con cuerpo `{ "data": { "id", "fullName", "email", "createdAt", "updatedAt", "initials" } }` del dueño del token

### Requirement: Cálculo de las iniciales

El sistema SHALL incluir en cada usuario devuelto un campo `initials` en mayúsculas, derivado de su nombre o, si no tiene, de su email.

#### Scenario: Nombre de dos o más palabras

- **WHEN** el `fullName` tiene al menos dos palabras separadas por espacio, p. ej. `ana maria lopez`
- **THEN** `initials` es la primera letra de las dos primeras palabras, en mayúsculas: `AM`

#### Scenario: Nombre de una sola palabra

- **WHEN** el `fullName` es una sola palabra, p. ej. `Cher`
- **THEN** `initials` son sus dos primeras letras en mayúsculas: `CH`

#### Scenario: Sin nombre

- **WHEN** el `fullName` es `null`, p. ej. con email `juan.perez@example.com`
- **THEN** `initials` es la primera letra de la parte anterior a la `@` seguida de la primera letra del dominio, en mayúsculas: `JE`

### Requirement: Cierre de sesión por API

El sistema SHALL revocar, en `POST /api/v1/account/logout`, únicamente el token con el que se hace la petición.

#### Scenario: Logout con token válido

- **WHEN** se llama con un token vigente
- **THEN** la respuesta es `200` con cuerpo `{ "message": "Logged out successfully" }` (sin envoltorio `data`), y cualquier petición posterior con ese mismo token recibe `401`

#### Scenario: Otros tokens siguen vivos

- **WHEN** la cuenta tenía otros tokens emitidos además del usado para cerrar sesión
- **THEN** esos otros tokens siguen siendo válidos

### Requirement: Respuestas siempre en JSON

El sistema SHALL responder en JSON en todas las rutas de cuentas y acceso, también en los errores, con independencia de la cabecera `Accept` que envíe el cliente.

#### Scenario: Error sin pedir JSON

- **WHEN** se provoca un error de validación o de autenticación sin enviar `Accept: application/json`
- **THEN** la respuesta sigue siendo un cuerpo JSON `{ "errors": [...] }` con el código de estado correspondiente

### Requirement: Errores identificables por `rule` y `field`

El sistema SHALL identificar cada error de validación con `rule` y `field`, que son el contrato para los clientes; `message` es un texto informativo en inglés y los clientes no deben depender de él.

#### Scenario: Error de validación

- **WHEN** una petición de registro o de inicio de sesión falla la validación
- **THEN** cada entrada de `errors` trae `rule` y `field` estables, y la pantalla construye su mensaje en castellano a partir de ellos, sin usar `message`

#### Scenario: Error de credenciales o de autenticación

- **WHEN** falla el inicio de sesión por credenciales o una petición autenticada se rechaza
- **THEN** la entrada de `errors` solo trae `message`, sin `rule` ni `field`, y lo único que distingue un caso del otro es el código de estado (`400` o `401`)

### Requirement: Navegación según el estado de sesión

La aplicación web SHALL mostrar las pantallas de inicio de sesión (`/login`) y de registro (`/register`) solo a quien no tiene sesión, y la pantalla de perfil (`/profile`) solo a quien sí la tiene.

#### Scenario: Visitante sin sesión en una pantalla privada

- **WHEN** una persona sin sesión abre `/profile`
- **THEN** se la lleva a `/login`, sin que la visita a `/profile` quede en el historial

#### Scenario: Persona con sesión en login o registro

- **WHEN** una persona con sesión activa abre `/login` o `/register`
- **THEN** se la lleva a `/profile`

#### Scenario: Dirección desconocida

- **WHEN** alguien abre cualquier dirección que no sea `/login`, `/register` ni `/profile`
- **THEN** se le envía a `/profile`, y de ahí a `/login` si no tiene sesión

#### Scenario: Sesión aún comprobándose

- **WHEN** la aplicación arranca con una sesión guardada que todavía no ha verificado con el servidor
- **THEN** en lugar de cualquier pantalla se muestra un indicador de carga a pantalla completa (anunciado como «Cargando…»), sin redirigir hasta tener la respuesta

### Requirement: Persistencia y restauración de la sesión

La aplicación web SHALL recordar la sesión en el navegador tras registrarse o iniciar sesión, y al volver a cargarse SHALL validarla contra el servidor antes de darla por buena.

#### Scenario: Recarga con sesión válida

- **WHEN** una persona con sesión recarga la página o vuelve a abrir la aplicación en el mismo navegador
- **THEN** tras el indicador de carga sigue dentro, sin volver a introducir credenciales

#### Scenario: Sesión rechazada por el servidor

- **WHEN** la aplicación arranca con una sesión guardada que el servidor ya no reconoce
- **THEN** se olvida la sesión guardada y se muestra la pantalla de inicio de sesión con el aviso «Tu sesión ha caducado. Vuelve a iniciar sesión.»

#### Scenario: Servidor inaccesible al arrancar

- **WHEN** la aplicación arranca con una sesión guardada y no puede contactar con el servidor
- **THEN** se muestra la pantalla de inicio de sesión con el aviso «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.», pero la sesión guardada se conserva, de modo que al recargar con el servidor disponible la persona vuelve a entrar sin credenciales

#### Scenario: Error del servidor al arrancar

- **WHEN** la aplicación arranca con una sesión guardada y el servidor responde con un error interno
- **THEN** se muestra la pantalla de inicio de sesión con el aviso «Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.» y la sesión guardada se conserva

### Requirement: Pantalla de inicio de sesión

La aplicación web SHALL ofrecer en `/login`, bajo el nombre «FlowSync», un formulario «Inicia sesión» con los campos «Email» y «Contraseña», un botón «Entrar» y un enlace «Crea una» que lleva a `/register`.

#### Scenario: Inicio de sesión correcto

- **WHEN** la persona introduce el email y la contraseña de su cuenta y pulsa «Entrar»
- **THEN** el botón pasa a «Entrando…» y queda deshabilitado mientras dura la petición, y al completarse se la lleva a `/profile`

#### Scenario: Credenciales incorrectas

- **WHEN** el email no existe o la contraseña no corresponde
- **THEN** aparece sobre el formulario el aviso «El email o la contraseña no son correctos.» y el botón vuelve a estar disponible

#### Scenario: Campos vacíos o email sin formato

- **WHEN** la persona pulsa «Entrar» con algún campo vacío o con un email sin formato válido
- **THEN** bajo cada campo afectado aparece su error («Falta rellenar el email.», «Falta rellenar la contraseña.», «Introduce una dirección de email válida.») y el campo se marca como inválido; el navegador no bloquea el envío por su cuenta

#### Scenario: Aviso de sesión perdida

- **WHEN** la persona llega a esta pantalla porque su sesión guardada no se pudo restaurar
- **THEN** ve el motivo en el aviso superior; un intento fallido con aviso general lo sustituye mientras ese aviso está visible, pero el motivo vuelve a aparecer en cuanto un intento falla solo con errores de campo, y no desaparece hasta iniciar sesión con éxito

#### Scenario: Servidor inaccesible al enviar

- **WHEN** la persona pulsa «Entrar» y el servidor no responde
- **THEN** aparece el aviso «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»

### Requirement: Pantalla de registro

La aplicación web SHALL ofrecer en `/register`, bajo el nombre «FlowSync», un formulario «Crea tu cuenta» con los campos «Nombre completo (opcional)», «Email», «Contraseña» (con la pista «Entre 8 y 32 caracteres.») y «Repite la contraseña», un botón «Crear cuenta» y un enlace «Inicia sesión» que lleva a `/login`.

#### Scenario: Registro correcto

- **WHEN** la persona rellena los campos con datos válidos y pulsa «Crear cuenta»
- **THEN** el botón pasa a «Creando cuenta…» y queda deshabilitado mientras dura la petición, y al completarse queda con la sesión iniciada y se la lleva a `/profile`, sin pasar por el inicio de sesión

#### Scenario: Nombre en blanco

- **WHEN** la persona deja el nombre vacío o solo con espacios
- **THEN** la cuenta se crea sin nombre; si escribe un nombre, se guarda sin los espacios de los extremos

#### Scenario: Contraseñas distintas

- **WHEN** «Contraseña» y «Repite la contraseña» no coinciden y se pulsa «Crear cuenta»
- **THEN** aparece «Las contraseñas no coinciden.» bajo «Repite la contraseña» sin que se envíe nada al servidor

#### Scenario: Email ya registrado

- **WHEN** el email introducido ya pertenece a una cuenta
- **THEN** aparece bajo «Email» el error «Ese email ya está registrado. Inicia sesión en su lugar.»

#### Scenario: Longitudes fuera de rango o email sin formato

- **WHEN** la contraseña tiene menos de 8 o más de 32 caracteres, o el email no tiene formato válido o supera 254 caracteres
- **THEN** bajo cada campo afectado aparece su error (p. ej. «la contraseña debe tener al menos 8 caracteres.», «la contraseña no puede superar los 32 caracteres.», «Introduce una dirección de email válida.»), sustituyendo a la pista de longitud en el caso de la contraseña; si la repetición tiene la misma longitud, bajo «Repite la contraseña» aparece el error equivalente («la confirmación de la contraseña debe tener al menos 8 caracteres.», «la confirmación de la contraseña no puede superar los 32 caracteres.»)

#### Scenario: Error que no corresponde a ningún campo visible

- **WHEN** el servidor rechaza el registro con un error que no se puede colocar bajo ninguno de los campos de la pantalla, o con un error general
- **THEN** el mensaje aparece como aviso sobre el formulario, de modo que nunca se pierde

### Requirement: Pantalla de perfil

La aplicación web SHALL mostrar en `/profile` los datos de la persona con sesión: un avatar circular con sus iniciales, su nombre (o «Sin nombre» si no tiene), su email y la fecha de alta como «Miembro desde» en formato largo en castellano (p. ej. «30 de septiembre de 2026»).

#### Scenario: Perfil de una cuenta con nombre

- **WHEN** una persona con nombre «Ada Lovelace» abre su perfil
- **THEN** ve el avatar «AL», el nombre «Ada Lovelace», su email y la fecha en que creó la cuenta

#### Scenario: Perfil de una cuenta sin nombre

- **WHEN** una persona registrada sin nombre abre su perfil
- **THEN** ve «Sin nombre» en lugar del nombre y el avatar con las iniciales derivadas de su email

### Requirement: Cierre de sesión desde la pantalla

La aplicación web SHALL ofrecer en el perfil un botón «Cerrar sesión» que termina la sesión en el navegador siempre, y la revoca en el servidor cuando es posible.

#### Scenario: Cerrar sesión

- **WHEN** la persona pulsa «Cerrar sesión»
- **THEN** se la lleva a `/login` de inmediato y sin ningún aviso, y al recargar la página sigue sin sesión

#### Scenario: Cerrar sesión con el servidor inaccesible

- **WHEN** la persona pulsa «Cerrar sesión» y el servidor no responde o ya no reconoce la sesión
- **THEN** la sesión se cierra igualmente en el navegador y se la lleva a `/login` sin mostrar ningún error

---

## PARTE B: las 3 listas

### 1. Requisitos escritos y comprobados

- Requisitos escritos por el agente: 14
- Requisitos comprobados por el agente contra el código: 14
- Requisitos comprobados por mí abriendo el código: No revisados manualmente por desconocer el código de las tecnologías de backend y frontend

### 2. Incoherencias aparecidas al escribirla

- El registro rechaza un email ya existente, pero acepta el mismo email con otras mayúsculas como cuenta nueva (Scenario: El email distingue mayúsculas).
- Toda respuesta de éxito va envuelta en `data`, salvo la del logout, que devuelve `{ "message": ... }` sin envoltorio (Requirement: Cierre de sesión por API).
- El nombre es opcional, pero omitir la clave `fullName` da `422 required`; solo se acepta enviarla como `null` o vacía (Requirement: Registro de cuenta por API, Scenario: Falta la clave del nombre).
- `createdAt` y `updatedAt` salen con milisegundos en la respuesta del registro (`.596`) y truncados a `.000` en login y perfil para el mismo usuario (Requirement: Registro de cuenta por API frente a Consulta del perfil por API).
- El aviso dice que la sesión «ha caducado», pero los tokens no caducan por tiempo; solo dejan de valer si se revocan (Scenario: Sesión rechazada por el servidor).
- Las iniciales con nombre de una palabra son sus dos primeras letras, pero sin nombre se toman del usuario y del dominio del email, no de las dos primeras letras del email (Requirement: Cálculo de las iniciales, Scenario: Sin nombre).
- En pantalla, todo `400` se traduce como «El email o la contraseña no son correctos.» y todo `401` como «Tu sesión ha caducado…», con independencia de qué petición lo produzca (Requirement: Pantalla de inicio de sesión y Persistencia y restauración de la sesión).
- Los mensajes de error de pantalla empiezan en mayúscula, salvo los de longitud: «la contraseña debe tener al menos 8 caracteres.» (Requirement: Pantalla de registro).
- La pantalla de login solo se muestra a quien no tiene sesión, salvo cuando el servidor está caído al arrancar: se muestra aunque la sesión sigue guardada y vuelve sola al recargar (Requirement: Navegación según el estado de sesión frente a Scenario: Servidor inaccesible al arrancar).
- Cada problema de un formulario da un único error bajo su campo, salvo la contraseña corta o larga, que da el error dos veces: bajo «Contraseña» y bajo «Repite la contraseña» (Requirement: Pantalla de registro, Scenario: Longitudes fuera de rango o email sin formato).
- El aviso superior del login refleja el último intento, salvo el de sesión perdida, que vuelve a salir tras un intento fallido solo con errores de campo aunque antes se hubiera mostrado otro aviso (Requirement: Pantalla de inicio de sesión, Scenario: Aviso de sesión perdida).
- Los botones de login y registro muestran que están trabajando («Entrando…», «Creando cuenta…»), pero el de cerrar sesión no, porque la pantalla cambia antes de que se vea (Requirement: Cierre de sesión desde la pantalla, Scenario: Cerrar sesión).

### 3. Bug o contrato

Prácticamente todas las incoherencias son bugs, salvo la del nombre opcional, que es un contrato.
Sólo hay una incoherencia que no sé diferenciar si es contrato o bug, de hecho creo que son las dos: la del servidor inaccesible al arrancar, que muestra el login aunque la sesión sigue guardada.

Aquí tienes mi lista de veredictos:

**1. El email distingue mayúsculas**
- Veredicto: bug. Los buzones de correo no distinguen mayúsculas, y ese es el comportamiento que se debería modelar. Con lo que hay ahora sí se distinguen, y además la pantalla no avisa de ello.

**2. El logout responde sin envoltorio `data`**
- Veredicto: bug no grave. Todas las respuestas van envueltas menos esta, así que por coherencia debería envolverse. No es bloqueante ahora mismo, porque la pantalla ignora el cuerpo de la respuesta.

**3. La clave `fullName` es obligatoria aunque el nombre sea opcional**
- Veredicto: contrato. La API admite `null` pero pide que la clave esté, y el cliente la envía siempre, con un comentario que lo explica. Si un día se permite omitirla, basta con aceptar su ausencia en la API, que es un cambio compatible con los clientes actuales.

**4. Con el servidor inaccesible al arrancar se muestra el login y se conserva la sesión**
- Veredicto: contrato y bug. Conservar el token es contrato, porque el propio código deja escrita esa intención. Mostrar el login con la sesión guardada es bug, por el token huérfano y porque la persona cree que está fuera.

**5. Las iniciales de una cuenta sin nombre salen del usuario y del dominio del email**
- Veredicto: bug. Un email siempre se parte en dos por la `@`, así que nunca se aplica la regla de las dos primeras letras, y sacar la segunda inicial del dominio no tiene sentido.

**6. La pantalla traduce cualquier `400` y `401` con el mismo mensaje**
- Veredicto: bug. El mensaje debería depender de la petición que falla, no solo del código de estado. Además, «caducado» no es verdad, porque los tokens no caducan.

**7. Los mensajes de longitud empiezan en minúscula**
- Veredicto: bug. Deberían empezar en mayúscula; la minúscula es un efecto secundario de reutilizar la etiqueta del campo.

**8. El error de longitud de la contraseña sale dos veces**
- Veredicto: bug leve. La repetición solo debería comprobar que coincide con la contraseña; pedirle también la longitud no aporta nada y duplica el mensaje.

**9. El aviso de sesión perdida vuelve a aparecer en intentos posteriores**
- Veredicto: bug leve. El aviso sirve para que nadie llegue al login sin saber por qué, y eso ya se cumple al llegar. Que reaparezca después confunde; lo razonable sería borrarlo con el primer intento de entrar.

**10. «Cerrando sesión…» nunca llega a verse**
- Veredicto: contrato. El código deja escrito que la sesión se cierra en el navegador pase lo que pase, sin esperar al servidor, así que el cierre inmediato es lo buscado. Solo sobra un texto que nunca se muestra, y eso no se nota desde fuera.
