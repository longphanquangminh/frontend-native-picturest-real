import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import MasonryList from "@react-native-seoul/masonry-list";
import { mealData } from "../constants";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "./loading";
import { CachedImage } from "../helpers/image";
import { useNavigation } from "@react-navigation/native";
import { fallbackImage } from "../constants/index";
import { shortenString } from "../helpers/shortenString";
import { connect } from "react-redux";
import { useState, useEffect } from "react";

function Recipes({ loading, wantMarginX = true, wantMarginY = false, wantTitle = true, title = "Pictures", categories, meals }) {
  const navigation = useNavigation();
  const [showNo, setShowNo] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowNo(true);
    }, 500);
  }, []);
  return (
    <View className={`${wantMarginX && "mx-4"} ${wantMarginY && "my-4"} space-y-3`}>
      {wantTitle && (
        <Text style={{ fontSize: hp(3) }} className='font-semibold text-neutral-600'>
          {title}
        </Text>
      )}
      <View>
        {loading ? (
          <Loading size='large' className='mt-20' />
        ) : categories.length == 0 || meals.length == 0 ? (
          showNo ? (
            <Text className='text-center mt-20'>No pictures found!</Text>
          ) : (
            <></>
          )
        ) : (
          <MasonryList
            data={meals}
            keyExtractor={item => item.hinh?.id ?? item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, i }) => <RecipeCard item={item.hinh ? item.hinh : item} index={i} navigation={navigation} />}
            // refreshing={isLoadingNext}
            // onRefresh={() => refetch({first: ITEM_CNT})}
            onEndReachedThreshold={0.1}
            // onEndReached={() => loadNext(ITEM_CNT)}
          />
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
          uri={item.duong_dan}
          style={{ width: "100%", height: index % 3 == 0 ? hp(25) : hp(35), borderRadius: 35 }}
          className='bg-black/5'
          fallbackSource={fallbackImage}
        />

        <Text style={{ fontSize: hp(1.5) }} className='font-semibold ml-2 text-neutral-600'>
          {shortenString(item.ten_hinh)}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const mapStateToProps = state => ({
  loading: state.user.loading,
});

export default connect(mapStateToProps)(Recipes);
