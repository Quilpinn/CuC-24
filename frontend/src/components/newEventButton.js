import { checkAuth } from "@/services/cookies";
import Link from "next/link";
import { useState } from "react";

export default function NewEventButton() {
    const isAuthenticated = checkAuth();

    return (
        <Link href="/newPost">
            <div
                className="z-10 fixed bottom-5 right-12 bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg p-5 rounded-full flex items-center text-white transition-all duration-300 ease-in-out group hover:pr-6 hover:pl-5 hover:rounded-xl"
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
                    className="ml-3 opacity-0 group-hover:opacity-100 group-hover:ml-4 transition-all duration-300 ease-in-out"
                >
                    Neues Event anlegen
                </span>
            </div>
        </Link>
    );
}
