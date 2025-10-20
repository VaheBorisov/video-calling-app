import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  type Call,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";

import { FlatList, Switch, Text, TouchableOpacity, View } from "react-native";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Dialog from "react-native-dialog";
import { formatSlug } from "@/lib/slug";

export default function Home() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const client = useStreamVideoClient();

  const [calls, setCalls] = useState<Call[]>([]);
  const [isMyCalls, setIsMyCalls] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchCalls = async () => {
    if (!client || !user) return;

    const { calls } = await client.queryCalls({
      filter_conditions: isMyCalls
        ? {
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          }
        : {},
      sort: [{ field: "created_at", direction: -1 }],
      watch: true,
    });

    const sortedCalls = calls.sort(
      (callA, callB) =>
        callB.state.participantCount - callA.state.participantCount,
    );

    setCalls(sortedCalls);
  };

  useEffect(() => {
    fetchCalls();
  }, [isMyCalls]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCalls();
    setIsRefreshing(false);
  };

  const handleJoinRoom = async (id: string) => {
    router.push(`/(home)/${id}`);
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 100,
        }}
        onPress={() => setDialogOpen(true)}
      >
        <MaterialCommunityIcons name="exit-run" size={24} color="#5F5DEC" />
      </TouchableOpacity>

      <Dialog.Container visible={dialogOpen}>
        <Dialog.Title>Sign Out</Dialog.Title>
        <Dialog.Description>Are you sure want to sign out?</Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDialogOpen(false)} />
        <Dialog.Button
          label="Sign Out"
          onPress={async () => {
            await signOut();
            setDialogOpen(false);
          }}
        />
      </Dialog.Container>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          gap: 10,
        }}
      >
        <Text
          style={{ color: isMyCalls ? "black" : "#5F5DEC" }}
          onPress={() => setIsMyCalls(false)}
        >
          All Calls
        </Text>

        <Switch
          trackColor={{ false: "#5F5DEC", true: "#5F5DEC" }}
          thumbColor="white"
          ios_backgroundColor="#5F5DEC"
          onValueChange={() => setIsMyCalls((isMyCalls) => !isMyCalls)}
          value={isMyCalls}
        />

        <Text
          style={{ color: !isMyCalls ? "black" : "#5F5DEC" }}
          onPress={() => setIsMyCalls(true)}
        >
          My Calls
        </Text>
      </View>

      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({
          item: {
            id,
            state: { participantCount, createdBy },
          },
        }) => (
          <TouchableOpacity
            key={id}
            onPress={() => handleJoinRoom(id)}
            disabled={participantCount === 0}
            style={{
              padding: 20,
              backgroundColor: participantCount === 0 ? "#F1F1F1" : "#FFFFFF",
              opacity: participantCount === 0 ? 0.5 : 1,
              borderBottomWidth: 1,
              borderBottomColor: participantCount === 0 ? "#FFFFFF" : "#F1F1F1",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Feather
              name={participantCount === 0 ? "phone-off" : "phone-call"}
              size={participantCount === 0 ? 24 : 20}
              color="gray"
            />
            <Image
              source={{ uri: createdBy?.image }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {createdBy?.name || createdBy?.custom.email.split("@")[0]}
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    {createdBy?.custom.email}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 20 }}>
                  <Text
                    style={{ fontSize: 10, textAlign: "right", width: 100 }}
                  >
                    {formatSlug(id)}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {participantCount === 0 ? (
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          color: "#5F5DEC",
                        }}
                      >
                        Call Ended
                      </Text>
                    ) : (
                      <View
                        style={{
                          borderRadius: 5,
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#F1F1F1",
                          padding: 10,
                        }}
                      >
                        <Entypo
                          name="users"
                          size={14}
                          color="#5F5DEC"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={{ color: "#5F5DEC", fontWeight: "bold" }}>
                          {participantCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
