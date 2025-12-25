
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from './lib/react-query/QueryProvider'
import { GameRoot } from './_root/pages/GameRoot';

import { createSocket } from './engine/SocketEngine';
import { authController } from "./engine/AuthEngine";
import { ToastContextProvider } from './context/ToastContext';
authController.attachSSOListener("https://sso.smach.us");

createSocket();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <ToastContextProvider>
          <GameRoot>
              <App />
          </GameRoot>
        </ToastContextProvider>
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>

)