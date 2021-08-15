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
  Alert,
  RefreshControl,
  LogBox,
} from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  EvilIcons,
} from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { get_access_token } from "../utils/securestore";
import { ScrollView } from "react-native-gesture-handler";

const Profile = ({ navigation }) => {
  LogBox.ignoreLogs(["source.uri"]);
  const categoryListHeightAnimatedValue = useRef(
    new Animated.Value(115)
  ).current;
  const [showMoreToggle, setShowMoreToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    avatar: "",
    name: "",
    email_id: "",
  });
  const [expenseInfo, setExpenseInfo] = useState({
    total_count: 0,
    expense_sum: 0,
    category_count: 0,
  });

  const handleCategoryCount = (category_count) => {
    let obj = {
      food: 0,
      sports: 0,
      education: 0,
      banking: 0,
      healthCare: 0,
      gadget: 0,
      shopping: 0,
      misc: 0,
    };

    category_count.forEach((value) => {
      obj[value.type] = value["count(type)"];
    });
    return obj;
  };

  const handleUserApi = async () => {
    try {
      const access_token = await get_access_token();
      setLoading(true);
      // const data = await fetch("https://randomuser.me/api");

      let userData = await fetch(
        `https://xpenceapi.herokuapp.com/users/me?access_token=${access_token}`
      );
      // "https://randomuser.me/api"
      userData = await userData.json();
      if (userData.error) {
        console.log("\nProfile error: ", userData.error);
        if (userData.error === "Unauthorized") {
          Alert.alert("Session Expired", "Please login again", [
            {
              text: "Okay",
              onPress: () => {
                navigation.navigate("Login");
                setLoading(false);
              },
            },
          ]);
        }
      }
      // console.log(userData);
      setUserInfo({
        avatar: userData[0].avatar,
        name: userData[0].name,
        email_id: userData[0].email_id,
      });
      // console.log(userInfo);
      // setAvatar(img[0].avatar);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExpenseApi = async () => {
    try {
      const access_token = await get_access_token();
      let expenseData1 = await fetch(
        `https://xpenceapi.herokuapp.com/expense/profile_stats?access_token=${access_token}`
      );
      expenseData1 = await expenseData1.json();
      if (expenseData1.error) {
        console.log(expenseData1.error);
        if (expenseData1.error === "Unauthorized") {
          Alert.alert("Session Expired", "Please login again", [
            {
              text: "Okay",
              onPress: () => {
                navigation.navigate("Login");
                setLoading(false);
              },
            },
          ]);
        }
      }
      // console.log(expenseData1);

      let expenseData2 = await fetch(
        `https://xpenceapi.herokuapp.com/expense/category_count?access_token=${access_token}`
      );
      expenseData2 = await expenseData2.json();
      if (expenseData2.error) {
        console.log(expenseData2.error);
        if (expenseData2.error === "Unauthorized") {
          Alert.alert("Session Expired", "Please login again", [
            {
              text: "Okay",
              onPress: () => {
                navigation.navigate("Login");
                setLoading(false);
              },
            },
          ]);
        }
      }
      // console.log(expenseData2);

      setExpenseInfo({
        total_count: expenseData1[0]["count(*)"],
        expense_sum: expenseData1[0]["sum(amt_spent)"],
        category_count: handleCategoryCount(expenseData2),
      });

      // console.log(expenseInfo);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleUserApi();
  }, []);

  useEffect(() => {
    handleExpenseApi();
  }, []);

  const data = [
    {
      id: 1,
      name: "Food",
      count: expenseInfo.category_count.food,
    },
    {
      id: 2,
      name: "Education",
      count: expenseInfo.category_count.education,
    },
    {
      id: 3,
      name: "Sports",
      count: expenseInfo.category_count.sports,
    },
    {
      id: 4,
      name: "Banking",
      count: expenseInfo.category_count.banking,
    },
    {
      id: 5,
      name: "Health Care",
      count: expenseInfo.category_count.healthCare,
    },
    {
      id: 6,
      name: "Gadget",
      count: expenseInfo.category_count.gadget,
    },
    {
      id: 7,
      name: "Shopping",
      count: expenseInfo.category_count.shopping,
    },
    {
      id: 8,
      name: "Miscellaneous",
      count: expenseInfo.category_count.misc,
    },
  ];

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
            source={{ uri: userInfo.avatar }}
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
          <Text style={{ fontSize: 23 }}>{userInfo.name}</Text>
          {/*Icon*/}
          <View style={{ flexDirection: "row", padding: 3 }}>
            <MaterialCommunityIcons name="gmail" size={24} color="#EA4335" />
            <Text style={{ left: 5, fontSize: 15 }}>{userInfo.email_id}</Text>
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
            <Text style={{ fontSize: 15 }}>{expenseInfo.total_count}</Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 15 }}>Total Expenses</Text>
            <Text style={{ fontSize: 15 }}>₹{expenseInfo.expense_sum}</Text>
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
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
            colors={["#43b929"]}
            refreshing={loading}
            onRefresh={() => {
              handleUserApi();
              handleExpenseApi();
            }}
          />
        }
      >
        {renderNavBar({ navigation })}
        {/* {console.log(userInfo, expenseInfo)} */}
        {renderProfileBanner()}
        <View style={{ flex: 0.625 }}>
          {renderStats()}
          <View contentContainerStyle={{ paddingBottom: 20 }}>
            {renderExpenseTypes()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Profile;
