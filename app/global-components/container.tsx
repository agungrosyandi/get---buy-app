import { ChildrenProps } from "../utils/type";

export default function Container({ children }: ChildrenProps) {
  return (
    <div className="relative px-[5%] mx-auto flex flex-col w-screen min-h-screen desktopMinWidth:w-[90%] fullHdMinWidth:w-[80%]">
      {children}
    </div>
  );
}
