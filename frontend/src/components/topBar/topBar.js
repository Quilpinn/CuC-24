import { isAuthenticated } from "/src/services/cookies"
import Dropdown from "./dropDown";

export function TopBar() {
    return (
        <div className='flex justify-between items-center w-full max-w-screen-lg topbar py-5 px-10 gap-x-7'>
            <div className='w-16'>
                <a href="/calendar">Kalender</a>
            </div>
            <div className='flex justify-end gap-x-7 font-headline font-bold'>
                <a href="/me">Me</a>
                {isAuthenticated() ? <Dropdown /> :
                    <a href="/login">Login</a>
                }
            </div>
        </div>
    );
}

export default TopBar;