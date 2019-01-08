import { episodeStore, Episode } from "./episode-store";

jest.mock("rn-fetch-blob", () => "RNFetchBlob");

describe("episode-store", () => {
  it("can fetch episodes", () => {
    expect.assertions(2);
    return episodeStore.fetchAll().then(() => {
      expect(episodeStore.episodes.length).toBeGreaterThan(0);
      expect(episodeStore.isLoading).toEqual(false);
    });
  });
});
