import { checkAuth } from "/src/services/cookies"
import Dropdown from "./dropDown";
import Link from 'next/link'
import { useState } from "react";

export default function TopBar() {
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuth())

    return (
        <div className="flex justify-between items-center w-full topbar py-5 px-10 gap-x-7 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div>STEPZZ</div>
        {isAuthenticated && <Dropdown setIsAuthenticated={setIsAuthenticated} /> }
        {!isAuthenticated && <Link href="/login">Login</Link>}
        </div>
    );
}