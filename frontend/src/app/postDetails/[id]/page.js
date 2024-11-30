"use client";
import React, { useState } from "react";
import eventImage from "/src/assets/img.png";
import { use } from 'react';

export default function EventDetails({ params }) {
  const { id } = use(params);
  console.log(id);
  // Hardcoded event data
  const fakeEvent = {
    id: 1,
    title: "Salsa Night in Berlin",
    image: eventImage, // Local image path
    description: "Erlebe eine unvergessliche Nacht voller Salsa-Musik und Tanz!",
    location: "Berlin, Deutschland",
    time: "2024-12-15T19:00:00Z",
    likes: 42,
    participants: 120,
    comments: [
      "Das wird spannend!",
      "Ich liebe Salsa-Tanznächte!",
      "Kann es kaum erwarten!",
    ],
  };

  const [likes, setLikes] = useState(fakeEvent.likes);
  const [participants, setParticipants] = useState(fakeEvent.participants);
  const [comments, setComments] = useState(fakeEvent.comments);
  const [comment, setComment] = useState("");

  const handleLike = () => setLikes(likes + 1);
  const handleTeilnehmen = () => setParticipants(participants + 1);
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, comment]);
    setComment("");
  };

  const handleShare = () => {
    const shareLink = `${window.location.href}`;
    navigator.clipboard.writeText(shareLink);
    alert(`Der Event-Link wurde kopiert: ${shareLink}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Event Image */}
        <img
          src={fakeEvent.image}
          alt={fakeEvent.title}
          className="w-full h-64 object-cover"
        />

        {/* Event Details */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">{fakeEvent.title}</h1>
          <p className="text-gray-600 mt-4">{fakeEvent.description}</p>
          <div className="mt-6 text-gray-700">
            <p>
              <strong>📍 Ort:</strong> {fakeEvent.location}
            </p>
            <p>
              <strong>🕒 Zeit:</strong>{" "}
              {new Date(fakeEvent.time).toLocaleString("de-DE", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p>
              <strong>👥 Teilnehmer:</strong> {participants}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handleLike}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              ❤️ Gefällt mir ({likes})
            </button>
            <button
              onClick={handleTeilnehmen}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              🎉 Teilnehmen
            </button>
            <button
              onClick={handleShare}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              📤 Teilen
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Kommentare</h2>
          <ul className="mt-4 space-y-3">
            {comments.map((c, index) => (
              <li
                key={index}
                className="p-3 bg-gray-100 rounded-lg text-gray-800"
              >
                {c}
              </li>
            ))}
          </ul>

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
      </div>
    </div>
  );
}
