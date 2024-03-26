/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { delay, getRandomString, isEven, removeDuplicatesById, selectRandomObjects, shuffleArray } from "./utils";
import { useState } from "react";
import { Button } from "./components/ui/button";

const animeStatus = ["airing", "complete", "upcoming"];
const orderByCategories = ["title", "rank", "popularity", "favorites"];

enum PageStatus {
  QUESTION_COUNT,
  QUESTION_LIST,
  QUESTION_ANSWER,
}
export default function App() {
  const [page, setPage] = useState<PageStatus>(PageStatus.QUESTION_COUNT);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questionListIndex, setQuestionListIndex] = useState<number>(0);

  const fetchAnime = async () => {
    let animes: any[] = [];
    for (let i = 1; i <= 8; i++) {
      const status = getRandomString(animeStatus);
      const orderBy = getRandomString(orderByCategories);
      const isDecending = isEven(i) ? "desc" : "asc";

      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?page=${i}&limit=25&status=${status}&order_by=${orderBy}&sort=${isDecending}`
      );
      const items = response.data.data.map((item: any) => {
        return {
          id: item.mal_id,
          title: item.title,
          image: item.images.jpg.image_url,
          genres: item.genres.map((genre: any) => genre.name),
        };
      });
      animes = [...animes, ...items];

      await delay(1000);
    }

    const animeNoDuplicates = removeDuplicatesById(animes);

    // get random anime based on the question count
    const randomAnimes = selectRandomObjects(animeNoDuplicates, questionCount);

    // loop random anime and get the format the anime, include adding of choices by getting 3 random anime from animeNoDuplicates
    for (let i = 0; i < randomAnimes.length; i++) {
      const randomChoices = selectRandomObjects(animeNoDuplicates, 3);
      const randomChoicesTitles = randomChoices.map((choice: any) => choice.title);
      const choices = [randomAnimes[i].title, ...randomChoicesTitles];
      randomAnimes[i] = {
        ...randomAnimes[i],
        choices: shuffleArray(choices),
      };
    }

    return randomAnimes;
  };
  const { isPending, data, refetch } = useQuery({
    queryKey: ["randomAnime"],
    queryFn: () => fetchAnime(),
    enabled: false,
  });

  const setQuestionCountAndRedirect = (count: number) => {
    setQuestionCount(count);
    setPage(PageStatus.QUESTION_LIST);
    refetch();
  };

  const selectAnswer = () => {
    if (questionListIndex + 1 !== questionCount) {
      const nextIndex = questionListIndex + 1;
      setQuestionListIndex(nextIndex);
    } else {
      setPage(PageStatus.QUESTION_ANSWER);
    }
  };

  return (
    <div className="h-screen container">
      {page === PageStatus.QUESTION_COUNT && (
        <div>
          <h1>How many questions do you want?</h1>
          <Button onClick={() => setQuestionCountAndRedirect(10)}>10</Button>
          <Button onClick={() => setQuestionCountAndRedirect(20)}>20</Button>
          <Button onClick={() => setQuestionCountAndRedirect(30)}>30</Button>
          <Button onClick={() => setQuestionCountAndRedirect(50)}>50</Button>
        </div>
      )}
      {page === PageStatus.QUESTION_LIST && isPending ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data && (
            <div className="p-4">
              <img src={data[questionListIndex].image} alt="image" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data[questionListIndex].choices.map((choice: string, choiceIndex: number) => {
                  return (
                    <div key={choiceIndex} className="p-4">
                      <Button variant="outline" onClick={selectAnswer}>
                        {choice}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {page === PageStatus.QUESTION_ANSWER && (
        <div>
          <h1>Answer</h1>
        </div>
      )}
    </div>
  );
}
