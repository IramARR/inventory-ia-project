'use client';

import { useState } from "react";
import { api, Product } from "@/lib/api";

//Componente
import AddProductModal from "@/components/AddProductModal";

export default function IntentoryPage(){

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const loadData = async () => {
      try{
        //setLoading(true);
        const data = await api.getProducts();
        setProducts(data);
      }catch(error){
        console.error("Error cargando los productos: ", error);
      }finally{
        setLoading(false);
      }

    };

    if (loading && products.length === 0){
      loadData();
    }
    
    const handleOpenNewProduct = () => {
      setSelectedProduct(null);
      setIsModalOpen(true);
    };

  return(
    <main className="min-h-screen bg-slate-50 p-8">
      {/* Contenedor del encabezado */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">TechShop Inventory</h1>
          <p className="text-blue-600 font-medium">Panel de Gestion de Productos</p>
        </div>

        {/* Boton principal */}
        <button 
          onClick={() => handleOpenNewProduct()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg">
          + Nuevo Producto
          
        </button>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* Encabezado de la tabla */}
          <thead className="bg-blue-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-slate-700 font-semibold text-center">Productos</th>
              <th className="p-4 text-slate-700 font-semibold text-center">Categoria</th>
              <th className="p-4 text-slate-700 font-semibold text-center">Precio</th>
              <th className="p-4 text-slate-700 font-semibold text-center">Stock</th>
              <th className="p-4 text-slate-700 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          
          {/* Cuerpo de la tabla */}
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center text-slate-400">Cargando...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-slate-400">No hay productos almacenados</td></tr>
            ) : (
              products.map((p) => 
                //Filas con efecto hover
                <tr key={p.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-900 text-center">{p.name}</td>
                  <td className="p-4 text-slate-600 italic text-center">{p.category}</td>
                  <td className="p-4 text-slate-900 font-bold text-center">${p.price.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    {/* Badge de stock con condicional para stock bajo */}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock <= p.minStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {p.stock} unidades
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium px-2">
                      Editar</button>
                    <button 
                      className="text-red-500 hover:text-red-700 font-medium px-2"
                      onClick={async () => {
                        try {
                          await api.deleteProduct(p.id);
                          await loadData();
                        } catch (error) {
                          console.error("Error eliminando el producto: ", error);
                        }
                      }}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Modal para agregar nuevo producto */}
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onRefresh={loadData}
        productToEdit={selectedProduct} />

    </main>
  );
}

