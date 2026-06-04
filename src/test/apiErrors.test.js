import { describe, it, expect } from "vitest";
import { mensagemDeErro } from "../services/apiErrors";

describe("mensagemDeErro", () => {
  it("timeout / cold start", () => {
    expect(mensagemDeErro({ code: "ECONNABORTED" })).toMatch(/reativando/i);
    expect(mensagemDeErro({ message: "timeout of 75000ms exceeded" })).toMatch(/reativando/i);
  });

  it("sem resposta (offline)", () => {
    expect(mensagemDeErro({})).toMatch(/conectar ao servidor/i);
    expect(mensagemDeErro(undefined)).toMatch(/conectar ao servidor/i);
  });

  it("sessao expirada (401/403)", () => {
    expect(mensagemDeErro({ response: { status: 401 } })).toMatch(/sessao expirada/i);
    expect(mensagemDeErro({ response: { status: 403 } })).toMatch(/sessao expirada/i);
  });

  it("nao encontrado (404)", () => {
    expect(mensagemDeErro({ response: { status: 404 } })).toMatch(/nao encontrado/i);
  });

  it("dados invalidos (400/422) usa mensagem do servidor quando houver", () => {
    expect(mensagemDeErro({ response: { status: 400, data: {} } })).toMatch(/dados invalidos/i);
    expect(mensagemDeErro({ response: { status: 422, data: { message: "CNPJ ja cadastrado" } } }))
      .toBe("CNPJ ja cadastrado");
    expect(mensagemDeErro({ response: { status: 400, data: { erro: "Campo obrigatorio" } } }))
      .toBe("Campo obrigatorio");
  });

  it("erro de servidor (5xx)", () => {
    expect(mensagemDeErro({ response: { status: 500 } })).toMatch(/servidor encontrou um erro/i);
    expect(mensagemDeErro({ response: { status: 503 } })).toMatch(/servidor encontrou um erro/i);
  });

  it("fallback para status inesperado", () => {
    expect(mensagemDeErro({ response: { status: 418 } })).toMatch(/erro inesperado/i);
  });
});
