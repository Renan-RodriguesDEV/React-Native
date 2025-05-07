import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Index",
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          title: "Editar",
          href: null, // Isso oculta a aba, mas permite navegação
        }}
      />
    </Tabs>
  );
}
