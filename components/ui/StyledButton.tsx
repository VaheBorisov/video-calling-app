import {
  type StyleProp,
  type ViewStyle,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface StyledButtonProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress: VoidFunction;
}

export default function StyledButton({
  title,
  style,
  onPress,
}: StyledButtonProps) {
  const flatStyle = StyleSheet.flatten(style) || {};

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "white",
        padding: 12,
        borderRadius: 5,
        width: "100%",
        ...flatStyle,
      }}
    >
      <Text
        style={{
          color: "#5F5DEC",
          fontSize: 16,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
