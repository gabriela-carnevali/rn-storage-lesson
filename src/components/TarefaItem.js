// Importa o useState para gerenciar o estado local do componente (modo de edição e texto temporário)
import { useState } from "react";

// Importa os componentes nativos do React Native e a API de estilos
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";

// Componente funcional que renderiza um item da lista de tarefas
// Recebe o objeto da tarefa e as funções de manipulação via props (desestruturação)
export default function TarefaItem({
  tarefa,
  aoAlternarConcluida,
  aoExcluir,
  aoEditar,
}) {
  // Define o estado 'editando': true se o usuário estiver alterando o texto, false caso contrário
  const [editando, setEditando] = useState(false);

  // Define o estado 'textoEditado': armazena o texto enquanto o usuário digita na edição (inicia com o texto atual)
  const [textoEditado, setTextoEditado] = useState(tarefa.text);

  // Função responsável por validar e salvar a edição realizada
  function confirmarEdicao() {
    // Remove os espaços em branco no início e no fim para evitar salvar textos vazios ou só com espaços
    const textoLimpo = textoEditado.trim();

    // Se o texto estiver vazio, restaura o texto original e fecha o modo de edição sem alterar nada
    if (textoLimpo.length === 0) {
      setTextoEditado(tarefa.text);
      setEditando(false);
      return;
    }

    // Executa a função recebida da tela pai enviando o ID da tarefa e o novo texto
    aoEditar(tarefa.id, textoLimpo);

    // Encerra o modo de edição
    setEditando(false);
  }

  // Função responsável por desistir das alterações feitas durante a edição
  function cancelarEdicao() {
    // Reverte o valor do campo para o texto original antes da tentativa de edição
    setTextoEditado(tarefa.text);

    // Encerra o modo de edição
    setEditando(false);
  }

  return (
    // Container principal do item da tarefa (linha horizontal)
    <View style={styles.item}>
      {/* Renderização Condicional: Se 'editando' for true, exibe o campo de entrada. Se for false, exibe o texto da tarefa */}
      {editando ? (
        // Campo de texto interativo exibido apenas no modo de edição
        <TextInput
          style={styles.input} // Aplica linha inferior e margens
          value={textoEditado} // Define o valor exibido no campo vinculado ao estado
          onChangeText={setTextoEditado} // Atualiza o estado a cada caractere digitado
          onSubmitEditing={confirmarEdicao} // Confirma a edição ao pressionar 'Concluir' no teclado do celular
          returnKeyType="done" // Altera a tecla de ação do teclado mobile para o ícone de 'OK/Concluído'
          autoFocus // Abre o teclado automaticamente assim que o campo é exibido
        />
      ) : (
        // Área clicável onde exibe a tarefa quando não está sendo editada
        <TouchableOpacity
          style={styles.textoContainer} // Faz o texto ocupar o espaço livre restante da linha
          onPress={() => aoAlternarConcluida(tarefa.id)} // Clique simples alterna entre concluído/pendente
        >
          {/* Texto da tarefa */}
          <Text
            // Aplica o estilo base 'texto' e concatena o estilo 'textoConcluido' (riscado) caso a tarefa esteja marcada como concluída
            style={[styles.texto, tarefa.concluida && styles.textoConcluido]}
          >
            {tarefa.text}
          </Text>
        </TouchableOpacity>
      )}

      {/* Renderização Condicional dos Botões de Ação */}
      {editando ? (
        // Grupo de botões exibidos durante o modo de edição (Salvar / Cancelar)
        <View style={styles.acoesEdicao}>
          {/* Botão para confirmar a alteração */}
          <TouchableOpacity
            style={styles.botaoSalvar}
            onPress={confirmarEdicao} // Dispara a validação e o salvamento
          >
            <Text style={styles.textoBotaoExcluir}>Salvar</Text>
          </TouchableOpacity>

          {/* Botão para descartar a alteração */}
          <TouchableOpacity
            style={styles.botaoCancelar}
            onPress={cancelarEdicao} // Descarta o texto e fecha o modo de edição
          >
            <Text style={styles.textoBotaoExcluir}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Grupo de botões exibidos no estado normal da tarefa (Editar / Excluir)
        <View style={styles.acoesEdicao}>
          {/* Botão para entrar no modo de edição */}
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => setEditando(true)} // Habilita o estado de edição
          >
            <Text style={styles.textoBotaoExcluir}>Editar</Text>
          </TouchableOpacity>

          {/* Botão para remover o item */}
          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => aoExcluir(tarefa.id)} // Chama a função do componente pai passando o ID para exclusão
          >
            <Text style={styles.textoBotaoExcluir}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Objeto de estilização usando StyleSheet para otimização de performance no React Native
const styles = StyleSheet.create({
  // Card visual da tarefa (estrutura da linha)
  item: {
    flexDirection: "row", // Alinha o texto e os botões lado a lado (horizontalmente)
    alignItems: "center", // Centraliza verticalmente o texto e os botões na mesma linha
    justifyContent: "space-between", // Empurra o texto para a esquerda e os botões para a extrema direita
    backgroundColor: "#fff", // Fundo branco do card
    borderRadius: 8, // Arredonda os cantos do card
    paddingVertical: 12, // Espaçamento interno em cima e embaixo
    paddingHorizontal: 14, // Espaçamento interno nas laterais
    marginBottom: 10, // Espaço em branco abaixo de cada tarefa para separá-las
    // Sombras para iOS:
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    // Sombra para Android:
    elevation: 2,
  },

  // Conteiner que envolve o texto da tarefa (quando não editando)
  textoContainer: {
    flex: 1, // Faz com que o texto ocupe todo o espaço disponível antes dos botões
    marginRight: 10, // Garante um espaço de segurança para não colar nos botões
  },

  // Estilo do texto normal da tarefa
  texto: {
    fontSize: 16, // Tamanho da fonte para boa leitura em telas móveis
    color: "#222", // Cinza escuro/quase preto para alto contraste
  },

  // Estilo aplicado dinamicamente quando a tarefa estiver concluída
  textoConcluido: {
    textDecorationLine: "line-through", // Aplica o risco no meio das palavras
    color: "#999", // Suaviza a cor do texto para cinza claro
  },

  // Estilo do campo TextInput de edição
  input: {
    flex: 1, // Ocupa todo o espaço da linha disponível
    marginRight: 10, // Distância em relação aos botões
    fontSize: 16, // Mantém a mesma proporção do texto normal
    color: "#222", // Cor do texto digitado
    borderBottomWidth: 1, // Adiciona uma linha apenas na parte inferior
    borderBottomColor: "#3498db", // Cor azul para a linha de foco do campo
    paddingVertical: 2, // Ajuste fino do espaçamento vertical do input
  },

  // Envolvente dos botões de ação
  acoesEdicao: {
    flexDirection: "row", // Coloca os botões de ação lado a lado
    gap: 6, // Espaçamento automático de 6px entre cada botão do grupo
  },

  // Botão de exclusão (Ação Destrutiva)
  botaoExcluir: {
    backgroundColor: "#e74c3c", // Vermelho
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  // Botão de início de edição (Ação Primária)
  botaoEditar: {
    backgroundColor: "#3498db", // Azul
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  // Botão de confirmação da edição (Ação Sucesso)
  botaoSalvar: {
    backgroundColor: "#2ecc71", // Verde
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  // Botão de cancelamento (Ação Neutra)
  botaoCancelar: {
    backgroundColor: "#95a5a6", // Cinza
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  // Estilo padrão do texto exibido dentro de todos os botões pequenos
  textoBotaoExcluir: {
    color: "#fff", // Texto em branco para legibilidade em fundos coloridos
    fontWeight: "bold", // Negrito para destacar as ações
    fontSize: 12, // Tamanho reduzido para caber confortavelmente no layout da linha
  },
});