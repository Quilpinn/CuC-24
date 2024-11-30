"use client";
import React, { useEffect, useState } from "react";
import eventImage from "/src/assets/img.png";
import { use } from 'react';
import { getAuthentication } from "@/services/cookies";
import { useRouter } from 'next/navigation'

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getPostDetails = async (eventId) => {
  try {

    const response = await fetch(`${apiUrl}/api/v1/events/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hash: getAuthentication(),
        eventId: eventId
      })
    })

    const data = await response.json()

    return {
      city: data.CITY,
      content: data.CONTENT,
      heading: data.HEADING,
      participants: data.PARTICIPANTS,
      pictureUrl: data.PICTURE_URL,
      time: data.TIMESTAMP
    }
  } catch (e) {
    return e
  }
}

export default function EventDetails({ params }) {
  const { id } = use(params);
  const [eventData, setEventData] = useState()
  // const [likes, setLikes] = useState(eventData.likes);
  // const [participants, setParticipants] = useState(eventData.participants);
  // const [comments, setComments] = useState(eventData.comments);
  const [comment, setComment] = useState("");
  const router = useRouter()

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${apiUrl}/api/v1/posts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heading: eventData.heading,
          content: comment,
          hash: getAuthentication(),
          eventId: id,
        }),
      });
      router.push('/');
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleLike = () => setLikes(likes + 1);
  const handleTeilnehmen = () => setParticipants(participants + 1);

  const handleShare = () => {
    const shareLink = `${window.location.href}`;
    navigator.clipboard.writeText(shareLink);
    alert(`Der Event-Link wurde kopiert: ${shareLink}`);
  };

  // Fetch event data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getPostDetails(id);
        setEventData(responseData);
      } catch (e) {
        console.error("Error fetching event details:", e);
      }
    };

    fetchData();
  }, [])

  const EventDetails = () => <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800">{eventData.heading}</h1>
    <p className="text-gray-600 mt-4">{eventData.content}</p>
    <div className="mt-6 text-gray-700">
      <p>
        <strong>📍 Ort: {eventData.city}</strong>
      </p>
      <p>
        <strong>🕒 Zeit: {eventData.time}</strong>{" "}
      </p>
      {/* <p>
      <strong>👥 Teilnehmer:</strong> {participants}
    </p> */}
    </div>

    {/* Buttons */}
    <div className="flex flex-wrap gap-4 mt-6">
      {/* <button
      onClick={handleLike}
      className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
    >
      ❤️ Gefällt mir ({likes})
    </button> */}
      {/* <button
      onClick={handleTeilnehmen}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
    >
      🎉 Teilnehmen
    </button> */}
      <button
        onClick={handleShare}
        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
      >
        📤 Teilen
      </button>
    </div>
  </div>

  {/* Comments Section */ }
  const CommentSection = () => <div className="p-6 border-t border-gray-200">
    {/* Comment Form */}
    <form onSubmit={handleCommentSubmit} className="mt-4 flex flex-col gap-2">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Schreibe einen Kommentar..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button
        type="submit"
        className="self-start bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
      >
        Kommentar hinzufügen
      </button>
    </form>
  </div>


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Event Image
        <img
          src={eventData.image}
          alt={eventData.title}
          className="w-full h-64 object-cover"
        /> */}
        {eventData && <EventDetails/>}
        {/* Event Details */}
        <CommentSection/>
      </div>
    </div>
  );
}
