import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/files");
  }

  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full bg-secondary">
              <span className="text-sm font-bold text-primary">
                Chat With BOR Transcripts
              </span>
            </span>

            <h1 className="mt-8 text-3xl font-extrabold -tracking-tight lg:text-6xl">
              Ask Questions About 
            </h1>
            <h1 className="mt-2 text-3xl font-extrabold -tracking-tight lg:text-6xl">
              The Hearing
            </h1>

            <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl font-bold text-muted-foreground">
              Semantically Search For Excerpts
            </p>
          </div> 
          <div className="flex justify-center max-w-sm mx-auto mt-10">
            <LoginButton>
              <Button size="lg" className="w-full">
                Sign Up Now
              </Button>
            </LoginButton>
          </div>
        </div>
      </div>
    </section>
  );
}
