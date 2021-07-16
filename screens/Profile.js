import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  EvilIcons,
} from "@expo/vector-icons";
import { Avatar } from "react-native-elements";

const Profile = ({ navigation }) => {
  const data = [
    {
      id: 1,
      name: "Food",
      count: 3,
    },
    {
      id: 2,
      name: "Education",
      count: 4,
    },
    {
      id: 3,
      name: "Sports",
      count: 4,
    },
    {
      id: 4,
      name: "Banking",
      count: 2,
    },
    {
      id: 5,
      name: "Health Care",
      count: 3,
    },
    {
      id: 6,
      name: "Gadget",
      count: 10,
    },
    {
      id: 7,
      name: "Shopping",
      count: 5,
    },
    {
      id: 8,
      name: "Miscellaneous",
      count: 15,
    },
  ];

  const categoryListHeightAnimatedValue = useRef(
    new Animated.Value(115)
  ).current;
  const [showMoreToggle, setShowMoreToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleApi = async () => {
    try {
      setLoading(true);
      const data = await fetch("https://randomuser.me/api");
      // "https://randomuser.me/api"
      const img = await data.json();
      if (img) {
        setLoading(false);
      }
      setAvatar(img.results[0].picture.large);
      // setAvatar(img[0].avatar);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleApi();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
        color="#43b929"
        // animating={loading}
      />
    );
  }

  const renderNavBar = ({ navigation }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingVertical: 15,
          paddingHorizontal: 15,
          backgroundColor: "#96e072",
        }}
      >
        <TouchableOpacity
          style={{
            width: 45,
          }}
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <EvilIcons name="navicon" size={35} color="#134611" />
        </TouchableOpacity>

        <View>
          <Text style={{ fontSize: 25, marginLeft: 10, color: "#134611" }}>
            Profile
          </Text>
        </View>
      </View>
    );
  };

  const renderProfileBanner = () => {
    return (
      <View
        style={{
          flex: 0.37,
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "blue",
          marginHorizontal: 17,
          borderBottomWidth: 0.5,
        }}
      >
        <View style={{}}>
          <Avatar
            size="xlarge"
            rounded
            source={{ uri: avatar }}
            activeOpacity={0.5}
          />
        </View>

        <View
          style={{
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <Text style={{ fontSize: 23 }}>Aneerudh</Text>
          {/*Icon*/}
          <View style={{ flexDirection: "row", padding: 3 }}>
            <MaterialCommunityIcons name="gmail" size={24} color="#EA4335" />
            <Text style={{ left: 5, fontSize: 15 }}>anee469@gmail.com</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderStats = () => {
    return (
      <View
        style={{
          // borderWidth: 1,
          margin: 25,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Stats </Text>
        <View
          style={{
            marginTop: 10,
            margin: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={{ fontSize: 15 }}>Number of expenses till now</Text>
            <Text style={{ fontSize: 15 }}>10</Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 15 }}>Price of expenses</Text>
            <Text style={{ fontSize: 15 }}>₹12458</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderExpenseTypes = () => {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 5,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderRadius: 5,
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ color: "#000", fontSize: 15 }}>{item.name}</Text>
          <Text style={{ color: "#000", fontSize: 15 }}>{item.count}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <View
        style={{
          marginTop: 15,
          margin: 25,
          // borderWidth: 0.5,
        }}
      >
        <Animated.View style={{ height: categoryListHeightAnimatedValue }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Categories</Text>
          <View style={{ margin: 6 }}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.id}`}
              numColumns={2}
            />
          </View>
        </Animated.View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            marginVertical: 8,
            justifyContent: "center",
          }}
          onPress={() => {
            if (showMoreToggle) {
              Animated.timing(categoryListHeightAnimatedValue, {
                toValue: 113,
                duration: 300,
                useNativeDriver: false,
              }).start();
            } else {
              Animated.timing(categoryListHeightAnimatedValue, {
                toValue: 220,
                duration: 300,
                useNativeDriver: false,
              }).start();
            }
            setShowMoreToggle(!showMoreToggle);
          }}
        >
          <View style={{ flexDirection: "row", marginTop: 25 }}>
            <Text style={{ marginRight: 5 }}>
              {showMoreToggle ? "Less" : "More"}
            </Text>
            <>
              {showMoreToggle ? (
                <AntDesign name="up" size={19} color="black" />
              ) : (
                <AntDesign name="down" size={19} color="black" />
              )}
            </>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#96e072"
        barStyle="light-content"
        showHideTransition="fade"
        hidden={false}
      />

      {renderNavBar({ navigation })}
      {renderProfileBanner()}
      <View style={{ flex: 0.625 }}>
        {renderStats()}
        <View contentContainerStyle={{ paddingBottom: 20 }}>
          {renderExpenseTypes()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Profile;
