import { getAuthentication, removeAuthentication } from "/src/services/cookies"
import React, { useState, useEffect } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function addParticipant(eventid) {
    fetch(`${apiUrl}/api/v1/participant/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hash: getAuthentication(),
            eventid: eventid
        })
    }).catch(error => {
        console.error('Failed to add participant:', error);
    });
}



function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchFeed() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/v1/feed`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        hash: getAuthentication(), // TODO insert search criteria or something here. 
                    })
                });

                const data = await response.json();
                console.log(data)

                if (!Array.isArray(data.posts)) {
                    throw new Error('Expected array of posts but received different data structure');
                }

                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching feed:', error);
            }
        }

        fetchFeed();
    }, []);

    return (
        <div className='flex flex-col items-center w-full py-5' {...props}>
            {posts.map(post => {
                const participants = post.PARTICIPANTS.split("; ");
                return (
                    <div className="flex flex-col items-center" key={post.HEADING} >
                        <div className="font-bold text-center text-xl">{post.HEADING}</div>
                        <div className="italic text-center text-lg">{post.CONTENT}</div>
                        {/*<Image src={post.IMAGE} alt="post" className="object-cover rounded-full mt-5 mb-3" width={300} height={300} />*/}
                        <div className="">{post.EVENT_ADDRESS}</div>
                        <div className="">{post.DATETIME}</div>
                        <div className="">Geposted am {post.DATE_POSTED} von {post.USER}</div>
                        {
                            participants.includes(getUser()) ? (
                                <div className="">
                                    {participants.length - 1} Teilnehmende außer dir
                                </div>
                            ) : (
                                <div className="">
                                    {participants.length} Teilnehmende.{" "}
                                    <a onClick={() => addParticipant(post.UUID)} href="#">
                                        Auch teilnehmen?
                                    </a>
                                </div>
                            )
                        }
                        <div className="" onClick={console.log("reposing not implemented yet")}>Repost</div>
                    </div>
                );
            })}
        </div>
    )
}

export default Feed