import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, TextInput, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/components/BackButton";
export default function BuyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem("id").then((idValue) => {
      if (idValue) {
        setUserId(idValue ? parseInt(idValue) : 0);
      }
    });
    if (id) {
      axios
        .get(`http://localhost:5001/product/${id}`)
        .then((res) => setProduct(res.data.product))
        .catch(() => {
          alert("Erro!! Não foi possível carregar o produto.");
          Alert.alert("Erro", "Não foi possível carregar o produto");
        });
    }
  }, [id]);

  const handleBuy = async () => {
    if (!product) return;
    if (parseInt(quantity) < 1) {
      alert("Quantidade inválida, Escolha pelo menos 1 unidade.");
      Alert.alert("Quantidade inválida", "Escolha pelo menos 1 unidade.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/buy", {
        fk_produto: product.id,
        fk_usuario: userId,
        count: parseInt(quantity),
      });
      alert("Compra realizada com sucesso!");
      router.back();
      //   Alert.alert("Sucesso", "Compra realizada com sucesso!", [
      //     { text: "OK", onPress: () => router.back() },
      //   ]);
    } catch (err) {
      alert("Erro!! Não foi possível realizar a compra.");
      Alert.alert("Erro", "Não foi possível realizar a compra.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando produto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>{product.nome}</Text>
      <Text style={styles.info}>Preço: R$ {product.preco}</Text>
      <Text style={styles.info}>Descrição: {product.descricao}</Text>
      <Text style={styles.info}>Disponível: {product.quantidade}</Text>

      <Text style={styles.label}>Quantidade:</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="Quantidade"
      />

      <Button
        title={loading ? "Processando..." : "Confirmar Compra"}
        onPress={handleBuy}
        disabled={loading}
      />
      <Button title="Cancelar" color="#888" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    padding: 24,
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  info: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 6,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#232323",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
});
