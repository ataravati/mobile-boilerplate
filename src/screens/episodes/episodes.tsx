import React from "react";
import { Container, Content, Header } from "native-base";
import { ScrollView, StyleSheet } from "react-native";
import { Episode } from "./episode";
import { NavigationScreenProp, NavigationState } from "react-navigation";

interface Episode {
  title: string;
  filename: string;
}

interface EpisodesProps {
  navigation: NavigationScreenProp<NavigationState>;
}

const EpisodeList = ({
  onPlayEpisode,
  onDownloadEpisode,
  episodes,
}: {
  onPlayEpisode(episode: Episode): void;
  onDownloadEpisode(episode: Episode): void;
  episodes: Episode[];
}) => {
  return (
    <ScrollView style={styles.episodes}>
      {episodes.map((episode: Episode, index: number) => (
        <Episode
          onPlayEpisode={(episode: Episode) => onPlayEpisode(episode)}
          onDownloadEpisode={(episode: Episode) => onDownloadEpisode(episode)}
          key={index}
          episode={episode}
        />
      ))}
    </ScrollView>
  );
};

export class Episodes extends React.Component<EpisodesProps, void> {
  episodes: Episode[] = [
    {
      title: "فصل دوم - قسمت ۵ - کاش اینجا بودی",
      filename:
        "http://feeds.soundcloud.com/stream/247409391-tehranpodcast-lfuo5sqr9aby.mp3",
    },
    {
      title: "مستند صوتی «بازیِ گوش» قسمت نهم: با پیمان یزدانیان",
      filename:
        "http://feeds.soundcloud.com/stream/325004379-tehranpodcast-hermes09.mp3",
    },
  ];

  static navigationOptions = {
    title: "پادکست‌های من",
  };

  playEpisode = (episode: Episode) => {
    this.props.navigation.push("NestedPointlessScreen", {
      filename: episode.filename,
    });
  };

  downloadEpisode = (episode: Episode) => {
    console.log(`Downloading episode ${episode.title}`);
  };

  render() {
    return (
      <Container style={{ direction: "rtl" }}>
        <Header style={{ backgroundColor: "white" }} />
        <Content style={{ flex: 1 }}>
          <EpisodeList
            onPlayEpisode={episode => this.playEpisode(episode)}
            onDownloadEpisode={episode => this.downloadEpisode(episode)}
            episodes={this.episodes}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  content: {
    margin: 10,
    flex: 1,
    flexDirection: "column",
  },
  episodes: {
    flex: 3,
    flexDirection: "column",
    width: "100%",
  },
});
