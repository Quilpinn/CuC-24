import { useState, useEffect } from 'react';

import handleShare from "@/services/handleShare";
import PublisherLink from "./publisherLink";

import { getAuthentication } from "/src/services/cookies"

import { useRouter } from "next/navigation"

async function getUsername() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${apiUrl}/api/v1/users/getByHash`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                hash: getAuthentication(),
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to get username.");
        }
        const data = await response.json();
        return data.username
    } catch (error) {
        console.error("Failed to get username:", error);
    }
}


export default function EventPost({post}) {
    const participants = post.event_details.PARTICIPANTS
    ? post.event_details.PARTICIPANTS.split("; ")
    : null;

    const [username, setUsername] = useState(null);
    const router = useRouter()
    
    useEffect(() => {
        getUsername().then(name => {
            setUsername(name);
        });
    }, []);
    
    async function addParticipant(eventId) {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
            const response = await fetch(`${apiUrl}/api/v1/events/participate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hash: getAuthentication(),
                    eventId: eventId,
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to add participant.");
            }
            console.log("Participant added successfully.");
            router.refresh()
        } catch (error) {
            console.error("Failed to add participant:", error);
        }
    }


    return (
        <div
            className="bg-white shadow-lg rounded-lg p-6 w-4/5 mb-6"
            key={post.HEADING}
        >
            {/* Heading */}
            <h2 className="text-xl font-bold mb-2 text-gray-800">
                {post.HEADING}
            </h2>

            {/* Content */}
            <p className="text-gray-600 italic">{post.CONTENT}</p>

            {/* City and Date */}
            <div className="mt-4">
                <p>
                    <strong>📍 Stadt:</strong> {post.event_details.CITY}
                </p>
                <p>
                    <strong>🕒 Datum:</strong>{" "}
                    {new Date(post.event_details.EVENT_DATE).toLocaleString("de-DE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                    Uhr
                </p>
            </div>

            {/* Participants */}
            <div className="mt-4">
                {participants == null ? (
                    <a
                        onClick={() => addParticipant(post.EVENT_QID)}
                        href="#"
                        className="text-blue-500 hover:underline"
                    >
                        Melde dich als erster an!
                    </a>
                ) : participants.includes(username) ? (
                    <p>
                        Du bist dabei!{" "}
                        {participants.length - 1 > 0 &&
                            `+ ${participants.length - 1} Teilnehmer.`}
                    </p>
                ) : (
                    <p>
                        {participants.length} Teilnehmer.{" "}
                        <a
                            onClick={() => addParticipant(post.EVENT_QID)}
                            href="#"
                            className="text-blue-500 hover:underline"
                        >
                            Auch teilnehmen?
                        </a>
                    </p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
                <a
                    href={`/postDetails/${post.EVENT_QID}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Details ansehen
                </a>
                <a
                    href="#"
                    onClick={handleShare}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                >
                    📤 Teilen
                </a>
            </div>

            {/* Timestamp */}
            <div className="text-gray-400 text-sm mt-3">
                Geposted am:{" "}
                {new Date(post.TIMESTAMP).toLocaleString("de-DE", {
                    dateStyle: "long",
                    timeStyle: "short",
                })}
            </div>

            <PublisherLink userUuid={post.CREATED_BY_UUID}/>
        </div>
    )
}