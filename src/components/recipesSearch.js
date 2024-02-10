import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import MasonryList from "@react-native-seoul/masonry-list";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "./loading";
import { CachedImage } from "../helpers/image";
import { useNavigation } from "@react-navigation/native";
import { fallbackImage } from "../constants/index";
import { BASE_URL_IMG } from "../api/config";
import { connect } from "react-redux";

function RecipesSearch({ title = "Pictures", categories, meals, loading }) {
  const navigation = useNavigation();
  return (
    <View className='mx-4 space-y-3'>
      <View>
        {loading ? (
          <Loading size='large' className='mt-20' />
        ) : categories.length == 0 || meals.length == 0 ? (
          <Text className='text-center mt-20'>No pictures found!</Text>
        ) : (
          <View className='space-y-3'>
            <Text style={{ fontSize: hp(3) }} className='font-semibold text-neutral-600'>
              {title}
            </Text>
            <MasonryList
              data={meals}
              keyExtractor={item => item.hinhId}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, i }) => <RecipeCard item={item} index={i} navigation={navigation} />}
              // refreshing={isLoadingNext}
              // onRefresh={() => refetch({first: ITEM_CNT})}
              onEndReachedThreshold={0.1}
              // onEndReached={() => loadNext(ITEM_CNT)}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const RecipeCard = ({ item, index, navigation }) => {
  let isEven = index % 2 == 0;
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .duration(600)
        .springify()
        .damping(12)}
    >
      <Pressable
        style={{ width: "100%", paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }}
        className='flex justify-center mb-4 space-y-1'
        onPress={() => navigation.navigate("RecipeDetail", { ...item })}
      >
        {/* <Image
                    source={{uri: item.strMealThumb}}
                    style={{width: '100%', height: index%3==0? hp(25): hp(35), borderRadius: 35}}
                    className="bg-black/5"
                /> */}
        <CachedImage
          uri={`${BASE_URL_IMG}/${item.duongDan}`}
          style={{ width: "100%", height: index % 3 == 0 ? hp(25) : hp(35), borderRadius: 35 }}
          className='bg-black/5'
          fallbackSource={fallbackImage}
        />

        <Text style={{ fontSize: hp(1.5) }} className='font-semibold ml-2 text-neutral-600'>
          {item.tenHinh.length > 20 ? item.tenHinh.slice(0, 20) + "..." : item.tenHinh}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const mapStateToProps = state => ({
  loading: state.user.loading,
});

const mapDispatchToProps = dispatch => ({
  setSearchValue: value => dispatch({ type: "SEARCH", payload: value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipesSearch);
