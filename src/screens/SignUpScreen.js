import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import { themeColors } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";

function SignUpScreen({ loading, error, register }) {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const handleRegister = () => {
    register({ hoTen: username, matKhau: password, email, tuoi: 15 });
    setEmail("");
    setPassword("");
    setUsername("");
    showToast();
    navigation.goBack();
  };
  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Register successfully!",
      text2: "Welcome newcomer 👋 Please login!",
    });
  };
  return (
    <ScrollView className='flex-1 bg-white' style={{ backgroundColor: themeColors.bg }}>
      <SafeAreaView className='flex'>
        <View className='flex-row justify-start'>
          <TouchableOpacity onPress={() => navigation.goBack()} className='bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4'>
            <ArrowLeftIcon size='20' color='black' />
          </TouchableOpacity>
        </View>
        <View className='flex-row justify-center'>
          <Image source={require("../../assets/images/signup.png")} style={{ width: 165, height: 110 }} />
        </View>
      </SafeAreaView>
      <View className='flex-1 bg-white px-8 pt-8 pb-9' style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
        <View className='form space-y-2'>
          <Text className='text-gray-700 ml-4'>Full name</Text>
          <TextInput
            className='p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3'
            placeholder='Enter name'
            value={username}
            onChangeText={text => setUsername(text)}
          />
          <Text className='text-gray-700 ml-4'>Email</Text>
          <TextInput
            className='p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3'
            placeholder='Enter email'
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <Text className='text-gray-700 ml-4'>Password</Text>
          <TextInput
            className='p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7'
            secureTextEntry
            placeholder='Enter password'
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity onPress={handleRegister} className='py-3 bg-yellow-400 rounded-xl'>
            <Text className='font-xl font-bold text-center text-gray-700'>Sign Up</Text>
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
          <Text className='text-gray-500 font-semibold'>Already have an account?</Text>
          {/* <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className='font-semibold text-yellow-500'> Login</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className='font-semibold text-yellow-500'> Login</Text>
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
  register: credentials => dispatch({ type: "REGISTER", payload: credentials }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
