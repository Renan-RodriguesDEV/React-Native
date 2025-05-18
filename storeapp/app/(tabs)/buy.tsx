import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/components/BackButton";

const { width } = Dimensions.get("window");

export default function BuyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(0);
  const urlAPI = "http://192.168.1.9:5001";

  useEffect(() => {
    AsyncStorage.getItem("id").then((idValue) => {
      if (idValue) {
        setUserId(idValue ? parseInt(idValue) : 0);
      }
    });
    if (id) {
      axios
        .get(`${urlAPI}/product/${id}`)
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
      await axios.post(`${urlAPI}/purchases/`, {
        fk_produto: product.id,
        fk_usuario: userId,
        count: parseInt(quantity),
      });
      alert("Compra realizada com sucesso!");
      router.back();
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
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <BackButton />
      <View style={styles.card}>
        {product.imagem ? (
          <Image
            source={
              product.imagem.startsWith("http")
                ? { uri: product.imagem }
                : { uri: `data:image/jpeg;base64,${product.imagem}` }
            }
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Text style={{ color: "#888" }}>Sem imagem</Text>
          </View>
        )}
        <Text style={styles.title}>{product.nome}</Text>
        <Text style={styles.info}>
          Preço: <Text style={styles.price}>R$ {product.preco}</Text>
        </Text>
        <Text style={styles.info}>Descrição: {product.descricao}</Text>
        <Text style={styles.info}>
          Disponível: <Text style={styles.highlight}>{product.quantidade}</Text>
        </Text>

        <Text style={styles.label}>Quantidade:</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Quantidade"
        />

        <View style={styles.buttonRow}>
          <Button
            title={loading ? "Processando..." : "Confirmar Compra"}
            onPress={handleBuy}
            disabled={loading}
            color="#4A90E2"
          />
          <View style={{ width: 12 }} />
          <Button title="Cancelar" color="#888" onPress={() => router.back()} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  container: {
    flex: 1,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#232323",
    borderRadius: 18,
    padding: 24,
    width: width * 0.92,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  productImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: "#333",
  },
  noImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  info: {
    color: "#ccc",
    fontSize: 17,
    marginBottom: 6,
    textAlign: "center",
  },
  price: {
    color: "#4A90E2",
    fontWeight: "bold",
    fontSize: 18,
  },
  highlight: {
    color: "#fff",
    fontWeight: "bold",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginTop: 18,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  input: {
    backgroundColor: "#232323",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
    fontSize: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#444",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
    justifyContent: "center",
  },
});
