import React from "react";
import { observer } from "mobx-react/native";
import { Button, Text, View, Icon } from "native-base";
import { StyleSheet, Platform } from "react-native";
import { Episode } from "../../stores/episode-store";

const EpisodeItem = observer(
  ({
    onPlayEpisode,
    onPauseEpisode,
    onDownloadEpisode,
    onDeleteEpisode,
    episode,
  }: {
    onPlayEpisode(episode: typeof Episode.Type): void;
    onPauseEpisode(episode: typeof Episode.Type): void;
    onDownloadEpisode(episode: typeof Episode.Type): void;
    onDeleteEpisode(episode: typeof Episode.Type): void;
    episode: typeof Episode.Type;
  }) => {
    return (
      <View style={styles.episode} testID="episode-item">
        <Text testID="episode-title" style={styles.title}>
          {episode.title}
        </Text>
        <View style={{ flexDirection: "row" }}>
          {episode.localPath ? (
            <Button transparent onPress={() => onDeleteEpisode(episode)}>
              <Icon name={Platform.OS === "ios" ? "ios-trash" : "trash"} />
            </Button>
          ) : (
            <Button
              transparent
              disabled={episode.isDownloading}
              onPress={() => onDownloadEpisode(episode)}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-cloud-download" : "download"}
              />
            </Button>
          )}
          {episode.isPlaying === false ? (
            <Button
              transparent
              disabled={episode.isLoading === true}
              onPress={() => onPlayEpisode(episode)}
            >
              <Icon name={Platform.OS === "ios" ? "ios-play" : "play"} />
            </Button>
          ) : (
            <Button transparent onPress={() => onPauseEpisode(episode)}>
              <Icon name={Platform.OS === "ios" ? "ios-pause" : "pause"} />
            </Button>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  title: {
    maxWidth: "70%",
    writingDirection: "rtl",
  },
  episode: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#eee",
  },
});

export default EpisodeItem;
