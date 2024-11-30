"use client";
import "/src/app/globals.css";
import React, { useState } from "react";
import { setAuthentication } from "/src/app/cockies";

const apiUrl = "https://probable-halibut-qg5pq4pg566c9vr6-8484.app.github.dev:8484";

function InputBox({ children, label }) {
  return (
    <div className="w-full mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ label, ...props }) {
  return (
    <InputBox label={label}>
      <input
        type="text"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
        {...props}
      />
    </InputBox>
  );
}

function RegisterBox({ registerState, setRegisterState }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/v1/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerState.user,
          email: registerState.mail,
          password: registerState.pass,
        }),
      });

      const data = await response.json();
      if (data.status !== "ok") {
        setMessage(data.status);
      } else {
        setAuthentication(data.hash);
      }
    } catch (error) {
      setMessage("Registering failed: " + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-pink-500 mb-4">
      Erstellen Sie Ihr Stepzz-Konto
        </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <TextInput
          id="userName"
          name="userName"
          type="text"
          label="Username"
          value={registerState.user}
          onChange={(e) =>
            setRegisterState({ ...registerState, user: e.target.value })
          }
        />
        <TextInput
          id="mail"
          name="mail"
          type="email"
          label="E-Mail Address"
          value={registerState.mail}
          onChange={(e) =>
            setRegisterState({ ...registerState, mail: e.target.value })
          }
        />
        <TextInput
          id="password"
          name="password"
          type="password"
          label="Password"
          value={registerState.pass}
          onChange={(e) =>
            setRegisterState({ ...registerState, pass: e.target.value })
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
        <a href="#" className="text-pink-500 hover:underline">
        Einloggen
        </a>
      </p>
    </div>
  );
}

export default function Register() {
  const [registerState, setRegisterState] = useState({
    user: "",
    mail: "",
    pass: "",
  });

  return (
    <div className="h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-gradient-to-r from-pink-500 to-purple-600 flex flex-col justify-center items-center text-white px-8">
        <h1 className="text-4xl font-bold mb-4">Willkommen bei Stepzz!</h1>
        <p className="text-center text-lg">
        Treten Sie unserer lebendigen Tanzgemeinschaft bei, knüpfen Sie Kontakte zu Enthusiasten und nehmen Sie an Veranstaltungen und Kursen teil, um sich durch Rhythmus und Bewegung auszudrücken.
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
