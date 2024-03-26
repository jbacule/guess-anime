import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { AnimeFormat } from "./types";
import { getAnimeQuestions, getAnimes } from "./lib/anime";
import { getScore } from "./shared/utils";
import { Card } from "./components/ui/card";
import Image from "rc-image";
import Loader from "./components/loader";

type PageStatus = "LOADING" | "QUESTION_COUNT" | "QUESTION_LIST" | "QUESTION_ANSWER";

export default function App() {
  const [animes, setAnimes] = useState<AnimeFormat[]>([]);
  const [page, setPage] = useState<PageStatus>("LOADING");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questions, setQuestions] = useState<AnimeFormat[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    message: string;
  }>();

  const selectQuestionCount = async (count: number) => {
    setQuestionCount(count);

    const response = await getAnimeQuestions(animes, count);
    setQuestions(response);

    setPage("QUESTION_LIST");
  };

  const selectAnswer = (title: string) => {
    questions[questionIndex].answer = title;

    if (questionIndex === questionCount - 1) {
      const result = getScore(questions);
      setResult(result);
      setPage("QUESTION_ANSWER");
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const resetQuestions = () => {
    setPage("QUESTION_COUNT");
    setQuestions([]);
    setQuestionIndex(0);
    setResult({
      score: 0,
      total: 0,
      message: "",
    });
  };

  useEffect(() => {
    const fetchAnime = async () => {
      setPage("LOADING");
      const response = await getAnimes();
      // const response = await getDummyAnimes();
      setAnimes(response);
      setPage("QUESTION_COUNT");
    };

    fetchAnime();
  }, []);

  return (
    <div id="main" className="w-screen min-h-screen flex items-center justify-center py-10">
      {page === "LOADING" && (
        <Card className="w-[300px] p-10 flex items-center justify-center m-4">
          <Loader />
        </Card>
      )}

      {page === "QUESTION_COUNT" && (
        <Card className="w-[500px] p-5 flex flex-col gap-3 items-center m-4">
          <h1 className="text-xl font-bold text-white">
            Select a number of{" "}
            <span className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              ANIME
            </span>{" "}
            to guess
          </h1>
          <div className="flex items-center gap-2">
            {[10, 15, 20, 30, 40, 50].map((count) => (
              <Button key={count} onClick={() => selectQuestionCount(count)} variant="outline">
                {count}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {page === "QUESTION_LIST" && questionIndex < questionCount && (
        <Card className="w-[500px] flex flex-col gap-y-3 items-center p-5  m-4">
          <h1 className="text-xl text-white font-bold">
            Question: {questionIndex + 1}/{questionCount}
          </h1>
          <Image src={questions[questionIndex].image} className="max-w-[300px] h-auto" alt="anime" />
          <div className="w-full flex flex-col space-y-3">
            {questions[questionIndex].choices?.map((choice, index) => (
              <Button
                key={index}
                onClick={() => selectAnswer(choice.title)}
                className="w-full text-wrap"
                variant="outline"
              >
                {choice.title}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {page === "QUESTION_ANSWER" && (
        <div className="w-[500px] flex flex-col items-center space-y-3">
          <Button onClick={resetQuestions}>Play Again</Button>
          <Card className="flex flex-col p-5 gap-y-3 justify-center  m-4">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold">
                Your scored {result?.score}/{result?.total}
              </h1>
              <h1 className="text-xl text-white">{result?.message}</h1>
            </div>
            <div className="flex flex-col gap-y-2">
              {questions.map((question, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Image src={question.image} className="max-w-[50px] h-auto" />
                  <div className="flex flex-col space-y-2">
                    <h1 className="text-lg text-green-600 font-bold">Title: {question.title}</h1>
                    <h1 className="text-sm text-white">Your Answer: {question.answer}</h1>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
