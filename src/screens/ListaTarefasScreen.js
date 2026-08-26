// Importa os hooks do React
import { useEffect, useState } from "react";

// Importa componentes do React Native
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

// Importa o componente responsável por mostrar cada tarefa
import TarefaItem from "../components/TarefaItem";

// Importa o AsyncStorage para salvar os dados no celular
import AsyncStorage from "@react-native-async-storage/async-storage";

// Chave usada para guardar as tarefas no armazenamento
const CHAVE_STORAGE = "@rn-storage-lesson:tarefas";

export default function ListaTarefasScreen() {
  // Guarda a lista de tarefas
  const [tarefas, setTarefas] = useState([]);

  // Guarda o texto digitado no campo de nova tarefa
  const [textoInput, setTextoInput] = useState("");

  // Indica se as tarefas ainda estão sendo carregadas
  const [carregando, setCarregando] = useState(true);

  // Executa uma vez quando a tela é aberta
  useEffect(() => {
    async function carregarTarefa() {
      try {
        // Busca as tarefas salvas no AsyncStorage
        const tarefasSalvas = await AsyncStorage.getItem(CHAVE_STORAGE);

        // Se existirem tarefas salvas, transforma o texto em array
        if (tarefasSalvas !== null) {
          setTarefas(JSON.parse(tarefasSalvas));
        }
      } catch (erro) {
        // Mostra o erro no console caso não consiga carregar
        console.error("ERRO AO CARREGAR TAREFAS NO STORAGE:", erro);
      } finally {
        // Finaliza o carregamento
        setCarregando(false);
      }
    }

    carregarTarefa();
  }, []);

  // Executa sempre que a lista de tarefas for alterada
  useEffect(() => {
    // Não salva enquanto as tarefas ainda estão sendo carregadas
    if (carregando) return;

    // Converte as tarefas para texto e salva no celular
    AsyncStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas)).catch(
      (erro) => {
        // Mostra o erro caso não consiga salvar
        console.error("ERRO AO SALVAR TAREFAS NO STORAGE:", erro);
      },
    );
  }, [tarefas, carregando]);

  // Adiciona uma nova tarefa
  function adicionarTarefa() {
    // Remove espaços desnecessários
    const text = textoInput.trim();

    // Não permite adicionar tarefa vazia
    if (text === "") return;

    // Cria uma nova tarefa
    const novaTarefa = {
      id: Date.now().toString(),
      text,
      concluida: false,
    };

    // Adiciona a nova tarefa na lista
    setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);

    // Limpa o campo de texto
    setTextoInput("");
  }

  // Marca ou desmarca uma tarefa como concluída
  function alternarConcluida(id) {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  }

  // Exclui uma tarefa específica
  function excluirTarefa(id) {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.filter((tarefa) => tarefa.id !== id),
    );
  }

  // Exclui todas as tarefas
  function excluirTodas() {
    setTarefas([]);
  }

  // Edita o texto de uma tarefa
  function editarTarefa(id, novoTexto) {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, text: novoTexto } : tarefa,
      ),
    );
  }

  return (
    // Evita que o teclado cubra o conteúdo da tela
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Título da tela */}
      <Text style={styles.titulo}>Lista de Tarefas</Text>

      {/* Área para adicionar tarefas */}
      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma nova tarefa..."
          value={textoInput}
          onChangeText={setTextoInput}
          onSubmitEditing={adicionarTarefa}
          returnKeyType="done"
        />

        {/* Botão para adicionar tarefa */}
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={adicionarTarefa}
        >
          <Text style={styles.textoBotaoAdicionar}>Adicionar</Text>
        </TouchableOpacity>

        {/* Botão para excluir todas */}
        <TouchableOpacity style={styles.botaoAdicionar} onPress={excluirTodas}>
          <Text style={styles.textoBotaoAdicionar}>Excluir Todas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista das tarefas */}
      <FlatList
        data={tarefas}
        keyExtractor={(tarefa) => tarefa.id}
        renderItem={({ item }) => (
          // Componente que representa cada tarefa
          <TarefaItem
            tarefa={item}
            aoAlternarConcluida={alternarConcluida}
            aoExcluir={excluirTarefa}
            aoEditar={editarTarefa}
          />
        )}
        // Mensagem quando não existem tarefas
        ListEmptyComponent={
          <Text style={styles.listaVazia}>
            Nenhuma tarefa cadastrada ainda.
          </Text>
        }
        contentContainerStyle={styles.listaConteudo}
      />
    </KeyboardAvoidingView>
  );
}

// Estilos da tela
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
});