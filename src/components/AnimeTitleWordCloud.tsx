import { Anime } from "@/models/anime";
import { TopOptions, YearOptions } from "@/utils";
import { Chip, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import WordCloud from "react-d3-cloud";

interface TopStudiosProps {
  animeList: Anime[];
}

interface FormType {
  top: number;
  years: number;
}

interface TopStudioChartData {
  data: WordCloudDataType[];
}

interface WordCloudDataType {
  text: string;
  value: number;
}

export default function AnimeTitleWordCloud({ animeList }: TopStudiosProps) {
  const [chartData, setChartData] = useState<TopStudioChartData>();
  const [formData, setFormData] = useState<FormType>({
    top: TopOptions[3].value,
    years: -1,
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

    let wordArray = animes.reduce((acc: WordCloudDataType[], obj) => {
      const name = obj.name ?? obj.japanese_name;
      if (name) {
        name
          .split(" ")
          .filter((x) => x.length > 3)
          ?.forEach((x) => {
            if (x) {
              x = x.replace(/[^\w\s]/gi, "");
              if (x) {
                const match = acc.find((y) => y.text == x);
                if (match) {
                  match.value += 1;
                } else {
                  acc.push({ text: x, value: 1 });
                }
              }
            }
          });
      }
      return acc;
    }, []);

    wordArray = wordArray.sort((a, b) => b.value - a.value).slice(0, top * 10);

    setChartData({ data: wordArray });
  };

  return (
    <>
      <div className="flex justify-between">
        <Stack direction="row" spacing={1}>
          {TopOptions.map((x, i) => (
            <Chip
              key={i}
              label={`${x.label}0`}
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
      {chartData && <WordCloud data={chartData.data} />}
    </>
  );
}
