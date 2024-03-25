'use client'

import { UserNav } from "./user-nav";
import { NavLinks } from "@/components/nav-links"


export function Navbar() {
    return (
        <nav className="border-b border-gray">
            <div className="flex h-16 items-center px-4">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold">OxyNeo</h1>
                    <NavLinks />
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <UserNav />
                </div>
            </div >
        </nav>

    );
}