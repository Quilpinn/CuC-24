import { getAuthentication } from "/src/services/cookies";
import React, { useState, useEffect } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


const handleShare = () => {
    const shareLink = `${window.location.href}`;
    navigator.clipboard.writeText(shareLink);
    alert(`Der Event-Link wurde kopiert: ${shareLink}`);
  };
async function addParticipant(eventId) {
    try {
        const response = await fetch(`${apiUrl}/api/v1/participant/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                hash: getAuthentication(),
                eventid: eventId,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to add participant.");
        }
        console.log("Participant added successfully.");
    } catch (error) {
        console.error("Failed to add participant:", error);
    }
}

function Feed(props) {
    //const [posts, setPosts] = useState([]);
    let posts = null;
    if (false) {

    useEffect(() => {
        async function fetchFeed() {
            try {
                const response = await fetch(`${apiUrl}/api/v1/feed`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        hash: getAuthentication(),
                    }),
                });

                const data = await response.json();

                if (!Array.isArray(data.posts)) {
                    throw new Error("Expected array of posts but received different data structure");
                }

                setPosts(data.posts);
            } catch (error) {
                console.error("Error fetching feed:", error);
            }
        }

        fetchFeed();
    }, []);}
    else {
        posts = [
                {
                    "CONTENT": "tette",
                    "CONTENT_TYPE": "event",
                    "CREATED_BY_UUID": "6dmg0mnw-gtevjkb9-oub13tqe-bht05ypv",
                    "EVENT_QID": "w7g5h562-dnmckqnr-qmsja46m-i8wb1rvm",
                    "HEADING": "testt",
                    "PICTURE_URL": null,
                    "PID": 2,
                    "TIMESTAMP": "Sat, 30 Nov 2024 18:23:53 GMT",
                    "event_details": {
                        "CITY": "tt",
                        "CREATED_BY_UUID": "6dmg0mnw-gtevjkb9-oub13tqe-bht05ypv",
                        "EVENT_DATE": "2000-01-01 00:00",
                        "PARTICIPANTS": "",
                        "QEID": "w7g5h562-dnmckqnr-qmsja46m-i8wb1rvm"
                    }
                },
                {
                    "CONTENT": "tette",
                    "CONTENT_TYPE": "post",
                    "CREATED_BY_UUID": "6dmg0mnw-gtevjkb9-oub13tqe-bht05ypv",
                    "EVENT_QID": "w7g5h562-dnmckqnr-qmsja46m-i8wb1rvm",
                    "HEADING": "testt", 
                    "PICTURE_URL": null,
                    "PID": 2,
                    "TIMESTAMP": "Sat, 30 Nov 2024 18:23:53 GMT",
                    "EVENT_HEADING": "tette"
                },
                {
                    "CONTENT": "test",
                    "CONTENT_TYPE": "event",
                    "CREATED_BY_UUID": "6dmg0mnw-gtevjkb9-oub13tqe-bht05ypv",
                    "EVENT_QID": "nwduwlsm-qf7o95n7-0iodwdjk-q58kavsk",
                    "HEADING": "test",
                    "PICTURE_URL": null,
                    "PID": 1,
                    "TIMESTAMP": "Sat, 30 Nov 2024 18:21:46 GMT",
                    "event_details": {
                        "CITY": "test",
                        "CREATED_BY_UUID": "6dmg0mnw-gtevjkb9-oub13tqe-bht05ypv",
                        "EVENT_DATE": "2000-01-01 00:00",
                        "PARTICIPANTS": "",
                        "QEID": "nwduwlsm-qf7o95n7-0iodwdjk-q58kavsk"
                    }
                }
            ]
    }

    return (
        <div className="flex flex-col items-center w-full py-5 bg-gray-100 min-h-screen" {...props}>
            <h1 className="text-3xl font-bold text-center mb-5">Dein Feed</h1>
            {posts.map((post) => {
                console.log(post);
                if (post.CONTENT_TYPE === "event") {
                    const participants = post.PARTICIPANTS
                        ? post.PARTICIPANTS.split("; ")
                        : null;

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
                                ) : participants.includes(getAuthentication()) ? (
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
                        </div>
                    );
                } else if (post.CONTENT_TYPE === "post") {
                    return (
                        <div className="bg-white shadow-lg rounded-lg p-6 w-4/5 mb-6" key={post.EVENT_QID}>
                            {/* Post Heading */}
                            <h2 className="text-xl font-bold mb-2 text-gray-800">{post.HEADING}</h2>
            
                            {/* Post Content */}
                            <p className="text-gray-600">{post.CONTENT}</p>
            
                            {/* Post Picture */}
                            {post.PICTURE_URL && (
                                <img
                                    src={post.PICTURE_URL}
                                    alt={post.HEADING}
                                    className="w-full h-60 object-cover rounded mt-4"
                                />
                            )}
            
                            {/* Post Timestamp */}
                            <div className="text-gray-400 text-sm mt-3">
                                Geposted am:{" "}
                                {new Date(post.TIMESTAMP).toLocaleString("de-DE", {
                                    dateStyle: "long",
                                    timeStyle: "short",
                                })}
                            </div>
            
                            {/* Details Button */}
                            <div className="flex gap-4 mt-4">
                                <a
                                    href={`/postDetails/${post.EVENT_QID}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                >
                                    Details ansehen
                                </a>
                            </div>
                        </div>
                    );
                }
                return null; // Skip unsupported content types
            })}
        </div>
    );
}

export default Feed;
