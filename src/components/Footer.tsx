import React from "react";
import Image from "next/image";
import icon from "./../../public/Ball 4 Stars.ico";
import { Typography } from "@mui/material";

export default function Footer() {
  return (
    <>
      <footer
        className="shadow dark:bg-gray-900"
        style={{
          background: "linear-gradient(180deg, #FFF, #CEE5FD); #1976D2",
          borderTop: "2px solid rgb(229,231,235)",
        }}
      >
        <div className="w-full mx-auto p-8 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <Image
                src={icon}
                alt="icon"
                style={{ width: "30px", height: "auto" }}
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="#"
                  sx={{
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Anime Universe
                </Typography>
              </span>
            </div>
            <div className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <Typography
                noWrap
                sx={{
                  fontFamily: "monospace",
                }}
              >
                Made by Dharan & Tanmay
              </Typography>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            <Typography
              noWrap
              sx={{
                fontFamily: "monospace",
              }}
            >
              © 2024 Anime Universe . All Rights Reserved.
            </Typography>
          </span>
        </div>
      </footer>
    </>
  );
}
