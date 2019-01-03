import React from "react";
import { StyleSheet } from "react-native";

import { Button, Text, View, Icon } from "native-base";

export function Episode({ onPlayEpisode, onDownloadEpisode, episode }) {
  return (
    <View style={styles.episode} testID="todo-item">
      <Text testID="episode-title" style={styles.title}>
        {episode.title}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <Button transparent onPress={() => onDownloadEpisode(episode)}>
          <Icon name="download" />
        </Button>
        <Button transparent onPress={() => onPlayEpisode(episode)}>
          <Icon name="play" />
        </Button>
      </View>
    </View>
  );
}

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
