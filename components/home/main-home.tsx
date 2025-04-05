import HomePageLottie from "../lottie-motion/homepage-lottie";

export default function MainHome() {
  return (
    <div className="w-full flex flex-col justify-center items-center desktopMinWidth:flex-row desktopMinWidth:justify-between">
      <div className="flex flex-1 flex-col gap-3">
        <h1 className="text-base font-bold desktopMinWidth:text-3xl">
          Welcome to Get & Buy !!!
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur
          molestias sunt alias sint excepturi similique repellat maiores quas,
          blanditiis aspernatur cupiditate sapiente a laborum quibusdam ipsam
          eligendi pariatur. Nobis, quia.
        </p>
      </div>

      <HomePageLottie />
    </div>
  );
}
