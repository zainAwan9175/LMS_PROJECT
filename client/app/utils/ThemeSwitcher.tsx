"use client";
import React, { FC, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

interface Props {}

const ThemeSwitcher: FC<Props> = (props) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="flex items-center justify-center mx-4">
      {theme === "light" ? (
        <BiMoon
          className="cursor-pointer"
          size={25}
          onClick={() => setTheme("dark")}
          fill="black" // Explicitly setting moon color
        />
      ) : (
        <BiSun
          size={25}
          className="cursor-pointer"
          onClick={() => setTheme("light")}
          color="white" // Explicitly setting sun color
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
