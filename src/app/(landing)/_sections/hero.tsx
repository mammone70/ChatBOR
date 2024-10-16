import AuthButton from "@/components/auth/auth-button";
import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="flex items-center justify-center h-[70vh]">
      <div className="relative items-center w-full px-5 pt-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full border border-primary bg-secondary">
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
              <AuthButton>
                <span>Sign Up Now</span>
              </AuthButton>
              {/* <Button size="lg" className="w-full">
                  Sign Up Now
              </Button> */}
            </LoginButton>
          </div>
        </div>
      </div>
    </section>
  )
}
