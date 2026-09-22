import { Stack } from "expo-router";
import { color, type } from "../../../design/tokens";

export default function CartStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: color.card },
        headerTintColor: color.brand,
        headerTitleStyle: { color: color.label, fontSize: type.section.fontSize },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: color.canvas },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Cart" }} />
    </Stack>
  );
}
