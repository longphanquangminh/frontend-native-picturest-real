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
import { BASE_URL } from "../api/config";
import { fallbackImage } from "../constants";
import { capitalizeString } from "../helpers/capitalizeString";
import { themeColors } from "../theme";
import AnimatedLottieView from "lottie-react-native";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import StyledTextInput from "../components/Inputs/StyledTextInput";
import { KeyboardAvoidingContainer } from "../components/Containers";

const ios = Platform.OS == "ios";

function RecipeDetailScreen(props) {
  const handleComment = () => {
    axios
      .post(
        `${BASE_URL}/comments/${item.id}`,
        {
          noiDung: bio,
        },
        {
          headers: {
            token: props.token,
          },
        },
      )
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Comment successfully!",
          text2: "Your comment has been saved!",
        });
        getComments(item.id);
        setBio("");
      })
      .catch(err => console.log(err));
  };

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
  const [bio, setBio] = useState("");
  const checkUserSave = () => {
    if (props.userInfo) {
      axios
        .get(`${BASE_URL}/saved/${item.id}`, {
          headers: {
            token: props.token,
          },
        })
        .then(res => {
          setIsFavourite(res.data.content.saved);
        })
        .catch(err => console.log(err));
    } else {
      setIsFavourite(false);
    }
  };
  const heartRef = useRef(null);

  useEffect(() => {
    heartRef?.current?.play(0, 30);
  }, []);

  useEffect(() => {
    checkUserSave();
  }, [props.userInfo]);

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
  const [userInfo, setUserInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    getMealData(item.id);
    getComments(item.id);
  }, []);

  const getComments = async id => {
    // console.log("id: ", id);
    try {
      const response = await axios.get(`${BASE_URL}/comments/${id}`);
      //   console.log('got meal data: ',response.data);
      if (response && response.data) {
        setComments(response.data.content);
        setLoading(false);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const getMealData = async id => {
    try {
      const response = await axios.get(`${BASE_URL}/pictures/${id}`);
      //   console.log('got meal data: ',response.data);
      if (response && response.data) {
        setMeal(response.data.content.data);
        setSavedCount(response.data.content.savedCount);
        setUserInfo(response.data.content.data.nguoi_dung);
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
            uri={item.duong_dan}
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
                    `${BASE_URL}/saved/${item.id}`,
                    {},
                    {
                      headers: {
                        token: props.token,
                      },
                    },
                  )
                  .then(() => {
                    props.setChangedSaved(!props.changedSaved);
                    getMealData(item.id);
                  })
                  .catch(err => {
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
                {meal?.ten_hinh}
              </Text>
              {/* <Text style={{ fontSize: hp(2) }} className='font-medium flex-1 text-neutral-500'>
                {capitalizeString(meal?.nguoi_dung?.ho_ten ?? "User")}
              </Text> */}
              <TouchableOpacity onPress={() => navigation.navigate("Profile", { ...userInfo })} className='flex-row items-center space-x-2'>
                <CachedImage
                  className='rounded-full object-cover'
                  uri={meal?.nguoi_dung?.anh_dai_dien}
                  style={{ width: hp(4), height: hp(4) }}
                  fallbackSource={fallbackImage}
                />
                <Text style={{ fontSize: wp(4.8) }} className='font-normal text-gray-700'>
                  {capitalizeString(meal?.nguoi_dung?.ho_ten ?? "User")}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* misc */}
            <Animated.View entering={FadeInDown.delay(100).duration(700).springify().damping(12)} className='flex-row justify-around'>
              {/* <View className='flex rounded-full bg-amber-300 p-2'>
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
              </View> */}
              <View className='flex rounded-full bg-amber-300 p-2'>
                <View style={{ height: hp(6.5), width: hp(6.5) }} className='bg-white rounded-full flex items-center justify-center'>
                  <UsersIcon size={hp(4)} strokeWidth={2.5} color='#525252' />
                </View>
                <View className='flex items-center py-2 space-y-1'>
                  <Text style={{ fontSize: hp(2) }} className='font-bold text-neutral-700'>
                    {comments.length}
                  </Text>
                  <Text style={{ fontSize: hp(1.3) }} className='font-bold text-neutral-700'>
                    {comments.length > 1 ? "Comments" : "Comment"}
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
                    Save
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
                <Text>{item.mo_ta}</Text>
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
              {/* {props.userInfo ? (
                <KeyboardAvoidingContainer style={styles.container}>
                  <StyledTextInput placeholder='Write your comment here...' value={bio} onChangeText={setBio} />
                </KeyboardAvoidingContainer>
              ) : (
                <Text>Please login to comment!</Text>
              )} */}
              {comments.length > 0 ? (
                comments.map((comment, index) => {
                  const color = index % 2 == 0 ? themeColors.bgOnBoard2 : themeColors.bgOnBoard3;
                  return (
                    <View key={index} className={`p-4 rounded-xl space-y-2`} style={{ backgroundColor: color }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Profile", { ...item.nguoi_dung })}
                        className='flex-row items-center space-x-2'
                      >
                        <CachedImage
                          className='rounded-full object-cover'
                          uri={item.nguoi_dung.anh_dai_dien}
                          style={{ width: hp(4), height: hp(4) }}
                          fallbackSource={fallbackImage}
                        />
                        <Text style={{ fontSize: wp(4.8) }} className='text-gray-700'>
                          {capitalizeString(comment?.nguoi_dung?.ho_ten ?? "User")}
                        </Text>
                      </TouchableOpacity>

                      <Text style={{ fontSize: wp(3.8) }} className='text-gray-700'>
                        {comment.noi_dung}
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
            {props.userInfo ? (
              <KeyboardAvoidingContainer style={styles.container}>
                <StyledTextInput placeholder='Write your comment here...' value={bio} onChangeText={setBio} />
                <TouchableOpacity onPress={handleComment} className='py-3 bg-yellow-400 rounded-xl'>
                  <Text className='text-xl font-bold text-center text-gray-700'>Post</Text>
                </TouchableOpacity>
              </KeyboardAvoidingContainer>
            ) : (
              <Text>Please login to comment!</Text>
            )}
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
  changedSaved: state.user.changedSaved,
  token: state.user.token,
});

const mapDispatchToProps = dispatch => ({
  setChangedSaved: booleanValue => dispatch({ type: "CHANGED_SAVED", payload: booleanValue }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetailScreen);
