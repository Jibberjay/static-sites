// main.js


// Elements
const popularQuizGrid = document.getElementById("popular-quiz-grid");
const hiddenID = document.getElementById("session-id");
const quizanator = document.getElementById("quizanator");
const question = document.getElementById("question");
const questionName = document.getElementById("question-name");
const questionOptions = document.getElementById("question-options");
const questionButton = document.getElementById("question-button");
const questionProgress = document.getElementById("question-progress");
const results = document.getElementById("results");
const resultsMessage = document.getElementById("results-message");
const resultsDetails = document.getElementById("results-details");
const resultsChallenge = document.getElementById("results-challenge");
const resultsButton = document.getElementById("results-button");
const loading = document.getElementById("loading");


// Data
const quizzes = {
  "quizanator": {
    "icon": "⁉️",
    "name": "The Official Trivia Quizanator Quiz",
    "questions": [
      {
        "name": "Who created Trivia Quizanator?",
        "correct": 0,
        "options": [
          "Jathan",
          "Billy",
          "Bob",
          "Joe"
        ]
      },
      {
        "name": "What's the primary brand color of Trivia Quizanator?",
        "correct": [0, 1],
        "options": [
          '<span style="background: #18a1db; color: white;">#18a1db</span>',
          '<span style="background: #f69841; color: white;">#f69841</span>',
          '<span style="background: #68067e; color: white;">#68067e</span>',
          '<span style="background: #00be2c; color: white;">#00be2c</span>'
        ]
      },
      {
        "name": "What language is Trivia Quizanator written in?",
        "correct": 0,
        "options": [
          "Mostly JavaScript, with basic HTML and CSS for the interface",
          "Entirely in PHP",
          "A shell script composed of many different languages",
          "An even mix of JavaScript and Python"
        ]
      }
    ]
  },
  "javascript": {
    "icon": "💻",
    "name": "How well do you know JavaScript?",
    "questions": [
      {
        "name": "What symbol is used to end an expression in JavaScript?",
        "correct": 0,
        "options": [
          "Semicolon (;)",
          "Period (.)",
          "Closing bracket (])",
          "None&mdash; no symbol is required"
        ]
      },
      {
        "name": "Which data primitive does NOT exist in JavaScript?",
        "correct": 3,
        "options": [
          "Number",
          "BigInt",
          "Infinity",
          "Float"
        ]
      },
      {
        "name": "What does DOM stand for (in the context of web development)?",
        "correct": 0,
        "options": [
          "Document Object Model",
          "Direct Object Mutation",
          "Dominant Operation Model",
          "Diligent Outsourced Monkeys"
        ]
      },
      {
        "name": "Can JavaScript run outside of a browser?",
        "correct": 1,
        "options": [
          "Yes, it can be executed natively by any computer",
          "Yes, but it needs a different runtime to execute",
          "No, it always requires a browser engine to run"
        ]
      }
    ]
  },
  "coffee": {
    "icon": "☕",
    "name": "Programming Essentials"
    // This quiz intentionally has no questions, to demonstrate error handling
  },
  "easy": {
    "icon": "✅",
    "name": "The EASY Quiz!!",
    "questions": [
      {
        "name": "Select an answer of your choice!",
        "correct": [0, 1, 2],
        "options": [
          "Pick me!",
          "Ooh, click me!",
          "C'mon, choose me!"
        ]
      }
    ]
  },
  "octopus": {
    "icon": "🐙",
    "name": "Random Octopus Fun Facts",
    "questions": [
      {
        "name": "What is the proper plural form of 'octopus'?",
        "correct": [0, 1, 2],
        "options": [
          "Octopi",
          "Octopuses",
          "Octopodes",
          "Octopedia"
        ]
      },
      {
        "name": "How many hearts does an octopus have?",
        "correct": 2,
        "options": [
          "One",
          "Two",
          "Three",
          "Four"
        ]
      },
      {
        "name": "How many brains does an octopus have?",
        "correct": 3,
        "options": [
          "One",
          "Three",
          "Eight",
          "Nine"
        ]
      }
    ]
  }
};
const feedback = {
  perfect: ["Amazing! A perfect score!", "🎉 You finished! 🎉", "Nicely done!", "Wow, incredible!"],
  good: ["So close! You're almost there!", "Not bad! Keep it up!", "Great job!", "All done! Check out your results:"],
  bad: ["Close but not quite. Don't worry, you'll get there!", "You're not too far off. Keep practicing!", "Having trouble? Try a different category!"],
  tragic: ["Oof, that's... not great.", "This quiz was a miss, but you'll do better next time.", "That is an impossibly low score.", "Remember that the goal is to get as many questions CORRECT as possible!"]
};
const categories = ["music", "sport_and_leisure", "film_and_tv", "arts_and_literature", "history", "society_and_culture", "science", "geography", "food_and_drink", "general_knowledge"];


// Global variables
let sessionID;
let rank = [];
let quizState = {};


// Init
sessionID = sessionStorage.getItem("sessionID") || randomID(9);
sessionStorage.setItem("sessionID", sessionID);
let rankCache = sessionStorage.getItem("rankCache");
if (rankCache) {
  try {
    rank = JSON.parse(rankCache);
  } catch (e) {
    console.warn(e);
  }
} else {
  let arr = Object.keys(quizzes);
  for (let i = 0; i < arr.length; i++) {
    rank.push({id: arr[i], score: random(1, 100)});
  }
  sessionStorage.setItem("rankCache", JSON.stringify(rank));
}
rank.sort((a, b) => a.score - b.score); // Sorts by ascending order


// Home page code
if (popularQuizGrid) {
  let counter = 1;
  for (let i = rank.length - 1; i >= 0; i--) {
    popularQuizGrid.appendChild(createCard(rank[i].id, counter++));
  }
}


// Generate page code
if (hiddenID) {
  hiddenID.value = sessionID;
  document.querySelector('input[type="submit"]').addEventListener("click", function(event) {
    let anychecked = false;
    for (let i = 0; i < categories.length; i++) {
      if (document.getElementById(categories[i]).checked) {
        anychecked = true;
        break;
      }
    }
    if (!anychecked) {
      event.preventDefault();
      alert("Select at least one category for your custom trivia quiz!");
    }
  });
}


// Play page code
if (quizanator) {
  const url = new URL(document.location.href);
  let internal = url.searchParams.get("quizID");
  let generated = url.searchParams.get("generated");
  if (internal) {
    let quiz = quizzes[internal];
    if (quiz && quiz.questions) {
      attachReplay(quiz);
      startQuiz(quiz);
    } else {
      quizanator.innerHTML = '<strong>Error:</strong> couldn\'t find a quiz with the ID "' + internal + '"';
    }
  } else if (generated) {
    generateQuiz(url);
  } else {
    quizanator.innerHTML = '<p>To start playing, you\'ll need to find a quiz. Find a popular one on the <a class="link" href="./index.html">home page</a> or <a class="link" href="./generate.html">make your own</a>!</p>';
  }
  questionButton.addEventListener("click", nextQuizQuestion);
}


// DOM functions
function createCard(quizID, i) {
  let el = document.createElement("a");
  el.href = "play.html?quizID=" + quizID;
  el.className = "card";
  let child1 = document.createElement("div");
  child1.className = "emoji";
  child1.textContent = quizzes[quizID].icon || "⛓️‍💥";
  el.appendChild(child1);
  let child2 = document.createElement("p");
  child2.innerHTML = '<span class="light">#' + i + "</span>&nbsp;&nbsp;" + quizzes[quizID].name;
  el.appendChild(child2);
  return el;
}
function startQuiz(quiz) {
  if (!question.hidden) question.setAttribute("hidden", "");
  if (!results.hidden) results.setAttribute("hidden", "");
  quizState = {
    name: quiz.name || "Autogenerated Quiz",
    index: 0,
    correct: 0,
    total: quiz.questions.length,
    questions: quiz.questions
  };
  questionProgress.max = quizState.total;
  showQuizQuestion(0);
}
function nextQuizQuestion() {
  let checked = -1;
  for (let i = 0; i < quizState.questions[quizState.index].options.length; i++) {
    let el = document.getElementById("question-" + i);
    if (el.checked) checked = el.value;
  }
  if (checked == -1) {
    alert("You must select an option before continuing!");
    return;
  }
  let correct = quizState.questions[quizState.index].correct;
  if (typeof correct === "number") {
    if (checked == correct) quizState.correct++;
  } else {
    for (let i = 0; i < correct.length; i++) {
      if (checked == correct[i]) {
        quizState.correct++;
        break;
      }
    }
  }
  quizState.index++;
  if (quizState.index > (quizState.total - 1)) {
    showQuizResults();
  } else {
    showQuizQuestion(quizState.index);
  }
}
function showQuizQuestion(i) {
  let q = quizState.questions[i];
  questionName.textContent = q.name;
  let html = [];
  for (let i = 0; i < q.options.length; i++) {
    html.push('<div class="pair"><input type="radio" id="question-' + i + '" name="question-choice" value="' + i + '"><label for="question-' + i + '">' + q.options[i] + '</label></div>');
  }
  html = shuffle(html);
  questionOptions.innerHTML = html.join("");
  questionProgress.value = i;
  question.removeAttribute("hidden");
}
function showQuizResults() {
  question.setAttribute("hidden", "");
  let percent = quizState.correct / quizState.total;
  if (quizState.correct == 0) {
    resultsMessage.textContent = randomItem(feedback.tragic);
  } else if (quizState.correct == quizState.total) {
    resultsMessage.textContent = randomItem(feedback.perfect);
  } else if (percent <= 0.5) {
    resultsMessage.textContent = randomItem(feedback.bad);
  } else {
    resultsMessage.textContent = randomItem(feedback.good);
  }
  resultsDetails.textContent = "You got " + quizState.correct + " out of " + quizState.total + " correct";
  resultsChallenge.textContent = quizState.name;
  results.removeAttribute("hidden");
}
function attachReplay(quiz) {
  resultsButton.addEventListener("click", function() {
    startQuiz(quiz);
  });
}


// Data functions
async function generateQuiz(pageURL) {
  loading.removeAttribute("hidden");
  let quiz = {questions: []};
  let url = new URL("https://the-trivia-api.com/v2/questions");
  url.searchParams.set("limit", pageURL.searchParams.get("number") || 5);
  let cats = [];
  for (let i = 0; i < categories.length; i++) {
    let cat = pageURL.searchParams.get(categories[i]);
    if (cat && cat == "on") cats.push(categories[i]);
  }
  url.searchParams.set("categories", cats.join(","));
  let dif = pageURL.searchParams.get("difficulty");
  if (dif && dif != "all") url.searchParams.set("difficulties", dif);
  let region = pageURL.searchParams.get("region");
  if (region && region == "on") url.searchParams.set("region", "US");
  // Sessions currently aren't working with the server
  //url.searchParams.set("session", pageURL.searchParams.get("sessionID"));
  const result = await getData(url.href.replace(/%2C/g, ","));
  loading.setAttribute("hidden", "");
  if (result.success) {
    for (let i = 0; i < result.data.length; i++) {
      quiz.questions.push({
        name: result.data[i].question.text,
        correct: 0,
        options: [result.data[i].correctAnswer].concat(result.data[i].incorrectAnswers)
      });
    }
    attachReplay(quiz);
    startQuiz(quiz);
  } else {
    quizanator.innerHTML = '<p>' + result.message + '</p>';
  }
}
async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return {success: false, message: '<strong>Error:</strong> ' + response.status};
    const result = await response.json();
    return {success: true, data: result};
  } catch (error) {
    console.error(error.message);
    return {success: false, message: '<strong>Error:</strong> an unknown error occurred'};
  }
}


// Helper functions
function shuffle(arr) {
  arr = JSON.parse(JSON.stringify(arr));
  // Fisher-Yates shuffle algorithm
  let i = arr.length;
  while (i != 0) {
    let randomIndex = Math.floor(Math.random() * i);
    i--;
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
}
function randomItem(arr) {
  return shuffle(arr)[0];
}
function randomID(length) {
  let result = "";
  for (var i = 0; i < length; i++) {
    result += random(0, 9);
  }
  return result;
}
function random(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));
}
function clearCache() {
  sessionStorage.clear();
}