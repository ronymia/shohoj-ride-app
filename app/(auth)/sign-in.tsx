import OAuth from "@/components/auth/OAuth";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
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

  const [code, setCode] = useState("");

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: formData.email,
      password: formData.password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/(root)/(tabs)/home");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as any);
          }
        },
      });
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
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize();
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

          {/* ROUTE TO SIGN UP IF ACCOUNT DOES NOT EXIST */}
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
        </View>
      </View>
    </ScrollView>
  );
}
