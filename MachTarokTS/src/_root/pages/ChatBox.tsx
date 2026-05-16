import { useCallback, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChatSlice';
import { emitSendMessage } from '@/engine/SocketEmitter';
import { useAuthSlice } from '@/hooks/useAuthSlice';
import { useUserContext } from '@/context/AuthContext';

/*

Chat TODO:
- Mobile friendly
- Chatbox grows with message length
- Test that it works :)
- Display avatars, timestamps, usernames
- Close when clicking off to the side

*/

const ChatBox = ({activeTab, setActiveTab, scrollRef}: {activeTab : 'game' | 'system', setActiveTab: React.Dispatch<React.SetStateAction<"game" | "system">>, scrollRef: React.MutableRefObject<any>}) => {
    const { ledger, chat } = useChat();

    const displayGameChat = activeTab === 'game';

    // username is used to differentiate which messages are "yours"
    const username = useAuthSlice(useCallback(auth => auth.user, [])) ?? "Guest";
    
    const authenticated = useUserContext().isAuthenticated;

    const [messageInput, setMessageInput] = useState('');

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        emitSendMessage(messageInput.trim());
        setMessageInput('');
    };

    return (
        <div className="chat-card fixed bottom-20 right-5 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        <div className="chat-header">Chat - Room I - ABC123</div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
            <button
            className={`flex-1 py-2 text-center ${
                activeTab === 'game'
                ? 'border-b-2 border-blue-600 font-semibold text-white'
                : 'text-gray-200'
            }`}
            onClick={() => setActiveTab('game')}
            >
            Game
            </button>
            <button
            className={`flex-1 py-2 text-center ${
                activeTab === 'system'
                ? 'border-b-2 border-blue-600 font-semibold text-white'
                : 'text-gray-200'
            }`}
            onClick={() => setActiveTab('system')}
            >
            System
            </button>
        </div>

        {/* Messages */}
        <div className="chatbox-body flex-1 p-2 overflow-y-auto space-y-2" ref={scrollRef}>
            <ul className="chat-list">
                {(displayGameChat ? chat : ledger).map((msg, idx) => {
                    const style = `chat-message ${
                                displayGameChat ? 'game-chat-message' : 'system-chat-message'
                            } ${
                                msg.author === username ? 'chat-left' : 'chat-right'
                            }`;

                    const avatar = false;
                    const avatarsrc = "/assets/profile-pictures/profile-17.png";

                    return (
                        <>
                            {/*Avatar goes here*/}
                            {
                                avatar && 
                                <li key={`${idx}-avatar`} className="chat-avatar chat-left">
                                    <div className="chat-img">
                                        <img alt="avatar" src={avatarsrc} />
                                    </div>
                                </li>
                            }
                            <li key={idx} className={style}>
                                {msg.message}
                            </li>
                        </>
                    );
                })}
            </ul>
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
