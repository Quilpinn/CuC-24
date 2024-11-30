"use client";
import "/src/app/globals.css";
import React, { useState } from "react";
import { getAuthentication } from "/src/services/cookies"

export default function NewPost() {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [eventData, setEventData] = useState({
    image: null,
    title: "",
    description: "",
    date: "",
    time: "",
    city: "",
    tags: "",
  });
  const [message, setMessage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData({ ...eventData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) =>{
    console.log("Saving Event:", eventData);
    e.preventDefault();
    try {
      console.log("Try Block ausgeführt.")
      const response = await fetch(`${apiUrl}/api/v1/events/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash: getAuthentication(),
          heading: eventData.title,
          content: eventData.description,
          city: eventData.city, 
          time: eventData.time,
          date: eventData.date,
          interests: eventData.tags
        }),
      });
      console.log(response)
      
      if (response.status == 201) {
        window.location = "/"
      } else {
        setMessage(data.status);
      }
    } catch (error) {
      setMessage("Posting failed: " + error.message);
    }
    };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 to-purple-600 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-pink-500 mb-4">Neues Event erstellen</h1>
        <div className="flex flex-col gap-4">
          {/* Image Upload */}
          <div className="flex items-center gap-4">
            <label className="w-32 h-32 flex justify-center items-center border-2 border-dashed rounded-lg cursor-pointer hover:border-pink-500 transition-all">
              {eventData.image ? (
                <img
                  src={eventData.image}
                  alt="Uploaded Event"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-500 text-xl font-bold">+</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <input
              type="text"
              placeholder="Veranstaltungstitel"
              value={eventData.title}
              onChange={(e) =>
                setEventData({ ...eventData, title: e.target.value })
              }
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Description */}
          <textarea
            placeholder="Veranstaltungsbeschreibung"
            value={eventData.description}
            onChange={(e) =>
              setEventData({ ...eventData, description: e.target.value })
            }
            className="w-full h-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
          ></textarea>

          {/* Date and Time */}
          <div className="flex gap-4">
            <input
              type="date"
              value={eventData.date}
              onChange={(e) =>
                setEventData({ ...eventData, date: e.target.value })
              }
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="time"
              value={eventData.time}
              onChange={(e) =>
                setEventData({ ...eventData, time: e.target.value })
              }
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          
          <input
              type="text"
              placeholder="Veranstaltungsort"
              value={eventData.city}
              onChange={(e) =>
                setEventData({ ...eventData, city: e.target.value })
              }
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

          {/* Tags */}
          <input
            type="text"
            placeholder="Tags (Komma-getrennt)"
            value={eventData.tags}
            onChange={(e) =>
              setEventData({ ...eventData, tags: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all mt-4"
          >
            Event speichern
          </button>
        </div>
      </div>
    </div>
  );
}
