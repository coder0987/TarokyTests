import { useEffect, useState } from "react";
import { chatStore } from "../engine/ChatStore";

export function useChat() {
  
  const [ledger, setLedger] = useState(() => chatStore.ledgerMessages);
  const [chat, setChat] = useState(() => chatStore.chatMessages);

  useEffect(() => {
    const handler = () => {
      const newLedger = chatStore.ledgerMessages;
      setLedger(prev => (Object.is(prev, newLedger) ? prev : newLedger));

      const newChat = chatStore.chatMessages;
      setChat(prev => (Object.is(prev, newChat) ? prev : newChat));
    };
    
    return chatStore.subscribe(handler);
  }, []);

  return { ledger: ledger, chat: chat };
}