import React, { useEffect } from "react";
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
import { get_access_token, save_access_token } from "../utils/securestore";

const Login = ({ navigation }) => {
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId:
  //     "211230601413-987o47v63tgvp570reqrmfp5ceorrt9f.apps.googleusercontent.com",
  //   clientSecret: "QGSaWa3sUcX2Lp9sq3bnyzin",
  // });

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { authentication } = response;
  //     console.log(authentication);
  //   }
  // }, [response]);

  const handleRedirect = (event) => {
    if (Platform.OS === "ios") {
      WebBrowser.dismissAuthSession();
    } else {
      removeLinkingListener();
    }

    let data = Linking.parse(event.url);
  };

  // const removeLinkingListener = () => {
  //   Linking.removeEventListener("url", handleRedirect);
  // };

  // const addLinkingListener = () => {
  //   Linking.addEventListener("url", handleRedirect);
  // };

  // openAuthSessionAsync doesn't require that you add Linking listeners, it
  // returns the redirect URL in the resulting Promise
  // Using WebBrowser AuthSession api
  const handleOAuthLogin = async () => {
    let redirectUrl = await Linking.makeUrl("/");
    console.log(redirectUrl);
    let authUrl = `https://xpenceapi.herokuapp.com/login?redirectUrl=${redirectUrl}`;
    try {
      let authresult = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );
      let temp;
      console.log("auth result: ", authresult, "\n");
      if (authresult.type === "success") {
        temp = Linking.parse(authresult.url);
        // temp = JSON.parse(temp.queryParams.user);
        save_access_token(temp.queryParams.access_token);
        console.log(temp.queryParams.access_token);
        navigation.navigate("Home");
      }
    } catch (e) {
      console.log("handleOAuthlogin error: ", e);
    }
  };

  // Using AuthSession api
  const handleLogin = async () => {
    // let redirectUrl = await Linking.makeUrl("/home");
    let redirectUrl = await AuthSession.makeRedirectUri({ path: "/home" });
    console.log(redirectUrl);
    const authresult = await AuthSession.startAsync({
      authUrl: `https://xpenceapi.herokuapp.com/login`,
      returnUrl: redirectUrl,
    });
    let temp;
    console.log("auth result: ", authresult, "\n");
    if (authresult.type === "success") {
      temp = Linking.parse(authresult.url);
      temp = JSON.parse(temp.queryParams.user);
    }
  };

  const login = async () => {
    let redirectUri = await AuthSession.makeRedirectUri({
      path: "/home",
    });
    console.log(redirectUri);
    const authresult = await promptAsync({ redirectUri });
    console.log(authresult);

    // // To refresh the logging with
    // const refreshResult = await AuthSession.refreshAsync({
    //   clientId:
    //     "211230601413-987o47v63tgvp570reqrmfp5ceorrt9f.apps.googleusercontent.com",
    //   clientSecret: "QGSaWa3sUcX2Lp9sq3bnyzin",
    //   scopes: ["profile", "email"],
    //   refreshToken: "" /** Your refresh token here */,
    // });
    // console.log(refreshResult);

    //
    // const refreshToken = await AuthSession.revokeAsync({
    //   token:
    //     "ya29.a0ARrdaM967_1FLimbB5gav0cpPw6cfviqh2iwXngi85wajdpFBIpGlU81Gl3H3wogtKQ2-L7OLhCpn2rPvFE-_-GchiTeHZddJK9PWWK_4tHCLJKVHcXuoUjAI1G8IaUpxILrw7GMjDhZ8-3xcKqV_YgEI7VVVQ",
    //   // clientId: "211230601413-987o47v63tgvp570reqrmfp5ceorrt9f.apps.googleusercontent.com",
    //   // clientSecret: "QGSaWa3sUcX2Lp9sq3bnyzin",
    //   // scopes: ["profile", "email"],
    //   tokenTypeHint: "bearer",
    // });
    // console.log(refreshToken);
  };

  const example = async () => {
    const access_token = await get_access_token();
    console.log(access_token);
    // let res = await fetch(
    //   `https://xpenceapi.herokuapp.com/example?access_token=${access_token}`
    // );
    let redirectUrl = await Linking.makeUrl("/");
    console.log(redirectUrl);
    let res = await fetch(
      `http://192.168.43.99:3000/example?redirectUrl=${redirectUrl}`
    );
    res = await res.json();
    console.log(res);
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
              handleOAuthLogin();
              // login();
              // example();
              // Linking.openURL("exp://192.168.43.99:19000/--/home");
              // if (authResult.authresult.type === "success") {
              //   navigation.navigate("Home");
              // }
              // handleLogin();
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
