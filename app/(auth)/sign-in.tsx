import OAuth from "@/components/auth/OAuth";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: formData.email,
      password: formData.password,
    });
    if (error) {
      if ((error as any)?.errors?.[0]?.code === "session_exists") {
        router.push("/(root)/(tabs)/home");
      }
      console.log(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize();
      router.replace("/(root)/(tabs)/home");
    } else if (signIn.status === "needs_second_factor") {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === "needs_client_trust") {
      // For other second factor strategies,
      // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code: verification.code });

    if (signIn.status === "complete") {
      await signIn.finalize();
      router.replace("/(root)/(tabs)/home");
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
    }
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View>
          <Image
            source={images.signUpCar}
            className="z-0 w-full"
            style={{ height: hp(30) }}
          />
          {/* SIGN IN HEADER RESPONSIVE FOR ALL SCREEN SIZES */}
          <Text
            className="font-JakartaSemiBold text-black absolute bottom-5 left-5 UPPERCASE"
            style={{ fontSize: hp(3) }}
          >
            Welcome Back
          </Text>
        </View>

        {/* SIGN IN FORM SECTION RESPONSIVE */}
        <View
          className="p-5"
          style={{ paddingHorizontal: wp(5), marginTop: hp(2) }}
        >
          <InputField
            label="Email"
            labelStyle={{ fontSize: hp(2) }}
            placeholder="Enter your email"
            keyboardType="email-address"
            icon={icons.email}
            value={formData.email}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
          />
          <InputField
            label="Password"
            labelStyle={{ fontSize: hp(2) }}
            placeholder="Enter your password"
            secureTextEntry={true}
            icon={icons.lock}
            value={formData.password}
            onChangeText={(value) =>
              setFormData({ ...formData, password: value })
            }
          />

          {/* LOGIN ACTION BUTTON RESPONSIVE */}
          <CustomButton
            title="Sign In"
            className="mt-6 uppercase"
            onPress={onSignInPress}
            textVariant="default"
          />

          {/* SOCIAL LOGIN OPTION */}
          <OAuth />

          {/* REDIRECT TO SIGN UP IF ACCOUNT DOES NOT EXIST */}
          <Link
            href="/(auth)/sign-up"
            className="text-center mt-10"
            style={{ marginBottom: hp(5) }}
          >
            <Text className="UPPERCASE" style={{ fontSize: hp(1.8) }}>
              Don't have an account?{" "}
            </Text>
            <Text
              className="text-primary-500 font-JakartaSemiBold UPPERCASE"
              style={{ fontSize: hp(1.8) }}
            >
              Sign Up
            </Text>
          </Link>

          {/* EMAIL VERIFICATION CODE MODAL (IF REQUIRED FOR MFA) */}
          <ReactNativeModal
            isVisible={verification.state === "pending"}
            onModalHide={() => {
              if (verification.state === "success") {
                // Success actions are handled in finalize navigation
              }
            }}
          >
            <View
              className={`bg-white px-7 py-9 rounded-2xl items-center min-h-[300px]`}
            >
              <Text className="text-center font-JakartaSemiBold text-3xl">
                Verify Log In
              </Text>
              <Text className="text-gray-400 text-base text-center font-Jakarta mt-2">
                We emailed you a verification code to log in.
              </Text>

              <InputField
                label={"Verification Code"}
                icon={icons.lock}
                placeholder={"Enter the code"}
                keyboardType="numeric"
                value={verification.code}
                onChangeText={(value) =>
                  setVerification({ ...verification, code: value })
                }
              />
              {verification.error && (
                <Text className={`text-red-500 text-sm mt-1`}>
                  {verification.error}
                </Text>
              )}

              <CustomButton
                title={"Verify Email"}
                onPress={handleVerify}
                className="mt-5 uppercase bg-success-500"
              />
            </View>
          </ReactNativeModal>
        </View>
      </View>
    </ScrollView>
  );
}
