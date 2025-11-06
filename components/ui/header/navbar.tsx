import Link from 'next/link'
import Image from 'next/image'

export function Navbar() {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="AquiFaz"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="https://wa.me/5563992731977"
              target="_blank"
              className="inline-flex px-6 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
