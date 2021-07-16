import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  FlatList,
  LogBox,
  Alert,
} from "react-native";
import { Avatar } from "react-native-elements";
import {
  Feather,
  FontAwesome5,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  EvilIcons,
  Ionicons,
} from "@expo/vector-icons";
import { LineChart, PieChart } from "react-native-chart-kit";
// import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";

const Home = ({ navigation }) => {
  LogBox.ignoreLogs(["VirtualizedLists"]);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [statsToggle, setStatsToggle] = useState("");
  const sheetRefStats = useRef(null);
  const sheetRefCategory = useRef(null);
  const sheetRefAdd = useRef(null);
  // Backdrop effect for bottomsheet
  // let fall = new Animated.Value(1);
  // const animatedShadowOpacity = Animated.interpolateNode(fall, {
  //   inputRange: [0, 1],
  //   outputRange: [0.35, 0],
  // });

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

  const pastExpensedata = [
    {
      id: 1,
      title: "Lunch with friends",
      amt_spent: 1250,
      type: "Food",
      place: "Mangalam hotel",
    },
    {
      id: 2,
      title: "kalai bday treat",
      amt_spent: 1250,
      type: "Food",
      place: "Mangalam hotel",
    },
    {
      id: 3,
      title: "Gym fees",
      amt_spent: 1250,
      type: "Sports",
      place: "Kings gym",
    },
    {
      id: 4,
      title: "Badminton membership",
      amt_spent: 1250,
      type: "Sports",
      place: "Super smash acad",
    },
    {
      id: 5,
      title: "Tempered glass",
      amt_spent: 1250,
      type: "Gadget",
      place: "Chennai mobiles",
    },
  ];

  const RenderNavBar = ({ navigation }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 15,
          paddingHorizontal: 15,
          // backgroundColor: "#96e072",
          // borderWidth: 1,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 0.1,
            width: 45,
          }}
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <EvilIcons name="navicon" size={35} color="#134611" />
        </TouchableOpacity>

        <View
          style={{
            flex: 0.99,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, marginLeft: 10, color: "#134611" }}>
            Xpence 💰
          </Text>
          <TouchableOpacity
            style={{
              width: 45,
            }}
            onPress={() => sheetRefAdd.current.snapTo(0)}
          >
            <Entypo name="plus" size={35} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  let now = new Date();
  const greetings = () => {
    let today = new Date().getHours();
    if (today >= 5 && today < 12) return "Morning  🌤️";
    else if (today >= 12 && today < 17) return "Afternoon  ☀️";
    else if (today >= 15 && today < 21) return "Evening  🌥️";
    else return "Night  💤";
  };

  const RenderGreeting = () => {
    return (
      <View
        style={{
          flex: 0.1,
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
          // borderWidth: 1,
          borderRadius: 8,
        }}
      >
        <View style={{ margin: 7 }}>
          <Avatar size="medium" rounded source={{ uri: avatar }} />
        </View>
        <View style={{ margin: 7, padding: 3 }}>
          <Text style={{ color: "grey", padding: 2 }}>Good {greetings()}</Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              padding: 3,
              color: "#034078",
            }}
          >
            Aneerudh
          </Text>
        </View>
      </View>
    );
  };

  const RenderExpenseBanner = () => {
    return (
      <View
        style={{
          flex: 0.15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // borderWidth: 1,
          backgroundColor: "#fff",
          margin: 10,
          padding: 20,
          paddingTop: 25,
          borderRadius: 15,
          elevation: 5,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "100",
              color: "#004f2d",
            }}
          >
            Expense total
          </Text>
          <Text
            style={{
              fontSize: 30,
              padding: 7,
              fontWeight: "900",
              color: "#004f2d",
            }}
          >
            ₹ 12,000
          </Text>
        </View>
        <View>
          <Image
            style={{
              width: 100,
              height: 90,
            }}
            source={require("../assets/homepage.png")}
          />
        </View>
      </View>
    );
  };

  const RenderStatsToggle = () => {
    return (
      <View
        style={{
          flex: 0.09,
          margin: 10,
          // padding: 15,
          justifyContent: "space-around",
          alignItems: "center",
          // borderWidth: 1,
          flexDirection: "row",
          borderRadius: 20,
          backgroundColor: "#fff",
          elevation: 5,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 0.5,
            width: "50%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            backgroundColor: statsToggle === "chart" ? "#95e06c" : "#fff",
          }}
          onPress={() => {
            setStatsToggle("chart");
            sheetRefCategory.current.snapTo(1); // to close lists
            sheetRefStats.current.snapTo(0); // to open stats
          }}
        >
          <Text
            style={{
              color: statsToggle === "chart" ? "#fff" : "#000",
              fontSize: 17,
            }}
          >
            Monthly Stats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 0.5,
            width: "50%",
            height: "100%",
            backgroundColor: statsToggle === "list" ? "#95e06c" : "#fff",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
          onPress={() => {
            setStatsToggle("list");
            sheetRefStats.current.snapTo(1); // to close stats
            sheetRefCategory.current.snapTo(0); // to open lists
          }}
        >
          <Text
            style={{
              color: statsToggle === "list" ? "#fff" : "#000",
              fontSize: 17,
            }}
          >
            Category Stats
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMonthlyStats = () => {
    return (
      <View
        style={{
          padding: 10,
          height: 360,
          alignItems: "center",
          backgroundColor: "#fff",
          elevation: 20,
          shadowColor: "gray",
          justifyContent: "space-between",
          borderTopWidth: 2,
        }}
      >
        <Text style={{ fontSize: 20 }}>Your Monthly Stats 📊</Text>
        <LineChart
          data={{
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
            ],
            datasets: [
              // {
              //   data: [
              //     Math.random() * 100,
              //     Math.random() * 100,
              //     Math.random() * 100,
              //     Math.random() * 100,
              //     Math.random() * 100,
              //     Math.random() * 100,
              //     Math.random() * 100,
              //   ],
              //   color: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
              // },
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              },
            ],
            // legend: ["Exp 1", "Exp 2"],
          }}
          width={Dimensions.get("window").width - 10} // from react-native
          height={Dimensions.get("window").height - 500}
          yAxisLabel="₹"
          yAxisSuffix="k"
          yAxisInterval={2} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#96E072",
            backgroundGradientFrom: "#43b929",
            backgroundGradientTo: "#5cf64a",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            borderRadius: 16,
            // borderWidth: 1,
            paddingBottom: 10,
          }}
        />
      </View>
    );
  };

  const renderCategoryStats = () => {
    return (
      <View
        style={{
          padding: 10,
          height: 350,
          alignItems: "center",
          backgroundColor: "#fff",
          elevation: 20,
          shadowColor: "gray",
          borderTopWidth: 2,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 20 }}>Your Category Stats 📈 </Text>

        <LinearGradient
          colors={["#00b712", "#5aff15", "#00b712"]}
          start={[0.65, 0.35]}
          style={{
            // backgroundColor: "#00b712",
            borderRadius: 25,
            elevation: 10,
          }}
        >
          <PieChart
            data={[
              {
                name: "Food",
                count: 3,
                color: "#d95d39",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Education",
                count: 4,
                color: "skyblue",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Sports",
                count: 4,
                color: "#000",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Banking",
                count: 2,
                color: "#136f63",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "HealthCare",
                count: 3,
                color: "#10b881",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Gadget",
                count: 10,
                color: "#084887",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Shopping",
                count: 5,
                color: "#ffd639",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Misc",
                count: 15,
                color: "gray",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
            ]}
            width={Dimensions.get("window").width - 16}
            height={Dimensions.get("window").height - 500} // 280
            chartConfig={{
              backgroundColor: "#96E072",
              backgroundGradientFromOpacity: 0,
              backgroundGradientFrom: "#43b929",
              backgroundGradientToOpacity: 0.5,
              backgroundGradientTo: "#5cf64a",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              borderRadius: 16,

              // borderWidth: 1,
              // margin: 20,
            }}
            accessor="count"
            paddingLeft="30"
          />
        </LinearGradient>
      </View>
    );
  };

  const renderAddForm = () => {
    return (
      <View
        style={{
          padding: 10,
          height: 380,
          alignItems: "center",
          backgroundColor: "#fff",
          elevation: 20,
          shadowColor: "gray",
          borderTopWidth: 2,
        }}
      >
        <Text>Hello this where you add details</Text>
      </View>
    );
  };

  const renderPastExpenses = ({ item }) => {
    const renderIcon = (item) => {
      const type = item.type;
      switch (type) {
        case "Food":
          return (
            <MaterialCommunityIcons name="food" size={45} color="#d95d39" />
          );

        case "Education":
          return <FontAwesome5 name="book-reader" size={45} color="skyblue" />;

        case "Sports":
          return <Entypo name="game-controller" size={45} color="black" />;

        case "Banking":
          return (
            <MaterialCommunityIcons
              name="currency-inr"
              size={45}
              color="#136f63"
            />
          );

        case "HealthCare":
          return <FontAwesome5 name="hospital" size={45} color="#10b881" />;

        case "Gadget":
          return (
            <Entypo name="tablet-mobile-combo" size={45} color="#084887" />
          );

        case "Shopping":
          return <Feather name="shopping-bag" size={45} color="black" />;

        case "Miscellaneous":
          return <Ionicons name="ios-settings" size={45} color="gray" />;

        default:
          return (
            <Entypo name="dots-three-horizontal" size={24} color="black" />
          );
      }
    };

    const date = () => {
      const today = new Date();
      return today.toDateString().substring(4, today.toDateString().length);
    };

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#fff",
          margin: 5,
          padding: 15,
          // borderWidth: 1,
          borderRadius: 10,
          elevation: 5,
        }}
        onLongPress={() => Alert.alert(`${item.id}`)}
      >
        <View
          style={{
            marginRight: 15,
            // borderWidth: 1,
            flex: 0.2,
          }}
        >
          {renderIcon(item)}
        </View>

        <View
          style={{
            flexDirection: "column",
            // borderWidth: 1,
            flex: 0.98,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              margin: 3,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text style={{ fontWeight: "bold" }}>₹{item.amt_spent}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 3,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Entypo name="location-pin" size={20} color="gray" />
              <Text style={{ color: "gray" }}>{item.place}</Text>
            </View>
            <View>
              <Text style={{}}>{date()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
      {/* <Animated.View
        pointerEvents="none"
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "#000",
            opacity: animatedShadowOpacity,
          },
        ]}
      /> */}
      <RenderNavBar navigation={navigation} />
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          margin: 5,
          // borderWidth: 1,
        }}
        // refreshControl={
        //   <RefreshControl
        //     colors={["#43b929"]}
        //     refreshing={loading}
        //     onRefresh={() => handleApi()}
        //   />
        // }
      >
        <RenderGreeting />
        <RenderExpenseBanner />
        <RenderStatsToggle />
        <View
          style={{
            flex: 0.76,
            margin: 10,
            padding: 5,
            // borderWidth: 1,
          }}
        >
          <Text style={{ fontSize: 25, margin: 6 }}>Last Expenses </Text>
          <FlatList
            data={pastExpensedata}
            renderItem={renderPastExpenses}
            keyExtractor={(item) => item.id.toString()}
            refreshing={loading}
            onRefresh={() => {
              handleApi();
            }}
          />
        </View>
        <BottomSheet
          ref={sheetRefStats}
          snapPoints={[360, 0]}
          // callbackNode={fall}
          borderRadius={25}
          initialSnap={1}
          renderContent={renderMonthlyStats}
          // enabledInnerScrolling={true}
          // onCloseEnd={() => {}}
          enabledContentTapInteraction={false}
        />

        <BottomSheet
          ref={sheetRefCategory}
          snapPoints={[350, 0]}
          // callbackNode={fall}
          borderRadius={25}
          initialSnap={1}
          renderContent={renderCategoryStats}
          enabledInnerScrolling={true}
          // onCloseEnd={() => {}}
          enabledContentTapInteraction={false}
        />

        <BottomSheet
          ref={sheetRefAdd}
          snapPoints={[380, 0]}
          // callbackNode={fall}
          borderRadius={25}
          initialSnap={1}
          renderContent={renderAddForm}
          enabledInnerScrolling={true}
          // onCloseEnd={() => {}}
          enabledContentTapInteraction={false}
        />
      </ScrollView>
    </View>
  );
};
{
  /* <FlatList
        data={pastExpensedata}
        renderItem={renderPastExpenses}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
      /> */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
  },
});

export default Home;
