$(document).ready(function() {
    let quizData = {};
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let score = 0;
  
    // โหลดข้อมูลจากไฟล์ JSON
    $.getJSON("quiz.json", function(data) {
      quizData = data;
      populateSubjectSelect();
    });
  
    // ฟังก์ชันในการ populate รายการวิชา
    function populateSubjectSelect() {
      const subjectSelect = $("#subjectSelect");
      quizData.subjects.forEach(subject => {
        subjectSelect.append(`<option value="${subject.name}">${subject.name}</option>`);
      });
    }
  
    // เมื่อเลือกวิชาแล้ว
    $("#subjectSelect").change(function() {
      if ($(this).val()) {
        $("#startButton").prop("disabled", false);
      } else {
        $("#startButton").prop("disabled", true);
      }
    });
  
    // เมื่อคลิกปุ่มเริ่มทำ
    $("#startButton").click(function() {
      const selectedSubject = $("#subjectSelect").val();
      const subjectData = quizData.subjects.find(subject => subject.name === selectedSubject);
      if (subjectData) {
        currentQuestionIndex = 0;
        userAnswers = [];
        score = 0;
        $("#startPage").addClass("d-none");
        $("#quizPage").removeClass("d-none");
        displayQuestion(subjectData);
      }
    });
  
    // ฟังก์ชันแสดงคำถาม
    function displayQuestion(subjectData) {
      const questionData = subjectData.questions[currentQuestionIndex];
      let optionsHtml = "";
      questionData.options.forEach((option, index) => {
        optionsHtml += `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="question${currentQuestionIndex}" id="option${index}" value="${option}">
            <label class="form-check-label" for="option${index}">
              ${option}
            </label>
          </div>
        `;
      });
  
      // แสดงคำถามและตัวเลือก
      $("#questionContainer").html(`
        <h4>${questionData.question}</h4>
        ${optionsHtml}
      `);
  
      // ซ่อนปุ่ม "Submit" หากยังไม่ถึงคำถามสุดท้าย
      if (currentQuestionIndex === subjectData.questions.length - 1) {
        $("#submitButton").show();
        $("#nextButton").hide();
      } else {
        $("#submitButton").hide();
        $("#nextButton").show();
      }
  
      // แสดงปุ่ม "Show Answer"
      $("#showAnswerButton").show();
    }
  
    // เมื่อคลิกปุ่ม "Next"
    $("#nextButton").click(function() {
      const selectedSubject = $("#subjectSelect").val();
      const subjectData = quizData.subjects.find(subject => subject.name === selectedSubject);
      const currentQuestion = subjectData.questions[currentQuestionIndex];
  
      // บันทึกคำตอบที่เลือก
      const selectedAnswer = $("input[name='question" + currentQuestionIndex + "']:checked").val();
      if (selectedAnswer) {
        userAnswers[currentQuestionIndex] = selectedAnswer;
      }
  
      // ไปยังคำถามถัดไป
      currentQuestionIndex++;
      displayQuestion(subjectData);
    });
  
    // เมื่อคลิก Submit
    $("#submitButton").click(function() {
      const selectedSubject = $("#subjectSelect").val();
      const subjectData = quizData.subjects.find(subject => subject.name === selectedSubject);
  
      const correctAnswers = subjectData.questions.map(q => q.answer);
  
      // คำนวณคะแนน
      score = userAnswers.reduce((acc, answer, index) => {
        return answer === correctAnswers[index] ? acc + 1 : acc;
      }, 0);
  
      $("#score").text(`${score} / ${subjectData.questions.length}`);
      $("#scoreContainer").removeClass("d-none");
    });
  
    // เมื่อคลิกปุ่ม "Show Answer"
    $("#showAnswerButton").click(function() {
      const selectedSubject = $("#subjectSelect").val();
      const subjectData = quizData.subjects.find(subject => subject.name === selectedSubject);
      const currentQuestion = subjectData.questions[currentQuestionIndex];
  
      // แสดงคำตอบที่ถูกต้อง
      const correctAnswer = currentQuestion.answer;
      $("#questionContainer").append(`
        <div class="mt-3">
          <strong>Correct Answer: ${correctAnswer}</strong>
        </div>
      `);
      // ซ่อนปุ่ม "Show Answer"
      $(this).hide();
    });
  });
  