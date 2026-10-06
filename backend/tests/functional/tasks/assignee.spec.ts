import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: responsable identificable, la tarea no
 * filtra datos de cuenta, y responsable sin nombre.
 *
 * Cada scenario se comprueba por las dos vías por las que se obtiene una tarea:
 * suelta (`GET /tasks/:id`) y dentro de la lista (`GET /tasks`).
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const hoy = '2026-10-07'

  async function sesion(client: any, fullName: string | null, email: string) {
    const user = await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  async function assigneeSuelto(client: any, token: string, task: Task) {
    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    return response.body().data.assignee
  }

  async function assigneeEnLista(client: any, token: string, task: Task) {
    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    return response.body().data.find((t: { id: number }) => t.id === task.id).assignee
  }

  test('el assignee trae el nombre y las iniciales del responsable', async ({ client, assert }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const task = await Task.create({ title: 'Escribir', status: 'pending', assigneeId: user.id })

    for (const assignee of [
      await assigneeSuelto(client, token, task),
      await assigneeEnLista(client, token, task),
    ]) {
      assert.equal(assignee.fullName, 'Ada Lovelace')
      assert.equal(assignee.initials, 'AL')
    }
  })

  test('el assignee no incluye el email ni datos de acceso de la cuenta', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const task = await Task.create({ title: 'Escribir', status: 'pending', assigneeId: user.id })

    for (const assignee of [
      await assigneeSuelto(client, token, task),
      await assigneeEnLista(client, token, task),
    ]) {
      // Se busca el valor, no solo la clave: un email bajo otro nombre de campo
      // seguiría siendo la fuga que el scenario prohíbe.
      const serialized = JSON.stringify(assignee)
      assert.notProperty(assignee, 'email')
      assert.notInclude(serialized, 'ada@example.com')
      assert.notInclude(serialized, 'password')
      assert.notInclude(serialized, 'secreto123')
    }
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, null, 'sin-nombre@example.com')
    const task = await Task.create({ title: 'Escribir', status: 'pending', assigneeId: user.id })

    for (const assignee of [
      await assigneeSuelto(client, token, task),
      await assigneeEnLista(client, token, task),
    ]) {
      assert.isNull(assignee.fullName)
      assert.isString(assignee.initials)
      assert.isNotEmpty(assignee.initials)
    }
  })
})
