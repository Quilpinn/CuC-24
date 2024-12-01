import { checkAuth } from "@/services/cookies";
import Link from "next/link";

export default function NewEventButton() {
    const isAuthenticated = checkAuth();

    return (
        <Link href="/newPost">
            <div
                className="z-10 fixed bottom-5 right-12 bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg flex items-center text-white group transition-all duration-300 ease-in-out rounded-full"
                style={{
                    width: '48px',  // Small circle initially
                    height: '48px',
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 5l0 14" />
                    <path d="M5 12l14 0" />
                </svg>
                <span
                    className="ml-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                        maxWidth: '0px',  
                        transition: 'max-width 0.3s ease-in-out, opacity 0.3s ease-in-out',
                    }}
                >
                    Neues Event anlegen
                </span>
            </div>
            <style jsx>{`
                .group:hover span {
                    max-width: 150px; // Smoothly expands to show text on hover
                }
            `}</style>
        </Link>
    );
}
