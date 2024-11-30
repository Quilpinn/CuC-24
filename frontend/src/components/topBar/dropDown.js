import { getAuthentication, removeAuthentication } from "@/services/cookies";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getInitials = (names) => {
    const initials = names.split(' ').map(name => name[0].toUpperCase())
    const initialString = initials.length == 1 ? initials[0] : initials[0] + initials[1]
    return initialString
}

export default function Dropdown({setIsAuthenticated}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('Choose an option');
    const [user, setUser] = useState()
    const router = useRouter()

    const options = [
        "Me",
        "Logout",
    ];

    useEffect(() => {
        const fetchUserName = async () => {
            try {                
                const response = await fetch(`${apiUrl}/api/v1/users/getByHash`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        hash: getAuthentication(),
                    })
                });
                const userData = await response.json();
                setUser(userData)
                console.log(userData);
                
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        fetchUserName()
    }, [])

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = async (option) => {
        setSelected(option);
        setIsOpen(false);

        if (option == "Me") {
            window.location.href = `/profile/${encodeURIComponent(username)}`;
        }
        else if (option == "Logout") {
            
            removeAuthentication();
            setIsAuthenticated(false)
            router.push("/")
        }
    };

    return (
        <div className="relative inline-block">
            {/* Circular image button */}
            <button
                onClick={toggleDropdown}
                className="w-12 h-12 bg-pink-300 text-pink-800 font-bold rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {user && user.username && getInitials(user.username)}
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                    <ul className="py-1">
                        {options.map((option) => (
                            <li
                                key={option}
                                className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};