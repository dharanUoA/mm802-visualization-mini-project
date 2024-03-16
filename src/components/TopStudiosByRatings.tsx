"use client";

import { Anime } from "@/models/anime";
import { TopOptions, YearOptions } from "@/utils";
import { Chip, Stack } from "@mui/material";
import { DefaultizedPieValueType } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useEffect, useState } from "react";

interface TopStudiosProps {
  animeList: Anime[];
}

interface TopStudioChartData {
  series: {
    data: { id: number; value: number; label: string }[];
    arcLabel?: (valType: DefaultizedPieValueType) => string;
  }[];
}

interface FormType {
  top: number;
  years: number;
}

const TopOptionsForTopStudioComponet = TopOptions.filter((x) => x.value <= 20);

export default function TopStudiosByRatings({ animeList }: TopStudiosProps) {
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
    let animes = animeList.filter((x) => !!x.studio && !!x.rating).slice();

    if (years != -1) {
      const currentyear = new Date().getFullYear();
      const minYear = currentyear - years;
      animes = animes.filter((x) => x.release_year > minYear);
    }

    let studioWithRatings = animes.reduce<{ studio: string; rating: number }[]>(
      (acc, obj) => {
        const match = acc.find((x) => x.studio == obj.studio);
        if (match) {
          match.rating += obj.rating;
        } else {
          acc.push({
            studio: obj.studio,
            rating: obj.rating,
          });
        }
        return acc;
      },
      []
    );

    let totalRatings = 0;
    studioWithRatings.forEach((x) => (totalRatings += x.rating));

    studioWithRatings = studioWithRatings
      .sort((a, b) => b.rating - a.rating)
      .slice(0, top);

    const series = [
      {
        data: studioWithRatings.map((x, i) => ({
          id: i,
          value: (x.rating / totalRatings) * 100,
          label: x.studio,
        })),
      },
    ];

    setChartData({ series });
  };

  return (
    <>
      <div className="flex justify-between">
        <Stack direction="row" spacing={1}>
          {TopOptionsForTopStudioComponet.map((x, i) => (
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
        <PieChart series={chartData.series} height={400}></PieChart>
      )}
    </>
  );
}
