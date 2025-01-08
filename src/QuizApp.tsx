import { useState, useEffect } from "react";
import { questions } from "./assets/questions";

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    if (!isSubmitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerClick = (answerIndex: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  useEffect(() => {
    setSelectedAnswer(answers[currentQuestion]);
    setShowResult(answers[currentQuestion] !== null);
  }, [currentQuestion, answers]);

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers(Array(questions.length).fill(null));
    setIsSubmitted(false);
    setTimeLeft(3600);
  };

  if (isSubmitted) {
    const score = calculateScore();
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-5xl font-bold mb-4">Quiz Results</h2>
            <div className="text-4xl mb-4">
              Final Score: {score} / {questions.length} (
              {Math.round((score / questions.length) * 100)}%)
            </div>

            <div className="space-y-6 mt-8">
              {questions.map((q: any, idx: any) => (
                <div key={idx} className="border-b pb-4">
                  <div className="font-semibold mb-2 text-2xl">
                    {idx + 1}. {q.question}
                  </div>
                  <div className="ml-4">
                    <div
                      className={`${
                        answers[idx] === q.correctAnswer
                          ? "text-green-600"
                          : "text-red-600"
                      } mb-2 ${answers[idx] !== null ? "font-medium" : ""}`}
                    >
                      Your answer:{" "}
                      {answers[idx] !== null
                        ? `${String.fromCharCode(65 + answers[idx])}. ${
                            q.options[answers[idx]]
                          }`
                        : "Not answered"}
                    </div>
                    {answers[idx] !== q.correctAnswer && (
                      <div className="text-green-600 mb-2">
                        Correct answer:{" "}
                        {String.fromCharCode(65 + q.correctAnswer)}.{" "}
                        {q.options[q.correctAnswer]}
                      </div>
                    )}
                    <div className="text-gray-700 bg-gray-50 p-3 rounded mt-2 text-lg">
                      <span className="font-medium">Explanation:</span>{" "}
                      {q.explanation}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mt-6"
            >
              Restart Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-end items-center mb-4">
        <div className="text-lg font-semibold whitespace-nowrap">
          Time: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>
      </div>
      <div className="mb-4 bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className="bg-white shadow rounded-lg mb-4">
        <div className="p-6">
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="text-4xl font-semibold mt-2">
              {questions[currentQuestion].question}
              {questions[currentQuestion].diagram !== "" && (
                <img
                  src={questions[currentQuestion].diagram}
                  alt="Diagram"
                  width="500"
                  height="300"
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
              )}
            </div>
          </div>

          <div className="space-y-3">
            {questions[currentQuestion].options.map(
              (option: any, index: any) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`answer-${index}`}
                    name="answer"
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => !isSubmitted && handleAnswerClick(index)}
                    disabled={isSubmitted}
                    className="w-5 h-5"
                  />
                  <label
                    htmlFor={`answer-${index}`}
                    className={`flex-1 p-3 rounded border cursor-pointer text-2xl ${
                      !showResult ? "hover:bg-gray-100" : ""
                    }`}
                  >
                    <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                  </label>
                </div>
              )
            )}
          </div>

          {questions[currentQuestion].reference && (
            <div className="mt-4 text-sm text-gray-500">
              Reference: {questions[currentQuestion].reference}
            </div>
          )}

          <div className="mt-6 space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setCurrentQuestion((prev) => Math.max(0, prev - 1))
                }
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              {showResult && currentQuestion < questions.length - 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                >
                  Next Question
                </button>
              )}
            </div>

            {showResult && currentQuestion === questions.length - 1 && (
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
