"use client";
import "/src/app/globals.css";
import React, { useState } from "react";
import { setAuthentication } from "/src/services/cookies";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function InputBox({children, label}) {
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

function LoginBox({ loginState, setLoginState }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/v1/authenticate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginState.user,
          password: loginState.pass,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.status !== "ok") {
          setMessage(data.status);
        } else {
          console.log("logged in")
          setAuthentication(data.hash);
          window.location = "/"
        }
      }
    } catch (error) {
      setMessage("Login failed: " + error.message + " Try Reloading the page.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-pink-500 mb-4">
        Let's dance!
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <TextInput
          id="userName"
          name="userName"
          type="text"
          label="Username"
          value={loginState.user}
          onChange={(e) =>
            setLoginState({ ...loginState, user: e.target.value })
          }
        />
        <TextInput
          id="password"
          name="password"
          type="password"
          label="Passwort"
          value={loginState.pass}
          onChange={(e) =>
            setLoginState({ ...loginState, pass: e.target.value })
          }
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
        >
         Einloggen
        </button>
        {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
      </form>
      {/* <p className="text-center text-gray-600 text-sm mt-4">
        Passwort vergessen?{" "}
        <a href="#" className="text-pink-500 hover:underline">
        Zurücksetzen
        </a>
      </p> */}
      <p className="text-center text-gray-600 text-sm mt-2">
      Sie haben noch kein Konto?{" "}
        <Link href="/register" className="text-pink-500 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function Login() {
  const [loginState, setLoginState] = useState({
    user: "",
    pass: "",
  });

  return (
    <div className="h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-gradient-to-r from-pink-500 to-purple-600 flex flex-col justify-center items-center text-white px-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Stepzz!</h1>
        <p className="text-center text-lg">
        Treten Sie ein in eine Welt voller Rhythmus, Leidenschaft und Gemeinschaft. Entdecken Sie Kurse,
        Events und knüpfen Sie Kontakte zu anderen Tanzbegeisterten.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex justify-center items-center">
        <LoginBox loginState={loginState} setLoginState={setLoginState} />
      </div>
    </div>
  );
}
