import { useState } from "react";
import { SignedIn, useAuth } from "@clerk/clerk-expo";

import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Dialog from "react-native-dialog";

export default function Home() {
  const { signOut } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

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

      <SignedIn>
        <Text>Sign in</Text>
      </SignedIn>
    </View>
  );
}
