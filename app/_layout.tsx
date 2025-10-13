import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import "react-native-reanimated";

// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
//
// if (!publishableKey) {
//   throw new Error("Missing Clerk publishable key");
// }

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  );
}
