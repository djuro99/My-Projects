import { useState, useEffect } from "react";
import {NavLink, useHistory} from "react-router-dom";

function Admin() {

    //const[pass, setPass] = useState(false)

    let history = useHistory()

    /*function password() {
        if (pass == false) {
            let text;
            let password = prompt("Enter password:");
            if (password != "admin123" || password == null)
                history.push("/");
            else
                setPass(true)
        }
    }

    password();*/

    const [results, setResults] = useState([])
    const [val, setVal] = useState("rank")
    const [cat, setCat] = useState("computers")
    const [id, setId] = useState("")


    useEffect(function () {
        const getResults = async function () {
            const res = await fetch('http://localhost:3001/questions/');
            const data = await res.json();
            setResults(data);
        }
        getResults()
    }, [])

    async function deleteQuestion(id, cat) {
        await fetch('http://localhost:3001/questions/delete/' + id + '&' + cat);
        window.location.reload();
    }


    return (
        <div style={{ textAlign: 'left' }}>
            <NavLink to={"/add"}><button>Add new question</button></NavLink>
            <>{
                results.map(result => result.results.map(result2 =>
                    <p>
                        {result2.question} <i><b>Category:</b> {result.category} </i>
                        <button onClick={
                            () => deleteQuestion(result.results.map(function(e) { return e.question; }).indexOf(result2.question), 
                            result.category)}>Remove</button>
                            <NavLink to={"/edit/" + result.results.map(function(e) { return e.question; }).indexOf(result2.question)
                        + "/" + result.category}><button>Edit</button></NavLink>
                    </p>
                ))}</>
        </div>
    )
}

export default Admin