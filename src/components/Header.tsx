import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-gray-900 hover:text-gray-700">
            <h1 className="text-xl font-bold">24Taro</h1>
          </Link>
        </div>
      </div>
    </header>
  )
}
