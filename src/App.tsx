import React from "react";
import { Provider } from "mobx-react";
import { Platform, TouchableOpacity } from "react-native";
import { Icon, View } from "native-base";
import { createDrawerNavigator, createStackNavigator } from "react-navigation";

import { PointlessScreen } from "./screens/play-screen";
import { Episodes } from "./screens/episodes";
import { episodeStore } from "./stores/episode-store";
import { audioPlayerStore } from "./stores/audio-player-store";

const withDrawerButton = navigation => {
  return {
    headerLeft: <DrawerButton navigation={navigation} />,
    headerLeftContainerStyle: { padding: 16 },
  };
};

const DrawerButton = props => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          props.navigation.openDrawer();
        }}
      >
        <Icon name="menu" color="black" />
      </TouchableOpacity>
    </View>
  );
};

const DrawerNavigator = createDrawerNavigator(
  {
    Episodes: {
      screen: createStackNavigator(
        {
          Episodes: {
            screen: Episodes,
            navigationOptions: ({ navigation }) => ({
              ...withDrawerButton(navigation),
              drawerLabel: "در حال پخش",
            }),
          },
          NestedPointlessScreen: { screen: PointlessScreen },
        },
        {
          initialRouteName: "Episodes",
        },
      ),
      navigationOptions: ({ navigation }) => ({
        ...withDrawerButton(navigation),
        drawerLabel: "پادکست‌های من",
      }),
    },
    PointlessScreen: {
      screen: createStackNavigator(
        {
          PointlessScreen: {
            screen: PointlessScreen,
            navigationOptions: ({ navigation }) => ({
              ...withDrawerButton(navigation),
            }),
          },
        },
        {
          initialRouteName: "PointlessScreen",
        },
      ),
      navigationOptions: ({ navigation }) => ({
        ...withDrawerButton(navigation),
        drawerLabel: "در حال پخش",
      }),
    },
  },
  {
    initialRouteName: "Episodes",
    contentOptions: {
      activeTintColor: "#e91e63",
    },
    drawerPosition: Platform.OS === "ios" ? "left" : "right",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#f4511e",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    },
  },
);

type Props = {};
export class App extends React.Component<Props> {
  private drawer: any = null;

  closeDrawer = () => {
    this.drawer!._root.close();
  };

  openDrawer = () => {
    this.drawer._root.open();
  };

  render() {
    return (
      <Provider episodeStore={episodeStore} audioPlayerStore={audioPlayerStore}>
        <DrawerNavigator />
      </Provider>
    );
  }
}
