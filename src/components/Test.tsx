import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AnimeResult } from "@/types";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Loader = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};

const ErrorComponent = ({ message }: { message: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{message}</p>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [title, setTitle] = useState<string>("");

  const fetchAnime = async () => {
    const response = await axios.get<AnimeResult>("https://api.jikan.moe/v4/random/anime");
    //  fetch("https://api.jikan.moe/v4/genres/anime").then((res) => res.json())
    // fetch("https://api.jikan.moe/v4/anime?page=1&limit=500").then((res) => res.json())
    return response.data;
  };
  const { isPending, error, data } = useQuery({
    queryKey: ["randomAnime"],
    queryFn: () => fetchAnime(),
  });

  const guessAnime = () => {
    if (data) {
      const animeTitle = data.data.title_english || data.data.title;
      if (title.toLowerCase() === animeTitle.toLowerCase()) {
        alert("Correct");
      } else {
        alert("Incorrect");
      }
    }
  };

  return (
    <div className="h-screen container">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Guess the Anime</h1>
      </div>

      {isPending && <Loader />}
      {error && <ErrorComponent message={error.message} />}
      {!isPending && data && (
        <div>
          <img src={data.data.images.jpg.large_image_url} alt="img" style={{ width: "200px" }} />
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button onClick={guessAnime}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-help-circle"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <span className="ml-4">Guess</span>
          </Button>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
