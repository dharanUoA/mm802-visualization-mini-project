"use client";

import { Anime } from "@/models/anime";
import { YearOptions, onlyUnique } from "@/utils";
import { Chip, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bubble } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface TopStudiosProps {
  animeList: Anime[];
}

interface TopStudioChartData {
  data: { datasets: SeriesType[] };
}

interface SeriesType {
  label: string;
  data: { x: number; y: number; r: number }[];
  backgroundColor: string;
}

const TopStudios = [
  "Toei Animation",
  "Sunrise",
  "J.C.Staff",
  "TMS Entertainment",
  "MADHOUSE",
  "Production I.G",
  "Studio DEEN",
  "OLM",
  "Pierrot",
  "A-1 Pictures",
];

const backgroundColors = [
  "rgb(2,178,175)",
  "rgb(46,150,255)",
  "rgb(184,0,216)",
  "rgb(96,0,155)",
  "rgb(39,49,200)",
  "rgb(2,178,175)",
  "rgb(46,150,255)",
  "rgb(184,0,216)",
  "rgb(96,0,155)",
  "rgb(39,49,200)",
];

export default function TopStudiosByRatingsAndTimeBubble({
  animeList,
}: TopStudiosProps) {
  const [chartData, setChartData] = useState<TopStudioChartData>();

  useEffect(() => {
    visualize();
  }, []);

  const visualize = () => {
    let animes = animeList.filter(
      (x) =>
        !!x.studio &&
        !!x.tags &&
        !!x.rating &&
        !!x.release_year &&
        TopStudios.includes(x.studio)
    );

    const series: SeriesType[] = TopStudios.map((x, i) => {
      return {
        label: x,
        backgroundColor: backgroundColors[i],
        data: animes
          .filter((y) => y.studio == x)
          .reduce(
            (
              acc: { year: number; totalRating: number; animeCount: number }[],
              obj
            ) => {
              const match = acc.find((y) => y.year == obj.release_year);
              if (match) {
                match.totalRating += obj.rating;
                match.animeCount += 1;
              } else {
                acc.push({
                  year: obj.release_year,
                  totalRating: obj.rating,
                  animeCount: 1,
                });
              }
              return acc;
            },
            []
          )
          .sort((a, b) => a.year - b.year)
          .map((y) => ({
            x: y.year,
            y: (y.totalRating / y.animeCount) * 100,
            r: y.animeCount,
          })),
      };
    });

    setChartData({ data: { datasets: series } });
  };
  return <>{chartData && <Bubble data={chartData.data} />}</>;
}
