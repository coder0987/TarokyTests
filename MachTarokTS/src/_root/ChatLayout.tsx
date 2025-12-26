import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bottombar, Topbar } from '@/components/shared';
import MobileTopbar from '@/components/shared/MobileTopbar';
import ChatBox from './pages/ChatBox';

const ChatLayout = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
        <Outlet />

        {/* Chat FAB */}
        <button
            className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
            onClick={() => setChatOpen((prev) => !prev)}
        >
            💬
        </button>

        {/* Chat Box */}
        {chatOpen && <ChatBox />}
    </>
  );
};

export default ChatLayout;
