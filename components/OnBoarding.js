import React from "react";
import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import * as Font from "expo-font";

const Skip = ({ ...props }) => {
  return (
    <TouchableOpacity style={{ marginHorizontal: 8 }} {...props}>
      <Text style={{ fontSize: 16 }}>Skip</Text>
    </TouchableOpacity>
  );
};

const Dots = ({ selected }) => {
  let backgroundColor;

  backgroundColor = selected ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.3)";

  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};

const Next = ({ ...props }) => {
  return (
    <TouchableOpacity style={{ marginHorizontal: 8 }} {...props}>
      <Text style={{ fontSize: 16 }}>Next</Text>
    </TouchableOpacity>
  );
};

const Done = ({ ...props }) => {
  return (
    <TouchableOpacity style={{ marginHorizontal: 8 }} {...props}>
      <Text style={{ fontSize: 16 }}>Done</Text>
    </TouchableOpacity>
  );
};

const OnBoarding = ({ navigation }) => {
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#96e072"
        barStyle="light-content"
        showHideTransition="fade"
        hidden={false}
      />
      <Onboarding
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dots}
        bottomBarColor="#96e072"
        onSkip={() => {
          navigation.navigate("Login");
        }}
        onDone={() => {
          navigation.navigate("Login");
        }}
        pages={[
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("../assets/boarding_images/1.png")}
                style={{ width: 400, height: 275 }}
              />
            ),
            title: "Welcome to Xpence",
            subtitle: "Get Started with Xpence, Click next to get started",
          },
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("../assets/boarding_images/2.png")}
                style={{ width: 350, height: 350 }}
              />
            ),
            title: "Push the expenses",
            subtitle: "Add all your expenses and savings in Xpence",
          },
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("../assets/boarding_images/3.png")}
                style={{ width: 350, height: 350 }}
              />
            ),
            title: "Track expenses",
            subtitle: "Analysation of your expenses at your finger tips",
          },
        ]}
      />
    </>
  );
};

export default OnBoarding;
