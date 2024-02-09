import { View, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import axios from "axios";
import { BASE_URL } from "../api/config";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import RecipesSearch from "../components/recipesSearch";
function SearchScreen({ searchValue, setLoading, loading }) {
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    try {
      const response = await axios.get("https://themealdb.com/api/json/v1/1/categories.php");
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };
  const [pictures, setPictures] = useState([]);
  const getPictures = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/pictures/search-by-name/${searchValue}`)
      .then(response => {
        if (response && response.data) {
          setPictures(response.data.content);
          setTimeout(() => setLoading(false), 500);
        }
      })
      .catch(err => {
        console.log("error: ", err.message);
        setPictures([]);
        setTimeout(() => setLoading(false), 500);
      });
  };
  // const getPictures = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(`${BASE_URL}/pictures/search-by-name/${searchValue}`);
  //     if (response && response.data) {
  //       setLoading(true);
  //       setPictures(response.data.content);
  //     }
  //   } catch (err) {
  //     console.log("error: ", err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    getPictures();
    getCategories();
  }, []);
  const navigation = useNavigation();
  return (
    <View className='flex-1 bg-white'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }} className='space-y-6 pt-14'>
        <View className='flex-row justify-start'>
          <TouchableOpacity onPress={() => navigation.goBack()} className='bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4'>
            <ArrowLeftIcon size='20' color='black' />
          </TouchableOpacity>
        </View>

        {/* <View className='flex-row items-center space-x-2 px-4 pb-2 '>
          <View className='flex-row flex-1 items-center rounded-full bg-black/5 p-[6px]'>
            <TextInput
              placeholder='Search any pictures'
              placeholderTextColor={"gray"}
              style={{ fontSize: hp(1.7) }}
              className='flex-1 text-base mb-1 pl-3 tracking-wider'
            />
            <TouchableOpacity className='rounded-full p-2' style={{ backgroundColor: themeColors.bgLight }}>
              <MagnifyingGlassIcon size='25' strokeWidth={2} color='white' />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ backgroundColor: themeColors.bgLight }} className='p-3 rounded-full'>
            <Icon.Sliders height={20} width={20} strokeWidth='2.5' stroke='white' />
          </TouchableOpacity>
        </View> */}

        {/* recipes */}
        <View>
          <RecipesSearch
            title={`Total: ${pictures.count}, found by keyword: ${searchValue.length > 3 ? searchValue.slice(0, 3) + "..." : searchValue}`}
            meals={pictures.data}
            categories={categories}
          />
        </View>
        <View className='mb-20'></View>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = state => ({
  searchValue: state.user.searchValue,
  loading: state.user.loading,
});

const mapDispatchToProps = dispatch => ({
  setSearchValue: value => dispatch({ type: "SEARCH", payload: value }),
  setLoading: value => dispatch({ type: "LOADING", payload: value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
