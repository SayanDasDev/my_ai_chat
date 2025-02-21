import { Tabs } from "expo-router";
import { useTheme } from "tamagui";

export default function AuthLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
          display: "none",
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="signin"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
