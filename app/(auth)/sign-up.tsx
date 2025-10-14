import { useState } from "react";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";

import StyledButton from "@/components/ui/StyledButton";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      // @ts-ignore
      Alert.alert("Error", err.errors[0].message);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert(
        "Error",
        "Looks like your entered the wrong code. \n\nPlease try again",
      );
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
          backgroundColor: "#5F5DEC",
          paddingHorizontal: 20,
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          A verification code has been sent to your email. Please enter it
          below.
        </Text>
        <TextInput
          style={{
            padding: 20,
            width: "100%",
            backgroundColor: "white",
            borderRadius: 10,
          }}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <StyledButton title="Verify Email" onPress={onVerifyPress} />
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        backgroundColor: "#5F5DEC",
        paddingHorizontal: 20,
        justifyContent: "center",
        gap: 10,
      }}
    >
      <View style={{ gap: 10 }}>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Enter your details to get started!
        </Text>
        <TextInput
          autoCapitalize="none"
          style={{
            padding: 20,
            width: "100%",
            backgroundColor: "white",
            borderRadius: 10,
          }}
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          style={{
            padding: 20,
            width: "100%",
            backgroundColor: "white",
            borderRadius: 10,
          }}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <StyledButton title="Sign Up" onPress={onSignUpPress} />
      </View>
    </KeyboardAvoidingView>
  );
}
