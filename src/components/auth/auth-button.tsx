
interface AuthButtonProps {
    children: React.ReactNode;
}

export default function AuthButton({
    children
}: AuthButtonProps) {
    return (
        <button className="relative py-2 px-3 rounded-lg font-bold bg-gradient-to-b {/*from-[#190d2e]*/} from-secondary to-primary shadow-[0px_0px_12px_#f0f3f5]">
            <div className="absolute inset-0">
                <div className="rounded-lg border border-white/20 absolute inset-0 [mask-image:linear-gradient(to_bottom, white, transparent)]"></div>
                <div className="rounded-lg border border-white/40 absolute inset-0 [mask-image:linear-gradient(to_top, white, transparent)]"></div>
                <div className="rounded-lg absolute inset-0 shadow-[0_0_10px_rgb(140, 69, 255, .7)_inset]"></div>
            </div>
            {children}
        </button>
    )
}
