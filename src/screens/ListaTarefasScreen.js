import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TarefaItem from "../components/TarefaItem";

const CHAVE_STORAGE = "@rn-storage-lessons:tarefa";

export default function ListaTarefasScreen() {
  const [tarefas, setTarefas] = useState([]);
  const [textoInput, setTextoInput] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarTarefas() {
      try {
        const tarefasSalvas = await AsyncStorage.getItem(CHAVE_STORAGE);
        if (tarefasSalvas !== null) {
          setTarefas(JSON.parse(tarefasSalvas));
        }
      } catch (erro) {
        console.error("Erro ao carregar tarefas do storage", erro);
      } finally {
        setCarregando(false);
      }
    }
    carregarTarefas();
  }, []);

  useEffect(() => {
    if (carregando) return;
    AsyncStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas)).catch(
      (erro) => {
        console.error("Erro ao salvar tarefas no storage", erro);
      },
    );
  }, [tarefas, carregando]);

  function AdicionarTarefa() {
    const texto = textoInput.trim();
    if (texto === "") return;

    const novaTarefa = {
      id: Date.now().toString(),
      texto,
      concluida: false,
    };

    setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);
    setTextoInput("");
  }

  function AlternarConcluida(id) {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  }

  function ExcluirTarefa(id) {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.filter((tarefa) => tarefa.id !== id),
    );
  }

    function ExcluirTodasTarefas() {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais = [])
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.titulo}>Lista de Tarefas</Text>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma nova tarefa..."
          value={textoInput}
          onChangeText={setTextoInput}
          onSubmitEditing={AdicionarTarefa}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={AdicionarTarefa}
        >
          <Text style={styles.textoBotaoAdicionar}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={(tarefa) => tarefa.id}
        renderItem={({ item }) => (
          <TarefaItem
            tarefa={item}
            aoAlternarConcluida={AlternarConcluida}
            aoExcluir={ExcluirTarefa}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.listaVazia}>
            Nenhuma tarefa cadastrada ainda.
          </Text>
        }
        contentContainerStyle={styles.listaConteudo}
      />
      <TouchableOpacity
        style={styles.botaoExcluirTudo}
        onPress={ExcluirTodasTarefas}
      >
        <Text style={styles.textoBotaoExcluirTudo}>
          Excluir Todos os Elemetos da Lista
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  formulario: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  botaoAdicionar: {
    backgroundColor: "#2e86de",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  textoBotaoAdicionar: {
    color: "#fff",
    fontWeight: "bold",
  },
  listaConteudo: {
    paddingBottom: 20,
  },
  listaVazia: {
    textAlign: "center",
    color: "#888",
    marginTop: 24,
  },
  botaoExcluirTudo: {
    borderRadius: 8,
    paddingVertical: 8,
    backgroundColor: "#e41717f7",
    paddingHorizontal: 80,
    justifyContent: "center",
  },
  textoBotaoExcluirTudo: {
    color: "#fff",
    fontWeight: "bold",
  },
});
