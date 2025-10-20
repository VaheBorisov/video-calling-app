import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { RootSiblingParent } from "react-native-root-siblings";

import "react-native-reanimated";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <RootSiblingParent>
        <Slot />
      </RootSiblingParent>
    </ClerkProvider>
  );
}
