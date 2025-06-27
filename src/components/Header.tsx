import { Link } from 'react-router-dom'

interface HeaderProps {
  onSearchChange?: (query: string) => void
  searchQuery?: string
}

export default function Header({ onSearchChange, searchQuery = '' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link to="/" className="text-gray-900 hover:text-gray-700">
            <h1 className="text-xl font-bold">24Taro</h1>
          </Link>

          {onSearchChange && (
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="記事を検索..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

        </div>
      </div>
    </header>
  )
}
