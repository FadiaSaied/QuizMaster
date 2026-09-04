const loading = document.querySelector(".loading-overlay");
const errorCard = document.querySelector(".error-card");
const retryBtn = document.querySelector(".retry-btn");
import { Question } from "./question.js";
export class Quiz {
  constructor(playerName, numberOfQuestions, category, difficulty) {
    this.playerName = playerName;
    this.numberOfQuestions = numberOfQuestions;
    this.category = category;
    this.difficulty = difficulty;
    this.score = 0;
  }

  async getQuestions() {
    loading.classList.remove("d-none");

    try {
      let request = await fetch(
        `https://opentdb.com/api.php?amount=${this.numberOfQuestions}&category=${this.category}&difficulty=${this.difficulty}`,
      );
      if (request.ok) {
        let response = await request.json();
        loading.classList.add("d-none");
        return response.results;
      } else {
        let error = await request.json();
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      errorCard.classList.remove("d-none");
    }
  }
}

retryBtn.addEventListener("click", function () {
  getQuestions();
});
