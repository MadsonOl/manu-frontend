/*
 * Traducao de erros de requisicao em mensagens claras e especificas para a UI,
 * sem expor detalhes internos. Modulo puro (sem dependencias de rede/Firebase)
 * para ser facilmente testavel. Cobre: cold start (timeout), ausencia de
 * conexao, sessao expirada, nao encontrado, dados invalidos e erro de servidor.
 */
export function mensagemDeErro(error) {
  if (error?.code === "ECONNABORTED" || /timeout/i.test(error?.message || "")) {
    return "O servidor demorou a responder. Ele pode estar reativando apos um periodo ocioso - tente novamente em instantes.";
  }
  if (!error?.response) {
    return "Nao foi possivel conectar ao servidor. Verifique sua conexao e tente novamente.";
  }
  const status = error.response.status;
  if (status === 401 || status === 403) return "Sessao expirada. Faca login novamente.";
  if (status === 404) return "Registro nao encontrado.";
  if (status === 400 || status === 422) {
    const msg = error.response.data?.message || error.response.data?.erro;
    return msg || "Dados invalidos. Verifique os campos e tente novamente.";
  }
  if (status >= 500) return "O servidor encontrou um erro. Tente novamente mais tarde.";
  return "Ocorreu um erro inesperado. Tente novamente.";
}
