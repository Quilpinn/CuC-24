"use client";
import "/src/app/globals.css";
import React, { useState } from "react";
import { setAuthentication } from "/src/services/cookies";
import Link from "next/link";
import { useRouter } from "next/navigation"

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function InputBox({ children, label }) {
  return (
    <div className="w-full mb-3">
      <label className="block text-gray-700 text-sm font-medium mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ label, hint, ...props }) {
  return (
    <InputBox label={label}>
      {hint && <div className="text-gray-500 text-xs mb-1">{hint}</div>}
      <input
        type="text"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
        {...props}
      />
    </InputBox>
  );
}

function RegisterBox({ registerState, setRegisterState }) {
  const [message, setMessage] = useState("");
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const interestsArray = registerState.interests.split(",");

      console.log("before fetch")
      const response = await fetch(`${apiUrl}/api/v1/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerState.user,
          email: registerState.mail,
          password: registerState.pass,
          interests: interestsArray,
          city: registerState.city,
        }),
      });
      console.log("after fetch")

      const data = await response.json();
      if (data.status !== "ok") {
        setMessage(data.status);
      } else {
        router.push('/login')
      }
    } catch (error) {
      setMessage("Registering failed: " + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-xl font-bold text-center text-pink-500 mb-4">
        Erstellen Sie Ihr Stepzz-Konto
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
        <TextInput
          id="userName"
          name="userName"
          type="text"
          label="Benutzername"
          value={registerState.user}
          onChange={(e) =>
            setRegisterState({ ...registerState, user: e.target.value })
          }
        />
        <TextInput
          id="mail"
          name="mail"
          type="email"
          label="E-Mail Addresse"
          value={registerState.mail}
          onChange={(e) =>
            setRegisterState({ ...registerState, mail: e.target.value })
          }
        />
        <TextInput
          id="password"
          name="password"
          type="password"
          label="Passwort"
          value={registerState.pass}
          onChange={(e) =>
            setRegisterState({ ...registerState, pass: e.target.value })
          }
        />
        <TextInput
          id="interests"
          name="interests"
          placeholder="Bitte gib eine ',' separierte Liste deiner Interessen an."
          type="text"
          label="Interessen"
          value={registerState.interests}
          onChange={(e) =>
            setRegisterState({ ...registerState, interests: e.target.value })
          }
        />
        <TextInput
          id="city"
          name="city"
          type="text"
          label="Stadt"
          value={registerState.city}
          onChange={(e) =>
            setRegisterState({ ...registerState, city: e.target.value })
          }
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
        >
          Registrieren
        </button>
        {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
      </form>
      <p className="text-center text-gray-600 text-sm mt-4">
        Hast du schon ein Konto?{" "}
        <Link href="/login" className="text-pink-500 hover:underline">
          Einloggen
        </Link>
      </p>
    </div>
  );
}

export default function Register() {
  const [registerState, setRegisterState] = useState({
    user: "",
    mail: "",
    pass: "",
    interests: "",
    city: "",
  });

  return (
    <div className="h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-gradient-to-r from-pink-500 to-purple-600 flex flex-col justify-center items-center text-white px-8">
        <h1 className="text-4xl font-bold mb-4">Willkommen bei Stepzz!</h1>
        <p className="text-center text-lg">
          Treten Sie unserer lebendigen Tanzgemeinschaft bei, knüpfen Sie
          Kontakte zu Enthusiasten und nehmen Sie an Veranstaltungen und Kursen
          teil, um sich durch Rhythmus und Bewegung auszudrücken.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex justify-center items-center">
        <RegisterBox
          registerState={registerState}
          setRegisterState={setRegisterState}
        />
      </div>
    </div>
  );
}
