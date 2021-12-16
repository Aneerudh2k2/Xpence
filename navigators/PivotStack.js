import React from "react";
import DrawerContent from "../components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Expenses from "../screens/Expenses";

const Drawer = createDrawerNavigator();
const PivotStack = ({ navigation }) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerType="slide"
      drawerStyle={{}}
      drawerContent={(props) => <DrawerContent {...props} />}
      backBehavior="order"
    >
      <Drawer.Screen
        name="Profile"
        component={Profile}
        headerShown={true}
        headerTitle="Profile"
        headerTitleAlign="center"
      />

      <Drawer.Screen
        name="Home"
        component={Home}
        headerShown={true}
        headerTitle="Home"
        headerTitleAlign="center"
      />

      <Drawer.Screen
        name="Expenses"
        component={Expenses}
        headerShown={true}
        headerTitle="Expenses"
        headerTitleAlign="center"
      />
    </Drawer.Navigator>
  );
};

export default PivotStack;
