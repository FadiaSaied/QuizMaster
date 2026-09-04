import { allQuestions } from "./index.js";
import { quiz } from "./index.js";

const containerQuestion = document.getElementById("questionsContainer");

const results = document.querySelector(".results-card");
const correctSound = new Audio(
  "../sounds/mixkit-correct-answer-reward-952.wav",
);
const wrongSound = new Audio("../sounds/mixkit-wrong-long-buzzer-954.wav");
const warningtSound = new Audio(
  "../sounds/mixkit-vintage-warning-alarm-990.wav",
);
const revealSound = new Audio("../sounds/mixkit-correct-answer-tone-2870.wav");

export class Question {
  constructor(index) {
    this.index = index;
    this.category = allQuestions[this.index].category;
    this.difficulty = allQuestions[this.index].difficulty;
    this.questionLength = allQuestions.length;
    this.correct_answer = allQuestions[this.index].correct_answer;
    this.incorrect_answers = allQuestions[this.index].incorrect_answers;
    this.allChoose = [this.correct_answer, ...this.incorrect_answers].sort();
    this.question = allQuestions[this.index].question;
    this.count = 15;
    this.scorePercentage = 0;
  }

  displayQuestion() {
    containerQuestion.classList.remove("animate__bounceOut");
    containerQuestion.classList.add("animate__bounceIn");
    const progress = ((this.index + 1) / this.questionLength) * 100;
    containerQuestion.innerHTML = ` <div class="game-card question-card">
      
      <div class="xp-bar-container">
        <div class="xp-bar-header">
          <span class="xp-label"><i class="fa-solid fa-bolt"></i> Progress</span>
          <span class="xp-value">Question ${this.index + 1}/${this.questionLength}</span>
        </div>
        <div class="xp-bar">
          <div class="xp-bar-fill" style="width: ${progress}%"></div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-badge category">
          <i class="fa-solid fa-bookmark"></i>
          <span>${this.category}</span>
        </div>
        <div class="stat-badge difficulty easy">
          <i class="fa-solid fa-face-smile"></i>
          <span>${this.difficulty}</span>
        </div>
        <div class="stat-badge timer">
          <i class="fa-solid fa-stopwatch"></i>
          <span class="timer-value">${this.count}</span>s
        </div>
        <div class="stat-badge counter">
          <i class="fa-solid fa-gamepad"></i>
          <span>${this.index + 1}/${this.questionLength}</span>
        </div>
      </div>

      <h2 class="question-text">${this.question}</h2>

      <div class="answers-grid">
      ${this.allChoose
        .map(
          (choose, index) =>
            ` <button class="answer-btn" data-answer="${choose}">
          <span class="answer-key">${index + 1}</span>
          <span class="answer-text">${choose}</span>
        </button>
          
        `,
        )
        .join("")}
          
     
      </div>

      <p class="keyboard-hint">
        <i class="fa-regular fa-keyboard"></i> Press 1-${this.allChoose.length} to select
      </p>
         <div class="time-up-message d-none">
      <i class="fa-solid fa-clock"></i> TIME'S UP!
    </div>
      <div class="score-panel">
        <div class="score-item">
          <div class="score-item-label">Score</div>
          <div class="score-item-value">${quiz.score}</div>
        </div>
      </div>
    </div>
    `;
    this.startTimer();
    let answerBtns = document.querySelectorAll(".answer-btn");
    answerBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.checkAnswer(e.currentTarget);
      });
    });
    this.chooseFromKeyboard();
  }

  checkAnswer(userAnswer) {
    this.stopTimer();
    let checkAnswer = userAnswer.getAttribute("data-answer");
    if (checkAnswer === this.correct_answer) {
      userAnswer.classList.add("correct");
      correctSound.play();
      quiz.score++;
    } else {
      userAnswer.classList.add("wrong");
      wrongSound.play();
    }

    let answerBtns = document.querySelectorAll(".answer-btn");
    answerBtns.forEach((btn) => {
      if (btn.getAttribute("data-answer") === this.correct_answer) {
        btn.classList.add("correct-reveal");
      } else if (btn === userAnswer) {
      } else {
        btn.classList.add("disabled");
      }
    });
    this.index++;
    this.animateQuestions();
    setTimeout(() => {
      this.nextQusetion();
    }, 2500);
    document.removeEventListener("keydown", this.keyboardHandler);
  }
  chooseFromKeyboard() {
    const answerBtns = document.querySelectorAll(".answer-btn");

    this.keyboardHandler = (e) => {
      answerBtns.forEach((btn, index) => {
        if (index + 1 === Number(e.key)) {
          this.checkAnswer(btn);
        }
      });
    };
    document.addEventListener("keydown", this.keyboardHandler);
  }
  animateQuestions() {
    containerQuestion.classList.remove("animate__bounceOut");
    containerQuestion.classList.add("animate__bounceIn");
  }
  nextQusetion() {
    if (this.index < this.questionLength) {
      let newQuestuions = new Question(this.index);
      newQuestuions.displayQuestion();
    } else {
      containerQuestion.classList.add("d-none");
      results.classList.remove("d-none");
      this.calcScore();

      results.innerHTML = ` <h2 class="results-title">Quiz Complete!</h2>
      <p class="results-score-display">${quiz.score}/${this.questionLength}</p>
      <p class="results-percentage">${this.scorePercentage}% Accuracy</p>
      ${
        quiz.score > 0
          ? ` <div class="new-record-badge">
        <i class="fa-solid fa-star"></i> New High Score!
      </div>`
          : ``
      }
      
      <div class="leaderboard">
        <h4 class="leaderboard-title">
          <i class="fa-solid fa-trophy"></i> Leaderboard
        </h4>
        <ul class="leaderboard-list">
         
        </ul>
      </div>
      
      <div class="action-buttons">
        <button class="btn-restart">
          <i class="fa-solid fa-rotate-right"></i> Play Again
        </button>
      </div>`;
      const btnRestart = document.querySelector(".btn-restart");
      btnRestart.addEventListener("click", function () {
        window.location.reload();
      });
      this.savePlayers();
    }
  }
  startTimer() {
    const timeUpMessage = document.querySelector(".time-up-message");
    const timeWarning = document.querySelector(".timer");

    this.timer = setInterval(() => {
      this.count--;
      document.querySelector(".timer-value").textContent = this.count;
      if (this.count === 8) {
        timeWarning.classList.add("warning");
        warningtSound.play();
      }
      if (this.count === 0) {
         this.stopTimer();
        timeUpMessage.classList.remove("d-none");

        let answerBtns = document.querySelectorAll(".answer-btn");
        answerBtns.forEach((btn) => {
          if (btn.getAttribute("data-answer") === this.correct_answer) {
            btn.classList.add("correct-reveal");
            revealSound.play();
          } else {
            btn.classList.add("disabled");
          }
        });
        setTimeout(() => {
         
          this.index++;
          this.nextQusetion();
        }, 1000);
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  calcScore() {
    this.scorePercentage = (quiz.score / this.questionLength) * 100;
    return this.scorePercentage;
  }

  savePlayers() {
    let players = JSON.parse(localStorage.getItem("container")) || [];

    let player = {
      name: quiz.playerName,
      score: this.scorePercentage,
    };

    players.push(player);

    localStorage.setItem("container", JSON.stringify(players));

    const list = document.querySelector(".leaderboard-list");

    list.innerHTML = players
      .map((player, index) => {
        return ` <li class="leaderboard-item gold">
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-name">${player.name ? player.name : "Player"} </span>
            <span class="leaderboard-score">${player.score}%</span>
          </li>`;
      })
      .join("");
  }
}
