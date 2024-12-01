"use client";
import "/src/app/globals.css";
import React, { useState, useEffect } from "react";
import { use } from 'react';

const getInitials = (names) => {
  const initials = names.split(' ').map(name => name[0].toUpperCase())
  const initialString = initials.length == 1 ? initials[0] : initials[0] + initials[1]
  return initialString
}

export default function UserProfile({ params }) {
  const { id } = use(params);
  console.log(id);
  const [userData, setUserData] = useState({
    name: "",
    interests: "",
    city: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/users/getById`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuid: id })
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();

        console.log(data)
        const interestsAsArray = JSON.parse(data.interests);
        const interestsFormated = interestsAsArray.join(', ');
        const randomAvatarUrl = `https://api.dicebear.com/6.x/bottts/svg?seed=${Math.random()
        .toString(36)
        .substring(7)}`;
        
        setUserData({
          avatarUrl: randomAvatarUrl,
          username: data.username,
          name: data.uuid,
          interests: interestsFormated || "", // .join(", ") ? TODO?
          city: data.city,
        });
      } catch (error) {
        console.error('Error fetching user data:', error); // TODO: HTML "User not found!" if this happens.
      }
    };
  
    fetchUserData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 to-purple-600 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center flex flex-col items-center gap-6">
        {/* Avatar */}
        <div className="relative">
            <div className="flex items-center justify-center text-2xl w-20 h-20 bg-pink-300 text-pink-800 font-bold rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {userData && userData.username && getInitials(userData.username)}
            </div>
        </div>

        {/* User Name */}
        <h1 className="text-2xl font-bold text-gray-800">
          {userData.username}
        </h1>

        {/* Info Section */}
        <div className="w-full flex flex-col gap-4 text-left">
          {/* City */}
          <div className="flex justify-left gap-2 items-center">
            <h2 className="text-lg font-semibold text-gray-600">Stadt:</h2>
            <p className="text-gray-800 font-medium">{userData.city}</p>
          </div>
          {/* Interests */}
          <div className="flex justify-left gap-2 items-center">
            <h2 className="text-lg font-semibold text-gray-600">Interessen:</h2>
            <p className="text-gray-800 font-medium">{userData.interests}</p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-8 rounded-lg hover:shadow-lg transition-all font-semibold"
          onClick={() => alert("Edit Profile functionality not implemented yet!")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
