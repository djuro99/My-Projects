import {useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom'

function AddQuestion() {

    const { id, cat } = useParams();
    const [question, setQuestion] = useState('');
    const [correct_answer, setCorrect] = useState('');
    const [incorrect_answer1, setIncorrect1] = useState('');
    const [incorrect_answer2, setIncorrect2] = useState('');
    const [incorrect_answer3, setIncorrect3] = useState('');
    const [category, setCategory] = useState("computers");
    const [results, setResults] = useState([])

    useEffect(function () {
        const getResults = async function () {
            const res = await fetch('http://localhost:3001/questions/' + cat);
            const data = await res.json();
            setResults(data);
            setQuestion(data[0].results[id].question)
            setCorrect(data[0].results[id].correct_answer)
            setIncorrect1(data[0].results[id].incorrect_answers[0])
            setIncorrect2(data[0].results[id].incorrect_answers[1])
            setIncorrect3(data[0].results[id].incorrect_answers[2])
        }
        getResults()
    }, [])

    let history = useHistory()

    async function edit(e) 
        {
            e.preventDefault()
            let data = {category: category, question: question, correct_answer: correct_answer, incorrect_answer1: incorrect_answer1,
                incorrect_answer2: incorrect_answer2, incorrect_answer3: incorrect_answer3 };
            const res = await fetch('http://localhost:3001/questions/edit/' + id + '&' + cat, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });


            setQuestion("");
            setCorrect("");
            setIncorrect1("");
            setIncorrect2("");
            setIncorrect3("");
            history.push("/admin")
        }


        return (
            <div>
                <form onSubmit={edit}>
                    <textarea id="textArea" name="question" placeholder="Question name" rows="5" cols="25" value={question} onChange={(e) => { setQuestion(e.target.value) }} required></textarea>
                    <br/>
                    <h6>Correct answer:</h6>
                    <textarea name="correct_answer" placeholder="Correct answer" rows="5" cols="25" value={correct_answer} onChange={(e) => { setCorrect(e.target.value) }} required></textarea>
                    <br/>
                    <h6>Incorrect answers:</h6>
                    <textarea name="incorrect_answer1" placeholder="Incorrect answer 1" rows="5" cols="25" value={incorrect_answer1} onChange={(e) => { setIncorrect1(e.target.value) }} required></textarea>
                    <br/>
                    <textarea name="incorrect_answer1" placeholder="Incorrect answer 2" rows="5" cols="25" value={incorrect_answer2} onChange={(e) => { setIncorrect2(e.target.value) }} required></textarea>
                    <br/>
                    <textarea name="incorrect_answer1" placeholder="Incorrect answer 3" rows="5" cols="25" value={incorrect_answer3} onChange={(e) => { setIncorrect3(e.target.value) }} required></textarea>
                    <br/>
                    <div class="tp">
                        <input type="submit" value="Edit question" />
                    </div>
                    <br/>
                </form>
            </div>
        )
    }

export default AddQuestion