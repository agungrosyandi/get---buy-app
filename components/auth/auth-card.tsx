import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import BackButton from "./back-button";
import Socials from "./socials";

import loginBg from "@/public/img/login bg.jpg";

type CardWrapperProps = {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocial?: boolean;
};

export default function AuthCard({
  children,
  cardTitle,
  backButtonHref,
  backButtonLabel,
  showSocial,
}: CardWrapperProps) {
  return (
    <Card className="relative mx-auto flex flex-col w-full desktopMinWidth:flex-row desktopMinWidth:mt-[5rem]">
      <div className="hidden desktopMinWidth:relative desktopMinWidth:flex-1 desktopMinWidth:block">
        <Image src={loginBg} alt="" style={{ objectFit: "cover" }} fill />
      </div>

      <div className="flex-1">
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>

        {showSocial && (
          <CardFooter>
            <Socials />
          </CardFooter>
        )}

        <CardFooter className="justify-center">
          <BackButton href={backButtonHref} label={backButtonLabel} />
        </CardFooter>
      </div>
    </Card>
  );
}
