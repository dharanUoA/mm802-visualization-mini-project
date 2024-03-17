"use client";

import TableView from "@/components/TableView";
import { Anime, AnimeJson } from "@/models/anime";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Link as MUILink,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import TopStudiosByAnimeCounts from "@/components/TopStudiosByAnimeCounts";
import TopStudiosByRatings from "@/components/TopStudiosByRatings";
import data from "./../Anime.json";
import TopYearsByAnimeCounts from "@/components/TopYearsByAnimeCounts";
import TopGenresByAnimeCounts from "@/components/TopGenresByAnimeCounts";
import TopGenresByAnimeCountsAndTime from "@/components/TopGenresByAnimeCountsAndTime";
import TopGenresByRatingsAndTime from "@/components/TopGenresByRatingsAndTime";
import TopStudiosByRatingsAndTimeBubble from "@/components/TopStudioByRatingsAndTimeBubble";
import AnimeTitleWordCloud from "@/components/AnimeTitleWordCloud";

export default function Home() {
  const [animeList, setAnimeList] = useState<Anime[]>();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const list = filterAnimeData(data as AnimeJson[]);
    setAnimeList(list);
  };

  const filterAnimeData = (data: AnimeJson[]) => {
    const animeList = data.map((item, index) => {
      const relatedAnimeList = checkPropertyValue<string[]>(
        item["Related_anime"]
      );
      const tagsString = checkPropertyValue<string>(item["Tags"]);
      const anime: Anime = {
        japanese_name: checkPropertyValue<string>(item["Japanese_name"]) ?? "",
        name: checkPropertyValue<string>(item["Name"]) ?? "",
        rank: checkPropertyValue<number>(item["Rank"]) ?? 0,
        rating: checkPropertyValue<number>(item["Rating"]) ?? 0,
        related_anime: relatedAnimeList
          ? relatedAnimeList.map((i) => i.trim())
          : [],
        release_season:
          checkPropertyValue<string>(item["Release_season"]) ?? "",
        release_year: checkPropertyValue<number>(item["Release_year"]) ?? 0,
        studio: checkPropertyValue<string>(item["Studio"]) ?? "",
        type: checkPropertyValue<string>(item["Type"]) ?? "",
        tags: tagsString ? tagsString.split(",").map((i) => i.trim()) : [],
      };
      return anime;
    });
    return animeList.filter(
      (anime) =>
        (!!anime.name || !!anime.japanese_name) &&
        !!anime.rating &&
        (!!anime.release_year ||
          !!anime.studio ||
          !!anime.tags ||
          !!anime.type) &&
        anime.release_year &&
        anime.release_year < 2022
    );
  };

  function checkPropertyValue<T>(value: any): T | undefined {
    if (value) {
      if (typeof value == "string" && value.toLowerCase() == "nan") {
        return undefined;
      }
      return value as T;
    }
    return undefined;
  }

  return (
    <>
      <div className="text-4xl text-center uppercase font-bold mb-2">
        Anime Universe: Exploring Trends, Genres, and Ratings
      </div>
      <div>
        <div>
          The aim of this project is to create a small visualization of anime
          data.
        </div>
        <div>
          <MUILink
            href="https://www.kaggle.com/code/anuragnautiyal88/anime-analysis-jovian-project"
            target="_blank"
          >
            Dataset Link
          </MUILink>
        </div>
        {!animeList && <CircularProgress />}
        {animeList && (
          <>
            <TableView animeList={animeList} />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Top Studios - by total number of anime produced
              </AccordionSummary>
              <AccordionDetails>
                <TopStudiosByAnimeCounts animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Top Studios - by ratings given to the anime
              </AccordionSummary>
              <AccordionDetails>
                <TopStudiosByRatings animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Top Studios - by ratings over time
              </AccordionSummary>
              <AccordionDetails>
                <TopStudiosByRatingsAndTimeBubble animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                How has the number of anime released changed over the years?
              </AccordionSummary>
              <AccordionDetails>
                <TopYearsByAnimeCounts animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                What are the most common genres?
              </AccordionSummary>
              <AccordionDetails>
                <TopGenresByAnimeCounts animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                How does distribution of genre changes over time?
              </AccordionSummary>
              <AccordionDetails>
                <TopGenresByAnimeCountsAndTime animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                How does distribution of genre changes over time?
              </AccordionSummary>
              <AccordionDetails>
                <TopGenresByRatingsAndTime animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Word cloud of most common words in anime titles
              </AccordionSummary>
              <AccordionDetails>
                <AnimeTitleWordCloud animeList={animeList} />
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </div>
    </>
  );
}
