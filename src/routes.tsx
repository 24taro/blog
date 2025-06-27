import { Outlet, createBrowserRouter } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import TagPosts from './pages/TagPosts'
import NewPost from './pages/NewPost'

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'posts/:slug',
          element: <PostDetail />,
        },
        {
          path: 'tag/:tagId',
          element: <TagPosts />,
        },
        {
          path: 'new-post',
          element: <NewPost />,
        },
      ],
    },
  ],
  {
    basename: '/blog', // GitHub Pages用のベースパス
  },
)
