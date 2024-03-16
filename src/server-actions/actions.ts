"use server";

import { promises as fs } from "fs";
import { Anime, AnimeJson } from "@/models/anime";
import path from "path";

export async function getAnimeData(domain: string): Promise<Anime[]> {
  try {
    // console.log(`domain ${domain}`);
    // const resp = await fetch(`${domain}/data/Anime.json`);
    // if (!resp.ok) {
    //   console.log("API ERROR");
    //   console.log(await resp.json());
    //   return [];
    // }
    // const json = await resp.json();
    // console.log(json);

    // const file = await fs.readFile(process.cwd() + "/src/Anime.json", "utf8");
    const jsonDirectory = path.join(process.cwd(), "json");
    const file = await fs.readFile(jsonDirectory + "/Anime.json", "utf8");
    const json = JSON.parse(file);
    console.log(json);

    const data = json as AnimeJson[];
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
        (!!anime.release_year || !!anime.studio || !!anime.tags || !!anime.type)
    );
  } catch (e) {
    console.log(e);
    return [];
  }
}

function checkPropertyValue<T>(value: any): T | undefined {
  if (value) {
    if (typeof value == "string" && value.toLowerCase() == "nan") {
      return undefined;
    }
    return value as T;
  }
  return undefined;
}
