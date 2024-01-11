import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import { HomeIcon as HomeOutline, HeartIcon as HeartOutline, ShoppingBagIcon as BagOutline } from "react-native-heroicons/outline";
import { HomeIcon as HomeSolid, HeartIcon as HeartSolid, ShoppingBagIcon as BagSolid } from "react-native-heroicons/solid";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { themeColors } from "../theme";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ios = Platform.OS == "ios";

const menuIcons = (route, focused) => {
  let icon;

  if (route.name === "home") {
    icon = focused ? <HomeSolid size='30' color={themeColors.bgLight} /> : <HomeOutline size='30' strokeWidth={2} color='white' />;
  } else if (route.name === "favourite") {
    icon = focused ? <HeartSolid size='30' color={themeColors.bgLight} /> : <HeartOutline size='30' strokeWidth={2} color='white' />;
  } else if (route.name === "cart") {
    icon = focused ? <BagSolid size='30' color={themeColors.bgLight} /> : <BagOutline size='30' strokeWidth={2} color='white' />;
  }

  let buttonClass = focused ? "bg-white" : "";
  return <View className={"flex items-center rounded-full p-3 " + buttonClass}>{icon}</View>;
};

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => menuIcons(route, focused),
        tabBarStyle: {
          marginBottom: 20,
          height: 75,
          alignItems: "center",

          borderRadius: 100,
          marginHorizontal: 20,
          backgroundColor: themeColors.bgLight,
          position: "absolute",
        },
        tabBarItemStyle: {
          marginTop: ios ? 30 : 0,
        },
      })}
    >
      <Tab.Screen name='home' component={HomeScreen} />
      <Tab.Screen name='favourite' component={HomeScreen} />
      <Tab.Screen name='cart' component={HomeScreen} />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}>
        <Stack.Screen name='Home' options={{ headerShown: false }} component={HomeTabs} />
        <Stack.Screen name='Welcome' component={WelcomeScreen} />
        <Stack.Screen name='RecipeDetail' options={{ presentation: "fullScreenModal" }} component={RecipeDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
