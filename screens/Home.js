import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  TextInput,
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
  Keyboard,
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
import { get_access_token } from "../utils/securestore";
import { Picker } from "@react-native-picker/picker";

const Home = ({ navigation, route }) => {
  LogBox.ignoreLogs(["VirtualizedLists"]);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");
  const [statsToggle, setStatsToggle] = useState("");
  const [homeExpenseData, sethomeExpenseData] = useState([]);
  const [piecountdata, setPieCountData] = useState({
    food: 0,
    sports: 0,
    education: 0,
    banking: 0,
    healthCare: 0,
    gadget: 0,
    shopping: 0,
    misc: 0,
  });
  const [totalExpenseBanner, settotalExpenseBanner] = useState(0);
  const [monthlywiseExpense, setmonthlywiseExpense] = useState({
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  });
  const [title, setTitle] = useState("");
  const [amtspent, setAmtSpent] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  // const [postExpenseData, setPostExpenseData] = useState({
  //   title: "",
  //   amt_spent: "",
  //   type: "",
  //   place: "",
  // });
  let postExpenseData = {
    title: "",
    amt_spent: "",
    type: "",
    place: "",
  };
  let formdata = new FormData();
  const sheetRefStats = useRef(null);
  const sheetRefCategory = useRef(null);
  const sheetRefAdd = useRef(null);
  // Backdrop effect for bottomsheet
  // let fall = new Animated.Value(1);
  // const animatedShadowOpacity = Animated.interpolateNode(fall, {
  //   inputRange: [0, 1],
  //   outputRange: [0.35, 0],
  // });

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

  const handleMonthlyExpense = (monthlydata) => {
    let obj = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    monthlydata.forEach((value) => {
      let month = value["month(updatedAt)"];
      switch (month) {
        case 1:
          obj.Jan = value["sum(amt_spent)"];
          break;
        case 2:
          obj.Feb = value["sum(amt_spent)"];
          break;
        case 3:
          obj.Mar = value["sum(amt_spent)"];
          break;
        case 4:
          obj.Apr = value["sum(amt_spent)"];
          break;
        case 5:
          obj.May = value["sum(amt_spent)"];
          break;
        case 6:
          obj.Jun = value["sum(amt_spent)"];
          break;
        case 7:
          obj.Jul = value["sum(amt_spent)"];
          break;
        case 8:
          obj.Aug = value["sum(amt_spent)"];
          break;
        case 9:
          obj.Sep = value["sum(amt_spent)"];
          break;
        case 10:
          obj.Oct = value["sum(amt_spent)"];
          break;
        case 11:
          obj.Nov = value["sum(amt_spent)"];
          break;
        case 12:
          obj.Dec = value["sum(amt_spent)"];
          break;
        default:
          break;
      }
    });

    console.log(obj);
    return obj;
  };

  const handleUserApi = async () => {
    try {
      setLoading(true);
      const access_token = await get_access_token();
      console.log("From homejs: ", access_token);
      const data = await fetch("https://randomuser.me/api");
      // "https://randomuser.me/api"
      let data1 = await fetch(
        `http://anee.eastus.cloudapp.azure.com:5000/users/me?access_token=${access_token}`
      );
      data1 = await data1.json();
      console.log(data1);
      const img = await data.json();
      if (data1.error) {
        console.log(data1.error);
        if (data1.error === "Unauthorized") {
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

      // setAvatar(img1.results[0].picture.large);
      setAvatar(data1[0].avatar);
      setUsername(data1[0].name);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExpenseApi = async () => {
    try {
      const access_token = await get_access_token();
      let homePageExpenseData = await fetch(
        `http://anee.eastus.cloudapp.azure.com:5000/expenses?sortBy=createdAt_desc&limit=5&access_token=${access_token}`
      );
      homePageExpenseData = await homePageExpenseData.json();
      if (homePageExpenseData.error) {
        console.log(homePageExpenseData.error);
        setLoading(false);
      }

      let countData = await fetch(
        `http://anee.eastus.cloudapp.azure.com:5000/expense/category_count?access_token=${access_token}`
      );
      countData = await countData.json();
      if (countData.error) {
        console.log(countData.error);
        setLoading(false);
      }

      let totalExpense = await fetch(
        `http://anee.eastus.cloudapp.azure.com:5000/expense/profile_stats?access_token=${access_token}`
      );
      totalExpense = await totalExpense.json();
      if (totalExpense.error) {
        console.log(totalExpense.error);
        setLoading(false);
      }
      console.log(totalExpense);

      let monthlyData = await fetch(
        `http://anee.eastus.cloudapp.azure.com:5000/expense/monthly_expense?access_token=${access_token}`
      );
      monthlyData = await monthlyData.json();
      if (monthlyData.error) {
        console.log(monthlyData.error);
        setLoading(false);
      }

      setmonthlywiseExpense(handleMonthlyExpense(monthlyData));
      settotalExpenseBanner(totalExpense[0]["sum(amt_spent)"]);
      setPieCountData(handleCategoryCount(countData));
      sethomeExpenseData(homePageExpenseData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostExpense = async (postExpenseData) => {
    const token = await get_access_token();
    console.log("inside handle func: ", { title, amtspent, type, location });
    console.log("using variable: ", postExpenseData);
    console.log("using form data: ", formdata);
    let data = await fetch(
      `http://anee.eastus.cloudapp.azure.com:5000/expense?access_token=${token}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postExpenseData),
      }
    );
    data = await data.json();
    console.log("Post expense data: ", data);
    if (data.error) {
      console.log(data.error);
      if (data.error === "Unauthorized") {
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
    } else {
      Alert.alert("Info", "Your expense added successfully 😍", [
        {
          text: "Add more expenses",
          onPress: () => {
            setTitle("");
            setType("");
            setAmtSpent("");
            setLocation("");
            sheetRefAdd.current.snapTo(0);
          },
        },
        {
          text: "Okay",
          onPress: () => {
            setTitle("");
            setType("");
            setAmtSpent("");
            setLocation("");
            sheetRefAdd.current.snapTo(1);
          },
        },
      ]);
    }
  };

  useEffect(() => {
    handleUserApi();
  }, []);

  useEffect(() => {
    handleExpenseApi();
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

  // const pastExpensedata = [
  //   {
  //     id: "1",
  //     title: "Lunch with friends",
  //     amt_spent: 1250,
  //     type: "Food",
  //     place: "Mangalam hotel",
  //   },
  //   {
  //     id: "2",
  //     title: "kalai bday treat",
  //     amt_spent: 1250,
  //     type: "Food",
  //     place: "Mangalam hotel",
  //   },
  //   {
  //     id: "3",
  //     title: "Gym fees",
  //     amt_spent: 1250,
  //     type: "Sports",
  //     place: "Kings gym",
  //   },
  //   {
  //     id: "4",
  //     title: "Badminton membership",
  //     amt_spent: 1250,
  //     type: "Sports",
  //     place: "Super smash acad",
  //   },
  //   {
  //     id: "5",
  //     title: "Tempered glass",
  //     amt_spent: 1250,
  //     type: "Gadget",
  //     place: "Chennai mobiles",
  //   },
  // ];

  const pastExpensedata = homeExpenseData.map((each) => {
    const { id, title, amt_spent, type, place, createdAt } = each;
    return {
      id,
      title,
      amt_spent,
      type,
      place,
      createdAt,
    };
  });

  // const pastExpensedata = [];
  // console.log(pastExpensedata);

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
            onPress={() => {
              sheetRefCategory.current.snapTo(1);
              sheetRefStats.current.snapTo(1);
              sheetRefAdd.current.snapTo(0);
            }}
          >
            <Entypo name="plus" size={35} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
            {username}
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
          elevation: 2,
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
            ₹ {totalExpenseBanner}
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
          elevation: 2,
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
            sheetRefAdd.current.snapTo(1);
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
            sheetRefAdd.current.snapTo(1);
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
    const year = new Date().getFullYear();
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
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
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
                  monthlywiseExpense.Jan,
                  monthlywiseExpense.Feb,
                  monthlywiseExpense.Mar,
                  monthlywiseExpense.Apr,
                  monthlywiseExpense.May,
                  monthlywiseExpense.Jun,
                  monthlywiseExpense.Jul,
                  monthlywiseExpense.Aug,
                  monthlywiseExpense.Sep,
                  monthlywiseExpense.Oct,
                  monthlywiseExpense.Nov,
                  monthlywiseExpense.Dec,
                ],
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              },
            ],
            legend: [`${year}`],
          }}
          width={Dimensions.get("window").width - 20} // from react-native
          height={Dimensions.get("window").height - 500}
          yAxisLabel="₹"
          yAxisSuffix="k"
          yAxisInterval={2} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#96E072",
            backgroundGradientFrom: "#43b929",
            backgroundGradientTo: "#5cf64a",
            decimalPlaces: 0, // optional, defaults to 2dp
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
                count: piecountdata.food,
                color: "#d95d39",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Education",
                count: piecountdata.education,
                color: "skyblue",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Sports",
                count: piecountdata.sports,
                color: "#000",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Banking",
                count: piecountdata.banking,
                color: "#136f63",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "HealthCare",
                count: piecountdata.healthCare,
                color: "#10b881",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Gadget",
                count: piecountdata.gadget,
                color: "#084887",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Shopping",
                count: piecountdata.shopping,
                color: "#ffd639",
                legendFontColor: "#fff",
                legendFontSize: 12,
              },
              {
                name: "Misc",
                count: piecountdata.misc,
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
          flexDirection: "column",
          justifyContent: "space-between",
          // alignItems: "center",
          backgroundColor: "#fff",
          elevation: 20,
          shadowColor: "gray",
          borderTopWidth: 2,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            margin: 10,
            borderWidth: 1,
            flex: 1,
            // justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 0.25,
              borderRadius: 10,
              justifyContent: "space-evenly",
              flex: 0.15,
              margin: 5,
            }}
          >
            <AntDesign
              name="idcard"
              size={35}
              color="black"
              adjustsFontSizeToFit={true}
            />
            <TextInput
              placeholder="Type title here....."
              style={{
                flex: 0.7,
                width: 200,
                borderWidth: 0.25,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 0.25,
              borderRadius: 10,
              justifyContent: "space-evenly",
              flex: 0.15,
              margin: 5,
            }}
          >
            <Text style={{ flex: 0.2 }}>Amount spent</Text>
            <TextInput
              placeholder="Type amount spent here....."
              style={{
                flex: 0.7,
                width: 200,
                borderWidth: 0.25,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              flex: 0.15,
              borderRadius: 10,
              margin: 5,
            }}
          >
            <Text style={{ flex: 0.2 }}>Category</Text>
            <View style={{ flex: 0.7, borderWidth: 0.25 }}>
              <Picker
                selectedValue={type}
                onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                mode="dropdown"
              >
                <Picker.Item label="Food" value="food" />
                <Picker.Item label="Sports" value="sports" />
                <Picker.Item label="Education" value="education" />
                <Picker.Item label="Banking" value="banking" />
                <Picker.Item label="Health Care" value="healthCare" />
                <Picker.Item label="Gadgets" value="gadget" />
                <Picker.Item label="Shopping" value="shopping" />
                <Picker.Item label="Miscellaneous" value="misc" />
              </Picker>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 0.25,
              borderRadius: 10,
              justifyContent: "space-evenly",
              flex: 0.15,
              margin: 5,
            }}
          >
            <Text style={{ flex: 0.2 }}>Location</Text>
            <TextInput
              placeholder="Type location here....."
              style={{
                flex: 0.7,
                width: 200,
                borderWidth: 0.25,
              }}
            />
          </View>

          <View>
            <TouchableOpacity style={{}}>
              <Text>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View
        style={{
          flexDirection: "column",
          backgroundColor: "#fff",
          padding: 16,
          height: 400,
          borderWidth: 0.5,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ fontSize: 20 }}> Add Expenditures</Text>
        </View>

        {/* Title */}
        <View
          style={{
            flexDirection: "row",
            margin: 10,
            borderWidth: 0.5,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              padding: 7,
              borderRightWidth: 0.5,
              borderBottomRightRadius: 2,
            }}
          >
            <AntDesign
              name="idcard"
              size={35}
              color="black"
              adjustsFontSizeToFit={true}
            />
          </View>

          <View
            style={{
              padding: 10,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                paddingRight: 10,
                width: 250,
              }}
              numberOfLines={1}
              value={title}
              onChangeText={(value) => {
                setTitle(value);
              }}
              placeholder="Type title...."
            />
          </View>
        </View>

        {/*Amout spent*/}
        <View
          style={{
            flexDirection: "row",
            margin: 10,
            borderWidth: 0.5,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              padding: 7,
              borderRightWidth: 0.5,
              borderBottomRightRadius: 2,
            }}
          >
            <MaterialCommunityIcons
              name="currency-inr"
              size={35}
              color="black"
            />
          </View>

          <View
            style={{
              padding: 10,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                paddingRight: 10,
                width: 250,
              }}
              numberOfLines={1}
              value={amtspent}
              onChangeText={(value) => {
                setAmtSpent(value);
              }}
              placeholder="Type amount spent......"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Type of expense */}
        <View
          style={{
            flexDirection: "row",
            borderWidth: 0.5,
            borderRadius: 5,
            margin: 10,
          }}
        >
          <View
            style={{
              padding: 10,
              borderRightWidth: 0.5,
              borderBottomRightRadius: 2,
            }}
          >
            <MaterialCommunityIcons name="collage" size={24} color="black" />
          </View>
          <Picker
            style={{ height: 50, width: 290 }}
            selectedValue={type}
            onValueChange={(itemValue) => {
              setType(itemValue);
            }}
            mode="dropdown"
            itemStyle={{ fontSize: 20 }}
          >
            <Picker.Item label="Food" value="food" />
            <Picker.Item label="Sports" value="sports" />
            <Picker.Item label="Education" value="education" />
            <Picker.Item label="Banking" value="banking" />
            <Picker.Item label="Health Care" value="healthCare" />
            <Picker.Item label="Gadgets" value="gadget" />
            <Picker.Item label="Shopping" value="shopping" />
            <Picker.Item label="Miscellaneous" value="misc" />
          </Picker>
        </View>

        {/* Location */}
        <View
          style={{
            flexDirection: "row",
            margin: 10,
            borderWidth: 0.5,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              padding: 10,
              borderRightWidth: 0.5,
              borderBottomRightRadius: 2,
            }}
          >
            <Entypo
              name="location-pin"
              size={24}
              color="black"
              adjustsFontSizeToFit={true}
            />
          </View>

          <View
            style={{
              padding: 10,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                paddingRight: 10,
                width: 250,
              }}
              numberOfLines={1}
              value={location}
              onChangeText={(text) => {
                setLocation(text);
              }}
              placeholder="Type place of expense...."
            />
          </View>
        </View>

        {/* Button */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 20,
          }}
        >
          {/* Add */}
          <TouchableOpacity
            style={{
              paddingHorizontal: 35,
              paddingVertical: 10,
              backgroundColor: "#058ed9",
              borderRadius: 10,
            }}
            onPress={(e) => {
              e.preventDefault();
              Keyboard.dismiss();
              if (type === "") {
                postExpenseData.type = "food";
              }
              console.log({ title, amtspent, type, location });

              if (title === "" || amtspent === "" || location === "") {
                Alert.alert("Info", "Empty fields are not expenses 😕");
              } else {
                // setPostExpenseData({
                //   title: title,
                //   amt_spent: amtspent,
                //   type: type,
                //   place: location,
                // });
                postExpenseData.title = title;
                postExpenseData.amt_spent = amtspent;
                postExpenseData.type = type === "" ? "food" : type;
                postExpenseData.place = location;

                handlePostExpense(postExpenseData);
              }
              // console.log(expenseData);
              // sheetRef.current.snapTo(1);
            }}
          >
            <Text style={{ color: "#fff" }}>Add</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            style={{
              paddingHorizontal: 35,
              paddingVertical: 10,
              backgroundColor: "red",
              borderRadius: 10,
            }}
            onPress={() => {
              Keyboard.dismiss();
              setTitle("");
              setType("");
              setAmtSpent("");
              setLocation("");
              sheetRefAdd.current.snapTo(1);
            }}
          >
            <Text style={{ color: "#fff" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPastExpenses = ({ item }) => {
    const renderIcon = (item) => {
      const type = item.type;
      switch (type) {
        case "food":
          return (
            <MaterialCommunityIcons name="food" size={45} color="#d95d39" />
          );

        case "education":
          return <FontAwesome5 name="book-reader" size={45} color="skyblue" />;

        case "sports":
          return <Entypo name="game-controller" size={45} color="black" />;

        case "banking":
          return (
            <MaterialCommunityIcons
              name="currency-inr"
              size={45}
              color="#136f63"
            />
          );

        case "healthCare":
          return <FontAwesome5 name="hospital" size={45} color="#10b881" />;

        case "gadget":
          return (
            <Entypo name="tablet-mobile-combo" size={45} color="#084887" />
          );

        case "shopping":
          return <Feather name="shopping-bag" size={45} color="black" />;

        case "misc":
          return (
            <Entypo name="dots-three-horizontal" size={24} color="black" />
          );

        default:
          return (
            <Entypo name="dots-three-horizontal" size={24} color="black" />
          );
      }
    };

    const date = (date) => {
      const today = new Date(date);
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
          elevation: 3,
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
              <Text style={{}}>{date(item.createdAt)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
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
            {pastExpensedata.length === 0 ? (
              <View style={{ margin: 10, padding: 5, alignItems: "center" }}>
                <Text>Oops no more expenses ☹️</Text>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    marginTop: 15,
                    borderRadius: 5,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#5cf64a",
                  }}
                  onPress={() => {
                    sheetRefAdd.current.snapTo(0);
                  }}
                >
                  <Text>Add expense</Text>
                  <Entypo
                    name="plus"
                    style={{ left: 6 }}
                    size={25}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={pastExpensedata}
                renderItem={renderPastExpenses}
                keyExtractor={(item) => item.id.toString()}
                refreshing={loading}
                onRefresh={() => {
                  handleUserApi();
                  handleExpenseApi();
                }}
              />
            )}
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
        </ScrollView>
      </View>
      <BottomSheet
        ref={sheetRefAdd}
        snapPoints={[400, 0]}
        // callbackNode={fall}
        borderRadius={25}
        initialSnap={1}
        renderContent={renderContent}
        enabledInnerScrolling={true}
        // onCloseEnd={() => {}}
        enabledContentTapInteraction={false}
      />
    </>
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
