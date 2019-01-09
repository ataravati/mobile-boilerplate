import { episodeStore, Episode } from "./episode-store";

jest.mock("rn-fetch-blob", () => "RNFetchBlob");

describe("episode-store", () => {
  it("can fetch episodes", () => {
    return episodeStore.fetchAll().then(() => {
      expect(episodeStore.isLoading).toEqual(false);
    });
  });
});
