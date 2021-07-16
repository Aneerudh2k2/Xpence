import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import {
  Feather,
  FontAwesome5,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  EvilIcons,
  Ionicons,
} from "@expo/vector-icons";

const Expenses = ({ navigation }) => {
  const Fullexpense = [
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
    {
      id: 6,
      title: "Sem fees",
      amt_spent: 1250,
      type: "Education",
      place: "Tce",
    },
    {
      id: 7,
      title: "Underwear",
      amt_spent: 1250,
      type: "Miscellaneous",
      place: "Jockey showroom",
    },
    {
      id: 8,
      title: "Covid vaccination",
      amt_spent: 1250,
      type: "HealthCare",
      place: "GH Kgiri",
    },
    {
      id: 9,
      title: "Jersey T-shirts",
      amt_spent: 1250,
      type: "Shopping",
      place: "stadium behind",
    },
    {
      id: 10,
      title: "Cash deposit",
      amt_spent: 1250,
      type: "Banking",
      place: "Canara Bank",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [search, setSearch] = useState("");
  const [expense, setExpense] = useState([]);
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

  const renderNavBar = ({ navigation }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
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
          <Text style={{ fontSize: 24, marginLeft: 10, color: "#134611" }}>
            Expenses 🤑
          </Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
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
      // const str =
      //   String(today.getDate()) +
      //   "/" +
      //   String(today.getMonth() + 1) +
      //   "/" +
      //   String(today.getFullYear());
      // return str;
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

  // const separator = () => {
  //   return (
  //     <View
  //       style={{
  //         height: 1,
  //         width: "86%",
  //         backgroundColor: "#CED0CE",
  //         marginLeft: "5%",
  //       }}
  //     />
  //   );
  // };

  const contains = (exp, query) => {
    let { title, place } = exp;
    title = title.toLowerCase();
    place = place.toLowerCase();
    if (title.includes(query) || place.includes(query)) {
      return true;
    }
    return false;
  };

  const handleSearch = (value) => {
    const query = value.toLowerCase();
    const temp = Fullexpense.filter((exp) => {
      return contains(exp, query);
    });
    setExpense(temp);
  };

  const renderSearchBar = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          margin: 6,
          padding: 7,
          // height: 45,
          // borderWidth: 0.5,
          borderColor: "gray",
          borderRadius: 20,
          backgroundColor: "#fff",
          justifyContent: "space-between",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.55,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <AntDesign name="search1" size={23} color="black" />
        <TextInput
          // Keyboard closes when single char is typed because FlatList's props ListHeaderComponent
          style={{
            width: 250,
            // borderWidth: 0.2,
          }}
          placeholder="Type title here....."
          value={search}
          onChangeText={(val) => {
            handleSearch(val);
            setSearch(val);
          }}
        />
        <TouchableOpacity onPress={() => setSearch("")}>
          <Ionicons name="ios-close-circle" size={26} color="gray" />
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
      <View
        style={{
          flex: 1,
          margin: 13,
          // borderWidth: 1,
        }}
      >
        {renderSearchBar()}
        <FlatList
          data={expense.length === 0 || search === "" ? Fullexpense : expense}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          style={{ flex: 1 }}
          // ItemSeparatorComponent={separator}
          onRefresh={() => {
            handleApi();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
  },
});

export default Expenses;