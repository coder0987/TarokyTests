
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from './lib/react-query/QueryProvider'
import { SocketProvider } from '@/context/SocketContext';
import { GameRoot } from './_root/pages/GameRoot';

import { createSocket } from './engine/SocketEngine';
import { authController } from "./engine/AuthEngine";
authController.attachSSOListener("https://sso.smach.us");

const socket = createSocket();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
          <GameRoot>
              <App />
          </GameRoot>
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>

)