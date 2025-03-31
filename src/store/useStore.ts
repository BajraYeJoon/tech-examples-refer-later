import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import axios from 'axios'
import type { Product, ProductStore } from '../types/store';
import {persist, createJSONStorage, devtools} from 'zustand/middleware'
import { toast } from 'sonner';

const useStore = create<ProductStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        products: [],
        isLoading: false,
        error: null,
    
        fetchProducts: async () => {
          if (get().products.length === 0) {
            set({ isLoading: true, error: null })
            try {
              const response = await axios.get('https://fakestoreapi.com/products')
              set((state) => {
                state.products = response.data
                state.isLoading = false
              }, false, 'fetchProducts/success')
              toast.success('Products fetched successfully')
            } catch (error) {
              set((state) => {
                state.error = (error as Error).message
                state.isLoading = false
              }, false, 'fetchProducts/error')
              toast.error('Failed to fetch products')
            }
          }
        },
    
        addProduct: async (product: Omit<Product, 'id'>) => {
          set({ isLoading: true, error: null })
          try {
            const response = await axios.post('https://fakestoreapi.com/products', product)
            const newProduct = {
              ...response.data,
              id: Math.max(0, ...get().products.map(p => p.id)) + 1
            }
            set((state) => {
              state.products.push(newProduct)
              state.isLoading = false
            }, false, 'addProduct/success')
            toast.success('Product added successfully')
          } catch (error) {
            set((state) => {
              state.error = (error as Error).message
              state.isLoading = false
            }, false, 'addProduct/error')
            toast.error('Failed to add product')
          }
        },
    
        updateProduct: async (id: number, updates: Partial<Product>) => {
          set({ isLoading: true, error: null })
          try {
            await axios.patch(`https://fakestoreapi.com/products/${id}`, updates)
            const currentProduct = get().products.find(p => p.id === id)
            if (!currentProduct) throw new Error('Product not found')
            const updatedProduct = { ...currentProduct, ...updates }
            set((state) => {
              const index = state.products.findIndex((p) => p.id === id)
              if (index !== -1) {
                state.products[index] = updatedProduct
              }
              state.isLoading = false
            }, false, 'updateProduct/success')
            toast.success('Product updated successfully')
          } catch (error) {
            set((state) => {
              state.error = (error as Error).message
              state.isLoading = false
            }, false, 'updateProduct/error')
            toast.error('Failed to update product')
          }
        },
    
        deleteProduct: async (id: number) => {
          set({ isLoading: true, error: null })
          try {
            await axios.delete(`https://fakestoreapi.com/products/${id}`)
            set((state) => {
              state.products = state.products.filter((p) => p.id !== id)
              state.isLoading = false
            }, false, 'deleteProduct/success')
            toast.success('Product deleted successfully')
            } catch (error) {
            set((state) => {
              state.error = (error as Error).message
              state.isLoading = false
            }, false, 'deleteProduct/error')
            toast.error('Failed to delete product')
          }
        },
      })),
      {
        name: "product-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          products: state.products,
        }),
        version: 1,
        onRehydrateStorage: () => {
          console.log("hydration started")
          return (state) => {
            if (state) {
              console.log("hydration finished", state)
              state.isLoading = false
              state.error = null
            }
          }
        },
      }
    ),
  )
)

export default useStore 