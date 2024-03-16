"use client";

import { Anime } from "@/models/anime";
import { TopOptions, YearOptions, onlyUnique } from "@/utils";
import { Chip, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import React, { useEffect, useState } from "react";

interface TopStudiosProps {
  animeList: Anime[];
}

interface TopStudioChartData {
  series: { data: number[] }[];
  xAxis: xAxisType[];
}

interface xAxisType {
  scaleType: "band";
  data: string[];
}

export default function TopYearsByAnimeCounts({ animeList }: TopStudiosProps) {
  const [chartData, setChartData] = useState<TopStudioChartData>();

  useEffect(() => {
    visualize();
  }, []);

  const visualize = () => {
    let animes = animeList.slice();

    const years = animes
      .map((x) => x.release_year)
      .filter(onlyUnique)
      .filter((x) => !!x)
      .sort((a, b) => a - b);

    let studioWithCount = years.map((x) => ({
      name: x,
      count: animes.filter((y) => y.release_year == x)?.length ?? 0,
    }));

    const series = [
      {
        data: studioWithCount.map((x) => x.count),
      },
    ];
    const xAxis: xAxisType[] = [
      {
        scaleType: "band",
        data: studioWithCount.map((x) => x.name.toString()),
      },
    ];
    setChartData({ series, xAxis });
  };
  return (
    <>
      {chartData && (
        <BarChart
          xAxis={chartData.xAxis}
          series={chartData.series}
          height={200}
        />
      )}
    </>
  );
}
