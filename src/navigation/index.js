import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import {
  HomeIcon as HomeOutline,
  HeartIcon as HeartOutline,
  ShoppingBagIcon as BagOutline,
  UserCircleIcon as UserOutline,
  CameraIcon as CameraOutline,
} from "react-native-heroicons/outline";
import {
  HomeIcon as HomeSolid,
  HeartIcon as HeartSolid,
  ShoppingBagIcon as BagSolid,
  UserCircleIcon as UserSolid,
  CameraIcon as CameraSolid,
} from "react-native-heroicons/solid";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { themeColors } from "../theme";
import { Platform, Text, View } from "react-native";
import { getItem } from "../utils/asyncStorage.js";
import OnboardingScreen from "../screens/OnboardingScreen.js";
import LoginScreen from "../screens/LoginScreen.js";
import SignUpScreen from "../screens/SignUpScreen.js";
import UserScreen from "../screens/UserScreen";
import UploadImageScreen from "../screens/UploadImageScreen.js";
import ProfileEditScreen from "../screens/ProfileEditScreen.js";
import SearchScreen from "../screens/SearchScreen.js";
import ProfileScreen from "../screens/ProfileScreen.js";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ios = Platform.OS == "ios";

const menuIcons = (route, focused) => {
  let icon;

  if (route.name === "home") {
    icon = focused ? <HomeSolid size='30' color={themeColors.bgLight} /> : <HomeOutline size='30' strokeWidth={2} color='white' />;
  } else if (route.name === "favourite") {
    icon = focused ? <CameraSolid size='30' color={themeColors.bgLight} /> : <CameraOutline size='30' strokeWidth={2} color='white' />;
  } else if (route.name === "cart") {
    icon = focused ? <UserSolid size='30' color={themeColors.bgLight} /> : <UserOutline size='30' strokeWidth={2} color='white' />;
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
      <Tab.Screen name='favourite' component={UploadImageScreen} />
      <Tab.Screen name='cart' component={UserScreen} />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  const [showOnboarding, setShowOnboarding] = React.useState(null);
  React.useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    let onboarded = await getItem("onboarded");
    if (onboarded === 1) {
      // hide onboarding
      setShowOnboarding(false);
    } else {
      // show onboarding
      setShowOnboarding(true);
    }
  };

  if (showOnboarding == null) {
    return null;
  }
  return (
    <Stack.Navigator
      initialRouteName={showOnboarding ? "Onboarding" : "Welcome"}
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}
    >
      <Stack.Screen name='Onboarding' options={{ headerShown: false }} component={OnboardingScreen} />
      <Stack.Screen name='Home' options={{ headerShown: false }} component={HomeTabs} />
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
      <Stack.Screen name='SignUp' component={SignUpScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Search' component={SearchScreen} />
      <Stack.Screen name='Profile' component={ProfileScreen} />
      <Stack.Screen name='RecipeDetail' options={{ presentation: "fullScreenModal" }} component={RecipeDetailScreen} />
      <Stack.Screen name='ProfileEdit' component={ProfileEditScreen} options={{ title: "Edit Profile" }} />
    </Stack.Navigator>
  );
  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}>
  //       <Stack.Screen name='Home' options={{ headerShown: false }} component={HomeTabs} />
  //       <Stack.Screen name='Welcome' component={WelcomeScreen} />
  //       <Stack.Screen name='RecipeDetail' options={{ presentation: "fullScreenModal" }} component={RecipeDetailScreen} />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}

export default AppNavigation;
