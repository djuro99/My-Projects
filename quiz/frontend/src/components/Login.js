import { useState } from 'react'
import Button from "./Button";
import {Redirect, useHistory} from "react-router-dom"

function Login(props) {
    const[username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false)

    let history = useHistory();

    async function Login(e) {
        e.preventDefault();

        let data = { username: username, password: password };
        try {
            const res = await fetch('http://localhost:3001/users/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const response = await res.json();
            console.log(response)
            if (response.email != null && response.password != null && response.username != null) {
                setLoginSuccess(true)
                history.push("/")
            }
            else {
                setLoginSuccess(false)
                history.push("/login")
            }
        }
        catch {
            history.push("/")
        }

        setUsername("");
        setPassword("");
    }


    return (
        <div>
            <form className="form-group" onSubmit={Login}>
                <input type="text" className="form-control" name="username" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                <input type="password" className="form-control" name="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                <Button text="Login" />
            </form>
        </div>
    )
}

export default Login;