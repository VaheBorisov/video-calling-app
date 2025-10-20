import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import Toast from "react-native-root-toast";
import { useNavigation } from "@react-navigation/native";
import {
  Call,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";

import { ActivityIndicator, View } from "react-native";

import { generateSlug } from "random-word-slugs";

import Room from "@/components/Room";

import { copySlug } from "@/lib/slug";

export default function CallScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [call, setCall] = useState<Call | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  const client = useStreamVideoClient();

  useEffect(() => {
    navigation.setOptions({ unmountOnBlur: true });
  }, [navigation]);

  useEffect(() => {
    let slug: string;

    if (id !== "(home)" && id) {
      slug = id.toString();
      const _call = client?.call("default", slug);
      _call?.join({ create: false }).then(() => {
        setCall(_call);
      });
    } else {
      slug = generateSlug(3, {
        categories: {
          adjective: ["color", "personality"],
          noun: ["animals", "food"],
        },
      });
      const _call = client?.call("default", slug);
      _call?.join({ create: true }).then(() => {
        Toast.show(
          "Call Created Successfully \n Tap here to copy the call ID to share!",
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
            onPress: async () => {
              copySlug(slug);
            },
          },
        );
        setCall(_call);
      });
    }

    setSlug(slug);
  }, [id, client]);

  useEffect(() => {
    if (call?.state.callingState !== CallingState.LEFT) {
      call?.leave();
    }
  }, [call]);

  if (!call || !slug)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <StreamCall call={call}>
      <Room slug={slug} />
    </StreamCall>
  );
}
