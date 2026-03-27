import {useRef, useState} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import Swiper from "react-native-swiper";
import {onboarding as onboardingSlides} from "@/constants";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CustomButton from "@/components/CustomButton";


export default function Onboarding() {
    const swiperRef = useRef<Swiper | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isLastSlide = activeIndex === onboardingSlides.length - 1;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row justify-end px-5 pt-2">
                <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')}>
                    {/* SKIP BUTTON FOR ALL SCREEN SIZES */}
                    <Text className="text-md font-JakartaBold text-black uppercase">Skip</Text>
                </TouchableOpacity>
            </View>

            <Swiper
                ref={swiperRef}
                loop={false}
                showsButtons={false}
                dot={<View className="mx-1 h-[4px] w-[32px] rounded-full bg-[#E2E2E2]" />}
                activeDot={<View className="mx-1 h-[4px] w-[32px] rounded-full bg-[#0286FF]" />}
                onIndexChanged={setActiveIndex}
            >
                {onboardingSlides.map((slide) => (
                    <View
                        key={slide.id}
                        className="flex items-center justify-center p-5"
                        style={{ height: hp(70) }}>
                        <Image
                            source={slide.image}
                            resizeMode="contain"
                            style={{ width: wp(90), height: hp(30) }} />

                        <View className="flex flex-row items-center justify-center w-full mt-10">
                            {/* RESPONSIVE TITLE FOR DIFFERENT SCREEN RESOLUTIONS */}
                            <Text className="text-black font-bold text-center uppercase" style={{ fontSize: hp(3.5), marginHorizontal: wp(10) }}>
                                {slide.title}
                            </Text>
                        </View>

                        {/* DESCRIPTION WITH BETTER SPACING FOR SMALLER MOBILES */}
                        <Text className="font-JakartaSemiBold text-center text-[#858585] mt-3 uppercase" style={{ fontSize: hp(1.8), marginHorizontal: wp(10) }}>
                            {slide.description}
                        </Text>
                    </View>
                ))}
            </Swiper>

            <View className="px-6 pb-8">
                    {/* ACTION BUTTON COMPATIBLE WITH ALL IOS/ANDROID SIZES */}
                <CustomButton
                    title={isLastSlide ? 'Get Started' : 'Next'}
                    className="items-center rounded-full bg-[#0286FF] py-4 shadow-md shadow-neutral-300"
                    onPress={() => {
                        if (isLastSlide) {
                            router.replace('/(auth)/sign-up');
                            return;
                        }

                        swiperRef.current?.scrollBy(1);
                    }}
                />
            </View>
        </SafeAreaView>
    );
}