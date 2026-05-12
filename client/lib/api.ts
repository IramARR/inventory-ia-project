// Crea la interfaz para no tener problemas con TS
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    minStock: number;
    createdAt: string;
}

//Guarda la URL que esta almacenada en .env
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
    //Metodo asinctrono para obtener productos
    async getProducts(): Promise<Product[]> {
        // Guarda los productos obtenidos de /productos en response
        const response = await fetch(`${API_URL}/productos`);

        if(!response.ok){
            throw new Error ('Error al obtener los productos');
        }

        return response.json();
    },

    // Metodo asincrono para crear productos omitiendo id y fecha de creacion
    async createProduct(product: Omit<Product, 'id' | 'createdAt'>) {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        return response.json();
    }
};