import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/auth"
import { LogoutButton } from "@/components/auth/logout-button";
import { LoginButton } from "@/components/auth/login-button";
import NavMenu from "@/components/nav-menu";
import AuthButton from "./auth/auth-button";

export default async function Navbar() {
    const session = await auth();
    return (
        <nav className="h-[10vh] flex items-center border-b border-muted-foreground/15">
            <div className="container flex items-end">
                <Link href="/" className="font-bold text-3xl">
                    Chat
                    <span className="text-primary">BOR</span>
                </Link>
                  { session && 
                    <div className="px-8 font-bold"> 
                        <NavMenu></NavMenu>
                    </div>
                }
            </div>
            <div className="container flex items-center gap-x-5 justify-end">
                <ThemeToggle/>
                <div className="flex items-center gap-x-5">
                    {
                        session 
                        ? 
                            <LogoutButton>
                                <AuthButton>
                                    <span>Sign Out</span>
                                </AuthButton>
                            </LogoutButton>
                        :
                            <LoginButton>
                                <AuthButton>
                                    <span>Sign In</span>
                                </AuthButton>
                            </LoginButton>
                    }
                </div>
            </div>
        </nav>
    )
}
