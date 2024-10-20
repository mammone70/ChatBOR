import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/auth"
import { LogoutButton } from "@/components/auth/logout-button";
import { LoginButton } from "@/components/auth/login-button";
import AuthButton from "./auth/auth-button";
import { MenuIcon } from "lucide-react";
import NavMenu from "./nav-menu";

export default async function Header() {
    const session = await auth();
    return (
        <header className="py-2 border-b border-muted-foreground/15">
            <div className="container px-4">
                <div className="flex justify-between items-center align-bottom">
                    <div>
                        <div className="inline-flex items-center justify-between align-bottom">
                            <div>
                                <Link href="/" className="font-bold text-3xl">
                                    Chat
                                    <span className="text-primary">BOR</span>
                                </Link>
                            </div>
                            { session && 
                                <div className="px-2">
                                    <div>
                                        <MenuIcon className="md:hidden"></MenuIcon>
                                    </div>
                                    <div className="hidden md:block">
                                        <NavMenu></NavMenu>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <ThemeToggle/>
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
