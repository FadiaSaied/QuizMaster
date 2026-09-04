import { Quiz } from "./quiz.js";
import { Question } from "./question.js";

const playerNameInput = document.getElementById("playerName");
const categoryInput = document.getElementById("categoryMenu");
const difficultyOptions = document.getElementById("difficultyOptions");
const questionsNumber = document.getElementById("questionsNumber");
const startQuizBtn = document.getElementById("startQuiz");
const quizOptions = document.getElementById("quizOptions");
const numberInput = document.getElementById("questionsNumber");
const formError = document.querySelector(".form-error");

export let quiz;
export let allQuestions;
startQuizBtn.addEventListener("click", async function () {
  if (numberInput.value === "") {
    formError.classList.remove("d-none");
    setTimeout(() => {
      formError.classList.add("d-none");
    }, 2000);

    return;
  } else {
    formError.classList.add("d-none");
    quizOptions.classList.add("d-none");

    quiz = new Quiz(
      playerNameInput.value,
      questionsNumber.value,
      categoryInput.value,
      difficultyOptions.value,
    );

    allQuestions = await quiz.getQuestions();
    

    let question = new Question(0);

    question.displayQuestion();
  }
});








