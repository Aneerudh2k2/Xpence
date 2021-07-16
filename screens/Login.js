import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";

const Login = ({ navigation }) => {
  const [redirectData, setRedirectData] = useState({});
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "211230601413-987o47v63tgvp570reqrmfp5ceorrt9f.apps.googleusercontent.com",
    clientSecret: "QGSaWa3sUcX2Lp9sq3bnyzin",
  });

  const handleRedirect = (event) => {
    if (Platform.OS === "ios") {
      WebBrowser.dismissAuthSession();
    } else {
      removeLinkingListener();
    }

    let data = Linking.parse(event.url);

    setRedirectData(data);
  };

  // const removeLinkingListener = () => {
  //   Linking.removeEventListener("url", handleRedirect);
  // };

  // const addLinkingListener = () => {
  //   Linking.addEventListener("url", handleRedirect);
  // };

  // openAuthSessionAsync doesn't require that you add Linking listeners, it
  // returns the redirect URL in the resulting Promise
  const handleOAuthLogin = async () => {
    let redirectUrl = await Linking.makeUrl("/home");
    console.log(redirectUrl);
    let authUrl = `https://xpenceapi.herokuapp.com/login`;
    try {
      let authresult = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );
      let temp;
      if (authresult.url) {
        temp = Linking.parse(authresult.url);
      }
      console.log(authresult, temp);
      setRedirectData(temp);
    } catch (e) {
      console.log("handleOAuthlogin error: ", e);
    }
  };

  const handleLogin = async () => {
    let redirectUrl = await Linking.makeUrl("/home");
    console.log(redirectUrl);
    const result = await AuthSession.startAsync({
      authUrl: `https://xpenceapi.herokuapp.com/login`,
      returnUrl: redirectUrl,
    });
    console.log(result);
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
      <View style={styles.Imgbanner}>
        <Image
          style={{ width: 350, height: 350 }}
          source={require("../assets/Login/money.jpg")}
        />
      </View>

      <View style={styles.loginPart}>
        <View
          style={{
            paddingTop: 100,
          }}
        >
          <TouchableOpacity
            style={styles.siginwithgoogle}
            onPress={() => {
              // navigation.navigate("Home");
              // handleOAuthLogin();
              // Linking.openURL("exp://192.168.43.99:19000/--/home");
              // if (authResult.authresult.type === "success") {
              //   navigation.navigate("Home");
              // }
              handleLogin();
              // console.log(authResult);
            }}
          >
            <Image
              source={require("../assets/Login/google.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text style={{ fontSize: 23, left: 20, color: "#5b6b74" }}>
              Sign In with Google
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  Imgbanner: {
    flex: 0.45,
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
  },
  loginPart: {
    flex: 0.55,
    padding: 40,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    shadowColor: "#f8f8f8",
    elevation: 20,
    borderColor: "#000",
    backgroundColor: "#96E072",
  },
  siginwithgoogle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 30,
  },
});

export default Login;
