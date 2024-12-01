import Link from 'next/link'
import { useState, useEffect } from 'react'

const getInitials = (names) => {
    const initials = names.split(' ').map(name => name[0].toUpperCase())
    const initialString = initials.length == 1 ? initials[0] : initials[0] + initials[1]
    return initialString
  }
  

export default function PublisherLink({userUuid}) {
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
              body: JSON.stringify({ uuid: userUuid })
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
              uuid: data.uuid,
              interests: interestsFormated || "", // .join(", ") ? TODO?
              city: data.city,
            });
          } catch (error) {
            console.error('Error fetching user data:', error); // TODO: HTML "User not found!" if this happens.
          }
        };
      
        fetchUserData();
      }, [userUuid]);

      console.log(userUuid)

    return <div className='flex items-center gap-2 my-4'>
        <div>gepostet von: </div> <Link href={`/profile/${userData.uuid}`}>
        <div className="flex items-center justify-center w-8 h-8 bg-pink-300 text-pink-800 font-bold rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {userData && userData.username && getInitials(userData.username)}
            </div>
        </Link>
        <div>{userData.username}</div>
    </div>
}