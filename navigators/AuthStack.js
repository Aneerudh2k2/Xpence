import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
// Screens in AuthStack
import OnBoarding from "../components/OnBoarding";
import Login from "../screens/Login";
import PivotStack from "./PivotStack";
import * as Linking from "expo-linking";

const Stack = createStackNavigator();

const AuthStack = ({ navigation }) => {
  const [isFirstLaunch, setFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("alreadyOpened").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("alreadyOpened", "true");
        setFirstLaunch(true);
      } else {
        // change it to false
        setFirstLaunch(false);
      }
    });
  });

  let routeName;

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    routeName = "OnBoarding";
  } else {
    routeName = "Login";
  }

  let linking = {
    prefixes: [Linking.makeUrl("/")],
    config: {
      screens: {
        Home: "home",
        // Profile: "profile",
        // Expenses: "expenses",
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator headerMode="none" initialRouteName={routeName}>
        {console.log(routeName)}
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={PivotStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});

export default AuthStack;
