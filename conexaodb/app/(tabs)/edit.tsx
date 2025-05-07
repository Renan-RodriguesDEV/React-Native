import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditScreen() {
  const router = useRouter();
  // Recebendo os parâmetros e convertendo-os para string
  const params = useLocalSearchParams();
  const id = params.id?.toString();
  const nomeAtual = params.nomeAtual?.toString() || "";
  const telefoneAtual = params.telefoneAtual?.toString() || "";
  const emailAtual = params.emailAtual?.toString() || "";
  const senhaAtual = params.senhaAtual?.toString() || "";

  // Inicializando os estados com os valores recebidos
  const [nome, setNome] = useState(nomeAtual);
  const [telefone, setTelefone] = useState(telefoneAtual);
  const [email, setEmail] = useState(emailAtual);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Corrigindo a URL para usar o IP real, não localhost
  const urlAPI = "http://localhost:5001/"; // Use o IP do seu servidor

  useEffect(() => {
    // Só busca os dados do usuário se não tiver recebido os dados completos
    if (id && (!nomeAtual || !telefoneAtual || !emailAtual)) {
      axios
        .get(`${urlAPI}${id}`)
        .then((res) => {
          const userData = res.data;
          setNome(userData.nome || "");
          setTelefone(userData.telefone || "");
          setEmail(userData.email || "");
          console.log("Dados do usuário:", userData);
        })
        .catch((err) => {
          console.error("Erro ao buscar dados do usuário:", err);
          // Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
          alert("Erro!! Não foi possível carregar os dados do usuário.");
        });
    }
  }, [id, nomeAtual, telefoneAtual, emailAtual]);

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
          // Alert.alert("Não foi possível excluir o usuário");
        });
    }
  };
  const salvarAlteracoes = () => {
    if (senha !== confirmarSenha) {
      // Alert.alert("Erro", "As senhas não coincidem!");
      alert("Erro!! As senhas não coincidem!");
      return;
    }
    if (senha === "") {
      alert(`A senha se mantem: ${senhaAtual}`);
      setSenha(senhaAtual);
    }

    const userData = {
      nome,
      telefone,
      email,
      senha: senha !==""? senha: senhaAtual || undefined, 
    };

    axios
      .put(`${urlAPI}${id.toString()}`, userData)
      .then(() => {
        // Alert.alert("Sucesso", "Usuário atualizado com sucesso", [
        //   { text: "OK", onPress: () => router.back() },
        // ]);
        alert("Usuário atualizado com sucesso");
        router.back();
      })
      .catch((err) => {
        console.error("Erro ao atualizar usuário:", err);
        console.error(
          "Detalhes:",
          err.response ? JSON.stringify(err.response.data) : "Sem resposta"
        );
        // Alert.alert(
        //   "Erro",
        //   `Não foi possível atualizar os dados. ${err.message}`
        // );
        alert("Não foi possível atualizar os dados.");
        console.error("Erro:", err.message);
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
