import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";

function LoginScreen({ loading, error, login }) {
  const navigation = useNavigation();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Login successfully!",
      text2: "Welcome back 👋",
    });
  };
  const handleLogin = () => {
    login({ email: username, matKhau: password });
    setPassword("");
    setUsername("");
    showToast();
    navigation.goBack();
  };
  return (
    <ScrollView className='flex-1 bg-white' style={{ backgroundColor: themeColors.bg }}>
      <SafeAreaView className='flex '>
        <View className='flex-row justify-start'>
          <TouchableOpacity onPress={() => navigation.goBack()} className='bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4'>
            <ArrowLeftIcon size='20' color='black' />
          </TouchableOpacity>
        </View>
        <View className='flex-row justify-center'>
          <Image source={require("../../assets/images/login.png")} style={{ width: 200, height: 200 }} />
        </View>
      </SafeAreaView>
      <View style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }} className='flex-1 bg-white px-8 pt-8 pb-28'>
        <View className='form space-y-2'>
          <Text className='text-gray-700 ml-4'>Email</Text>
          <TextInput
            value={username}
            onChangeText={text => setUsername(text)}
            className='p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3'
            placeholder='Your email'
          />
          <Text className='text-gray-700 ml-4'>Password</Text>
          <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            className='p-4 bg-gray-100 text-gray-700 rounded-2xl'
            secureTextEntry
            placeholder='Your password'
          />
          <TouchableOpacity className='flex items-end'>
            <Text className='text-gray-700 mb-5'>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogin} className='py-3 bg-yellow-400 rounded-xl'>
            <Text className='text-xl font-bold text-center text-gray-700'>Login</Text>
          </TouchableOpacity>
        </View>
        <Text className='text-xl text-gray-700 font-bold text-center py-5'>Or</Text>
        <View className='flex-row justify-center space-x-12'>
          <TouchableOpacity className='p-2 bg-gray-100 rounded-2xl'>
            <Image source={require("../../assets/icons/google.png")} className='w-10 h-10' />
          </TouchableOpacity>
          <TouchableOpacity className='p-2 bg-gray-100 rounded-2xl'>
            <Image source={require("../../assets/icons/apple.png")} className='w-10 h-10' />
          </TouchableOpacity>
          <TouchableOpacity className='p-2 bg-gray-100 rounded-2xl'>
            <Image source={require("../../assets/icons/facebook.png")} className='w-10 h-10' />
          </TouchableOpacity>
        </View>
        <View className='flex-row justify-center mt-7'>
          <Text className='text-gray-500 font-semibold'>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text className='font-semibold text-yellow-500'> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => ({
  loading: state.user.loading,
  error: state.user.error,
});

const mapDispatchToProps = dispatch => ({
  login: credentials => dispatch({ type: "LOGIN", payload: credentials }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
