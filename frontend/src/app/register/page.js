"use client"
import "/src/app/globals.css";
import React, { useState } from 'react';
import { setAuthentication } from "/src/app/cockies"

//const apiUrl = process.env.API_URL;
const apiUrl = "https://probable-halibut-qg5pq4pg566c9vr6-8484.app.github.dev:8484"
console.log(apiUrl)

function InputBox({children, label}) {
  return (
    <div>
      <div>
        <label>{label}</label>
      </div>
      {children}
    </div>
  );
}

function TextInput({label, ...props}) {
  return (
    <InputBox label={label}>
      <input
        type="text"
        className="input input-bordered w-full"
        {...props}
      />
    </InputBox>
  );
}

function RegisterBox({registerState, setRegisterState}) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(registerState.user);
        console.log(registerState.pass);
      const response = await fetch(`${apiUrl}/api/v1/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerState.user,
          email: registerState.mail,
          password: registerState.pass
          
        })
      });
      console.log("Got here")
      
      const data = await response.json();
      if (data.status != "ok") {
        setMessage(data.status);
      }
      else {
        setAuthentication(data.hash);
      }
      
    } catch (error) {
      setMessage('Registering failed: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 border-4 border-primaer rounded-md p-4 max-w-screen-sm w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <TextInput
          id="userName"
          name="userName"
          type="text"
          label="Benutzername"
          value={registerState.user}
          onChange={e => setRegisterState({...registerState, user: e.target.value})}
        />
        <TextInput
          id="mail"
          name="mail"
          type="email"
          label="E-Mail Adresse"
          value={registerState.mail}
          onChange={e => setRegisterState({...registerState, mail: e.target.value})}
        />
        <TextInput
          id="password"
          name="password"
          type="password"
          label="Passwort"
          value={registerState.pass}
          onChange={e => setRegisterState({...registerState, pass: e.target.value})}
        />
        <button type="submit" className="btn btn-primary mt-4 border-4 border-white bg-white rounded-lg p-1 max-w-fit">
          Submit
        </button>
        <div>{message}</div>
      </form>
    </div>
  );
}

export default function Register() {
  const [registerState, setRegisterState] = useState({
    user: "",
    pass: ""
  });

  return (
    <div className='p-5 flex flex-col items-center gap-4'>
      <RegisterBox registerState={registerState} setRegisterState={setRegisterState} />
    </div>
  );
}