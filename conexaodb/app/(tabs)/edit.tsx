import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditScreen() {
  const router = useRouter();
  // Recebendo os parâmetros
  const params = useLocalSearchParams();
  const id = params.id;

  // Estados para os campos
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Use o IP correto do servidor, não localhost
  const urlAPI = "http://192.168.198.16:5001/"; // Substitua pelo seu IP

  // Carregar os dados do usuário quando o componente montar
  useEffect(() => {
    if (id) {
      console.log("Buscando usuário com ID:", id);

      // Buscar dados do usuário
      axios
        .get(`${urlAPI}${id}`)
        .then((res) => {
          console.log("Dados recebidos:", res.data);
          const userData = res.data;

          // Preencher os campos com os dados recebidos
          if (userData && userData.data) {
            setNome(userData.data.nome || "");
            setTelefone(userData.data.telefone || "");
            setEmail(userData.data.email || "");
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar dados:", err);
          Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
        });
    }
  }, [id]); // Dependência apenas no ID

  const excluirUsuario = () => {
    // Versão simplificada usando alert JavaScript padrão
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      // Correção no URL para garantir o formato correto
      axios
        .delete(`${urlAPI}${id}`) // Removi a barra para evitar problema de URL
        .then(() => {
          alert("Usuário excluído com sucesso");
          router.back();
        })
        .catch(() => {
          alert("Não foi possível excluir o usuário");
        });
    }
  };
  const salvarAlteracoes = () => {
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    const userData = {
      nome,
      telefone,
      email,
      senha: senha || undefined, // Só envia a senha se for preenchida
    };

    axios
      .put(`${urlAPI}${id.toString()}`, userData)
      .then(() => {
        Alert.alert("Sucesso", "Usuário atualizado com sucesso", [
          { text: "OK", onPress: () => router.back() },
        ]);
        alert("Usuário atualizado com sucesso");
        router.back();
      })
      .catch((err) => {
        console.error("Erro ao atualizar usuário:", err);
        console.error(
          "Detalhes:",
          err.response ? JSON.stringify(err.response.data) : "Sem resposta"
        );
        Alert.alert(
          "Erro",
          `Não foi possível atualizar os dados. ${err.message}`
        );
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>

      <Text>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text>Nova Senha (deixe em branco para manter):</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Text>Confirmar Senha:</Text>
      <TextInput
        style={styles.input}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <View style={styles.actions}>
        <Button title="Cancelar" onPress={() => router.back()} />
        <Button title="Salvar" onPress={salvarAlteracoes} />
        <Button title="Excluir" onPress={excluirUsuario} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
