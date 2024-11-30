import { getAuthentication, removeAuthentication, isAuthenticated } from "/src/app/cockies"
import React, { useState } from 'react';

const Dropdown = () => {
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

    try {
      const response = await fetch(`localhost:8484/api/v1/user/get`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash: getAuthentication(),
        })
      });
      const username = await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
    }

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
          src="/backend/src/images/default.PNG" 
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
        { isAuthenticated() ? <a href="/login">Login</a>
          : <Dropdown/>
        }
      </div>
    </div>
  );
}



export function NewPost() {
  
}



async function Feed(props) {
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const feed = fetch(`${apiUrl}/api/v1/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hash: getAuthentication(),
      username: registerState.user,
      password: registerState.pass,
      email: registerState.mail
    })
  })

  return (
    <div className='flex flex-col items-center w-full py-5' {...props}>
      {feed.map(post => (
        <div className="flex flex-col items-center" key={post.name} >
          <div className="font-bold text-center text-xl">{post.name}</div>
          <div className="italic text-center text-lg">{post.text}</div>
          <Image src={post.image} alt="post" className="object-cover rounded-full mt-5 mb-3" width={300} height={300} />
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div>
      <TopBar/>
      <Feed/>
    </div>
  );
}
