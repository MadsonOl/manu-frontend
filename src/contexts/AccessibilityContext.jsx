/* eslint-disable react-refresh/only-export-components --
   Colocacao intencional do hook useAccessibility e das constantes (FONT_SCALES,
   CB_MODES) com o provider. O aviso e apenas sobre HMR/fast-refresh. */
import { createContext, useContext, useEffect, useState } from "react";

/*
 * Provider de preferencias de acessibilidade.
 *
 * Centraliza as escolhas do usuario (alto contraste e escala de texto),
 * persiste em localStorage e as aplica no elemento <html>:
 *   - alto contraste -> atributo data-theme="hc" (tokens sobrescritos no CSS);
 *   - escala de fonte -> font-size inline em % no <html> (texto em rem escala).
 *
 * Mantido fora dos demais contexts para valer em todas as rotas (publicas e
 * privadas), inclusive antes do login.
 */

const STORAGE_KEY = "manu:a11y";

// Passos discretos de escala de texto expostos ao usuario (WCAG 1.4.4).
export const FONT_SCALES = [100, 125, 150, 200];

/*
 * Paletas seguras por tipo de daltonismo. A paleta padrao ja e compativel com
 * WCAG 1.4.1 (cor nunca e o unico indicador: badges trazem icone + texto).
 * Estas opcoes remapeiam os tons de status/prioridade para combinacoes
 * distinguiveis em cada deficiencia, via [data-cb] no <html> (ver index.css).
 */
export const CB_MODES = [
  { value: "none", label: "Padrao" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" },
  { value: "achromatopsia", label: "Acromatopsia" },
];

const CB_VALUES = CB_MODES.map((m) => m.value);

const AccessibilityContext = createContext(null);

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility precisa estar dentro de AccessibilityProvider");
  }
  return ctx;
}

function lerPreferencias() {
  // Le do localStorage; na ausencia, herda preferencias do sistema operacional.
  try {
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (salvo) {
      return {
        highContrast: Boolean(salvo.highContrast),
        fontScale: FONT_SCALES.includes(salvo.fontScale) ? salvo.fontScale : 100,
        colorblind: CB_VALUES.includes(salvo.colorblind) ? salvo.colorblind : "none",
      };
    }
  } catch {
    /* JSON invalido: cai no padrao abaixo */
  }
  const prefereContraste =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-contrast: more)").matches;
  return { highContrast: Boolean(prefereContraste), fontScale: 100, colorblind: "none" };
}

export function AccessibilityProvider({ children }) {
  const [highContrast, setHighContrast] = useState(() => lerPreferencias().highContrast);
  const [fontScale, setFontScale] = useState(() => lerPreferencias().fontScale);
  const [colorblind, setColorblind] = useState(() => lerPreferencias().colorblind);

  // Aplica o tema de alto contraste no <html> e persiste a escolha.
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.setAttribute("data-theme", "hc");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [highContrast]);

  // Aplica a escala de texto no <html> e persiste a escolha.
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
  }, [fontScale]);

  // Aplica a paleta de daltonismo no <html> (none => sem atributo).
  useEffect(() => {
    const root = document.documentElement;
    if (colorblind && colorblind !== "none") {
      root.setAttribute("data-cb", colorblind);
    } else {
      root.removeAttribute("data-cb");
    }
  }, [colorblind]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ highContrast, fontScale, colorblind }));
    } catch {
      /* localStorage indisponivel (modo privado): ignora a persistencia */
    }
  }, [highContrast, fontScale, colorblind]);

  const value = {
    highContrast,
    fontScale,
    colorblind,
    toggleHighContrast: () => setHighContrast((v) => !v),
    setFontScale,
    setColorblind,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}
