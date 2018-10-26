import React from "react";
import { Icon, View } from "native-base";
import { Provider } from "mobx-react";
import { createDrawerNavigator, createStackNavigator } from "react-navigation";

import { todoStore } from "./stores/todo-store";
import { PointlessScreen } from "./screens/pointless-screen";
import { TodoList } from "./screens/todo-list";
import { TouchableOpacity } from "react-native";

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
    TodoList: {
      screen: createStackNavigator(
        {
          TodoList: {
            screen: TodoList,
            navigationOptions: ({ navigation }) => ({
              ...withDrawerButton(navigation),
              drawerLabel: "Pointless Screen",
            }),
          },
          NestedPointlessScreen: { screen: PointlessScreen },
        },
        {
          initialRouteName: "TodoList",
        },
      ),
      navigationOptions: ({ navigation }) => ({
        ...withDrawerButton(navigation),
        drawerLabel: "Todo List",
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
        drawerLabel: "Pointless Screen",
      }),
    },
  },
  {
    initialRouteName: "TodoList",
    contentOptions: {
      activeTintColor: "#e91e63",
    },
    drawerPosition: "left",
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
      <Provider todoStore={todoStore}>
        <DrawerNavigator />
      </Provider>
    );
  }
}
