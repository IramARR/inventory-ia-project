'use client';

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const CATEGORIES = [
    { value: 'components', label: 'Componentes (RAM, CPU, GPU)'},
    { value: 'peripherals', label: 'Perifericos (Mouse, Teclado, Audifonos)'},
    { value: 'laptops', label: 'Laptops y Equipos'},
    { value: 'audio', label: 'Audio y sonido'},
    { value: 'accessories', label: 'Accesorios y Cables'},
];


// Source - https://stackoverflow.com/a/63884537
// Posted by Chamika Sandamal, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-15, License - CC BY-SA 4.0

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function AddProductModal({ isOpen, onClose, onRefresh, productToEdit }: any){
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: 0,
        stock: 0,
        minStock:0,
    });

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                category: productToEdit.category,
                price: Number(productToEdit.price),
                stock: productToEdit.stock,
                minStock: productToEdit.minStock,
            });
        } else {
            setFormData({
                name: '',
                category: '',
                price: 0,
                stock:0,
                minStock:0,
            });
        }
    }, [productToEdit, isOpen]);

    if(!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category){
            alert("Por favor, seleccionar una categoria")
            return;
        }
        try {
            if(productToEdit){
                await api.updateProduct(productToEdit.id, formData);
            }else{
                await api.createProduct(formData);
            }
            onRefresh();
            onClose();
        } catch (error) {
            alert("Error procesar el producto" + error); 
        }
    };

    return(
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    {productToEdit ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Nombre</label>
                        <input 
                        type="text"
                        required
                        value={formData.name || ''}
                        className="w-full mt-1 p-2 text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    {/* Campo categoria */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Categoria</label>
                        <select 
                            value={formData.category}
                            className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg focus:ring-blue-500 outline-none text-slate-900 font-medium cursor-pointer"
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="" disabled hidden>
                                Selecciona una categoria...
                            </option>

                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Campo precio */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Precio</label>
                            <input 
                            type="number" 
                            required
                            value={formData.price || ''}
                            className="w-full mt-1 p-2 text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormData({...formData, price:Number(e.target.value)})}
                            />
                        </div>

                        {/* Campo stock */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Stock</label>
                            <input 
                            type="number" 
                            required
                            value={formData.stock || ''}
                            className="w-full mt-1 p-2 text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormData({...formData, stock:Number(e.target.value)})}
                            />
                        </div>
                    </div>

                    {/* Botones de accion */}
                    <div className="flex justify-end space-x-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all">
                                Guardar Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}