import OAuth from "@/components/auth/OAuth";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/libs/fetch";
import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function SignUp() {
  // INITIALIZE CLERK HOOKS AND ROUTER
  const { signUp } = useSignUp();
  const router = useRouter();

  // STATE MANAGEMENT FOR MODALS AND FORM
  const [showSuccessModel, setShowSuccessModel] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    try {
      // CREATE USER ACCOUNT WITH CLERK
      const { error: passwordError } = await signUp.password({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.name,
      });

      if (passwordError) {
        Alert.alert("Error", (passwordError as any)?.errors[0]?.longMessage);
        return;
      }

      const { error: sendCodeError } =
        await signUp.verifications.sendEmailCode();

      if (sendCodeError) {
        Alert.alert("Error", (sendCodeError as any)?.errors[0]?.longMessage);
        return;
      }

      // OPEN VERIFICATION MODAL
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.errors?.[0]?.longMessage || "An unexpected error occurred",
      );
    }
  };

  const handleVerify = async () => {
    try {
      // ATTEMPT TO VERIFY THE CODE ENTERED BY USER
      const { error: verifyError } = await signUp.verifications.verifyEmailCode(
        {
          code: verification.code,
        },
      );

      if (verifyError) {
        setVerification({
          ...verification,
          error:
            (verifyError as any)?.errors[0]?.longMessage ||
            "Verification failed. Please try again.",
          state: "failed",
        });
        return;
      }

      // IF SUCCESSFUL, SET SESSION ACTIVE AND SHOW SUCCESS MODAL
      if (signUp.status === "complete") {
        await signUp.finalize();
        await fetchAPI("/(api)/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            clerkId: signUp.createdSessionId,
          }),
        });

        setShowSuccessModel(true);
      } else {
        setVerification({
          ...verification,
          error: "Verification incomplete",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err?.errors?.[0]?.longMessage || "An unexpected error occurred",
        state: "failed",
      });
    }
  };

  return (
    // KEYBOARD AVOIDING VIEW ENSURES INPUTS ARE NOT HIDDEN BY KEYBOARD
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View>
            {/* HERO IMAGE */}
            <Image
              source={images.signUpCar}
              className="z-0 w-full"
              style={{ height: hp(30) }}
            />
            {/* SIGN UP TITLE RESPONSIVE FOR ALL SCREEN SIZES */}
            <Text
              className="font-JakartaSemiBold text-black absolute bottom-5 left-5 UPPERCASE"
              style={{ fontSize: hp(3) }}
            >
              Create Your Account
            </Text>
          </View>

          {/* SIGN UP FORM AREA RESPONSIVE */}
          <View
            className="p-5"
            style={{ paddingHorizontal: wp(5), marginTop: hp(2) }}
          >
            {/* NAME INPUT */}
            <InputField
              label="Name"
              labelStyle={{ fontSize: hp(2) }}
              placeholder="Enter your name"
              icon={icons.person}
              value={formData.name}
              onChangeText={(value) =>
                setFormData({ ...formData, name: value })
              }
            />
            {/* EMAIL INPUT */}
            <InputField
              label="Email"
              labelStyle={{ fontSize: hp(2) }}
              placeholder="Enter your email"
              keyboardType="email-address"
              icon={icons.email}
              value={formData.email}
              onChangeText={(value) =>
                setFormData({ ...formData, email: value })
              }
            />
            {/* PASSWORD INPUT */}
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

            {/* ACTION BUTTON COMPATIBLE WITH ALL MOBILE DEVICES */}
            <CustomButton
              title="Sign Up"
              className="mt-6 uppercase"
              onPress={onSignUpPress}
              textVariant="default"
            />

            {/* SOCIAL AUTHENTICATION COMPONENT */}
            <OAuth />

            {/* REDIRECT TO SIGN IN SCREEN */}
            <Link
              href="/(auth)/sign-in"
              className="text-center mt-10"
              style={{ marginBottom: hp(5) }}
            >
              <Text className="UPPERCASE" style={{ fontSize: hp(1.8) }}>
                Already have an account?{" "}
              </Text>
              <Text
                className="text-primary-500 font-JakartaSemiBold UPPERCASE"
                style={{ fontSize: hp(1.8) }}
              >
                Sign In
              </Text>
            </Link>

            {/*  EMAIL VERIFICATION CODE MODAL */}
            <ReactNativeModal
              isVisible={verification.state === "pending"}
              onModalHide={() => {
                if (verification.state === "success") setShowSuccessModel(true);
              }}
            >
              <View
                className={`bg-white px-7 py-9 rounded-2xl items-center min-h-[300px]`}
              >
                <Text className="text-center font-JakartaSemiBold text-3xl">
                  Verify Your Account
                </Text>
                <Text className="text-gray-400 text-base text-center font-Jakarta mt-2">
                  We emailed you the six digit code to verify your account.
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

            {/* SUCCESS MODAL */}
            <ReactNativeModal isVisible={showSuccessModel}>
              <View className="bg-white px-7 py-9 rounded-2xl items-center min-h-[300px]">
                <Image
                  source={images.check}
                  className="w-[110px] h-[110px] mx-auto my-5"
                />
                <Text className="text-center font-JakartaSemiBold text-3xl">
                  Verified
                </Text>
                <Text className="text-gray-400 text-base text-center font-Jakarta">
                  Your successfully verify your account.
                </Text>
                <CustomButton
                  title="Browse Home"
                  onPress={() => {
                    // CLOSE MODAL AND NAVIGATE TO HOME
                    setShowSuccessModel(false);
                    router.push("/(root)/(tabs)/home");
                  }}
                  className="mt-6"
                />
              </View>
            </ReactNativeModal>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
