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
  fk_vendedor: number;
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [id, setId] = useState<number>(0);
  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/");
        return;
      }
      const userTypeValue = await AsyncStorage.getItem("userType");
      setUserType(userTypeValue ? userTypeValue.replace(/"/g, "") : null);

      const idValue = await AsyncStorage.getItem("id");
      setId(idValue ? parseInt(idValue) : 0);

      try {
        const response =
          userTypeValue === "clientes"
            ? await axios.get("http://localhost:5001/product")
            : await axios.get(
                `http://localhost:5001/product/seller/${idValue}`
              );

        setProducts(response.data.products);
      } catch (err) {
        alert("Erro ao carregar produtos");
      }
    };
    loadData();
  }, []);

  function logout() {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("userType");
    AsyncStorage.removeItem("id");
    router.replace("/");
  }
  function handleEditProduct(id: number) {
    router.push({
      pathname: "/(tabs)/edit_product",
      params: { id: id.toString() },
    });
  }
  function handleEditUser(id: number) {
    router.push({
      pathname: "/(tabs)/edit_user",
      params: { id: id.toString() },
    });
  }
  function handleBuy(id: number) {
    router.push({ pathname: "/(tabs)/buy", params: { id: id.toString() } });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.addButton, { alignSelf: "flex-end", marginBottom: 16 }]}
        onPress={logout}
      >
        <Text style={styles.addButtonText}>Logout</Text>
      </TouchableOpacity>
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
      <View style={styles.headerRow}>
        <Text style={styles.title}>Usuario</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            handleEditUser(id);
          }}
        >
          <Text style={styles.addButtonText}>+ Editar Perfil</Text>
        </TouchableOpacity>
      </View>
      {userType === "clientes" ? (
        <View style={styles.headerRow}>
          <Text style={styles.title}>Ver Minhas Compras</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              router.push("/(tabs)/my_purchases");
            }}
          >
            <Text style={styles.addButtonText}>+ Minhas Compras</Text>
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
                onPress={() => handleEditProduct(item.id)}
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
