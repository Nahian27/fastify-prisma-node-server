import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = fastify()

interface ITodo {
    title: string,
    subtitle: string
}
interface ITodoByIDParam {
    slug: number
}

app.get('/', async (req, res) => {
    res.send({ msg: 'OK' })
})
app.get('/todos', async (req, res) => {
    const todos = await prisma.todos.findMany()
    res.send(todos)
})
app.post<{ Body: ITodo }>('/todos', async (req, res) => {
    const { title, subtitle } = req.body
    const todo = await prisma.todos.create({ data: { title, subtitle } })
    res.status(200).send({ message: "Saved" })
})
app.put<{ Body: ITodo, Params: ITodoByIDParam }>('/todos/:slug', async (req, res) => {
    const { title, subtitle } = req.body
    const { slug } = req.params
    const todo = await prisma.todos.update({ where: { id: Number(slug) }, data: { title, subtitle } })
    res.status(200).send({ message: "Updated" })
})
app.delete<{ Params: ITodoByIDParam }>('/todos/:slug', async (req, res) => {
    const { slug } = req.params
    const todo = await prisma.todos.delete({ where: { id: Number(slug) } })
    res.status(200).send({ message: "Deleted" })
})

app.listen({ port: 3000 })