import { z } from "zod";

//Creacion de productos con validacion de campos
export const createProductSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(50),
    category: z.string().min(2, "Categoria requerida"),
    price: z.number().positive("El precio debe ser mayor a 0"),
    stock: z.number().int().nonnegative("El stock no puede ser negativo"),
    minStock: z.number().int().nonnegative().optional().default(5),
});

//Actualizacion de productos
//Permite usar la estructura de createProductSchema pero que los campos sean opcionales
export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;