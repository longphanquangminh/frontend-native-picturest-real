import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { Bars3CenterLeftIcon } from "react-native-heroicons/solid";
import axios from "axios";
import Recipes from "../components/recipes";
import { BASE_URL } from "../api/config";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "../components/customDrawerContent";
import Ionicons from "@expo/vector-icons/Ionicons";
import Categories from "../components/categories";
import SortCategories from "../components/sortCategories";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
function HomeScreen({ searchValue, setSearchValue, posted }) {
  const handleSearch = () => {
    if (!searchValue) {
      Toast.show({
        type: "error",
        text1: "No value",
        text2: "Type something to find pictures!",
      });
    } else {
      navigation.navigate("Search", { searchValue });
    }
  };
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState("Beef");
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState("");

  const checkTime = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      setTimeOfDay("morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }
  };

  const [pictures, setPictures] = useState([]);

  const getPictures = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pictures`);
      // console.log("got categories: ", response.data.content.data);
      if (response && response.data) {
        setPictures(response.data.content.data);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  useEffect(() => {
    getCategories();
    getRecipes();
    checkTime();
  }, []);

  useEffect(() => {
    getPictures();
  }, [posted]);

  const handleChangeCategory = category => {
    getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get("https://themealdb.com/api/json/v1/1/categories.php");
      // console.log('got categories: ',response.data);
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };
  const getRecipes = async (category = "Beef") => {
    try {
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      // console.log('got recipes: ',response.data);
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };
  return (
    <View className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }} className='space-y-6 pt-14'>
        {/* avatar and bell icon */}
        <View className='mx-4 flex-row justify-between items-center mb-2'>
          {/* <Image source={require("../../assets/images/avatar.png")} style={{ height: hp(5), width: hp(5.5) }} /> */}
          <Bars3CenterLeftIcon
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}
            color={themeColors.textIcon}
            size='30'
          />
          <BellIcon size={hp(4)} color='gray' />
        </View>

        {/* greetings and punchline */}
        <View className='mx-4 space-y-2 mb-2'>
          <Text style={{ fontSize: hp(1.7) }} className='text-neutral-600'>
            Good {timeOfDay}, photo addict!
          </Text>
          <View>
            <Text style={{ fontSize: hp(3.8) }} className='font-semibold text-neutral-600'>
              Search for many ideas,
            </Text>
          </View>
          <Text style={{ fontSize: hp(3.8) }} className='font-semibold text-neutral-600'>
            and <Text className='text-amber-400'>save</Text> them!
          </Text>
        </View>

        {/* search bar */}
        {/* <View className='mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]'>
          <TextInput
            placeholder='Search any pictures'
            placeholderTextColor={"gray"}
            style={{ fontSize: hp(1.7) }}
            className='flex-1 text-base mb-1 pl-3 tracking-wider'
          />
          <TouchableOpacity className='rounded-full p-2' style={{ backgroundColor: themeColors.bgLight }}>
            <MagnifyingGlassIcon size='25' strokeWidth={2} color='white' />
          </TouchableOpacity>
        </View> */}
        <View className='flex-row items-center space-x-2 px-4 pb-2 '>
          <View className='flex-row flex-1 items-center rounded-full bg-black/5 p-[6px]'>
            <TextInput
              placeholder='Search any pictures'
              placeholderTextColor={"gray"}
              style={{ fontSize: hp(1.7) }}
              className='flex-1 text-base mb-1 pl-3 tracking-wider'
              onChangeText={text => {
                setSearchValue(text);
              }}
              value={searchValue}
            />
            <TouchableOpacity onPress={handleSearch} className='rounded-full p-2' style={{ backgroundColor: themeColors.bgLight }}>
              <MagnifyingGlassIcon size='25' strokeWidth={2} color='white' />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ backgroundColor: themeColors.bgLight }} className='p-3 rounded-full'>
            <Icon.Sliders height={20} width={20} strokeWidth='2.5' stroke='white' />
          </TouchableOpacity>
        </View>

        {/* categories */}
        {/* <View>
          {categories.length > 0 && (
            <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
          )}
        </View> */}

        {/* categories */}
        <View className='mb-4'>
          <Categories />
        </View>

        {/* sort categories */}
        <View className='mb-4'>
          <SortCategories />
        </View>

        {/* recipes */}
        <View>
          <Recipes meals={pictures} categories={categories} />
        </View>
        <View className='mb-20'></View>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = state => ({
  searchValue: state.user.searchValue,
  posted: state.user.posted,
});

const mapDispatchToProps = dispatch => ({
  setSearchValue: value => dispatch({ type: "SEARCH", payload: value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
