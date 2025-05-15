import { useRouter } from "expo-router";
import { View, Button, StyleSheet } from "react-native";

export default function BackButton() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Button color={"#4A90E2"} title="Voltar" onPress={() => router.back()} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
