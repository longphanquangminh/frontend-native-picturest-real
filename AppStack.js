import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomDrawer from "./src/components/CustomDrawer";

import Ionicons from "react-native-vector-icons/Ionicons";
import AppNavigation from "./src/navigation";

const Drawer = createDrawerNavigator();

const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#aa18ea",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name='Home page'
        component={AppNavigation}
        options={{
          drawerIcon: ({ color }) => <Ionicons name='home-outline' size={22} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
