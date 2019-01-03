import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { Icon, View, Container } from "native-base";
import { createDrawerNavigator, createStackNavigator } from "react-navigation";

// import { todoStore } from "./stores/todo-store";
import { PointlessScreen } from "./screens/pointless-screen";
// import { TodoList } from "./screens/todo-list";
import { Episodes } from "./screens/episodes";

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
              drawerLabel: "صفحه‌ی بی‌خاصیت",
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
        drawerLabel: "صفحه‌ی بی‌خاصیت",
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
      <Container>
        <DrawerNavigator />
      </Container>
    );
  }
}
