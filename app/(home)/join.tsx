import { useState } from "react";
import { useRouter } from "expo-router";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";

import Toast from "react-native-root-toast";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { inverseFormatSlug } from "@/lib/slug";

export default function Join() {
  const router = useRouter();
  const client = useStreamVideoClient();

  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = async () => {
    if (!roomId) return;

    const slug = inverseFormatSlug(roomId);

    const call = client?.call("default", slug);

    call
      ?.get()
      .then(() => {
        router.push(`/(home)/${slug}`);
      })
      .catch((reason) => {
        Toast.show(
          "Whooops!\nLooks like the room you're trying to join doesn't exist.",
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
          },
        );
      });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text
        style={{
          padding: 20,
          fontWeight: "bold",
        }}
      >
        Enter the Room Name
      </Text>

      <TextInput
        placeholder="e.g. Black Purple Tiger"
        value={roomId}
        onChangeText={setRoomId}
        style={{ padding: 20, width: "100%", backgroundColor: "white" }}
      />

      <TouchableOpacity
        onPress={handleJoinRoom}
        style={{
          padding: 20,
          backgroundColor: "#5F5DEC",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Join Room</Text>
      </TouchableOpacity>
    </View>
  );
}
