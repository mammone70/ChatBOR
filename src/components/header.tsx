import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/auth"
import { LogoutButton } from "@/components/auth/logout-button";
import { LoginButton } from "@/components/auth/login-button";
import NavMenu from "@/components/nav-menu";
import AuthButton from "./auth/auth-button";
import { MenuIcon } from "lucide-react";

export default async function Header() {
    const session = await auth();
    return (
        <header className="py-4 border-b border-muted-foreground/15">
            <div className="container">
                <div className="flex justify-between">
                    <div>
                        <div className="h-10 w-10inline-flex items-center justify-center">
                            <Link href="/" className="font-bold text-3xl">
                                Chat
                                <span className="text-primary">BOR</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <ThemeToggle/>
                        { session && 
                            <MenuIcon></MenuIcon>
                        }
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
            </div>
        </header>
    )
}
