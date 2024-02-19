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
        style={{ backgroundColor: "#d4a574" }}
        className='py-3 px-9 mr-2 rounded-full shadow'
      >
        <Text className='font-semibold text-white'>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
