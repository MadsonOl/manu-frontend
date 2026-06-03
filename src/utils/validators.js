import { onlyDigits } from "./masks";

/*
 * Validadores de campos brasileiros. CPF/CNPJ conferem os digitos
 * verificadores (DV), nao apenas o formato, rejeitando numeros invalidos.
 */

/** E-mail em formato valido. */
export const validarEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());

/** Telefone fixo (10) ou celular (11 digitos). */
export const validarTelefone = (v) => {
  const d = onlyDigits(v);
  return d.length === 10 || d.length === 11;
};

/** CPF com digitos verificadores validos. */
export function validarCPF(v) {
  const c = onlyDigits(v);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += +c[i] * (10 - i);
  let dv1 = 11 - (soma % 11);
  if (dv1 >= 10) dv1 = 0;
  if (dv1 !== +c[9]) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += +c[i] * (11 - i);
  let dv2 = 11 - (soma % 11);
  if (dv2 >= 10) dv2 = 0;
  return dv2 === +c[10];
}

/** CNPJ com digitos verificadores validos. */
export function validarCNPJ(v) {
  const c = onlyDigits(v);
  if (c.length !== 14 || /^(\d)\1{13}$/.test(c)) return false;

  const dv = (len) => {
    const pesos =
      len === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < len; i++) soma += +c[i] * pesos[i];
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return dv(12) === +c[12] && dv(13) === +c[13];
}
