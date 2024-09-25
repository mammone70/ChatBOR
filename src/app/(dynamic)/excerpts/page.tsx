import DocumentExcerpts from "@/app/(dynamic)/chat/_components/document-excerpts";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function excerptsPage() {
  const session = await auth();
    if (!session) {
      redirect("/auth/login");
    }

    return (
        <DocumentExcerpts 
          defaultLayout={[650,650]}
        >
        </DocumentExcerpts>
    )
  }
  