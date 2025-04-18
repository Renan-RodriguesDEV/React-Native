import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface para tipo de compromisso
interface Compromisso {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  concluido: boolean;
}

export default function AgendaScreen() {
  // Estados principais
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Estados para filtragem
  const [filtroData, setFiltroData] = useState<Date | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<
    "todos" | "ativos" | "concluidos"
  >("todos");
  const [showFiltroDatePicker, setShowFiltroDatePicker] = useState(false);

  // Carregar dados ao iniciar
  useEffect(() => {
    carregarCompromissos();
  }, []);

  // Funções para persistência de dados
  const carregarCompromissos = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem("@agenda_compromissos");
      if (dadosSalvos) {
        setCompromissos(JSON.parse(dadosSalvos));
      }
    } catch (error) {
      console.error("Erro ao carregar compromissos:", error);
    }
  };

  const salvarCompromissos = async (novosCompromissos: Compromisso[]) => {
    try {
      await AsyncStorage.setItem(
        "@agenda_compromissos",
        JSON.stringify(novosCompromissos)
      );
    } catch (error) {
      console.error("Erro ao salvar compromissos:", error);
    }
  };

  // Funções para manipular compromissos
  const adicionarCompromisso = () => {
    if (!titulo.trim()) {
      alert("O título é obrigatório!");
      return;
    }

    const dataFormatada = formatarData(data);
    const horaFormatada = formatarHora(hora);

    const novoCompromisso: Compromisso = {
      id: editandoId || Date.now().toString(),
      titulo,
      descricao,
      data: dataFormatada,
      hora: horaFormatada,
      concluido: false,
    };

    let novosCompromissos: Compromisso[];

    if (editandoId) {
      // Editando um existente
      novosCompromissos = compromissos.map((comp) =>
        comp.id === editandoId ? novoCompromisso : comp
      );
    } else {
      // Adicionando novo
      novosCompromissos = [...compromissos, novoCompromisso];
    }

    setCompromissos(novosCompromissos);
    salvarCompromissos(novosCompromissos);
    limparFormulario();
    setModalVisivel(false);
  };

  const removerCompromisso = (id: string) => {
    const novosCompromissos = compromissos.filter(
      (compromisso) => compromisso.id !== id
    );
    setCompromissos(novosCompromissos);
    salvarCompromissos(novosCompromissos);
  };

  const marcarComoConcluido = (id: string) => {
    const novosCompromissos = compromissos.map((compromisso) => {
      if (compromisso.id === id) {
        return { ...compromisso, concluido: !compromisso.concluido };
      }
      return compromisso;
    });

    setCompromissos(novosCompromissos);
    salvarCompromissos(novosCompromissos);
  };

  const editarCompromisso = (comp: Compromisso) => {
    setTitulo(comp.titulo);
    setDescricao(comp.descricao);

    // Converter strings para Date objects
    const [dia, mes, ano] = comp.data.split("/").map(Number);
    const [horas, minutos] = comp.hora.split(":").map(Number);

    const novaData = new Date();
    novaData.setDate(dia);
    novaData.setMonth(mes - 1);
    novaData.setFullYear(ano);
    setData(novaData);

    const novaHora = new Date();
    novaHora.setHours(horas);
    novaHora.setMinutes(minutos);
    setHora(novaHora);

    setEditandoId(comp.id);
    setModalVisivel(true);
  };

  // Funções utilitárias
  const formatarData = (date: Date): string => {
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const formatarHora = (date: Date): string => {
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  const limparFormulario = () => {
    setTitulo("");
    setDescricao("");
    setData(new Date());
    setHora(new Date());
    setEditandoId(null);
  };

  // Filtrar compromissos
  const compromissosFiltrados = () => {
    return compromissos.filter((comp) => {
      // Filtro por status
      if (filtroStatus === "ativos" && comp.concluido) return false;
      if (filtroStatus === "concluidos" && !comp.concluido) return false;

      // Filtro por data
      if (filtroData) {
        const dataFormatada = formatarData(filtroData);
        if (comp.data !== dataFormatada) return false;
      }

      return true;
    });
  };

  // Handlers para seletores de data e hora
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setData(selectedDate);
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setHora(selectedTime);
    }
  };

  const onChangeFiltroDate = (event: any, selectedDate?: Date) => {
    setShowFiltroDatePicker(false);
    if (selectedDate) {
      setFiltroData(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agenda de Compromissos</Text>

      {/* Seção de filtros */}
      <View style={styles.filtrosContainer}>
        <Text style={styles.filtroTitulo}>Filtros:</Text>

        <View style={styles.filtroRow}>
          <TouchableOpacity
            style={styles.filtroData}
            onPress={() => setShowFiltroDatePicker(true)}
          >
            <Text style={styles.filtroTexto}>
              {filtroData ? formatarData(filtroData) : "Todas as datas"}
            </Text>
          </TouchableOpacity>

          {filtroData && (
            <TouchableOpacity onPress={() => setFiltroData(null)}>
              <Ionicons name="close-circle" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.botoesStatus}>
          <TouchableOpacity
            style={[
              styles.botaoStatus,
              filtroStatus === "todos" && styles.botaoStatusAtivo,
            ]}
            onPress={() => setFiltroStatus("todos")}
          >
            <Text style={styles.botaoTexto}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoStatus,
              filtroStatus === "ativos" && styles.botaoStatusAtivo,
            ]}
            onPress={() => setFiltroStatus("ativos")}
          >
            <Text style={styles.botaoTexto}>Ativos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoStatus,
              filtroStatus === "concluidos" && styles.botaoStatusAtivo,
            ]}
            onPress={() => setFiltroStatus("concluidos")}
          >
            <Text style={styles.botaoTexto}>Concluídos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de compromissos */}
      <FlatList
        data={compromissosFiltrados()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.compromissoItem,
              item.concluido && styles.compromissoConcluido,
            ]}
          >
            <View style={styles.compromissoHeader}>
              <Text style={styles.compromissoTitulo}>{item.titulo}</Text>
              <View style={styles.dataHora}>
                <Text style={styles.dataHoraTexto}>
                  {item.data} às {item.hora}
                </Text>
              </View>
            </View>

            <Text style={styles.compromissoDescricao}>{item.descricao}</Text>

            <View style={styles.botoesAcao}>
              <TouchableOpacity
                style={[styles.botao, styles.botaoConcluir]}
                onPress={() => marcarComoConcluido(item.id)}
              >
                <Ionicons
                  name={item.concluido ? "checkbox" : "square-outline"}
                  size={22}
                  color="white"
                />
                <Text style={styles.botaoTexto}>
                  {item.concluido ? "Desmarcar" : "Concluir"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botao, styles.botaoEditar]}
                onPress={() => editarCompromisso(item)}
              >
                <Ionicons name="pencil" size={22} color="white" />
                <Text style={styles.botaoTexto}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botao, styles.botaoExcluir]}
                onPress={() => removerCompromisso(item.id)}
              >
                <Ionicons name="trash" size={22} color="white" />
                <Text style={styles.botaoTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Text style={styles.listaVaziaTexto}>
              Nenhum compromisso encontrado
            </Text>
          </View>
        }
      />

      {/* Botão Adicionar */}
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => {
          limparFormulario();
          setModalVisivel(true);
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal para Adicionar/Editar */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>
              {editandoId ? "Editar Compromisso" : "Novo Compromisso"}
            </Text>

            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Título:</Text>
                <TextInput
                  style={styles.input}
                  value={titulo}
                  onChangeText={setTitulo}
                  placeholder="Título do compromisso"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Descrição:</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={descricao}
                  onChangeText={setDescricao}
                  placeholder="Descrição do compromisso"
                  multiline={true}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Data:</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{formatarData(data)}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Hora:</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text>{formatarHora(hora)}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.botoesModal}>
                <TouchableOpacity
                  style={[styles.botaoModal, styles.botaoCancelar]}
                  onPress={() => setModalVisivel(false)}
                >
                  <Text style={styles.botaoTexto}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botaoModal, styles.botaoSalvar]}
                  onPress={adicionarCompromisso}
                >
                  <Text style={styles.botaoTexto}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Seletores de Data e Hora */}
      {showDatePicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={hora}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeTime}
        />
      )}

      {showFiltroDatePicker && (
        <DateTimePicker
          value={filtroData || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeFiltroDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  filtrosContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  filtroTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  filtroRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  filtroData: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  filtroTexto: {
    color: "#555",
  },
  botoesStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoStatus: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  botaoStatusAtivo: {
    backgroundColor: "#4A90E2",
  },
  compromissoItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  compromissoConcluido: {
    backgroundColor: "#f8f8f8",
    opacity: 0.8,
    borderLeftColor: "#2ecc71",
    borderLeftWidth: 5,
  },
  compromissoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  compromissoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  dataHora: {
    backgroundColor: "#f0f0f0",
    padding: 4,
    borderRadius: 4,
  },
  dataHoraTexto: {
    fontSize: 12,
    color: "#555",
  },
  compromissoDescricao: {
    color: "#666",
    marginBottom: 16,
  },
  botoesAcao: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  botaoConcluir: {
    backgroundColor: "#2ecc71",
  },
  botaoEditar: {
    backgroundColor: "#4A90E2",
  },
  botaoExcluir: {
    backgroundColor: "#FF6B6B",
  },
  botaoTexto: {
    color: "white",
    marginLeft: 4,
    fontSize: 14,
  },
  listaVazia: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  listaVaziaTexto: {
    color: "#999",
    fontSize: 16,
  },
  botaoAdicionar: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#4A90E2",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalConteudo: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  botoesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  botaoModal: {
    padding: 12,
    borderRadius: 4,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },
  botaoCancelar: {
    backgroundColor: "#FF6B6B",
  },
  botaoSalvar: {
    backgroundColor: "#4A90E2",
  },
});
