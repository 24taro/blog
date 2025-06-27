import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Link
          to="/new-post"
          className="text-xs text-gray-500 hover:text-gray-700 mt-2 inline-block"
        >
          新規投稿
        </Link>
      </div>
    </footer>
  );
}
