import { dummyAnimes } from "@/shared/data";
import { useEffect, useState } from "react";
type LoaderProps = {
  loading: boolean;
};

function Loader({ loading }: LoaderProps) {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const setRandomImage = () => {
      const anime = dummyAnimes[Math.floor(Math.random() * dummyAnimes.length)];
      setImage(anime.image);
    };

    let interval = undefined;

    if (loading) {
      interval = setInterval(() => {
        setRandomImage();
      }, 50);
    }

    return () => clearInterval(interval);
  }, [loading]);
  return (
    <div className="flex flex-col space-y-3 items-center">
      <img src={image} alt="image" width={50} height={50} style={{ objectFit: "contain" }} />
      <h1 className="text-3xl text-white">Loading Animes...</h1>
    </div>
  );
}
export default Loader;
