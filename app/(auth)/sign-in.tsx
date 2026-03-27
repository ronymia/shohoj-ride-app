import {Image, ScrollView, Text, View} from "react-native";
import {icons, images} from "@/constants";
import InputField from "@/components/InputField";
import {useState} from "react";
import CustomButton from "@/components/CustomButton";
import {Link} from "expo-router";
import OAuth from "@/components/auth/OAuth";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function SignIn(){
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const onSignInPress=async()=>{
        // TODO: SIGN IN LOGIC
    }

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View>
                    <Image
                        source={images.signUpCar}
                        className="z-0 w-full"
                        style={{ height: hp(30) }}
                    />
                    {/* SIGN IN HEADER FOR ALL SCREEN SIZES */}
                    <Text className="text-2xl font-JakartaSemiBold text-black absolute bottom-5 left-5 UPPERCASE">
                        Welcome Back
                    </Text>
                </View>

                {/* SIGN IN FORM SECTION */}
                <View className="p-5" style={{ paddingHorizontal: wp(5) }}>
                    <InputField
                        label="Email"
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        icon={icons.email}
                        value={formData.email}
                        onChangeText={(value) => setFormData({ ...formData, email: value })}
                    />
                    <InputField
                        label="Password"
                        placeholder="Enter your password"
                        secureTextEntry={true}
                        icon={icons.lock}
                        value={formData.password}
                        onChangeText={(value) => setFormData({ ...formData, password: value })}
                    />

                    {/* LOGIN ACTION BUTTON */}
                    <CustomButton
                        title="Sign In"
                        className="mt-6 uppercase"
                        onPress={onSignInPress}
                    />
                    
                    {/* SOCIAL LOGIN OPTION */}
                    <OAuth/>

                    {/* ROUTE TO SIGN UP IF ACCOUNT DOES NOT EXIST */}
                    <Link
                        href="/(auth)/sign-up"
                        className="text-lg text-center text-general-200 mt-10"
                    >
                        <Text className="UPPERCASE">Don't have an account? </Text>
                        <Text className="text-primary-500 font-JakartaSemiBold UPPERCASE">Sign Up</Text>
                    </Link>

                </View>
            </View>
        </ScrollView>
    )
}