import { Routes, Route } from 'react-router-dom'
import '@/globals.css'

import RootLayout from '@/_root/RootLayout'
import { Donate, Home, Learn, NotFound, Play, SignIn, Tour, Updates } from '@/_root/pages'
import { ToastContextProvider } from '@/context/ToastContext';

const App = () => {
  return (
    <ToastContextProvider>
      <main className="flex h-screen">
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/donate" element={<Donate />} />
            <Route index element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/play" element={<Play />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/tour" element={<Tour />} />
            <Route path="/updates" element={<Updates />} />
          </Route>

        </Routes>

      </main>
    </ToastContextProvider>
  )
}

export default App
