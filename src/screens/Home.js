import { View, Text, ScrollView, Image, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import axios from "axios";
import Recipes from "../components/recipes";
import { BASE_URL } from "../api/config";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "../components/customDrawerContent";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function Home() {
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
      // console.log('got categories: ',response.data);
      if (response && response.data) {
        setPictures(response.data.content.data);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  useEffect(() => {
    getCategories();
    getPictures();
    getRecipes();
    checkTime();
  }, []);

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
          <Image source={require("../../assets/images/avatar.png")} style={{ height: hp(5), width: hp(5.5) }} />
          <BellIcon size={hp(4)} color='gray' />
        </View>

        {/* greetings and punchline */}
        <View className='mx-4 space-y-2 mb-2'>
          <Text style={{ fontSize: hp(1.7) }} className='text-neutral-600'>
            Good {timeOfDay}, photo addict! demo
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
        <View className='mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]'>
          <TextInput
            placeholder='Search any pictures'
            placeholderTextColor={"gray"}
            style={{ fontSize: hp(1.7) }}
            className='flex-1 text-base mb-1 pl-3 tracking-wider'
          />
          <View className='bg-white rounded-full p-3'>
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color='gray' />
          </View>
        </View>

        {/* categories */}
        {/* <View>
          {categories.length > 0 && (
            <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
          )}
        </View> */}

        {/* recipes */}
        <View>
          <Recipes meals={pictures} categories={categories} />
        </View>
      </ScrollView>
    </View>
  );
}
