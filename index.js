import express from "express"
import bodyParser from "body-parser"
//? Karena mode JS, pastikan prisma/schema.prisma menggunakan provider prisma-client-js
import { PrismaClient } from "./generated/prisma/client.js"

const prisma = new PrismaClient({
    log: ["query"]
})

const app = express()
app.use(bodyParser.json())


/**
 * @openapi
 * /:
 *   get:
 *     summary: Check Health
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/', (req, res) => {
    res.send('OK')
})

/**
 * @openapi
 * /articles:
 *   post:
 *     tags: [articles]
 *     summary: Create new article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Article"
 *     responses:
 *       201:
 *         description: Created
 */
app.post('/articles', async (req, res) => {
    delete req.body.id
    await prisma.article.create({
        data: req.body
    })
    res.status(201).json({ success: true })
})

/**
 * @openapi
 * /articles/{id}:
 *   get:
 *     tags: [articles]
 *     summary: Get Articles
 *     parameters:
 *      - name: id
 *        in: path
 *        required: false
 *     responses:
 *       200:
 *         description: []
 */
app.get('/articles/:id', async (req, res) => {
    let resp = {}
    const id = req.params.id
    console.log(id);
    if (id !== "{id}") { //? Terjadi ketika param path id tidak di isi dan tidak required
        //? 1. data by id
        resp = await prisma.article.findFirst({
            where: { id: req.params.id }
        })
    } else {
        //? 2. data by non id field
        resp = await prisma.article.findMany({
            where: { state: 'DRAFT' }
        })
    }
    res.json(resp)
})

/**
 * @openapi
 * /articles/{id}:
 *   put:
 *     tags: [articles]
 *     summary: Update article
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Article"
 *     responses:
 *       200:
 *         description: Updated
 */
app.put('/articles/:id', async (req, res) => {
    delete req.body.id
    const id = req.params.id;
    const data = await prisma.article.update({
        where: { id: id },
        data: req.body
    })
    res.status(200).json(data)
})

/**
 * @openapi
 * /articles/{id}:
 *   delete:
 *     tags: [articles]
 *     summary: Delete article
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
app.delete('/articles/:id', async (req, res) => {
    const data = await prisma.article.delete({
        where: { id: req.params.id }
    })
    res.status(200).json(data)

    //! multi delete syntax, count = total deleted data
    // const count = prisma.article.deleteMany({where:{status:'archive'}})
})

// Swagger UI
import setupSwagger from './swagger.js'
if (process.env.NODE_ENV !== "production") {
    setupSwagger(app);
}

const port = process.env.APP_PORT
app.listen(port, () => {
    console.log(`http://0.0.0.0:${port}`);
    console.log(`http://0.0.0.0:${port}/docs`);
})