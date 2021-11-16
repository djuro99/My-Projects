import {useState} from 'react';
import { useHistory } from 'react-router-dom'

function AddQuestion() {

    const [question, setQuestion] = useState('');
    const [correct_answer, setCorrect] = useState('');
    const [incorrect_answer1, setIncorrect1] = useState('');
    const [incorrect_answer2, setIncorrect2] = useState('');
    const [incorrect_answer3, setIncorrect3] = useState('');
    const [category, setCategory] = useState("computers");

    let history = useHistory()

    async function add(e) 
        {
            e.preventDefault()
            let data = {category: category, question: question, correct_answer: correct_answer, incorrect_answer1: incorrect_answer1,
                incorrect_answer2: incorrect_answer2, incorrect_answer3: incorrect_answer3 };
            const res = await fetch('http://localhost:3001/questions/', {
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
                <form onSubmit={add}>
                    <textarea name="question" placeholder="Question name" rows="5" cols="25" onChange={(e) => { setQuestion(e.target.value) }} required></textarea>
                    <br/>
                    <textarea name="correct_answer" placeholder="Correct answer" rows="5" cols="25" onChange={(e) => { setCorrect(e.target.value) }} required></textarea>
                    <br/>
                    <textarea name="incorrect_answer1" placeholder="Incorrect answer 1" rows="5" cols="25" onChange={(e) => { setIncorrect1(e.target.value) }} required></textarea>
                    <br/>
                    <textarea name="incorrect_answer1" placeholder="Incorrect answer 2" rows="5" cols="25" onChange={(e) => { setIncorrect2(e.target.value) }} required></textarea>
                    <br/>
                    <textarea name="incorrect_answer1" placeholder="Incorrect answer 3" rows="5" cols="25" onChange={(e) => { setIncorrect3(e.target.value) }} required></textarea>
                    <br/>
                    <p>Category: </p>
                    <input type="radio" id="computers" name="category" value="computers" onChange={(e) => { setCategory(e.target.value) }} checked="checked" />
                    <label for="computers">Computers</label><br/>
                    <input type="radio" id="history" name="category" value="history" onChange={(e) => { setCategory(e.target.value) }}/>
                    <label for="history">History</label><br/>
                    <input type="radio" id="music" name="category" value="music" onChange={(e) => { setCategory(e.target.value) }}/>
                    <label for="music">Music</label><br/><br/>
                    <div class="tp">
                        <input type="submit" value="Add question" />
                    </div>
                    <br/>
                </form>
            </div>
        )
    }

export default AddQuestion