import { useRouter } from "expo-router";
import { CallContent } from "@stream-io/video-react-native-sdk";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { View, Text, TouchableOpacity } from "react-native";

import { copySlug, formatSlug } from "@/lib/slug";

interface RoomProps {
  slug: string;
}

export default function Room({ slug }: RoomProps) {
  const router = useRouter();

  return (
    <View>
      <View
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 100,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() => copySlug(slug)}
        >
          <Text style={{ color: "white" }}>Call ID: {formatSlug(slug)}</Text>
        </TouchableOpacity>
      </View>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CallContent onHangupCallHandler={() => router.back()} />
      </GestureHandlerRootView>
    </View>
  );
}
