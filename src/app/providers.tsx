'use client'

import { SessionProvider } from 'next-auth/react';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

export interface ExcerptProps {
    transcriptId: string | null,
    transcriptName: string | null,
    chunkId: string | null,
    pageNumber: number,
    fromLine: number,
    toLine: number,
    content: string | null,
}

export interface ExcerptsContextProps {
    excerpts : ExcerptProps[] | null;
    setExcerpts : Dispatch<SetStateAction<ExcerptProps[]>> | null;
    selected : string;
    setSelected : Dispatch<SetStateAction<string>> | null;
}

export interface ChatContextProps {
    chatHistory : ChatMessage[];
    setChatHistory : Dispatch<SetStateAction<ChatMessage[]>> | null;
}

interface ProvidersProps {
    children: React.ReactNode
}

interface ChatMessage {
    role : "USER" | "AGENT",
    message : string,
}

export const ChatContext = createContext<ChatContextProps>({
    chatHistory: [],
    setChatHistory: null,
});

export const ExcerptsContext = createContext<ExcerptsContextProps>({
    excerpts : [],
    setExcerpts: null,
    selected: "",
    setSelected : null,
});

export default function Providers({children}: ProvidersProps) {
    const [excerpts, setExcerpts] = useState<ExcerptProps[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [selected, setSelected] = useState<string>("");
    
    return (
        <SessionProvider>
            <ChatContext.Provider value={{chatHistory, setChatHistory}}>
                <ExcerptsContext.Provider value={{
                    excerpts, 
                    setExcerpts,
                    selected,
                    setSelected
                }}>
                    {children}
                </ExcerptsContext.Provider>
            </ChatContext.Provider>
        </SessionProvider>
    );
}