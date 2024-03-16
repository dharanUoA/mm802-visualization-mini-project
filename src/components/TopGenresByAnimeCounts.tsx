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

interface FormType {
  top: number;
  years: number;
}

export default function TopGenresByAnimeCounts({ animeList }: TopStudiosProps) {
  const [chartData, setChartData] = useState<TopStudioChartData>();
  const [formData, setFormData] = useState<FormType>({
    top: TopOptions[0].value,
    years: YearOptions[0].value,
  });

  useEffect(() => {
    visualize(formData.top, formData.years);
  }, []);

  const updateTopValue = (value: number) => {
    setFormData((prev) => ({ ...prev, top: value }));
    visualize(value, formData.years);
  };

  const updateyearValue = (value: number) => {
    setFormData((prev) => ({ ...prev, years: value }));
    visualize(formData.top, value);
  };

  const visualize = (top: number, years: number) => {
    let animes = animeList.filter((x) => !!x.tags);

    if (years != -1) {
      const currentyear = new Date().getFullYear();
      const minYear = currentyear - years;
      animes = animes.filter((x) => x.release_year > minYear);
    }

    const tags = animes
      .map((x) => x.tags)
      .reduce((ret, obj) => {
        ret.push(...obj);
        return ret.filter(onlyUnique);
      }, [])
      .filter((x) => !!x);

    let tagsWithCount = tags.map((x) => ({
      name: x,
      count: animes.filter((y) => y.tags.includes(x))?.length ?? 0,
    }));

    tagsWithCount = tagsWithCount
      .sort((a, b) => b.count - a.count)
      .slice(0, top);

    const series = [
      {
        data: tagsWithCount.map((x) => x.count),
      },
    ];
    
    const xAxis: xAxisType[] = [
      {
        scaleType: "band",
        data: tagsWithCount.map((x) => x.name),
      },
    ];
    setChartData({ series, xAxis });
  };
  return (
    <>
      <div className="flex justify-between">
        <Stack direction="row" spacing={1}>
          {TopOptions.map((x, i) => (
            <Chip
              key={i}
              label={x.label}
              color="primary"
              variant={formData?.top == x.value ? "filled" : "outlined"}
              clickable
              onClick={() => updateTopValue(x.value)}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          {YearOptions.map((x, i) => (
            <Chip
              key={i}
              label={x.label}
              color="primary"
              variant={formData?.years == x.value ? "filled" : "outlined"}
              clickable
              onClick={() => updateyearValue(x.value)}
            />
          ))}
        </Stack>
      </div>
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
