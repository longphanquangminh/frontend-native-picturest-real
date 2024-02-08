import { View, Text, TouchableOpacity } from "react-native";
import { themeColors } from "../theme/index";
import { useNavigation } from "@react-navigation/native";

export default function PleaseLoginScreen() {
  const navigation = useNavigation();
  return (
    <View className='flex h-screen items-center justify-center space-y-6'>
      <Text>Please login to experience this feature!</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{ backgroundColor: isActive ? themeColors.bgLight : "rgba(0,0,0,0.07)" }}
        className='py-3 px-9 mr-2 rounded-full shadow'
      >
        <Text className='font-semibold'>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
