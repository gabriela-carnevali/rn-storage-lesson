// Importa o useState para controlar a edição
import { useState } from "react";

// Importa os componentes do React Native
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";

// Componente que representa uma tarefa individual
export default function TarefaItem({
  tarefa,
  aoAlternarConcluida,
  aoExcluir,
  aoEditar,
}) {
  // Controla se a tarefa está sendo editada
  const [editando, setEditando] = useState(false);

  // Guarda o texto que está sendo editado
  const [textoEditado, setTextoEditado] = useState(tarefa.text);

  // Confirma a edição da tarefa
  function confirmarEdicao() {
    // Remove espaços desnecessários
    const textoLimpo = textoEditado.trim();

    // Não permite salvar uma tarefa vazia
    if (textoLimpo.length === 0) {
      setTextoEditado(tarefa.text);
      setEditando(false);
      return;
    }

    // Envia o novo texto para a tela principal
    aoEditar(tarefa.id, textoLimpo);

    // Sai do modo de edição
    setEditando(false);
  }

  // Cancela a edição
  function cancelarEdicao() {
    // Volta para o texto original
    setTextoEditado(tarefa.text);

    // Sai do modo de edição
    setEditando(false);
  }

  return (
    <View style={styles.item}>
      {editando ? (
        // Campo usado para editar a tarefa
        <TextInput
          style={styles.input}
          value={textoEditado}
          onChangeText={setTextoEditado}
          onSubmitEditing={confirmarEdicao}
          returnKeyType="done"
          autoFocus
        />
      ) : (
        // Área que mostra o texto da tarefa
        <TouchableOpacity
          style={styles.textoContainer}
          onPress={() => aoAlternarConcluida(tarefa.id)}
        >
          <Text
            // Aplica o estilo de concluído quando necessário
            style={[styles.texto, tarefa.concluida && styles.textoConcluido]}
          >
            {tarefa.text}
          </Text>
        </TouchableOpacity>
      )}

      {editando ? (
        // Botões exibidos durante a edição
        <View style={styles.acoesEdicao}>
          {/* Salva a alteração */}
          <TouchableOpacity
            style={styles.botaoSalvar}
            onPress={confirmarEdicao}
          >
            <Text style={styles.textoBotaoExcluir}>Salvar</Text>
          </TouchableOpacity>

          {/* Cancela a alteração */}
          <TouchableOpacity
            style={styles.botaoCancelar}
            onPress={cancelarEdicao}
          >
            <Text style={styles.textoBotaoExcluir}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Botões exibidos normalmente
        <View style={styles.acoesEdicao}>
          {/* Entra no modo de edição */}
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => setEditando(true)}
          >
            <Text style={styles.textoBotaoExcluir}>Editar</Text>
          </TouchableOpacity>

          {/* Exclui a tarefa */}
          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => aoExcluir(tarefa.id)}
          >
            <Text style={styles.textoBotaoExcluir}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  // Área onde fica o texto
  textoContainer: {
    flex: 1,
    marginRight: 10,
  },

  // Texto normal
  texto: {
    fontSize: 16,
    color: "#222",
  },

  // Texto quando a tarefa está concluída
  textoConcluido: {
    textDecorationLine: "line-through",
    color: "#999",
  },

  // Campo de edição
  input: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    color: "#222",
    borderBottomWidth: 1,
    borderBottomColor: "#3498db",
    paddingVertical: 2,
  },

  // Área dos botões
  acoesEdicao: {
    flexDirection: "row",
    gap: 6,
  },

  // Botão excluir
  botaoExcluir: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  // Botão editar
  botaoEditar: {
    backgroundColor: "#3498db",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  // Botão salvar
  botaoSalvar: {
    backgroundColor: "#2ecc71",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  // Botão cancelar
  botaoCancelar: {
    backgroundColor: "#95a5a6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  // Texto dos botões
  textoBotaoExcluir: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});