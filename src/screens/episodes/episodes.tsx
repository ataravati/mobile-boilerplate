import React from "react";
import { inject, observer } from "mobx-react/native";
import { Text, Button, Container, Content, Header, Footer, Spinner } from "native-base";
import { ScrollView, StyleSheet } from "react-native";
import EpisodeItem from "./episode-item";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { EpisodeStore, Episode } from "../../stores/episode-store";
import { AudioPlayerStore } from "../../stores/audio-player-store";

interface EpisodesProps {
  navigation: NavigationScreenProp<NavigationState>;
  episodeStore: EpisodeStore;
  audioPlayerStore: AudioPlayerStore;
}

interface EspisodesState {}

const EpisodeList = ({
  onPlayEpisode,
  onPauseEpisode,
  onDownloadEpisode,
  onDeleteEpisode,
  episodes,
}: {
  onPlayEpisode(episode: typeof Episode.Type): void;
  onPauseEpisode(episode: typeof Episode.Type): void;
  onDownloadEpisode(episode: typeof Episode.Type): void;
  onDeleteEpisode(episode: typeof Episode.Type): void;
  episodes: typeof Episode.Type[];
}) => {
  return (
    <ScrollView style={styles.episodes}>
      {episodes.map((episode: typeof Episode.Type, index: number) => (
        <EpisodeItem
          onPlayEpisode={(episode: typeof Episode.Type) =>
            onPlayEpisode(episode)
          }
          onPauseEpisode={(episode: typeof Episode.Type) =>
            onPauseEpisode(episode)
          }
          onDownloadEpisode={(episode: typeof Episode.Type) =>
            onDownloadEpisode(episode)
          }
          onDeleteEpisode={(episode: typeof Episode.Type) =>
            onDeleteEpisode(episode)
          }
          key={index}
          episode={episode}
        />
      ))}
    </ScrollView>
  );
};

@inject("episodeStore", "audioPlayerStore")
@observer
export class Episodes extends React.Component<EpisodesProps, EspisodesState> {
  static navigationOptions = {
    title: "پادکست‌های من",
  };

  constructor(props: EpisodesProps) {
    super(props);
    this.props.episodeStore.fetchAll();
  }

  playEpisode = (episode: typeof Episode.Type) => {
    this.props.audioPlayerStore.load(episode).then(() => {
      this.props.audioPlayerStore.play();
    });
  };

  pauseEpisode = (episode: typeof Episode.Type) => {
    this.props.audioPlayerStore.pause();
  };

  downloadEpisode = (episode: typeof Episode.Type) => {
    this.props.episodeStore.downloadEpisode(episode);
  };

  deleteEpisode = (episode: typeof Episode.Type) => {
    this.props.episodeStore.deleteEpisode(episode);
  };

  render() {
    return (
      <Container style={{ direction: "rtl" }}>
        <Header style={{ backgroundColor: "white" }} />
        <Content style={{ flex: 1 }}>
          {this.props.episodeStore.isLoading ? (
            <Spinner />
          ) : (
            <EpisodeList
              onPlayEpisode={episode => this.playEpisode(episode)}
              onPauseEpisode={episode => this.pauseEpisode(episode)}
              onDownloadEpisode={episode => this.downloadEpisode(episode)}
              onDeleteEpisode={episode => this.deleteEpisode(episode)}
              episodes={this.props.episodeStore.episodes}
            />
          )}
        </Content>
        <Footer style={{ flexDirection: "column", height: 150 }}>
          {this.props.audioPlayerStore.episode && (
            <Button
              full
              onPress={() => {
                this.props.navigation.push("NestedPointlessScreen");
              }}
            >
              <Text>در حال پحش</Text>
            </Button>
          )}
        </Footer>
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
