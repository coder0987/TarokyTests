import { useCallback, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChatSlice';
import { emitSendMessage } from '@/engine/SocketEmitter';
import { useAuthSlice } from '@/hooks/useAuthSlice';

/*

Chat TODO:
- Mobile friendly
- Chatbox grows with message length
- FAB background color
- Test that it works :)
- Display avatars, timestamps, usernames
- Close when clicking off to the side

*/

const ChatBox = () => {
    const [activeTab, setActiveTab] = useState<'game' | 'system'>('game');
    const { ledger, chat } = useChat();

    const username = useAuthSlice(useCallback(auth => auth.user, [])) ?? "Guest";
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        setAuthenticated(username !== 'Guest');
    }, [username]);

    const [messageInput, setMessageInput] = useState('');

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        emitSendMessage(messageInput.trim());
        setMessageInput('');
    };

    return (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-300">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
            <button
            className={`flex-1 py-2 text-center ${
                activeTab === 'game'
                ? 'border-b-2 border-blue-600 font-semibold'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('game')}
            >
            Game
            </button>
            <button
            className={`flex-1 py-2 text-center ${
                activeTab === 'system'
                ? 'border-b-2 border-blue-600 font-semibold'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('system')}
            >
            System
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-2 overflow-y-auto space-y-2 bg-gray-50">
            {(activeTab === 'game' ? chat : ledger).map((msg, idx) => (
            <div
                key={idx}
                className={`p-2 rounded ${
                activeTab === 'game' ? 'bg-blue-100 text-gray-800' : 'bg-gray-200 text-gray-700'
                }`}
            >
                {msg.message}
            </div>
            ))}
        </div>

        {/* Input (only game tab) */}
        {activeTab === 'game' && (
            <div className="p-2 border-t border-gray-200 flex">
            <input
                className="flex-1 border border-gray-300 rounded px-2 py-1 mr-2"
                type="text"
                value={authenticated ? messageInput : 'Please sign in to send chat messages'}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                onClick={handleSendMessage}
                disabled={!authenticated}
            >
                Send
            </button>
            </div>
        )}
        </div>
    );
};

export default ChatBox;
