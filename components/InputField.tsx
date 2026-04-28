import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      className="w-full"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text
            className={`text-lg font-JakartaSemiBold mb-3 ${typeof labelStyle === "string" ? labelStyle : ""}`}
            style={typeof labelStyle === "object" ? labelStyle : {}}
          >
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500 ${typeof containerStyle === "string" ? containerStyle : ""}`}
            style={typeof containerStyle === "object" ? containerStyle : {}}
          >
            {icon && (
              <Image
                source={icon}
                className={`w-6 h-6 ml-4 ${typeof iconStyle === "string" ? iconStyle : ""}`}
                style={typeof iconStyle === "object" ? iconStyle : {}}
              />
            )}
            <TextInput
              className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 text-left ${typeof inputStyle === "string" ? inputStyle : ""}`}
              style={typeof inputStyle === "object" ? inputStyle : {}}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
