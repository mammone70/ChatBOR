import { ChatMessage as Message } from "@/app/providers";
import { BotMessageSquare, User } from "lucide-react";

interface ChatMessageProps {
    chatMessage : Message;
}
function ChatMessage({chatMessage} : ChatMessageProps) {
    return (
        <div className=
            {`rounded-md my-4 mx-1 p-2 font-normal w-fit ${chatMessage.role === "USER" ? "bg-primary/80" : "bg-background"}`}>
            {chatMessage.role === "USER" ? <User /> : <BotMessageSquare /> } {chatMessage.message}
        </div>
    );
}

export default ChatMessage
