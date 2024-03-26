import { Anime, AnimeFormat, AnimeResult, Genre } from "@/types";
import {
  delay,
  getRandomString,
  isEven,
  removeDuplicatesById,
  selectRandomObjects,
  shuffleArray,
} from "@/shared/utils";
import axios, { AxiosResponse } from "axios";
import { dummyAnimes } from "@/shared/data";

const animeStatus = ["airing", "complete", "upcoming"];
const orderByCategories = ["title", "rank", "popularity", "favorites"];

export const getDummyAnimes = (): Promise<AnimeFormat[]> => {
  return new Promise((resolve) => {
    resolve(dummyAnimes);
  });
};

export const getAnimes = async () => {
  let animes: AnimeFormat[] = [];
  for (let i = 1; i <= 8; i++) {
    const status = getRandomString(animeStatus);
    const orderBy = getRandomString(orderByCategories);
    const isDecending = isEven(i) ? "desc" : "asc";

    const response: AxiosResponse<AnimeResult> = await axios.get(
      `https://api.jikan.moe/v4/anime?sfw&page=${i}&limit=25&status=${status}&order_by=${orderBy}&sort=${isDecending}`
    );
    const items = response.data.data.map((item: Anime) => {
      return {
        id: item.mal_id,
        title: item.title,
        image: item.images.webp.large_image_url,
        genres: item.genres.map((genre: Genre) => genre.name),
      };
    });

    animes = [...animes, ...items];

    await delay(1500);
  }
  return animes;
};

export const getAnimeQuestions = async (animes: AnimeFormat[], count: number) => {
  const animeNoDuplicates = removeDuplicatesById(animes);

  // get random anime based on the question count
  const randomAnimes = selectRandomObjects(animeNoDuplicates, count);

  // loop random anime and get the format the anime, include adding of choices by getting 3 random anime from animeNoDuplicates
  for (let i = 0; i < randomAnimes.length; i++) {
    const randomChoices = selectRandomObjects(animeNoDuplicates, 3);
    // const randomChoicesTitles = randomChoices.map((choice: AnimeFormat) => choice.title);
    const choices = [randomAnimes[i], ...randomChoices];
    randomAnimes[i] = {
      ...randomAnimes[i],
      choices: shuffleArray(choices),
    };
  }

  return randomAnimes;
};
