import React from "react";
import { View, Text, ImageBackground, Image, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";

const CustomDrawer = props => {
  const navigation = useNavigation();
  // console.log("s", props.userInfo);
  // console.log("s", props.token);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: "#8200d6" }}>
        <ImageBackground source={require("../../assets/images/menu-bg.jpeg")} style={{ padding: 20 }}>
          <Image source={require("../../assets/images/picturest-logo.png")} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              marginBottom: 5,
            }}
          >
            John Doe
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#fff",
                marginRight: 5,
              }}
            >
              280 Coins
            </Text>
            <FontAwesome5 name='coins' size={14} color='#fff' />
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
