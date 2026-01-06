import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Brain, Trophy } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

const quizData: QuizQuestion[] = [
  {
    question: "What is the primary disadvantage of Priority Scheduling, and which technique is used to resolve it?",
    options: ["Deadlock; resolved by Banking Algorithm", "Starvation; resolved by Aging", "Thrashing; resolved by Swapping", "Fragmentation; resolved by Compaction"],
    correct_answer: "Starvation; resolved by Aging",
    explanation: "In Priority Scheduling, low-priority processes may wait indefinitely (Starvation) if high-priority processes keep arriving. Aging solves this by gradually increasing the priority of waiting processes over time."
  },
  {
    question: "In Preemptive Priority Scheduling, what happens if a newly arriving process has a higher priority than the currently running process?",
    options: ["The new process waits in the queue.", "The current process is paused (preempted) and the CPU is given to the new process immediately.", "Both processes run simultaneously.", "The new process is discarded."],
    correct_answer: "The current process is paused (preempted) and the CPU is given to the new process immediately.",
    explanation: "Preemptive scheduling allows the OS to interrupt the currently executing task to run a higher-priority task immediately."
  },
  {
    question: "In standard Priority Scheduling, how is a tie broken when two processes have the exact same priority?",
    options: ["Shortest Job First (SJF)", "Round Robin (RR)", "First-Come-First-Serve (FCFS)", "Random Selection"],
    correct_answer: "First-Come-First-Serve (FCFS)",
    explanation: "When priorities are identical, the OS typically defaults to arrival order (FCFS)."
  },
  {
    question: "What is the primary advantage of C-SCAN over the standard SCAN algorithm?",
    options: ["Minimizes seek time perfectly.", "Provides a more uniform wait time (fairness) for all cylinders.", "Requires less memory.", "Services requests in both directions."],
    correct_answer: "Provides a more uniform wait time (fairness) for all cylinders.",
    explanation: "C-SCAN services requests in only one direction, ensuring that innermost and outermost tracks have equal wait times."
  },
  {
    question: "In C-SCAN, what does the disk arm do when it reaches the end of the disk?",
    options: ["Reverses direction servicing requests.", "Stops and waits.", "Jumps to the beginning (0) without servicing requests.", "Jumps to the middle."],
    correct_answer: "Jumps to the beginning (0) without servicing requests.",
    explanation: "It performs a 'flyback' to the start to maintain the scan direction, treating the disk as a circular loop."
  }
];

export const QuizView = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = quizData[currentQuestion];
  const isCorrect = selectedAnswer === question.correct_answer;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === question.correct_answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return "border-border hover:border-primary/50 hover:bg-muted/30";
    }
    if (option === question.correct_answer) {
      return "border-neon-green bg-neon-green/10";
    }
    if (option === selectedAnswer && !isCorrect) {
      return "border-destructive bg-destructive/10";
    }
    return "border-border opacity-50";
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground neon-text font-mono">
            KNOWLEDGE CHECK
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            // OS Concepts Quiz
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="font-mono text-primary">
              {score}/{quizData.length}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetQuiz}
            className="cyber-button flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-mono">RESET</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground">
            PROGRESS
          </span>
          <span className="text-xs font-mono text-primary">
            {currentQuestion + 1} / {quizData.length}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            transition={{ type: "spring", damping: 20 }}
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {quizComplete ? (
          /* Completion Screen */
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-block mb-6"
            >
              <Trophy className="w-20 h-20 text-secondary mx-auto" />
              <motion.div
                className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <h3 className="text-3xl font-bold font-mono text-foreground mb-4">
              QUIZ COMPLETE!
            </h3>
            <div className="mb-6">
              <p className="text-6xl font-mono font-bold text-primary neon-text">
                {score}/{quizData.length}
              </p>
              <p className="text-muted-foreground font-mono mt-2">
                {score === quizData.length
                  ? "Perfect Score! Master of OS!"
                  : score >= quizData.length * 0.8
                  ? "Excellent! You know your stuff!"
                  : score >= quizData.length * 0.6
                  ? "Good job! Keep learning!"
                  : "Keep practicing!"}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetQuiz}
              className="cyber-button px-8 py-3"
            >
              <span className="font-mono">TRY AGAIN</span>
            </motion.button>
          </motion.div>
        ) : (
          /* Question Card */
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-panel p-6"
          >
            {/* Question */}
            <div className="mb-6">
              <span className="text-xs font-mono text-muted-foreground">
                QUESTION {currentQuestion + 1}
              </span>
              <h3 className="text-lg font-medium text-foreground mt-2 leading-relaxed">
                {question.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 flex items-center gap-3 ${getOptionStyle(
                    option
                  )}`}
                >
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-mono text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-foreground">{option}</span>
                  {showResult && option === question.correct_answer && (
                    <CheckCircle2 className="w-5 h-5 text-neon-green" />
                  )}
                  {showResult && option === selectedAnswer && !isCorrect && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? "bg-neon-green/5 border-neon-green/30"
                        : "bg-destructive/5 border-destructive/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-neon-green" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <span
                        className={`font-mono font-bold ${
                          isCorrect ? "text-neon-green" : "text-destructive"
                        }`}
                      >
                        {isCorrect ? "CORRECT!" : "INCORRECT"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={nextQuestion}
                    className="w-full mt-4 cyber-button flex items-center justify-center gap-2 py-3"
                  >
                    <span className="font-mono">
                      {currentQuestion < quizData.length - 1 ? "NEXT QUESTION" : "VIEW RESULTS"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
