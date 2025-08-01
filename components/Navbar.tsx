"use client"
import NavBtn from "@/components/NavBtn";

export default function Navbar() {
    return (
        <header className="absolute top-0 left-0 w-screen flex items-center justify-between px-[160px] py-[40px]">
            <div className="text-2xl">Logo</div>
            <div className="flex items-center text-xl">
                <NavBtn text="Home" variant="primary"/>
                <NavBtn text="About" variant="primary"/>
                <NavBtn text="Connect" variant='cta'/>
            </div>
        </header>
    )
}