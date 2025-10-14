import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import StyledButton from "@/components/ui/StyledButton";
import SignInWithOAuth from "@/components/SignInWithOAuth";

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error("Error trying to sign in", err);
      Alert.alert(
        "Whooops!",
        "Looks like your entered the email or password. \n\n try again",
      );
    }
  };

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
      <MaterialIcons
        name="video-chat"
        size={160}
        color="white"
        style={{ alignSelf: "center", paddingBottom: 20 }}
      />
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
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
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

      {/* Divider */}
      <View
        style={{
          borderBottomColor: "white",
          borderBottomWidth: 1,
          marginVertical: 20,
        }}
      />
      <StyledButton title="Sign In" onPress={onSignInPress} />

      <Text style={{ textAlign: "center", color: "white" }}>OR</Text>

      <SignInWithOAuth />

      {/* Divider */}
      <View
        style={{
          borderBottomColor: "white",
          borderBottomWidth: 1,
          marginVertical: 20,
        }}
      />

      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Don&#39;t have an account?</Text>
        <Link href="/sign-up">
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
          >
            Sign up
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
