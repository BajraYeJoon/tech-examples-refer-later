import { createBrowserRouter } from 'react-router'
import HookFormTutorial from '../components/HookFormTutorial'
import ProductList from '../components/ProductList'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProductList />,
  },

  {
    path: '/hook-form',
    element: <HookFormTutorial />,
  },

]) 