import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";

import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-native-sdk";

import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const apiKey = process.env.EXPO_PUBLIC_GET_STREAM_API_KEY;

if (!apiKey) {
  throw new Error("Missing EXPO_PUBLIC_GET_STREAM_API_KEY");
}

export default function Layout() {
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();

  if (!isSignedIn || !clerkUser || !apiKey)
    return <Redirect href="/(auth)/sign-in" />;

  const user: User = {
    id: clerkUser.id,
    name: clerkUser.fullName!,
    image: clerkUser.imageUrl!,
  };

  const tokenProvider = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/generateUserToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: clerkUser.id,
          name: clerkUser.fullName!,
          image: clerkUser.imageUrl!,
          email: clerkUser.primaryEmailAddress?.toString()!,
        }),
      },
    );

    const data = await response.json();
    return data.token;
  };

  const client = StreamVideoClient.getOrCreateInstance({
    apiKey,
    user,
    tokenProvider,
    options: {
      logger: (logLevel, message, args) => {},
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StreamVideo client={client}>
        <Tabs
          screenOptions={({ route }) => ({
            header: () => null,
            tabBarActiveTintColor: "#5F5DEC",
            tabBarStyle: {
              display: route.name === "[id]" ? "none" : "flex",
            },
            tabBarLabelStyle: {
              zIndex: 100,
              paddingBottom: 5,
            },
          })}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "All Calls",
              tabBarIcon: ({ color }) => (
                <Ionicons name="call-outline" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="[id]"
            options={{
              title: "Start a New Call",
              header: () => null,
              tabBarIcon: () => (
                <FontAwesome name="plus-circle" size={30} color="black" />
              ),
            }}
          />
          <Tabs.Screen
            name="join"
            options={{
              title: "Join Call",
              headerTitle: "Enter the Room ID",
              tabBarIcon: ({ color }) => (
                <Ionicons name="enter-outline" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </StreamVideo>
    </SafeAreaView>
  );
}
