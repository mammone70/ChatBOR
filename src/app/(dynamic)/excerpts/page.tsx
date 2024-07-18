import TranscriptExcerpts from "@/components/chat/transcript-excerpts";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function excerptsPage() {
  const session = await auth();
    if (!session) {
      redirect("/auth/login");
    }

    return (
        <TranscriptExcerpts 
          defaultLayout={[650,650]}
        >
        </TranscriptExcerpts>
    )
  }
  