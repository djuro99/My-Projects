import { Button } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router";
import "./Question.css";
import axios from "axios"

const Question = ({
    current,
    setCurrent,
    questions,
    answers,
    correct,
    setQuestions,
}) => {
    const [selected, setSelected] = useState();
    const [warning, setWarning] = useState("");

    const history = useHistory();

    async function addTime() {
        await axios.get('http://localhost:3001/questions/addTime')
    }

    async function calculatePoints() {
        await axios.get('http://localhost:3001/questions/calculatePoints')
    }

    async function downgrade() {
        await axios.get('http://localhost:3001/questions/downgrade')
    }

    const select = (i) => {
        if (selected === i && selected === correct) {
            return "select";
        }
        else if (selected === i && selected !== correct) {
            return "wrong";
        };
    };

    const check = (i) => {
        setSelected(i);
        if (i === correct) {
            addTime()
        }
        else if (i !== correct) {
            downgrade()
        };
        setWarning("")
    };

    const next = async () => {
        if (current > 8) {
            calculatePoints()
            history.push("/results");
        } else if (selected === correct) {
            setCurrent(current + 1);
            calculatePoints()
            setSelected();
        }
        else
            setWarning("You must choose the correct answer.")
    };

    return (
        <div className="question">
            <h1>Question {current + 1} :</h1>

            <div className="singleQuestion">
                <h2>{questions.questions[current].question}</h2>
                <div className="answers">
                    {answers &&
                        answers.map((i) => (
                            <button
                                className={`singleOption  ${selected && select(i)}`}
                                key={i}
                                onClick={() => check(i)}
                                disabled={selected === correct}
                            >
                                {i}
                            </button>
                        ))}
                </div>
                <div className="controls">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ width: 185 }}
                        onClick={next}
                    >
                        {current > 20 ? "Finish" : "Next Question"}
                    </Button>
                </div>
            </div>
            <h3>{warning}</h3>
        </div>
    );
};

export default Question;
