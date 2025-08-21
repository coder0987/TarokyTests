
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from './lib/react-query/QueryProvider'
import { SocketProvider } from '@/context/SocketContext';
import { GameProvider } from './context/GameContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <SocketProvider>
          <GameProvider>
            <App />
          </GameProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>

)