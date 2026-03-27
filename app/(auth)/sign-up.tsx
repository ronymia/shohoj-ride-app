import {Image, ScrollView, Text, View} from "react-native";
import {icons, images} from "@/constants";
import InputField from "@/components/InputField";
import {useState} from "react";
import CustomButton from "@/components/CustomButton";
import {Link} from "expo-router";
import OAuth from "@/components/auth/OAuth";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function SignUp(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const onSignUpPress=async()=>{
        // TODO: SIGN UP LOGIC
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
                    {/* SIGN UP TITLE FOR ALL SCREEN SIZES */}
                    <Text className="text-2xl font-JakartaSemiBold text-black absolute bottom-5 left-5 UPPERCASE">
                        Create Your Account
                    </Text>
                </View>

                {/* SIGN UP FORM AREA */}
                <View className="p-5" style={{ paddingHorizontal: wp(5) }}>
                    <InputField
                        label="Name"
                        placeholder="Enter your name"
                        icon={icons.person}
                        value={formData.name}
                        onChangeText={(value) => setFormData({ ...formData, name: value })}
                    />
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

                    {/* ACTION BUTTON COMPATIBLE WITH ALL MOBILE DEVICES */}
                    <CustomButton
                        title="Sign Up"
                        className="mt-6 uppercase"
                        onPress={onSignUpPress}
                    />
                    
                    {/* SOCIAL AUTHENTICATION COMPONENT */}
                    <OAuth/>

                    {/* REDIRECT TO SIGN IN SCREEN */}
                    <Link
                        href="/(auth)/sign-in"
                        className="text-lg text-center text-general-200 mt-10"
                    >
                        <Text className="UPPERCASE">Already have an account? </Text>
                        <Text className="text-primary-500 font-JakartaSemiBold UPPERCASE">Sign In</Text>
                    </Link>

                </View>
            </View>
        </ScrollView>
    )
}