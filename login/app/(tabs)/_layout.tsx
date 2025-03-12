import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Oculta o cabeçalho se desejar
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="userscreen" />
    </Stack>
  );
}
