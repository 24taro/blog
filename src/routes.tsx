import { Outlet, createBrowserRouter } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import NewPost from './pages/NewPost'
import PostDetail from './pages/PostDetail'
import TagPosts from './pages/TagPosts'

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
    basename: '/', // ルートパス
  },
)
