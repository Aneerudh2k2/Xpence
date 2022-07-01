import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Octicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import { get_access_token } from "../utils/securestore";

const DrawerContent = (props, { navigation }) => {
  const isFocused = useIsFocused();
  const [hfocused, setHFocused] = useState(false);
  const [pfocused, setPFocused] = useState(false);
  const [efocused, setEFocused] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");

  const handleApi = async () => {
    try {
      // Dummmy api
      const data = await fetch("https://randomuser.me/api");
      const img = await data.json();
      // "https://randomuser.me/api"

      // my api
      const access_token = await get_access_token();
      console.log("\nFrom drawercontent: ", access_token);
      let data1 = await fetch(
        `https://xpenceapi.herokuapp.com/users/me?access_token=${access_token}`
      );
      data1 = await data1.json();
      if (data1.error) {
        console.log("\nDrawer content fetch api: ", data1.error);
      } else {
        setAvatar(data1[0].avatar);
        setUsername(data1[0].name);
      }
      // setAvatar(img[0].avatar);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleApi();
  }, []);

  const handleSignOut = async () => {
    const access_token = await get_access_token();
    let result = await fetch(
      `https://xpenceapi.herokuapp.com/logout?access_token=${access_token}`
    );
    result = await result.json();
    if (result.logged_out) {
      props.navigation.navigate("Login");
    } else {
      Alert.alert("Info", "Something went wrong 😕", [
        {
          text: "return to home",
          onPress: () => props.navigation.navigate("Home"),
        },
      ]);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        margin: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 25,
          paddingTop: 30,
          borderBottomWidth: 0.25,
        }}
      >
        <Avatar
          rounded
          size="medium"
          source={{
            uri: avatar,
          }}
        />

        <Text style={{ fontSize: 20, marginLeft: 10 }}>Hello, {username}</Text>
      </View>

      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <DrawerContentScrollView>
          <DrawerItem
            label="Home"
            focused={hfocused}
            icon={(props) => (
              <AntDesign name="home" size={props.size} color={props.color} />
            )}
            onPress={() => {
              props.navigation.navigate("Home");
              setHFocused(isFocused ? true : false);
              setEFocused(isFocused ? false : true);
              setPFocused(isFocused ? false : true);
            }}
            activeBackgroundColor="#aceca1"
            activeTintColor="#134611"
          />

          <DrawerItem
            label="Profile"
            focused={pfocused}
            icon={(props) => (
              <EvilIcons name="user" size={30} color={props.color} />
            )}
            onPress={() => {
              props.navigation.navigate("Profile");
              setHFocused(isFocused ? false : true);
              setEFocused(isFocused ? false : true);
              setPFocused(isFocused ? true : false);
            }}
            activeBackgroundColor="#aceca1"
            activeTintColor="#134611"
          />

          <DrawerItem
            label="Expenses"
            focused={efocused}
            icon={(props) => (
              <MaterialCommunityIcons
                name="cash"
                size={props.size}
                color={props.color}
              />
            )}
            onPress={() => {
              props.navigation.navigate("Expenses");
              setHFocused(isFocused ? false : true);
              setEFocused(isFocused ? true : false);
              setPFocused(isFocused ? false : true);
            }}
            activeBackgroundColor="#aceca1"
            activeTintColor="#134611"
          />
        </DrawerContentScrollView>
      </View>

      <View
        style={{
          marginHorizontal: 35,
          marginBottom: 25,
          paddingVertical: 15,
          paddingHorizontal: 7,
          borderWidth: 2,
          borderColor: "red",
          borderRadius: 21,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={() => {
            handleSignOut();
          }}
        >
          <Octicons
            style={{ paddingHorizontal: 7 }}
            name="sign-out"
            size={24}
            color="red"
          />
          <Text
            style={{
              color: "red",
              fontSize: 20,
              marginLeft: 10,
              bottom: 3,
            }}
          >
            Signout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DrawerContent;
