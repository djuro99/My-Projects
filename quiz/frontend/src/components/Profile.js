import { useState, useEffect } from "react";

function Profile() {

    const [user, setUser] = useState({rank:0,time:0,points:0})

    useEffect(function () {
        const getResults = async function() {
            const res = await fetch('http://localhost:3001/questions/user');
            const data = await res.json();
         setUser(data);
        }
        getResults()
    }, {})

    return(
        <div style={{textAlign: 'center'}}>
            <h3>{user.username}</h3>
            <a href="http://localhost:3000/">Back</a>
        </div>
    )
}

export default Profile