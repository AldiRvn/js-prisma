import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const prismaSchema = JSON.parse(fs.readFileSync("./prisma/json-schema/json-schema.json", "utf8"));

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Article",
            version: "1.0.0",
        },
        components: {
            schemas: prismaSchema.definitions
        }
    },
    apis: ["./index.js"], // komentar route
};

const specs = swaggerJsdoc(options);

export default function setupSwagger(app) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}
