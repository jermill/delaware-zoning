import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-delaware-blue">
              Delaware Zoning
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/pricing" 
              className="text-gray-700 hover:text-delaware-blue transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-delaware-blue transition-colors"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="btn-primary"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Link 
              href="/signup" 
              className="btn-primary text-sm px-4 py-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
