import React from 'react'
import {Redirect} from 'react-router-dom'

export default function Logout() {

    async function Logout(e) {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/users/logout')
    console.log('ok')
    }

    return (
        <Redirect to="/" />
    )
}
