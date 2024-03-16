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
  dataset: any;
  series: seriesType[];
  xAxis: xAxisType[];
}

interface seriesType {
  dataKey: string;
  label: string;
}

interface xAxisType {
  scaleType: "band";
  dataKey: string;
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

export default function TopGenresByAnimeCountsAndTime({
  animeList,
}: TopStudiosProps) {
  const [chartData, setChartData] = useState<TopStudioChartData>();
  const [formData, setFormData] = useState<FormType>({
    years: YearOptions[0].value,
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
        !!x.tags && x.tags.some((y) => tags.map((z) => z.label).includes(y))
    );

    if (years != -1) {
      const currentyear = new Date().getFullYear();
      const minYear = currentyear - years;
      animes = animes.filter((x) => x.release_year > minYear);
    }

    let tagsByYears = animes
      .reduce((ret: { year: number; tag: string; count: number }[], obj) => {
        obj.tags
          .filter((x) => tags.map((y) => y.label).includes(x))
          ?.forEach((i) => {
            let match = ret.find(
              (x) => x.year == obj.release_year && x.tag == i
            );
            if (match) {
              match.count++;
            } else {
              ret.push({ year: obj.release_year, tag: i, count: 1 });
            }
          });
        return ret;
      }, [])
      .reduce(
        (
          ret: {
            year: number;
            manga: number;
            comedy: number;
            action: number;
            fantasy: number;
            scifi: number;
          }[],
          obj
        ) => {
          let match = ret.find((x) => x.year == obj.year);
          if (!match) {
            match = {
              year: obj.year,
              manga: 0,
              comedy: 0,
              action: 0,
              fantasy: 0,
              scifi: 0,
            };
            ret.push(match);
          }
          match = ret.find((x) => x.year == obj.year);
          if (!match) return ret;
          switch (obj.tag) {
            case "Based on a Manga":
              match.manga = obj.count;
              break;
            case "Comedy":
              match.comedy = obj.count;
              break;
            case "Action":
              match.action = obj.count;
              break;
            case "Fantasy":
              match.fantasy = obj.count;
              break;
            case "Sci Fi":
              match.scifi = obj.count;
              break;
          }
          return ret;
        },
        []
      )
      .sort((a, b) => b.year - a.year)
      .map((x) => ({
        ...x,
        year: x.year.toString(),
      }));

    const xAxis: xAxisType[] = [
      {
        scaleType: "band",
        dataKey: "year",
      },
    ];
    setChartData({ dataset: tagsByYears, series: tags, xAxis });
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
        <BarChart
          dataset={chartData.dataset}
          xAxis={chartData.xAxis}
          series={chartData.series}
          height={200}
        />
      )}
    </>
  );
}
