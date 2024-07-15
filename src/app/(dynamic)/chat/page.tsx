import ChatInteraction from "@/components/chat/chat-interaction";
import TranscriptExcerpts from "@/components/chat/transcript-excerpts";

  export default function chatPage() {
    return (
        // <ChatInteraction></ChatInteraction>
        <TranscriptExcerpts 
          defaultLayout={[650,650]}
        ></TranscriptExcerpts>
    )
  }
  