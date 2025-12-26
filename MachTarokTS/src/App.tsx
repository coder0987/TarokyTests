import { Routes, Route } from 'react-router-dom'
import '@/globals.css'

import RootLayout from '@/_root/RootLayout'
import { Browse, Custom, Daily, Donate, Home, Host, Learn, NotFound, Play, Ranked, Rules, SignIn, Updates, Game } from '@/_root/pages'
import Test from './_root/pages/Rules/Test';
import ArticlePage from './_root/pages/articles/ArticlePage';

const App = () => {
  return (
      <main className="flex h-screen">
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/daily" element={<Daily />} />
          <Route index element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/game" element={<Game />} />
          <Route path="/ranked" element={<Ranked />} />
          <Route path="/rules" element={<Rules />} />
          <Route element={<RootLayout />}>
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/play" element={<Play />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/updates" element={<Updates />} />
          </Route>

        </Routes>

      </main>
  )
}

export default App
