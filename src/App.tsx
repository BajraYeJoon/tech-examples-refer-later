import { Outlet, Link } from 'react-router'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Zustand Store Demo
            </h1>
            <nav className="space-x-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Products
              </Link>
              <Link 
                to="/forms" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Survey Form
              </Link>
              <Link 
                to="/hook-form-tutorial" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Hook Form Tutorial
              </Link>
              <Link 
                to="/airbnb-form" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Airbnb Form
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
