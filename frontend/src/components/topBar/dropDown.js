import { getAuthentication, removeAuthentication } from "@/services/cookies";
import React, { useState, useEffect } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getUser() {
    try {
        const response = await fetch(`localhost:8484/api/v1/user/get`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hash: getAuthentication(),
            })
        });
        const username = await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
    }
    return username;
}

export default function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('Choose an option');

    const options = [
        "Me",
        "Logout",
    ];

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = async (option) => {
        setSelected(option);
        setIsOpen(false);

        username = getUser();

        if (option == "Me") {
            window.location.href = `/profile/${encodeURIComponent(username)}`;
        }
        else if (option == "Logout") {
            removeAuthentication();
            window.location.href = "/";
        }
    };

    return (
        <div className="relative inline-block">
            {/* Circular image button */}
            <button
                onClick={toggleDropdown}
                className="w-12 h-12 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                <img
                    src={`${apiUrl}/cdn/default.PNG`}
                    alt="Dropdown trigger"
                    className="w-full h-full object-cover"
                />
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