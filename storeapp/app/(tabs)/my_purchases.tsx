import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
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
};

export default function MyPurchasesScreen() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      const id = await AsyncStorage.getItem("id");
      try {
        const res = await axios.get(`http://localhost:5001/purchases/${id}`);
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
            <Text style={styles.productName}>{item.nome}</Text>
            <Text style={styles.productInfo}>Preço: R$ {item.preco}</Text>
            <Text style={styles.productInfo}>Descrição: {item.descricao}</Text>
            <Text style={styles.productInfo}>
              Quantidade: {item.quantidade}
            </Text>
            <Text style={styles.productInfo}>
              Data: {new Date(item.data_compra).toLocaleDateString()}
            </Text>
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
    paddingHorizontal: 16,
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  purchaseContainer: {
    backgroundColor: "#232323",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productInfo: {
    color: "#ccc",
    fontSize: 15,
    marginBottom: 4,
  },
});
