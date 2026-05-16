import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bottombar, Topbar } from '@/components/shared';
import MobileTopbar from '@/components/shared/MobileTopbar';
import ChatBox from './pages/ChatBox';

const ChatLayout = () => {
  const [chatOpen, setChatOpen] = useState(false);
  
  // These are stored here so that it doesn't reset when the chat box is closed
  const [activeTab, setActiveTab] = useState<'game' | 'system'>('game');
  const containerRef = useRef(null);

  // Store scroll positions per tab
  const scrollPositions = useRef({
    game: 0,
    system: 0,
  });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTop = scrollPositions.current[activeTab];
  }, [activeTab, chatOpen]);

  const swapTabs = (tab: 'game' | 'system') => {
    const el = containerRef.current;

    // Save current position before switching
    if (el) {
      scrollPositions.current[activeTab] = el.scrollTop;
    }

    setActiveTab(tab);
  }

  const chatFABCallback = () => {
    setChatOpen((prev) => {
      const el = containerRef.current;
      if (!el) return !prev;

      if (prev) // chat is open, so I'm closing it
        scrollPositions.current[activeTab] = el.scrollTop;

      return !prev;
    });
  }



  return (
    <>
        <Outlet />

        {/* Chat FAB */}
        <button
            className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
            onClick={chatFABCallback}
        >
            💬
        </button>

        {/* Chat Box */}
        {chatOpen && <ChatBox activeTab={activeTab} setActiveTab={swapTabs} scrollRef={containerRef} />}
    </>
  );
};

export default ChatLayout;
