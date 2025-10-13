import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView>
      <Text>Home</Text>
    </SafeAreaView>
  );
}
