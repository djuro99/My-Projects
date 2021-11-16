import { useState, useEffect } from "react";

function Results() {

    const [results, setResults] = useState({rank:0,time:0,points:0})

    useEffect(function () {
        const getResults = async function() {
            const res = await fetch('http://localhost:3001/questions/results');
            const data = await res.json();
            setResults(data);
        }
        getResults()
    }, {})

    return(
        <div style={{textAlign: 'center'}}>
            <h1>Results:</h1>
            <p>Rank: {results.rank}</p>
            <p>Time: {results.time}</p>
            <p>Points: {results.points}</p>
            <a href="http://localhost:3000/">Back</a>
        </div>
    )
}

export default Results