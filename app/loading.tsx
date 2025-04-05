import LoadingLottie from "@/components/lottie-motion/loading-lottie";

export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <LoadingLottie />
      <h1>Loading .....</h1>
    </div>
  );
}
