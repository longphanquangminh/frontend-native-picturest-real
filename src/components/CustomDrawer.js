import React from "react";
import { View, Text, ImageBackground, Image, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import { capitalizeString } from "../helpers/capitalizeString";
import { BASE_URL_IMG } from "../api/config";
import { useState } from "react";

const CustomDrawer = props => {
  const navigation = useNavigation();
  // console.log("s", props.userInfo);
  // console.log("s", props.token);
  const [error, setError] = useState(false);

  const onImageError = () => {
    setError(true);
  };
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: "#8200d6" }}>
        <ImageBackground source={require("../../assets/images/menu-bg.jpeg")} style={{ padding: 20 }}>
          {props.userInfo ? (
            <Image
              source={
                error || !props.userInfo?.anhDaiDien
                  ? require("../../assets/images/picturest-logo.png")
                  : { uri: `${BASE_URL_IMG}/${props.userInfo.anhDaiDien}` }
              }
              onError={onImageError}
              style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
            />
          ) : (
            <View style={{ height: 80, width: 80, marginBottom: 10 }}></View>
          )}
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              marginBottom: 5,
            }}
          >
            {props.userInfo && capitalizeString(props.userInfo.hoTen)}
          </Text>
          <View style={{ flexDirection: "row" }}>
            {/* <Text
              style={{
                color: "#fff",
                marginRight: 5,
              }}
            >
              280 Coins
            </Text>
            <FontAwesome5 name='coins' size={14} color='#fff' /> */}
          </View>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name='share-social-outline' size={22} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
              }}
            >
              Tell your friends
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (props.userInfo) {
              props.logout();
              navigation.dispatch(DrawerActions.closeDrawer());
              Toast.show({
                type: "success",
                text1: "Logout successfully!",
                text2: "Hope to see you again 👋",
              });
              // navigation.navigate("Home");
              // navigation.navigate("Login");
            } else {
              navigation.navigate("Login");
            }
          }}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name='exit-outline' size={22} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
              }}
            >
              {props.userInfo ? `Sign out` : "Sign in"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  userInfo: state.user.userInfo,
  token: state.user.token,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: "LOGOUT" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);
