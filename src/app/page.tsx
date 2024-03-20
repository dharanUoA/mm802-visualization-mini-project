"use client";

import TableView from "@/components/TableView";
import { Anime, AnimeJson } from "@/models/anime";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Link as MUILink,
  Skeleton,
  Typography,
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
        <Typography
          noWrap
          variant="h3"
          className="py-8"
          sx={{
            fontWeight: 700,
            fontFamily: "monospace",
            color: "black",
          }}
        >
          Exploring Trends, Genres, and Ratings
        </Typography>
      </div>
      <div>
        <Typography
          sx={{
            fontFamily: "monospace",
            marginBottom: "1rem",
            color: "black",
          }}
        >
          In a world where anime has become a remarkable part of global
          entertainment, understanding its trends and popularity is crucial for
          both enthusiasts and industry professionals alike. Our dashboard aims
          to provide a comprehensive overview of these trends by utilizing a
          diverse array of visualizations including bubble charts, bar charts,
          pie charts, histograms, and word clouds. Through these visualizations,
          users can discern trends in studio production, anime ratings, and
          yearly releases, gaining valuable insights into the evolving
          preferences and dynamics of the anime community.
        </Typography>
        <div className="mb-5">
          <MUILink
            href="https://www.kaggle.com/code/anuragnautiyal88/anime-analysis-jovian-project"
            target="_blank"
          >
            Dataset Link
          </MUILink>
        </div>
        {/* {!animeList && <CircularProgress />} */}
        {!animeList && (
          <Box>
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton animation="wave" height={40} />
            <Skeleton animation="wave" height={40} />
            <Skeleton animation={false} height={40} />
            <Skeleton animation={false} height={40} />
          </Box>
        )}
        {animeList && (
          <>
            <TableView animeList={animeList} />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  noWrap
                  sx={{
                    fontFamily: "monospace",
                  }}
                >
                  Which anime studios have dominated the industry in terms of
                  production volume over the years?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TopStudiosByAnimeCounts animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  noWrap
                  sx={{
                    fontFamily: "monospace",
                  }}
                >
                  Which anime studios consistently produce high-quality content,
                  as evidenced by their ratings?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TopStudiosByRatings animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  noWrap
                  sx={{
                    fontFamily: "monospace",
                  }}
                >
                  Which anime studios have consistently produced a high volume
                  of anime while maintaining a high average rating over the
                  years?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TopStudiosByRatingsAndTimeBubble animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  noWrap
                  sx={{
                    fontFamily: "monospace",
                  }}
                >
                  How has the volume of anime releases evolved over the years?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TopYearsByAnimeCounts animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  noWrap
                  sx={{
                    fontFamily: "monospace",
                  }}
                >
                  Which anime genres have consistently captivated audiences over
                  the years?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TopGenresByAnimeCounts animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  noWrap
                  sx={{
                    fontFamily: "monospace",
                  }}
                >
                  How does the distribution of volume releases vary across the
                  top 5 genres of anime throughout the years?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TopGenresByAnimeCountsAndTime animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  noWrap
                  sx={{
                    fontFamily: "monospace",
                  }}
                >
                  How does the distribution of average ratings vary across the
                  top 5 genres of anime throughout the years?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TopGenresByRatingsAndTime animeList={animeList} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  noWrap
                  sx={{
                    fontFamily: "monospace",
                  }}
                >
                  What are the most common words found in anime titles based on
                  their frequency?
                </Typography>
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
