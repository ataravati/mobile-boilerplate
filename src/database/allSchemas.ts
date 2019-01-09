import Realm from "realm";
import podcastsData from "./podcasts.json";

export const PODCAST_SCHEMA = "Podcast";
export const EPISODE_SCHEMA = "Episode";

export const PodcastSchema = {
  name: PODCAST_SCHEMA,
  primaryKey: "id",
  properties: {
    id: "int",
    title: "string",
    episodes: { type: "list", objectType: EPISODE_SCHEMA },
  },
};

export const EpisodeSchema = {
  name: EPISODE_SCHEMA,
  primaryKey: "id",
  properties: {
    id: "int",
    title: "string",
    url: "string",
    localPath: { type: "string", optional: true },
    isLocal: { type: "bool", default: false },
  },
};

const databaseOptions = {
  path: "localDb.realm",
  schema: [PodcastSchema, EpisodeSchema],
};

const createDb = (realm: Realm) => {
  realm.write(() => {
    for (let index in podcastsData.podcasts) {
      let podcast = podcastsData.podcasts[index];
      realm.create(PODCAST_SCHEMA, {
        id: podcast["id"],
        title: podcast["title"],
        episodes: podcast["episodes"],
      });
    }
  });
};

export const getPodcasts = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let podcasts = realm.objects(PODCAST_SCHEMA);
        if (podcasts.length === 0) {
          createDb(realm);
        }
        resolve(podcasts);
      })
      .catch(error => {
        reject(error);
      });
  });
