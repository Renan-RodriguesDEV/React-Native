import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Product = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  descricao: string;
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (!token) {
        router.replace("/");
      }
    });
    axios.get("http://localhost:5001/product").then((response) => {
      setProducts(response.data.products);
    });
    AsyncStorage.getItem("userType").then((value) => {
      setUserType(value ? value.replace(/"/g, "") : null);
      // alert(`User type: ${value}`);
    });
  }, []);

  function handleEdit(id: number) {
    router.push({
      pathname: "/(tabs)/edit_product",
      params: { id: id.toString() },
    });
  }
  function handleBuy(id: number) {
    router.push({ pathname: "/(tabs)/buy", params: { id: id.toString() } });
  }

  return (
    <View style={styles.container}>
      {userType === "vendedores" ? (
        <View style={styles.headerRow}>
          <Text style={styles.title}>Produtos</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/(tabs)/register_product")}
          >
            <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.nome}</Text>
            <Text style={styles.productInfo}>Preço: R$ {item.preco}</Text>
            <Text style={styles.productInfo}>Descrição: {item.descricao}</Text>
            <Text style={styles.productInfo}>
              Quantidade: {item.quantidade}
            </Text>
            {userType === "vendedores" ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item.id)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuy(item.id)}
              >
                <Text style={styles.buttonText}>Comprar</Text>
              </TouchableOpacity>
            )}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  productContainer: {
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
  editButton: {
    backgroundColor: "#FF8C00",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buyButton: {
    backgroundColor: "#2ecc71",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
