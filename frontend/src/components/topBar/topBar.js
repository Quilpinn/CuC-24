import { checkAuth } from "/src/services/cookies"
import Dropdown from "./dropDown";
import Link from 'next/link'
import { useState } from "react";

export default function TopBar() {
    const [isAuthenticated, setIsAuthenticated] = useState()

    return (
        <div className='flex justify-between items-center w-full topbar py-5 px-10 gap-x-7'>
        <div>STEPZZ</div>
        {isAuthenticated && <Dropdown setIsAuthenticated={setIsAuthenticated} /> }
        {!isAuthenticated && <Link href="/login">Login</Link>}
        </div>
    );
}