import { Outlet, Link } from 'react-router'

export default function App() {
  return (
    <div className="min-h-screen ">
      <header className=" shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">React Demo Apps</h1>
            <nav className="space-x-4">
              <Link
                to="/"
                className="text-primary hover:text-primary-foreground transition-colors"
              >
                Products
              </Link>
              <Link
                to="/hook-form"
                className="text-primary hover:text-primary-foreground transition-colors"
              >
                Hook Form
              </Link>
              <Link
                to="/airbnb-form"
                className="text-primary hover:text-primary-foreground transition-colors"
              >
                Airbnb Form
              </Link>
              <Link
                to="/spacex"
                className="text-primary hover:text-primary-foreground transition-colors"
              >
                SpaceX (Apollo)
              </Link>
              <Link
                to="/spacex-tanstack"
                className="text-primary hover:text-primary-foreground transition-colors"
              >
                SpaceX (TanStack)
              </Link>

              <Link
                to="/finance"
                className="text-primary hover:text-primary-foreground transition-colors"
              >
                Finance Tracker
              </Link>
              <Link
                to="/auth"
                className="text-primary hover:text-primary-foreground transition-colors"
              >
                Auth
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
  );
}
