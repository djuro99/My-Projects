import {useState, useEffect} from 'react';
import {BrowserRouter, Route, useHistory, Link} from 'react-router-dom';
import { Button, MenuItem, TextField } from "@material-ui/core";
import Login from './Login';
import Register from './Register';


function Home({questions, setQuestions, getQuestions}) {
    const [category, setCategory] = useState("computers");

    let history = useHistory();

    const start = async () => {
        const res = await fetch('http://localhost:3001/questions/generate/' + category);
        const data = await res.json();
        setQuestions(data);
        history.push("/quiz");
    }

    return (
        <BrowserRouter>
            <div style={{textAlign: 'center'}}>
                <h1>Quiz</h1>
                <a href="http://localhost:3000/login">Login </a>
                <a href="http://localhost:3000/register">Register </a>
                <br/>
                <TextField
                    select
                    label="Select Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    variant="outlined"
                    style={{ width: 200, top: 20 }}
                >
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
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={start}
                    style={{ margin: 20 }}
                >
                    Start
                </Button>
                <br/>
                <a href="http://localhost:3000/leaderboard">Leaderboard </a>
            </div>
        </BrowserRouter>
    );
}

export default Home;
