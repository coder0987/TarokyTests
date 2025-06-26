import { Routes, Route } from 'react-router-dom'
import '@/globals.css'

import RootLayout from '@/_root/RootLayout'
import { Browse, Custom, Daily, Donate, Home, Host, Learn, NotFound, Play, Ranked, Rules, SignIn, Updates } from '@/_root/pages'
import { ToastContextProvider } from '@/context/ToastContext';
import Test from './_root/pages/Rules/Test';

const App = () => {
  return (
    <ToastContextProvider>
      <main className="flex h-screen">
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/daily" element={<Daily />} />
          <Route index element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/ranked" element={<Ranked />} />
          <Route path="/rules" element={<Rules />} />
          <Route element={<RootLayout />}>
            <Route path="/donate" element={<Donate />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/play" element={<Play />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/updates" element={<Updates />} />
          </Route>

        </Routes>

      </main>
    </ToastContextProvider>
  )
}

export default App
