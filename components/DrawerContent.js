import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Octicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Avatar } from "react-native-elements";

const DrawerContent = (props) => {
  const isFocused = useIsFocused();
  const [hfocused, setHFocused] = useState(false);
  const [pfocused, setPFocused] = useState(false);
  const [efocused, setEFocused] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleApi = async () => {
    try {
      const data = await fetch("https://randomuser.me/api");
      // "https://randomuser.me/api"
      const img = await data.json();
      setAvatar(img.results[0].picture.large);
      // setAvatar(img[0].avatar);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleApi();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        margin: 10,
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

        <Text style={{ fontSize: 20, marginLeft: 10 }}>Hello, Aneerudh</Text>
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
            props.navigation.navigate("Login");
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
