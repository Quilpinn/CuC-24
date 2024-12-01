"use client";
import React, { useEffect, useState } from "react";
import { use } from 'react';
import { getAuthentication } from "@/services/cookies";
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getUsername() {
  try {
    const response = await fetch(`${apiUrl}/api/v1/users/getByHash`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hash: getAuthentication(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get username.");
    }
    const data = await response.json();
    return data.username;
  } catch (error) {
    console.error("Failed to get username:", error);
    return null;
  }
}

const getPostDetails = async (eventId) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/events/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hash: getAuthentication(),
        eventId: eventId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }

    const data = await response.json();
    return {
      city: data.CITY,
      content: data.CONTENT,
      heading: data.HEADING,
      participants: data.PARTICIPANTS,
      pictureUrl: data.PICTURE_URL,
      time: data.TIMESTAMP,
    };
  } catch (error) {
    console.error("Error fetching event details:", error);
    return null;
  }
};

function CommentSection({ comment, setComment, handleCommentSubmit }) {
  return (
    <div className="p-6 border-t border-gray-200">
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
  );
}

function ParticipantSection({ participants, username, onParticipate, eventId }) {
  if (!participants) {
    return (
      <a
        onClick={() => onParticipate(eventId)}
        href="#"
        className="text-blue-500 hover:underline"
      >
        Melde dich als erster an!
      </a>
    );
  }

  const participantstring = participants;
  const participantList = participants.split("; ");
  const isParticipating = participantList.includes(username);
  const otherParticipants = participantList.length - (isParticipating ? 1 : 0);

  if (isParticipating && otherParticipants -1 > 0) {
    return (
      <p>
        Du bist dabei!
        {otherParticipants -1 > 0 ? "" : `${participantstring} auch.`}
      </p>
    );
  }

  return (
    <p>
      {participantstring} nehmen teil.{" "}
      <a
        onClick={() => onParticipate(eventId)}
        href="#"
        className="text-blue-500 hover:underline"
      >
        Auch teilnehmen?
      </a>
    </p>
  );
}

export default function EventDetails({ params }) {
  const { id } = use(params);
  const [eventData, setEventData] = useState(null);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [userData, eventDetails] = await Promise.all([
          getUsername(),
          getPostDetails(id)
        ]);
        
        setUsername(userData);
        setEventData(eventDetails);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !eventData) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/posts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heading: eventData.heading,
          content: comment,
          hash: getAuthentication(),
          eventId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      router.push("/");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleParticipate = async (eventId) => {
    // Implement your participation logic here
    console.log("Handling participation for event:", eventId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p>Laden...</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p>Event nicht gefunden oder ein Fehler ist aufgetreten.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {eventData.heading}
          </h1>
          <p className="text-gray-600 mt-4">{eventData.content}</p>
          <div className="mt-6 text-gray-700">
            <p>
              <strong>📍 Ort: {eventData.city}</strong>
            </p>
            <p>
              <strong>🕒 Zeit: {eventData.time}</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => {
                const shareLink = `${window.location.href}`;
                navigator.clipboard.writeText(shareLink);
                alert(`Der Event-Link wurde kopiert: ${shareLink}`);
              }}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              📤 Teilen
            </button>
          </div>
        </div>

        <div className="mt-4 px-6">
          <ParticipantSection
            participants={eventData.participants}
            username={username}
            onParticipate={handleParticipate}
            eventId={id}
          />
        </div>

        <CommentSection
          comment={comment}
          setComment={setComment}
          handleCommentSubmit={handleCommentSubmit}
        />
      </div>
    </div>
  );
}