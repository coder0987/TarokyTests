import { chatStore } from './ChatStore';
import { getFormattedTime, sanitizeInput } from '@/utils';

const serverName = "MachTarok";


function trimExcessMessages(): void {
    while (chatStore.chatMessages.length > chatStore.maxChatMessages) {
        chatStore.chatMessages.shift();
    }
    while (chatStore.ledgerMessages.length > chatStore.maxLedgerMessages) {
        chatStore.ledgerMessages.shift();
    }
}

export function addServerMessage(message: string): void {
    const time = getFormattedTime();
    const sanitizedMessage = sanitizeInput(message);
    chatStore.ledgerMessages.push({author: serverName, message: sanitizedMessage, timestamp: time});
    trimExcessMessages();
    chatStore.notify();

    console.log(`${serverName}: ${sanitizedMessage}`);
}

export function addErrorMessage(message: string): void {
    const time = getFormattedTime();
    const sanitizedMessage = sanitizeInput(message);
    chatStore.ledgerMessages.push({author: serverName, message: sanitizedMessage, timestamp: time, bold: true});
    trimExcessMessages();
    chatStore.notify();

    console.error(`${serverName}: ${sanitizedMessage}`);
}

export function addPlayerMessage(author: string, message: string): void {
    const time = getFormattedTime();
    const sanitizedMessage = sanitizeInput(message);
    chatStore.chatMessages.push({author, message: sanitizedMessage, timestamp: time});
    trimExcessMessages();
    chatStore.notify();

    console.log(`${author}: ${sanitizedMessage}`);
}

export function clearAllMessages(): void {
    while (chatStore.chatMessages.length > 0) {
        chatStore.chatMessages.pop();
    }
    while (chatStore.ledgerMessages.length > 0) {
        chatStore.ledgerMessages.pop();
    }
    chatStore.notify();
}