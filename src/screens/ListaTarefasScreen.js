// Importa os hooks essenciais do React:
// - useEffect: para lidar com efeitos colaterais (carregar/salvar dados no armazenamento)
// - useState: para criar e controlar estados locais
import { useEffect, useState } from "react";

// Importa os componentes de interface nativos do React Native:
// - FlatList: para renderizar listas de alta performance
// - KeyboardAvoidingView: para ajustar a tela automaticamente quando o teclado mobile abre
// - Platform: para identificar se o dispositivo é Android ou iOS
// - StyleSheet: para criar a folha de estilos otimizada
// - Text, TextInput, TouchableOpacity, View: blocos fundamentais da UI
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

// Importa o componente filho criado para exibir cada item individual da lista
import TarefaItem from "../components/TarefaItem";

// Importa a biblioteca AsyncStorage para persistir dados localmente no dispositivo (banco de dados chave-valor)
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define a chave única usada para salvar e recuperar as tarefas do AsyncStorage
const CHAVE_STORAGE = "@rn-storage-lesson:tarefas";

export default function ListaTarefasScreen() {
  // Estado que armazena a lista de tarefas (Array de objetos)
  const [tarefas, setTarefas] = useState([]);

  // Estado que controla o texto digitado no campo de entrada de nova tarefa
  const [textoInput, setTextoInput] = useState("");

  // Estado booleano para evitar que o salvamento automático sobrescreva os dados antes de carregar o que já estava salvo
  const [carregando, setCarregando] = useState(true);

  // Efeito 1 (Inicialização): Executa apenas UMA vez quando a tela é carregada (array de dependências vazio [])
  useEffect(() => {
    async function carregarTarefa() {
      try {
        // Busca a string no formato JSON salva no disco do celular
        const tarefasSalvas = await AsyncStorage.getItem(CHAVE_STORAGE);

        // Se encontrou dados salvos no armazenamento
        if (tarefasSalvas !== null) {
          // Converte a string JSON de volta para Array e atualiza o estado
          setTarefas(JSON.parse(tarefasSalvas));
        }
      } catch (erro) {
        // Exibe erro no console caso falhe a leitura do armazenamento
        console.error("ERRO AO CARREGAR TAREFAS NO STORAGE:", erro);
      } finally {
        // Libera a aplicação para realizar futuros salvamentos
        setCarregando(false);
      }
    }

    carregarTarefa();
  }, []);

  // Efeito 2 (Persistência): Executa sempre que o estado 'tarefas' ou 'carregando' mudar
  useEffect(() => {
    // Trava de segurança: Se ainda estiver lendo os dados do celular na inicialização, aborta para não apagar nada
    if (carregando) return;

    // Transforma o array de tarefas em string JSON e salva no AsyncStorage
    AsyncStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas)).catch(
      (erro) => {
        // Captura e exibe falhas de escrita no armazenamento
        console.error("ERRO AO SALVAR TAREFAS NO STORAGE:", erro);
      }
    );
  }, [tarefas, carregando]);

  // Função responsável por adicionar um novo item à lista
  function adicionarTarefa() {
    // Remove os espaços em branco no início e no fim da string digitada
    const text = textoInput.trim();

    // Impede a criação de tarefas vazias
    if (text === "") return;

    // Constrói a estrutura do novo objeto de tarefa
    const novaTarefa = {
      id: Date.now().toString(), // Gera um ID único baseado na data/hora atual em milissegundos
      text, // Texto higienizado da tarefa
      concluida: false, // Por padrão, a nova tarefa inicia pendente
    };

    // Atualiza o estado da lista adicionando o novo item ao final mantendo as anteriores (imutabilidade)
    setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);

    // Limpa a caixa de texto
    setTextoInput("");
  }

  // Função para alternar o status de concluída (true/false) de uma tarefa específica
  function alternarConcluida(id) {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.map((tarefa) =>
        // Procura a tarefa pelo ID: se for ela, inverte a propriedade 'concluida'. Se não, mantém como está.
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  }

  // Função para remover uma única tarefa da lista pelo seu ID
  function excluirTarefa(id) {
    setTarefas((tarefasAtuais) =>
      // Cria uma nova lista mantendo apenas as tarefas com ID diferente do passado
      tarefasAtuais.filter((tarefa) => tarefa.id !== id)
    );
  }

  // Função que limpa completamente a lista de tarefas
  function excluirTodas() {
    setTarefas([]);
  }

  // Função para atualizar o texto de uma tarefa já existente após edição
  function editarTarefa(id, novoTexto) {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.map((tarefa) =>
        // Procura a tarefa pelo ID e atualiza a propriedade 'text' com o novo conteúdo
        tarefa.id === id ? { ...tarefa, text: novoTexto } : tarefa
      )
    );
  }

  return (
    // Wrapper que empurra o conteúdo da tela para cima quando o teclado do celular aparece
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined} // O ajuste com 'padding' é ideal para o sistema iOS
    >
      {/* Título principal da aplicação */}
      <Text style={styles.titulo}>Lista de Tarefas</Text>

      {/* Formulário superior de inserção */}
      <View style={styles.formulario}>
        {/* Campo para o usuário digitar o nome da nova tarefa */}
        <TextInput
          style={styles.input}
          placeholder="Digite uma nova tarefa..."
          value={textoInput}
          onChangeText={setTextoInput} // Atualiza o estado a cada caractere digitado
          onSubmitEditing={adicionarTarefa} // Permite cadastrar pressionando 'Enter' no teclado
          returnKeyType="done"
        />

        {/* Botão de envio do formulário */}
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={adicionarTarefa}
        >
          <Text style={styles.textoBotaoAdicionar}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista otimizada para renderização dinâmica das tarefas */}
      <FlatList
        data={tarefas} // Array de dados que alimentará a lista
        keyExtractor={(tarefa) => tarefa.id} // Define a chave única necessária para o React identificar cada item
        renderItem={({ item }) => (
          // Componente customizado renderizado para cada item da lista
          <TarefaItem
            tarefa={item}
            aoAlternarConcluida={alternarConcluida}
            aoExcluir={excluirTarefa}
            aoEditar={editarTarefa}
          />
        )}
        // Exibido automaticamente pela FlatList quando o array 'tarefas' estiver vazio
        ListEmptyComponent={
          <Text style={styles.listaVazia}>
            Nenhuma tarefa cadastrada ainda.
          </Text>
        }
        contentContainerStyle={styles.listaConteudo} // Estilo aplicado no container interno de scroll
      />

      {/* Botão vermelho de ação global na parte inferior para limpar toda a lista */}
      <TouchableOpacity style={styles.botaoExluirTudo} onPress={excluirTodas}>
        <Text style={styles.textoBotaoExcluirTudo}>Excluir Todas</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

// Folha de estilos da tela principal usando o StyleSheet
const styles = StyleSheet.create({
  // Container pai da tela
  container: {
    flex: 1, // Faz a tela ocupar todo o espaço vertical disponível
    backgroundColor: "#f2f2f2", // Cor de fundo cinza bem claro
    paddingTop: 60, // Distância do topo para não cobrir a barra de status do celular
    paddingHorizontal: 16, // Espaçamento nas laterais da tela
  },

  // Estilo do título
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  // Container do formulário de adição (Input + Botão lado a lado)
  formulario: {
    flexDirection: "row", // Posiciona os elementos em linha horizontal
    marginBottom: 16,
  },

  // Campo de entrada de texto
  input: {
    flex: 1, // Toma todo o espaço disponível restante na linha
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8, // Espaço entre o campo e o botão adicionar
  },

  // Botão de adicionar
  botaoAdicionar: {
    backgroundColor: "#2e86de", // Tom de azul primário
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center", // Centraliza o texto verticalmente dentro do botão
  },

  // Texto dentro do botão adicionar
  textoBotaoAdicionar: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Container interno de rolagem da FlatList
  listaConteudo: {
    paddingBottom: 20,
  },

  // Estilo do texto de fallback para lista vazia
  listaVazia: {
    textAlign: "center",
    color: "#888",
    marginTop: 24,
  },

  // Botão em destaque de exclusão em massa
  botaoExluirTudo: {
    backgroundColor: "#D32F2F", // Vermelho de aviso/perigo
    width: "100%", // Ocupa toda a largura
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center", // Centraliza o conteúdo horizontalmente
    justifyContent: "center", // Centraliza o conteúdo verticalmente
    marginBottom: 25, // Afasta o botão da borda inferior da tela
  },

  // Texto em destaque dentro do botão de exclusão geral
  textoBotaoExcluirTudo: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1, // Espaçamento entre as letras para efeito de destaque
    textTransform: "uppercase", // Força o texto para CAIXA ALTA
  },
});