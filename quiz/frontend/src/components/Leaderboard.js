import { useState, useEffect } from "react";
import { Button, MenuItem, TextField } from "@material-ui/core";

function Leaderboard() {

    const [results, setResults] = useState([])
    const [val, setVal] = useState("rank")
    const [cat, setCat] = useState("all")
    const [valTime, setValTime] = useState("all")

    useEffect(function () {
        const getResults = async function () {
            const res = await fetch('http://localhost:3001/scores');
            const data = await res.json();
            setResults(data);
        }
        getResults()
    }, [])

    function filterTime(results, time) {
        if (time === "last_day")
            return results.filter(result => new Date(result.date).getDate() == new Date(results[results.length - 1].date).getDate())
        else if (time === "last_hour")
            return results.filter(result => new Date(result.date).getDate() == new Date(results[results.length - 1].date).getDate() &&
            new Date(result.date).getHours() == new Date(results[results.length - 1].date).getHours())
        else
            return results
    }

    function myFilter(results, cat, time) {
        let filtered
        if (cat === "computers" || cat === "history" || cat === "music") {
            filtered = results.filter(result => result.category == cat)
            return filterTime(filtered, time)
        }
        else
            return filterTime(results, time)
    }

    function mySort(results, cat, time) {
        let filtered
        if (val == "rank") {
            filtered = myFilter(results.sort((a, b) => b.rank - a.rank), cat, time)
            return filtered
        }
        else if (val == "time")
        {
            filtered = myFilter(results.sort((a, b) => b.time - a.time), cat, time)
            return filtered
        }
        else if (val == "points")
        {
            filtered = myFilter(results.sort((a, b) => b.points - a.points), cat, time)
            return filtered
        }
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Leaderboard:</h1>
            <TextField
                select
                label="Sort by"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                variant="outlined"
                style={{ width: 100, top: 20 }}
            >
                <MenuItem key="rank" value="rank">
                    Rank
                </MenuItem>
                <MenuItem key="time" value="time">
                    Time
                </MenuItem>
                <MenuItem key="points" value="points">
                    Points
                </MenuItem>
            </TextField>
            <TextField
                select
                label="Select Category"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                variant="outlined"
                style={{ width: 150, top: 20 }}
            >
                <MenuItem key="all" value="all">
                    All
                </MenuItem>
                <MenuItem key="computers" value="computers">
                    Computers
                </MenuItem>
                <MenuItem key="history" value="history">
                    History
                </MenuItem>
                <MenuItem key="music" value="music">
                    Music
                </MenuItem>
            </TextField>
            <TextField
                select
                label="Time"
                value={valTime}
                onChange={(e) => setValTime(e.target.value)}
                variant="outlined"
                style={{ width: 150, top: 20 }}
            >
                <MenuItem key="all" value="all">
                    All
                </MenuItem>
                <MenuItem key="last_hour" value="last_hour">
                    Last Hour
                </MenuItem>
                <MenuItem key="last_day" value="last_day">
                    Last Day
                </MenuItem>
            </TextField>
            <br />
            <br />
            <br />
            <h6>Category&nbsp;&nbsp;&nbsp;&nbsp;Rank&nbsp;&nbsp;&nbsp;&nbsp;Time&nbsp;&nbsp;&nbsp;&nbsp;Points&nbsp;&nbsp;&nbsp;&nbsp;Date</h6>
            <>{
                mySort(results, cat, valTime).map(result =>
                    <p key={result._id}>
                        {result.category}&nbsp;&nbsp;{result.rank}&nbsp;&nbsp;{result.time}s&nbsp;&nbsp;{result.points}s&nbsp;&nbsp;{result.date}
                    </p>)}</>
            <a href="http://localhost:3000/">Back</a>
        </div>
    )
}

export default Leaderboard