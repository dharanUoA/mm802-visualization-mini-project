"use client";

import { Anime } from "@/models/anime";
import { YearOptions, onlyUnique } from "@/utils";
import { Chip, Stack } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import React, { useEffect, useState } from "react";

interface TopStudiosProps {
  animeList: Anime[];
}

interface TopStudioChartData {
  series: SeriesType[];
  xAxis: xAxisType[];
}

interface xAxisType {
  id: string;
  data: Date[];
  scaleType: "time";
  valueFormatter: (data: Date) => string;
}

interface SeriesType {
  id: string;
  label: string;
  data: number[];
  stack: "total";
  area: true;
  showMark: false;
}

interface FormType {
  years: number;
}

const tags = [
  {
    label: "Based on a Manga",
    dataKey: "manga",
  },
  {
    label: "Comedy",
    dataKey: "comedy",
  },
  {
    label: "Action",
    dataKey: "action",
  },
  {
    label: "Fantasy",
    dataKey: "fantasy",
  },
  {
    label: "Sci Fi",
    dataKey: "scifi",
  },
];

export default function TopGenresByRatingsAndTime({
  animeList,
}: TopStudiosProps) {
  const [chartData, setChartData] = useState<TopStudioChartData>();
  const [formData, setFormData] = useState<FormType>({
    years: -1,
  });

  useEffect(() => {
    visualize(formData.years);
  }, []);

  const updateyearValue = (value: number) => {
    setFormData((prev) => ({ ...prev, years: value }));
    visualize(value);
  };

  const visualize = (years: number) => {
    let animes = animeList.filter(
      (x) =>
        !!x.tags &&
        !!x.rating &&
        !!x.release_year &&
        x.tags.some((y) => tags.map((z) => z.label).includes(y))
    );

    if (years != -1) {
      const currentyear = new Date().getFullYear();
      const minYear = currentyear - years;
      animes = animes.filter((x) => x.release_year > minYear);
    }

    const allYears = animes
      .map((x) => x.release_year)
      .filter(onlyUnique)
      .sort((a, b) => a - b);

    const series: SeriesType[] = tags.map((tag) => {
      const avgRatingsCountPerYear = animes
        .filter((x) => x.tags.includes(tag.label))
        .reduce(
          (
            acc: { year: number; ratings: number; animeCount: number }[],
            obj
          ) => {
            let match = acc.find((x) => x.year == obj.release_year);
            if (match) {
              match.ratings += obj.rating;
              match.animeCount += 1;
            } else {
              acc.push({
                year: obj.release_year,
                ratings: obj.rating,
                animeCount: 1,
              });
            }
            return acc;
          },
          []
        )
        .sort((x, y) => x.year - y.year);

      const avgRatingsCount = allYears.map((year) => {
        const match = avgRatingsCountPerYear.find((x) => x.year == year);
        if (match) {
          return match.ratings / match.animeCount;
        } else {
          return 0;
        }
      });

      return {
        id: tag.label,
        label: tag.label,
        stack: "total",
        area: true,
        showMark: false,
        data: avgRatingsCount,
      };
    });

    console.log(series);
    const allYearsInDate = allYears.map((x) => new Date(x, 0, 1));

    const xAxis: xAxisType[] = [
      {
        id: "Years",
        data: allYearsInDate,
        scaleType: "time",
        valueFormatter: (data: Date) => data.getFullYear().toString(),
      },
    ];

    setChartData({ series, xAxis });
  };
  return (
    <>
      <div className="flex justify-between">
        <div></div>
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
        <LineChart
          xAxis={chartData.xAxis}
          series={chartData.series}
          height={500}
        />
      )}
    </>
  );
}
