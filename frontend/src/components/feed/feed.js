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
    const [selectedFilter, setSelectedFilter] = useState("");

    const handleFilterClick = (filterType) => {
        setSelectedFilter(filterType); 
        sortBy(filterType); 
    };

    // let posts = null;
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

                console.log(data)

                if (!Array.isArray(data.posts)) {
                    throw new Error("Expected array of posts but received different data structure");
                }

                setPosts(data.posts);
            } catch (error) {
                console.error("Error fetching feed:", error);
            }
        }

        fetchFeed();
    }, []);

    // const [sortedData, setSortedData] = useState(posts);

    // Sorting function
    const sortBy = (key) => {
        console.log("sorting by: ")
        console.log(key)
        const eventPosts = posts.filter(post => post.CONTENT_TYPE === "event");
        const sorted = [...eventPosts].sort((a, b) => {
            console.log(`Comparing: ${a.event_details[key]} vs ${b.event_details[key]}`);
            return b.event_details[key] - a.event_details[key];
        });
        // Combine sorted event posts with non-event posts
        const nonEventPosts = posts.filter(post => post.CONTENT_TYPE !== "event");
        setPosts([...sorted, ...nonEventPosts]);
    };

    return (
        <div className="flex flex-col items-center w-full py-5 bg-gray-100 min-h-screen" {...props}>
            <h1 className="text-3xl font-bold text-center mb-5">Dein Feed</h1>

            {/* Button Group */}
            <div className="bg-white shadow-lg rounded-lg p-4 flex gap-4 justify-center mb-6">
                <button
                    onClick={() => handleFilterClick("totalRating")}
                    className={`px-4 py-2 rounded transition ${
                        selectedFilter === "totalRating"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100 text-blue-500 hover:bg-blue-200"
                    }`}
                >
                    Events für dich!
                </button>
                <button
                    onClick={() => handleFilterClick("distanceRating")}
                    className={`px-4 py-2 rounded transition ${
                        selectedFilter === "distanceRating"
                            ? "bg-green-500 text-white"
                            : "bg-green-100 text-green-500 hover:bg-green-200"
                    }`}
                >
                    Events in deiner Nähe!
                </button>
                <button
                    onClick={() => handleFilterClick("interestRating")}
                    className={`px-4 py-2 rounded transition ${
                        selectedFilter === "interestRating"
                            ? "bg-purple-500 text-white"
                            : "bg-purple-100 text-purple-500 hover:bg-purple-200"
                    }`}
                >
                    Events die zu dir passen!
                </button>
                <a
                    href="/"
                    onClick={() => handleFilterClick("all")}
                    className={`px-4 py-2 rounded transition ${
                        selectedFilter === "all"
                            ? "bg-gray-500 text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                >
                    Alle Posts
                </a>
            </div>

            {/* Posts */}
            {posts.map((post) => {
                if (post.CONTENT_TYPE === "event") {
                    return <EventPost key={post.PID} post={post} />;
                } else if (post.CONTENT_TYPE === "post") {
                    return <CommentPost key={post.PID} post={post} />;
                }
                return null; // Skip unsupported content types
            })}
        </div>
    );
}

export default Feed;