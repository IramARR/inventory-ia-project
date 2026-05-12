import Fastify from "fastify";
import cors from "@fastify/cors"
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { createProductSchema, updateProductSchema } from "./schemas/product.schemas";

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
    origin: true // Esto permite peticiones desde cualquier origen
})

// Ruta para probar que el servidor sirve
fastify.get('/', async () => {
    return { message: 'Hello, world!' };
});

// Ruta para obtener todos los productos
fastify.get('/productos', async () => {
    return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' } // Ordenar por fecha de creación, el más reciente primero
    });
});

// Ruta para crear un producto
fastify.post('/productos', async (request, reply) => {
    try{
        const validatedData = createProductSchema.parse(request.body);

        const producto = await prisma.product.create({
            data: validatedData,
        });

        return { success: true, producto };
    }catch(error){
        if(error instanceof z.ZodError){
            return reply.status(400).send({
                success: false,
                errors: error.issues.map(e => ({
                    campo: e.path[0],
                    mensaje: e.message
                }))
            });
        }

        return reply.status(500).send({ success: false, error: "Error interno"});
    }
});

// Ruta para actualizar un producto
fastify.put('/productos/:id', async (request, reply) => {
    try{
        //Validar que el ID tenga el formato UUID
        const paramsSchema = z.object({
            id: z.string().uuid("ID no valido"),
        });
        const { id } = paramsSchema.parse(request.params);

        //Validar si el cuerpo no viene vacio
        const validatedData = updateProductSchema.parse(request.body);

        //Verificar si el cuerpo no viene vacio
        if(Object.keys(validatedData).length === 0){
            return reply.status(400).send({
                success: false,
                error: "Debes enviar al menos un campo para actualizar"
            });
        }

        //Actualizar en prisma
        const actualizado = await prisma.product.update({
            where: { id },
            data: validatedData as any,
        });

        return { success: true, producto: actualizado};
    }catch(error){
        if(error instanceof z.ZodError){
            return reply.status(400).send({ success: false, errors: error.issues});
        }
    }
});

// Ruta para eliminar un producto
fastify.delete('/productos/:id', async (request, reply) => {
    try{
        //Validamos que el ID este en el formato correcto
        const paramsSchema = z.object({
            id: z.string().uuid("ID no valido")
        });
        const { id } = paramsSchema.parse(request.params);

        await prisma.product.delete({
            where: { id }
        });
        return({ success: true, message: "Producto eliminado correctamente "});
    }catch(error){
        if(error instanceof z.ZodError){
            return reply.status(400).send({ success: false, error: "El producto no existe "});
        }
    }
});


const start = async () => {
    try {
        await fastify.listen({ port: 3001, host: '0.0.0.0' });
        console.log('Servidor escuchando en http://localhost:3001');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();