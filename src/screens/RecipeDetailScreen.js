import { View, Text, ScrollView, TouchableOpacity, Image, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { CachedImage } from "../helpers/image";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ChevronLeftIcon, ClockIcon, FireIcon } from "react-native-heroicons/outline";
import { HeartIcon, UsersIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Loading from "../components/loading";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { BASE_URL, BASE_URL_IMG, https } from "../api/config";
import { fallbackImage } from "../constants";
import { capitalizeString } from "../helpers/capitalizeString";
import { themeColors } from "../theme";
import AnimatedLottieView from "lottie-react-native";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";

const ios = Platform.OS == "ios";

function RecipeDetailScreen(props) {
  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Saved ♥️",
      text2: "You have saved the picture 😍",
    });
  };
  const showToastUnsave = () => {
    Toast.show({
      type: "success",
      text1: "Unsaved 💔",
      text2: "Unsaved the picture 😿",
    });
  };
  let item = props.route.params;
  const [isFavourite, setIsFavourite] = useState(false);
  const checkUserSave = () => {
    axios
      .get(`${BASE_URL}/saved/${item.hinhId}`, {
        headers: {
          token: props.token,
        },
      })
      .then(res => {
        setIsFavourite(res.data.content.saved);
      })
      .catch(err => console.log(err));
  };
  const heartRef = useRef(null);

  useEffect(() => {
    heartRef?.current?.play(0, 30);
    if (props.userInfo) {
      checkUserSave();
    }
  }, []);

  const handleLike = () => {
    if (isFavourite) {
      heartRef?.current?.reset();
    } else {
      heartRef?.current?.play(30, 144);
    }

    setIsFavourite(!isFavourite);
  };
  const navigation = useNavigation();
  const [meal, setMeal] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    getMealData(item.hinhId);
    getComments(item.hinhId);
  }, []);

  const getComments = async hinhId => {
    // console.log("hinhId: ", hinhId);
    try {
      const response = await axios.get(`${BASE_URL}/comments/${hinhId}`);
      //   console.log('got meal data: ',response.data);
      if (response && response.data) {
        setComments(response.data.content);
        setLoading(false);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const getMealData = async hinhId => {
    try {
      const response = await axios.get(`${BASE_URL}/pictures/${hinhId}`);
      //   console.log('got meal data: ',response.data);
      if (response && response.data) {
        setMeal(response.data.content.data);
        setSavedCount(response.data.content.savedCount);
        setLoading(false);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const ingredientsIndexes = meal => {
    if (!meal) return [];
    let indexes = [];
    for (let i = 1; i <= 20; i++) {
      if (meal["strIngredient" + i]) {
        indexes.push(i);
      }
    }

    return indexes;
  };

  const getYoutubeVideoId = url => {
    const regex = /[?&]v=([^&]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  };

  const handleOpenLink = url => {
    Linking.openURL(url);
  };

  const toastProps = {
    id: 1,
    title: "Hello world",
    placement: "top",
    variant: "solid",
    description: "This is a description",
    isClosable: true,
    status: "success",
  };

  return (
    <View className='flex-1 bg-white relative'>
      <StatusBar style={"light"} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* recipe image */}
        <View className='flex-row justify-center'>
          <CachedImage
            uri={`${BASE_URL_IMG}/${item.duongDan}`}
            // sharedTransitionTag={item.strMeal} // this will only work on native image (now using Image from expo-image)
            style={{ width: wp(100), height: hp(50), borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
            fallbackSource={fallbackImage}
          />
        </View>

        {/* back button */}
        {/* <Animated.View entering={FadeIn.delay(200).duration(1000)} className='w-full absolute flex-row justify-between items-center pt-14'>
          <TouchableOpacity onPress={() => navigation.goBack()} className='p-3 rounded-full ml-5 bg-white'>
            <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color='#fbbf24' />
          </TouchableOpacity>
          <TouchableOpacity className='p-1 rounded-full mr-5 bg-white'>
            <Pressable onPress={handleLike}>
              <AnimatedLottieView style={{ height: hp(6) }} ref={heartRef} loop={false} source={require("../../assets/animations/heart.json")} />
            </Pressable>
          </TouchableOpacity>
        </Animated.View> */}

        <Animated.View entering={FadeIn.delay(200).duration(1000)} className='w-full absolute flex-row justify-between items-center pt-14'>
          <TouchableOpacity onPress={() => navigation.goBack()} className='p-2 rounded-full ml-5 bg-white'>
            <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color='#fbbf24' />
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() =>
            //   toast.show({
            //     title: "Hello world",
            //     placement: "top",
            //     variant: "solid",
            //     description: "This is a description",
            //     isClosable: true,
            //     status: "info",
            //   })
            // }
            onPress={() => {
              if (props.userInfo) {
                if (!isFavourite) {
                  showToast();
                } else {
                  showToastUnsave();
                }
                setIsFavourite(!isFavourite);
                axios
                  .post(
                    `${BASE_URL}/saved/${item.hinhId}`,
                    {},
                    {
                      headers: {
                        token: props.token,
                      },
                    },
                  )
                  .then(() => {
                    // getMealData(item.hinhId);
                  })
                  .catch(err => {
                    console.log(props.token);
                    console.log(parseInt(item.hinhId));
                    console.log(err);
                  });
              } else {
                Toast.show({
                  type: "info",
                  text1: "Please login first!",
                  text2: "You need to login to use this feature!",
                });
              }
            }}
            className='p-2 rounded-full mr-5 bg-white'
          >
            <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFavourite ? "red" : "gray"} />
          </TouchableOpacity>
        </Animated.View>

        {/* meal description */}
        {loading ? (
          <Loading size='large' className='mt-16' />
        ) : (
          <View className='px-4 flex justify-between space-y-4 pt-8'>
            {/* name and area */}
            <Animated.View entering={FadeInDown.duration(700).springify().damping(12)} className='space-y-2'>
              <Text style={{ fontSize: hp(3) }} className='font-bold flex-1 text-neutral-700'>
                {meal?.tenHinh}
              </Text>
              {/* <Text style={{ fontSize: hp(2) }} className='font-medium flex-1 text-neutral-500'>
                {capitalizeString(meal?.nguoiDung?.hoTen ?? "User")}
              </Text> */}
              <View className='flex-row items-center space-x-2'>
                <CachedImage
                  className='rounded-full object-cover'
                  uri={`${BASE_URL_IMG}/${meal?.nguoiDung?.anhDaiDien}`}
                  style={{ width: hp(4), height: hp(4) }}
                  fallbackSource={fallbackImage}
                />
                <Text style={{ fontSize: wp(4.8) }} className='font-normal text-gray-700'>
                  {capitalizeString(meal?.nguoiDung?.hoTen ?? "User")}
                </Text>
              </View>
            </Animated.View>

            {/* misc */}
            <Animated.View entering={FadeInDown.delay(100).duration(700).springify().damping(12)} className='flex-row justify-around'>
              <View className='flex rounded-full bg-amber-300 p-2'>
                <View style={{ height: hp(6.5), width: hp(6.5) }} className='bg-white rounded-full flex items-center justify-center'>
                  <ClockIcon size={hp(4)} strokeWidth={2.5} color='#525252' />
                </View>
                <View className='flex items-center py-2 space-y-1'>
                  <Text style={{ fontSize: hp(2) }} className='font-bold text-neutral-700'>
                    1
                  </Text>
                  <Text style={{ fontSize: hp(1.3) }} className='font-bold text-neutral-700'>
                    hour ago
                  </Text>
                </View>
              </View>
              <View className='flex rounded-full bg-amber-300 p-2'>
                <View style={{ height: hp(6.5), width: hp(6.5) }} className='bg-white rounded-full flex items-center justify-center'>
                  <UsersIcon size={hp(4)} strokeWidth={2.5} color='#525252' />
                </View>
                <View className='flex items-center py-2 space-y-1'>
                  <Text style={{ fontSize: hp(2) }} className='font-bold text-neutral-700'>
                    {comments.length}
                  </Text>
                  <Text style={{ fontSize: hp(1.3) }} className='font-bold text-neutral-700'>
                    {comments.length > 0 ? "Comments" : "Comment"}
                  </Text>
                </View>
              </View>
              <View className='flex rounded-full bg-amber-300 p-2'>
                <View style={{ height: hp(6.5), width: hp(6.5) }} className='bg-white rounded-full flex items-center justify-center'>
                  <FireIcon size={hp(4)} strokeWidth={2.5} color='#525252' />
                </View>
                <View className='flex items-center py-2 space-y-1'>
                  <Text style={{ fontSize: hp(2) }} className='font-bold text-neutral-700'>
                    {savedCount}
                  </Text>
                  <Text style={{ fontSize: hp(1.3) }} className='font-bold text-neutral-700'>
                    Love
                  </Text>
                </View>
              </View>
              {/* <View className='flex rounded-full bg-amber-300 p-2'>
                <View style={{ height: hp(6.5), width: hp(6.5) }} className='bg-white rounded-full flex items-center justify-center'>
                  <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color='#525252' />
                </View>
                <View className='flex items-center py-2 space-y-1'>
                  <Text style={{ fontSize: hp(2) }} className='font-bold text-neutral-700'></Text>
                  <Text style={{ fontSize: hp(1.3) }} className='font-bold text-neutral-700'>
                    Easy
                  </Text>
                </View>
              </View> */}
            </Animated.View>

            {/* ingredients */}
            <Animated.View entering={FadeInDown.delay(200).duration(700).springify().damping(12)} className='space-y-4'>
              <Text style={{ fontSize: hp(2.5) }} className='font-bold flex-1 text-neutral-700'>
                Description
              </Text>
              {/* <View className='space-y-2 ml-3'>
                {ingredientsIndexes(meal).map(i => {
                  return (
                    <View key={i} className='flex-row space-x-4'>
                      <View style={{ height: hp(1.5), width: hp(1.5) }} className='bg-amber-300 rounded-full' />
                      <View className='flex-row space-x-2'>
                        <Text style={{ fontSize: hp(1.7) }} className='font-extrabold text-neutral-700'>
                          {meal["strMeasure" + i]}
                        </Text>
                        <Text style={{ fontSize: hp(1.7) }} className='font-medium text-neutral-600'>
                          {meal["strIngredient" + i]}
                        </Text>
                      </View>
                    </View>
                  );
                })}
                <View className='flex-row space-x-4'>
                  <View style={{ height: hp(1.5), width: hp(1.5) }} className='bg-amber-300 rounded-full' />
                  <View className='flex-row space-x-2'>
                    <Text style={{ fontSize: hp(1.7) }} className='font-extrabold text-neutral-700'>
                      a
                    </Text>
                    <Text style={{ fontSize: hp(1.7) }} className='font-medium text-neutral-600'>
                      a
                    </Text>
                  </View>
                </View>
              </View> */}
              <View>
                <Text>{item.moTa}</Text>
              </View>
            </Animated.View>
            {/* instructions */}
            {/* <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} className='space-y-4'>
              <Text style={{ fontSize: hp(2.5) }} className='font-bold flex-1 text-neutral-700'>
                Instructions
              </Text>
              <Text style={{ fontSize: hp(1.6) }} className='text-neutral-700'>
                {meal?.strInstructions}
              </Text>
            </Animated.View> */}

            <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} className='space-y-4'>
              <Text style={{ fontSize: hp(2.5) }} className='font-bold flex-1 text-neutral-700'>
                Comments
              </Text>
              {/* <Text style={{ fontSize: hp(1.6) }} className='text-neutral-700'>
                {meal?.strInstructions}
              </Text> */}
              {comments.length > 0 ? (
                comments.map((comment, index) => {
                  const color = index % 2 == 0 ? themeColors.bgOnBoard2 : themeColors.bgOnBoard3;
                  return (
                    <View key={index} className={`p-4 rounded-xl space-y-2`} style={{ backgroundColor: color }}>
                      <View className='flex-row items-center space-x-2'>
                        <CachedImage
                          className='rounded-full object-cover'
                          uri={`${BASE_URL_IMG}/${item.nguoiDung.anhDaiDien}`}
                          style={{ width: hp(4), height: hp(4) }}
                          fallbackSource={fallbackImage}
                        />
                        <Text style={{ fontSize: wp(4.8) }} className='text-gray-700'>
                          {capitalizeString(comment?.nguoiDung?.hoTen ?? "User")}
                        </Text>
                      </View>

                      <Text style={{ fontSize: wp(3.8) }} className='text-gray-700'>
                        {comment.noiDung}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <Text>No comments!</Text>
              )}
            </Animated.View>

            {/* recipe video */}

            {/* {meal.strYoutube && (
              <Animated.View entering={FadeInDown.delay(400).duration(700).springify().damping(12)} className='space-y-4'>
                <Text style={{ fontSize: hp(2.5) }} className='font-bold flex-1 text-neutral-700'>
                  Recipe Video
                </Text>
                <View>
                  {ios ? (
                    <YouTubeIframe
                      webViewProps={{
                        overScrollMode: "never", // a fix for webview on android - which didn't work :(
                      }}
                      videoId={getYoutubeVideoId(meal.strYoutube)}
                      height={hp(30)}
                    />
                  ) : (
                    <TouchableOpacity className='mb-5' onPress={() => handleOpenLink(meal.strYoutube)}>
                      <Text className='text-blue-600' style={{ fontSize: hp(2) }}>
                        {meal.strYoutube}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            )} */}
            {props.userInfo ? <Text>No comments!</Text> : <Text>Please login to comment!</Text>}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: hp(3.5),
    aspectRatio: 1,
  },
});

const mapStateToProps = state => ({
  userInfo: state.user.userInfo,
  token: state.user.token,
});

export default connect(mapStateToProps)(RecipeDetailScreen);
