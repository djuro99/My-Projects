import {useState} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Quiz from './components/Quiz'
import Home from './components/Home'
import Results from './components/Results'
import Leaderboard from './components/Leaderboard'
import Login from './components/Login';
import Register from './components/Register';
import AddQuestion from './components/AddQuestion';
import EditQuestion from './components/EditQuestion';
import Admin from './components/Admin';
import Profile from './components/Profile';


function App() {
    const [questions, setQuestions] = useState([]);

    const getQuestions = async function (category) {
        const res = await fetch('http://localhost:3001/questions/generate/' + category);
        const data = await res.json();
        setQuestions(data);
    }

    return (
        <BrowserRouter>
            <Route path="/" exact>
                <Home questions={questions} setQuestions={setQuestions} getQuestions={getQuestions} />
            </Route>
            <Route path='/quiz'>
                <Quiz questions={questions} setQuestions={setQuestions}/>
            </Route>
            <Route path='/results'>
                <Results />
            </Route>
            <Route path='/profile'>
                <Profile />
            </Route>
            <Route path='/leaderboard'>
                <Leaderboard />
            </Route>
            <Route path='/login'>
                <Login />
            </Route>
            <Route path='/register'>
                <Register />
            </Route>
            <Route path='/add'>
                <AddQuestion />
            </Route>
            <Route path='/edit/:id/:cat'>
                <EditQuestion />
            </Route>
            <Route path='/admin'>
                <Admin />
            </Route>
        </BrowserRouter>
    );
}

export default App;
