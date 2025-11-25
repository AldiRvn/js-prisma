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