"use client"
import { getAuthentication, removeAuthentication } from "/src/app/cockies"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


function isAuthenticated() {
  try {
      const value = Cookies.get('auth');
      return value != null;
  }
  catch {
      return false;
  }
  
}

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


const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Choose an option');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

export function TopBar() {
  return (
    <div className='flex justify-between items-center w-full max-w-screen-lg topbar py-5 px-10 gap-x-7'>
      <div className='w-16'>
        <a href="/calendar">Kalender</a>
      </div>
      <div className='flex justify-end gap-x-7 font-headline font-bold'>
        <a href="/me">Me</a>
        { isAuthenticated() ? <Dropdown/> : 
          <a href="/login">Login</a>
        }
      </div>
    </div>
  );
}



async function addParticipant(eventid) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log('API URL:', apiUrl);
  return (
    <div>
      <TopBar/>
      {<Feed/>}
    </div>
  );
}
