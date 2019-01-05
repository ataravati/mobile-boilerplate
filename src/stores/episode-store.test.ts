import { episodeStore, Episode } from "./episode-store";

jest.mock("rn-fetch-blob", () => "RNFetchBlob");

describe("episode-store", () => {
  it("can fetch episodes", () => {
    episodeStore
      .fetchAll()
      .then(() => {
        expect(episodeStore.episodes.length).toBeGreaterThan(0);
        expect(episodeStore.episodes.pop()).toBeInstanceOf(typeof Episode.Type);
        expect(episodeStore.isLoading).toEqual(false);
      })
      .catch(error => {
        expect(episodeStore.isLoading).toEqual(false);
      });
  });
});
