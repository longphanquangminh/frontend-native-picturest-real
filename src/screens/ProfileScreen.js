import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import Avatar from "../components/Profile/Avatar";
import { connect } from "react-redux";
import { BASE_URL_IMG, BASE_URL } from "../api/config";
import { MainContainer } from "../components/Containers";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { themeColors } from "../theme/index";
import { viewMode } from "../constants/index";
import Recipes from "../components/recipes";
import axios from "axios";

function ProfileScreen(props) {
  let userInfo = props.route.params;
  const [image, setImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState(1);
  const [pictures, setPictures] = useState([]);
  useEffect(() => {
    if (userInfo) {
      setImage(`${BASE_URL_IMG}/${userInfo.anhDaiDien}`);
    }
  }, [userInfo]);
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
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
  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    // setLoading(true);
    if (activeCategory === 1) {
      axios
        .get(`${BASE_URL}/created-by-user/${userInfo.nguoiDungId}`)
        .then(res => {
          setPictures(res.data.content);
          // setTimeout(() => setLoading(false), 600);
        })
        .catch(err => console.log(err));
    } else {
      axios
        .get(`${BASE_URL}/saved-by-user/${userInfo.nguoiDungId}`)
        .then(res => {
          setPictures(res.data.content);
          // setTimeout(() => setLoading(false), 600);
        })
        .catch(err => console.log(err));
    }
  }, [activeCategory, props.changedSaved]);
  return (
    <MainContainer style={styles.container}>
      <View className='flex-row justify-start mb-6'>
        <TouchableOpacity onPress={() => navigation.goBack()} className='bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl'>
          <ArrowLeftIcon size='20' color='black' />
        </TouchableOpacity>
      </View>
      <View className='flex flex-row gap-3 justify-start items-center'>
        <Avatar showChangeButton={false} uri={image} />
        <View className='space-y-6'>
          <Text>Name: {userInfo.hoTen}</Text>
          <Text>Email: {userInfo.email}</Text>
          <Text>Age: {userInfo.tuoi}</Text>
        </View>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={viewMode}
        keyExtractor={item => item.id}
        className='overflow-visible'
        renderItem={({ item }) => {
          isActive = item.id == activeCategory;
          let activeTextClass = isActive ? "text-white" : "text-gray-700";
          return (
            <TouchableOpacity
              onPress={() => setActiveCategory(item.id)}
              style={{ backgroundColor: isActive ? themeColors.bgLight : "rgba(0,0,0,0.07)" }}
              className='p-4 px-5 mr-2 rounded-full shadow'
            >
              <Text className={"font-semibold " + activeTextClass}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <Recipes wantMarginY wantMarginX={false} wantTitle={false} meals={pictures} categories={categories} />
    </MainContainer>
  );
}

const mapStateToProps = state => ({
  token: state.user.token,
  changedSaved: state.user.changedSaved,
});

const mapDispatchToProps = dispatch => ({
  setSearchValue: value => dispatch({ type: "SEARCH", payload: value }),
  setLoading: booleanValue => dispatch({ type: "LOADING", payload: booleanValue }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 50,
    paddingHorizontal: 25,
    marginTop: 50,
  },
  section: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 5,
    marginBottom: 5,
  },
  text: {
    textAlign: "center",
  },
});
