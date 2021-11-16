import React from 'react'
import {useState} from 'react';
import Button from "./Button";


export default function Register() {
    const[email, setEmail] = useState('');
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    async function Register(e){
        e.preventDefault();

        let data = {username: username, password: password, email: email};
        const res = await fetch('http://localhost:3001/users/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });


        setUsername("");
        setPassword("");
        setEmail("");
    }

    return (
        <div>
            <form className="form-group" onSubmit={Register}>
            <input type="text" className="form-control" name="email" placeholder="E-mail" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                <input type="text" className="form-control" name="username" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                <input type="password" className="form-control" name="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                <Button text="Register" />
            </form>
            <a href="http://localhost:3000/">Back</a>
        </div>
    )
}