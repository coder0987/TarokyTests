import { Routes, Route } from 'react-router-dom'
import '@/globals.css'

import RootLayout from '@/_root/RootLayout'
import { Home, NotFound } from '@/_root/pages'
import { ToastContextProvider } from '@/context/ToastContext';

const App = () => {
  return (
    <ToastContextProvider>
      <main className="flex h-screen">
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Route>

        </Routes>

      </main>
    </ToastContextProvider>
  )
}

export default App
