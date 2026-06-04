import { describe, it, expect } from "vitest";
import { onlyDigits, maskCPF, maskCNPJ, maskTelefone, maskCEP } from "../utils/masks";

describe("onlyDigits", () => {
  it("mantem apenas digitos", () => {
    expect(onlyDigits("12.345-67/ab")).toBe("1234567");
  });
  it("trata vazio, null e undefined", () => {
    expect(onlyDigits("")).toBe("");
    expect(onlyDigits(null)).toBe("");
    expect(onlyDigits(undefined)).toBe("");
  });
});

describe("maskCPF", () => {
  it("formata progressivamente", () => {
    expect(maskCPF("123")).toBe("123");
    expect(maskCPF("1234")).toBe("123.4");
    expect(maskCPF("1234567")).toBe("123.456.7");
    expect(maskCPF("52998224725")).toBe("529.982.247-25");
  });
  it("limita a 11 digitos e ignora nao-digitos", () => {
    expect(maskCPF("5299822472599999")).toBe("529.982.247-25");
    expect(maskCPF("a5b2c9")).toBe("529");
  });
  it("trata entrada vazia", () => {
    expect(maskCPF("")).toBe("");
  });
});

describe("maskCNPJ", () => {
  it("formata progressivamente", () => {
    expect(maskCNPJ("11")).toBe("11");
    expect(maskCNPJ("11222")).toBe("11.222");
    expect(maskCNPJ("11222333000181")).toBe("11.222.333/0001-81");
  });
  it("limita a 14 digitos", () => {
    expect(maskCNPJ("1122233300018199")).toBe("11.222.333/0001-81");
  });
});

describe("maskTelefone", () => {
  it("formata celular (11 digitos)", () => {
    expect(maskTelefone("11988887777")).toBe("(11) 98888-7777");
  });
  it("formata fixo (10 digitos)", () => {
    expect(maskTelefone("1133334444")).toBe("(11) 3333-4444");
  });
  it("formata parcial", () => {
    expect(maskTelefone("11")).toBe("11");
    expect(maskTelefone("119")).toBe("(11) 9");
  });
  it("limita a 11 digitos", () => {
    expect(maskTelefone("119888877779999")).toBe("(11) 98888-7777");
  });
});

describe("maskCEP", () => {
  it("formata 8 digitos", () => {
    expect(maskCEP("60000000")).toBe("60000-000");
  });
  it("formata parcial e limita", () => {
    expect(maskCEP("600")).toBe("600");
    expect(maskCEP("600000009999")).toBe("60000-000");
  });
});
