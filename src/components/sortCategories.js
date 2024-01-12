import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import { sortCategoryData } from "../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { themeColors } from "../theme/index";
import { categoriesNewStyle } from "../constants/index";

export default function SortCategories() {
  const [activeSort, setActiveSort] = useState("All");
  const [activeCategory, setActiveCategory] = useState(1);
  return (
    <View className='px-4'>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categoriesNewStyle}
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
    </View>
  );
}
