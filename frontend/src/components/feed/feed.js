import EventPost from "./eventPost";
import CommentPost from "./commentPost";
import { getAuthentication } from "/src/services/cookies";
import React, { useState, useEffect } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
    const [posts, setPosts] = useState([]);
    // let posts = null;
    if (true) {

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
                if (post.CONTENT_TYPE === "event") {
                    return (
                        <EventPost key={post.PID} post={post}/>
                    );
                } else if (post.CONTENT_TYPE === "post") {
                    return <CommentPost key={post.PID} post={post}/>
                }
                return null; // Skip unsupported content types
            })}
        </div>
    );
}

export default Feed;
