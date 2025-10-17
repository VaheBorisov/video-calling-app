import { useEffect, useState } from "react";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { useLocalSearchParams } from "expo-router";

import { useNavigation } from "@react-navigation/native";
import {
  Call,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";

import { ActivityIndicator, Alert, Platform, Text, View } from "react-native";

async function ensureAVPermissions() {
  const cameraPermission =
    Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
  const micPermission =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;

  const camStatus = await check(cameraPermission);
  const micStatus = await check(micPermission);

  if (camStatus !== RESULTS.GRANTED) await request(cameraPermission);
  if (micStatus !== RESULTS.GRANTED) await request(micPermission);

  // return true if both granted
  return (
    (await check(cameraPermission)) === RESULTS.GRANTED &&
    (await check(micPermission)) === RESULTS.GRANTED
  );
}

export default function CallScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [call, setCall] = useState<Call | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    navigation.setOptions({ unmountOnBlur: true });
  }, [navigation]);

  useEffect(() => {
    let mounted = true;
    let createdCall: Call | null = null;

    const init = async () => {
      try {
        if (!client) {
          console.warn("Stream client is not ready yet");
          return;
        }

        // Request permissions first (important on iOS)
        const ok = await ensureAVPermissions();
        if (!ok) {
          Alert.alert(
            "Permissions required",
            "Camera and microphone access are needed to join calls.",
          );
          // navigate back or stop initialization
          setLoading(false);
          return;
        }

        // your original slug + create logic
        let slugLocal: string;
        if (id !== "(home)" && id) {
          console.log("if id exists");
          slugLocal = id.toString();
          createdCall = client.call("default", slugLocal);
          // join with create: false
          await createdCall.join({ create: false });
          if (!mounted) {
            // If unmounted immediately after join, leave
            createdCall.leave().catch(() => {});
            return;
          }
          setCall(createdCall);
        } else {
          console.log("if id does not exist");
          slugLocal = "demoroom";
          createdCall = client.call("default", slugLocal);
          // join with create: true
          console.log("join");
          await createdCall.join({ create: true });
          if (!mounted) {
            createdCall.leave().catch(() => {});
            return;
          }
          console.log("Claas");
          setCall(createdCall);
        }

        setSlug(slugLocal);
      } catch (err) {
        console.error("Error while joining call:", err);
        Alert.alert("Error", "Failed to join the call. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      // cleanup: leave the call if it's still active
      if (createdCall && createdCall.state.callingState !== CallingState.LEFT) {
        createdCall.leave().catch((e) => {
          console.warn("Error leaving call on unmount:", e);
        });
      }
    };
  }, [client, id]);

  // useEffect(() => {
  //   // console.log(client, "client");
  //   let slug: string;
  //
  //   if (id !== "(home)" && id) {
  //     console.log("if id exists");
  //     slug = id.toString();
  //     const _call = client?.call("default", slug);
  //     _call?.join({ create: false }).then(() => {
  //       setCall(_call);
  //     });
  //   } else {
  //     console.log("if id does not exist");
  //     slug = "demoroom";
  //     const _call = client?.call("default", slug);
  //     _call
  //       ?.join({ create: true })
  //       .then(() => {
  //         console.log("Claas");
  //         setCall(_call);
  //       })
  //       .catch(() => {
  //         console.log("Error creating call");
  //       })
  //       .finally(() => {
  //         console.log("Finalyy call");
  //       });
  //   }
  //
  //   setSlug(slug);
  // }, [id, client]);

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

  if (
    call?.state.callingState === CallingState.JOINING ||
    call?.state.callingState === CallingState.IDLE
  )
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Joining call...</Text>
      </View>
    );

  return (
    <StreamCall call={call}>
      <Text>Call Screen</Text>
    </StreamCall>
  );
}
