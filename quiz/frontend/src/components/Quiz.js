import { useEffect, useState } from "react";
import Question from "./Question"

function Quiz(questions, setQuestions) {

    const [answers, setAnswers] = useState();
    const [current, setCurrent] = useState(0);


    useEffect(() => {
        setAnswers(
            questions.questions &&
            shuffle([
                questions.questions[current]?.correct_answer,
                ...questions.questions[current]?.incorrect_answers
            ])
        );
     }, [current, questions.questions]);

    function shuffle(answerss) {
        return answerss.sort(() => Math.random() - 0.5);
    };


    return (
        <div>
            <Question
                current={current}
                setCurrent={setCurrent}
                questions={questions}
                answers={answers}
                correct={questions.questions[current]?.correct_answer}
                setQuestions={setQuestions}
            />
        </div>
    );
}

export default Quiz