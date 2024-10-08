import ChatInteraction from "@/app/(dynamic)/chat/_components/chat-interaction";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

  export default async function chatPage() {
    const session = await auth();
    if (!session) {
      redirect("/auth/login");
    }
    
    return (
        <ChatInteraction></ChatInteraction>
    )
  }
  