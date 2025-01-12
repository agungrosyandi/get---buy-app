"use client";

import { usePathname } from "next/navigation";
import { disableFooter } from "../utils/disable-footer";

export default function Footer() {
  const path = usePathname();
  const hideFooter = disableFooter.includes(path);

  return (
    <>
      {!hideFooter && (
        <section className="relative mt-auto py-5">
          <div className="flex flex-col gap-5 justify-center items-center">
            <h1 className="text-xl font-bold">About Get & Buy</h1>
            <div className="flex text-xs flex-col gap-5 justify-center items-center text-center">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam
                odit voluptatum excepturi deserunt possimus inventore voluptates
                culpa sunt. Nam laborum quo quidem corporis animi ea obcaecati
                nihil at corrupti quaerat?
              </p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam
                odit voluptatum excepturi deserunt possimus inventore voluptates
                culpa sunt. Nam laborum quo quidem corporis animi ea obcaecati
                nihil at corrupti quaerat?
              </p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam
                odit voluptatum excepturi deserunt possimus inventore voluptates
                culpa sunt. Nam laborum quo quidem corporis animi ea obcaecati
                nihil at corrupti quaerat?
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
