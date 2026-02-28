// Shared data object - accessible by both main.js and app.js
let userData = {
  photo: null,
  survey: {}
};

// everything is wrapped in DOMContentLoaded to make sure
// all the HTML elements exist before we try to select them
document.addEventListener("DOMContentLoaded", function () {
  const questions = document.querySelectorAll(".question");
  const nextBtn = document.getElementById("surveyNextBtn");
  const backBtn = document.getElementById("surveyBackBtn");

  if (questions.length && nextBtn && backBtn) {
    let currentQuestion = 0;
    // Track the history of visited questions to support going back
    let questionHistory = [0];

    function showQuestion(index) {
      questions.forEach((q) => q.classList.remove("active"));
      questions[index].classList.add("active");

      // Show back button only if we're past the first question
      backBtn.style.display = index === 0 ? "none" : "flex";
    }

    document.querySelectorAll(".survey-option").forEach((button) => {
      button.addEventListener("click", function () {
        const questionDiv = this.closest(".question");
        questionDiv.querySelectorAll(".survey-option").forEach((btn) => {
          btn.classList.remove("active");
        });
        this.classList.add("active");
        userData.survey[questionDiv.dataset.question] = this.innerText;
      });
    });

    // back button
    backBtn.addEventListener("click", function () {
      if (questionHistory.length > 1) {
        questionHistory.pop(); // remove current
        currentQuestion = questionHistory[questionHistory.length - 1];
        showQuestion(currentQuestion);
      }
    });

    // continue button
    nextBtn.addEventListener("click", function () {
      const activeQuestion = questions[currentQuestion];
      const selectedOption = activeQuestion.querySelector(".survey-option.active");

      if (!selectedOption) {
        showAlert("Please select an option before continuing.");
        return;
      }

      let nextQuestion = currentQuestion + 1;

      // Conditional logic show breakout question only for "Clear skin & breakouts"
      if (activeQuestion.dataset.question === "mainConcern") {
        if (selectedOption.innerText === "Clear skin & breakouts") {
          nextQuestion = currentQuestion + 1;
        } else {
          nextQuestion = currentQuestion + 2;
        }
      }

      if (nextQuestion < questions.length) {
        questionHistory.push(nextQuestion);
        currentQuestion = nextQuestion;
        showQuestion(currentQuestion);
      } else {
        goToStep2();
      }
    });
  }

});

// step transitions
function goToStep2() {
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";
}

function goToStep3() {
  if (!userData.photo) {
    showAlert("Please upload a photo first.");
    return;
  }

  // Hide step 2 and show the analyzing overlay
  document.getElementById("step2").style.display = "none";
  document.getElementById("analyzingOverlay").classList.add("show");

  // Start the analysis
  analyzePhoto();
}

// photo preview
function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  userData.photo = file;

  const reader = new FileReader();
  reader.onload = function (e) {
    const preview = document.getElementById("photoPreview");
    const uploadArea = document.getElementById("uploadArea");
    const previewWrapper = document.getElementById("photoPreviewWrapper");
    const photoDataUrl = e.target.result;

    preview.src = photoDataUrl;
    uploadArea.style.display = "none";
    previewWrapper.classList.add("visible");

    // Keep uploaded image for results page preview.
    sessionStorage.setItem("skinUploadedPhoto", photoDataUrl);
    localStorage.setItem("skinUploadedPhoto", photoDataUrl);
  };
  reader.readAsDataURL(file);
}

function backToSurvey() {
  document.getElementById("step2").style.display = "none";
  document.getElementById("step1").style.display = "block";
}
