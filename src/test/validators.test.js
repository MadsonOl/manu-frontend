import { describe, it, expect } from "vitest";
import { validarCPF, validarCNPJ, validarTelefone, validarEmail } from "../utils/validators";

describe("validarCPF", () => {
  it("aceita CPFs validos (com e sem mascara)", () => {
    expect(validarCPF("529.982.247-25")).toBe(true);
    expect(validarCPF("52998224725")).toBe(true);
    expect(validarCPF("111.444.777-35")).toBe(true);
  });
  it("rejeita digito verificador invalido", () => {
    expect(validarCPF("529.982.247-24")).toBe(false);
    expect(validarCPF("12345678900")).toBe(false);
  });
  it("rejeita sequencias repetidas e tamanho errado", () => {
    expect(validarCPF("111.111.111-11")).toBe(false);
    expect(validarCPF("000.000.000-00")).toBe(false);
    expect(validarCPF("123")).toBe(false);
    expect(validarCPF("")).toBe(false);
  });
});

describe("validarCNPJ", () => {
  it("aceita CNPJs validos (com e sem mascara)", () => {
    expect(validarCNPJ("11.222.333/0001-81")).toBe(true);
    expect(validarCNPJ("11222333000181")).toBe(true);
    expect(validarCNPJ("04.252.011/0001-10")).toBe(true);
  });
  it("rejeita digito verificador invalido e repetidos", () => {
    expect(validarCNPJ("11222333000100")).toBe(false);
    expect(validarCNPJ("11.111.111/1111-11")).toBe(false);
    expect(validarCNPJ("123")).toBe(false);
    expect(validarCNPJ("")).toBe(false);
  });
});

describe("validarTelefone", () => {
  it("aceita 10 e 11 digitos", () => {
    expect(validarTelefone("(11) 3333-4444")).toBe(true);
    expect(validarTelefone("(11) 98888-7777")).toBe(true);
  });
  it("rejeita tamanhos invalidos", () => {
    expect(validarTelefone("9999")).toBe(false);
    expect(validarTelefone("119888877779")).toBe(false);
    expect(validarTelefone("")).toBe(false);
  });
});

describe("validarEmail", () => {
  it("aceita e-mails validos", () => {
    expect(validarEmail("nome@exemplo.com")).toBe(true);
    expect(validarEmail("a.b-c@dominio.com.br")).toBe(true);
  });
  it("rejeita e-mails invalidos", () => {
    expect(validarEmail("a@b")).toBe(false);
    expect(validarEmail("sem-arroba.com")).toBe(false);
    expect(validarEmail("com espaco@x.com")).toBe(false);
    expect(validarEmail("")).toBe(false);
  });
});
