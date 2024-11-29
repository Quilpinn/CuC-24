"use client"
import "/src/app/globals.css";
import React, { useState } from 'react';

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

function LoginBox({loginState, setLoginState}) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/v1/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginState.user,
          password: loginState.pass
        })
      });
      
      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Invalid credentials' : 'Server error');
      }
      
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Login failed: ' + error.message);
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
          value={loginState.user}
          onChange={e => setLoginState({...loginState, user: e.target.value})}
        />
        <TextInput
          id="password"
          name="password"
          type="password"
          label="Passwort"
          value={loginState.pass}
          onChange={e => setLoginState({...loginState, pass: e.target.value})}
        />
        <button type="submit" className="btn btn-primary mt-4 border-4 border-white bg-white rounded-lg p-1 max-w-fit">
          Submit
        </button>
        <div>{message}</div>
      </form>
    </div>
  );
}

export default function Login() {
  const [loginState, setLoginState] = useState({
    user: "",
    pass: ""
  });

  return (
    <div className='p-5 flex flex-col items-center gap-4'>
      <LoginBox loginState={loginState} setLoginState={setLoginState} />
    </div>
  );
}