import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { Text, View } from "react-native";

export default function CallScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ unmountOnBlur: true });
  }, [navigation]);

  return (
    <View>
      <Text>Call Screen</Text>
    </View>
  );
}
