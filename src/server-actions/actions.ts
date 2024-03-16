"use server";

import { Anime, AnimeJson } from "@/models/anime";

export async function getAnimeData(domain: string): Promise<Anime[]> {
  let i = 0;
  try {
    console.log(`domain ${domain}`);
    const resp = await fetch(`${domain}/data/Anime.json`);
    if (!resp.ok) {
      console.log("API ERROR");
      console.log(await resp.json());
      return [];
    }
    const json = await resp.json();
    console.log(json);
    const data = json as AnimeJson[];
    const animeList = data.map((item, index) => {
      const relatedAnimeList = checkPropertyValue<string[]>(
        item["Related_anime"]
      );
      const tagsString = checkPropertyValue<string>(item["Tags"]);
      i = index;
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
