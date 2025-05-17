import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BackButton from "@/components/BackButton";

type Purchase = {
  data_compra: string;
  descricao: string;
  fk_produto: number;
  fk_usuario: number;
  fk_vendedor: number;
  id: number;
  nome: string;
  p_id: number;
  p_quantidade: number;
  preco: number;
  quantidade: number;
  imagem?: string; // Adicione este campo se não existir
};

const { width } = Dimensions.get("window");

export default function MyPurchasesScreen() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const urlAPI = "http://192.168.1.18:5001";

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      const id = await AsyncStorage.getItem("id");
      try {
        const res = await axios.get(`${urlAPI}/purchases/${id}`);
        setPurchases(res.data.buys || []);
      } catch (err) {
        alert("Erro ao carregar compras");
      }
      setLoading(false);
    };
    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Carregando compras...
        </Text>
      </View>
    );
  }

  if (purchases.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>
          Você ainda não realizou nenhuma compra.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Compras</Text>
      <BackButton />
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.purchaseContainer}>
            {item.imagem ? (
              <Image
                source={
                  item.imagem.startsWith("http")
                    ? { uri: item.imagem }
                    : { uri: `data:image/jpeg;base64,${item.imagem}` }
                }
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImage}>
                <Text style={{ color: "#888" }}>Sem imagem</Text>
              </View>
            )}
            <View style={styles.infoBox}>
              <Text style={styles.productName}>{item.nome}</Text>
              <Text style={styles.productInfo}>
                Preço: <Text style={styles.price}>R$ {item.preco}</Text>
              </Text>
              <Text style={styles.productInfo}>
                Descrição: {item.descricao}
              </Text>
              <Text style={styles.productInfo}>
                Quantidade:{" "}
                <Text style={styles.highlight}>{item.quantidade}</Text>
              </Text>
              <Text style={styles.productInfo}>
                Data:{" "}
                <Text style={styles.highlight}>
                  {new Date(item.data_compra).toLocaleDateString()}
                </Text>
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    paddingHorizontal: 8,
    paddingTop: 40,
  },
  center: {
    flex: 1,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
    letterSpacing: 1,
  },
  purchaseContainer: {
    backgroundColor: "#232323",
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: "#333",
  },
  noImage: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  productInfo: {
    color: "#ccc",
    fontSize: 15,
    marginBottom: 2,
  },
  price: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  highlight: {
    color: "#fff",
    fontWeight: "bold",
  },
});
