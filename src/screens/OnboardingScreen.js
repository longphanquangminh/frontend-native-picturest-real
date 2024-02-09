import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import Lottie from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { setItem } from "../utils/asyncStorage";
import { themeColors } from "../theme";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const navigation = useNavigation();

  const handleDone = () => {
    navigation.navigate("Home");
    setItem("onboarded", "0");
    // setItem("onboarded", "1");
  };

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.doneButton} {...props}>
        <Text>Done</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        // bottomBarHighlight={false}
        DoneButtonComponent={doneButton}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: themeColors.bgOnBoard1,
            image: (
              <View style={styles.lottie}>
                <Lottie source={require("../../assets/animations/boost.json")} autoPlay loop />
              </View>
            ),
            title: "Capture Your Moments",
            subtitle: "Capture life's moments effortlessly. Snap a photo or choose from your gallery!",
          },
          {
            backgroundColor: themeColors.bgOnBoard2,
            image: (
              <View style={styles.lottie}>
                <Lottie source={require("../../assets/animations/work.json")} autoPlay loop />
              </View>
            ),
            title: "Express Yourself",
            subtitle: "Time to get creative. Let your imagination run wild!",
          },
          {
            backgroundColor: themeColors.bgOnBoard3,
            image: (
              <View style={styles.lottie}>
                <Lottie source={require("../../assets/animations/achieve.json")} autoPlay loop />
              </View>
            ),
            title: "Share & Connect",
            subtitle: "You're almost there. Share your masterpiece with friends and family!",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
  doneButton: {
    padding: 20,
    // backgroundColor: 'white',
    // borderTopLeftRadius: '100%',
    // borderBottomLeftRadius: '100%'
  },
});
