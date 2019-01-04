import React from "react";
import { observer } from "mobx-react/native";
import { Button, Text, View, Icon, Spinner } from "native-base";
import { StyleSheet } from "react-native";
import { Episode } from "../../stores/episode-store";

const EpisodeItem = observer(
  ({
    onPlayEpisode,
    onDownloadEpisode,
    episode,
  }: {
    onPlayEpisode(episode: typeof Episode.Type): void;
    onDownloadEpisode(episode: typeof Episode.Type): void;
    episode: typeof Episode.Type;
  }) => {
    return (
      <View style={styles.episode} testID="episode-item">
        <Text testID="episode-title" style={styles.title}>
          {episode.title}
        </Text>
        <View style={{ flexDirection: "row" }}>
          {episode.isLocal === false && (
            <Button
              transparent
              disabled={episode.isDownloading}
              onPress={() => onDownloadEpisode(episode)}
            >
              <Icon name="download" />
            </Button>
          )}
          <Button transparent onPress={() => onPlayEpisode(episode)}>
            <Icon name="play" />
          </Button>
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
    margin: 10,
  },
});

export default EpisodeItem;
