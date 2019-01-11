import React from "react";
import { inject, observer } from "mobx-react/native";
import { Container, Content, Header, Spinner } from "native-base";
import { ScrollView, StyleSheet } from "react-native";
import EpisodeItem from "./episode-item";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { EpisodeStore, Episode } from "../../stores/episode-store";

interface EpisodesProps {
  navigation: NavigationScreenProp<NavigationState>;
  episodeStore: EpisodeStore;
}

interface EspisodesState {}

const EpisodeList = ({
  onSelectEpisode,
  onDownloadEpisode,
  onDeleteEpisode,
  episodes,
}: {
  onSelectEpisode(episode: typeof Episode.Type): void;
  onDownloadEpisode(episode: typeof Episode.Type): void;
  onDeleteEpisode(episode: typeof Episode.Type): void;
  episodes: typeof Episode.Type[];
}) => {
  return (
    <ScrollView style={styles.episodes}>
      {episodes.map((episode: typeof Episode.Type, index: number) => (
        <EpisodeItem
          onSelectEpisode={(episode: typeof Episode.Type) =>
            onSelectEpisode(episode)
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

@inject("episodeStore")
@observer
export class Episodes extends React.Component<EpisodesProps, EspisodesState> {
  static navigationOptions = {
    title: "پادکست‌های من",
  };

  constructor(props: EpisodesProps) {
    super(props);
    this.props.episodeStore.fetchAll();
  }

  goToEpisode = (episode: typeof Episode.Type) => {
    this.props.navigation.push("NestedPointlessScreen", {
      episode: episode,
    });
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
              onSelectEpisode={episode => this.goToEpisode(episode)}
              onDownloadEpisode={episode => this.downloadEpisode(episode)}
              onDeleteEpisode={episode => this.deleteEpisode(episode)}
              episodes={this.props.episodeStore.episodes}
            />
          )}
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
