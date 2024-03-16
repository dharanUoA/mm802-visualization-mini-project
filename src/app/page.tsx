"use client";

import TableView from "@/components/TableView";
import { Anime } from "@/models/anime";
import { getAnimeData } from "@/server-actions/actions";
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

export default function Home() {
  const [animeList, setAnimeList] = useState<Anime[]>();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const list = await getAnimeData(document.location.origin);
    console.log(list);
    setAnimeList(list);
  };

  return (
    <>
      <div className="text-4xl text-center uppercase font-bold mb-2">
        MM 802 - Visualization Mini-project
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
          </>
        )}
      </div>
    </>
  );
}
