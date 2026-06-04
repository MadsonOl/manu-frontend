import { useEffect, useId, useRef, useState } from "react";
import { Accessibility, Contrast, Check } from "lucide-react";
import { useAccessibility, FONT_SCALES, CB_MODES } from "../contexts/AccessibilityContext";
import { PriorityBadge, StatusBadge } from "./ui/Badge";

/*
 * Controle de acessibilidade exibido no cabecalho (local visivel e presente em
 * todas as paginas). Padrao "disclosure": um botao abre um painel com:
 *   - alternancia de alto contraste (botao com aria-pressed);
 *   - escala de texto (radiogroup com navegacao por setas/Home/End).
 *
 * Totalmente operavel por teclado: Tab alcanca o gatilho, Enter/Espaco abre,
 * Esc fecha e devolve o foco ao gatilho, clique externo fecha.
 */
export default function AccessibilityMenu() {
  const { highContrast, toggleHighContrast, fontScale, setFontScale, colorblind, setColorblind } = useAccessibility();
  const [open, setOpen] = useState(false);
  const painelId = useId();
  const triggerRef = useRef(null);
  const painelRef = useRef(null);

  // Fecha ao clicar fora ou ao pressionar Esc (devolvendo o foco ao gatilho).
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e) {
      if (
        !painelRef.current?.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Acessibilidade"
        title="Acessibilidade"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={painelId}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          background: open ? "var(--surface-hover)" : "transparent",
          border: "none",
          borderRadius: "var(--radius-md)",
          color: "var(--text-2)",
          cursor: "pointer",
          transition: "var(--transition)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-hover)"; e.currentTarget.style.color = "var(--text-1)"; }}
        onMouseLeave={(e) => { if (!open) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-2)"; } }}
      >
        <Accessibility size={18} />
      </button>

      {open && (
        <div
          ref={painelRef}
          id={painelId}
          role="dialog"
          aria-label="Preferencias de acessibilidade"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 200,
            // Largura em rem (e nao px) para acompanhar a escala de fonte do <html>
            // e evitar overflow do texto em 150/200%; maxWidth impede que o painel
            // ultrapasse a viewport no mobile, deixando o conteudo quebrar linha.
            width: "15.5rem",
            maxWidth: "calc(100vw - 24px)",
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            animation: "fadeIn 0.15s ease",
          }}
        >
          {/* Alto contraste */}
          <div>
            <span style={legendStyle}>Contraste</span>
            <button
              type="button"
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                minHeight: 44,
                padding: "0 12px",
                background: highContrast ? "var(--primary-muted)" : "var(--surface-2)",
                border: `1px solid ${highContrast ? "var(--primary)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                color: highContrast ? "var(--primary)" : "var(--text-1)",
                fontSize: "var(--fs-13)",
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                transition: "var(--transition)",
              }}
            >
              <Contrast size={16} aria-hidden="true" />
              <span style={{ flex: 1, textAlign: "left" }}>Alto contraste</span>
              {highContrast && <Check size={16} aria-hidden="true" />}
            </button>
          </div>

          {/* Escala de texto */}
          <div>
            <span id={`${painelId}-fonte`} style={legendStyle}>Tamanho do texto</span>
            <div
              role="radiogroup"
              aria-labelledby={`${painelId}-fonte`}
              style={{ display: "flex", gap: 6 }}
            >
              {FONT_SCALES.map((escala) => {
                const ativo = fontScale === escala;
                return (
                  <button
                    key={escala}
                    type="button"
                    role="radio"
                    aria-checked={ativo}
                    tabIndex={ativo ? 0 : -1}
                    onClick={() => setFontScale(escala)}
                    onKeyDown={(e) => handleRadioKey(e, escala, setFontScale)}
                    style={{
                      flex: 1,
                      minHeight: 44,
                      padding: "0 4px",
                      background: ativo ? "var(--primary-strong)" : "var(--surface-2)",
                      border: `1px solid ${ativo ? "var(--primary-strong)" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)",
                      color: ativo ? "#fff" : "var(--text-1)",
                      fontSize: "var(--fs-12)",
                      fontWeight: ativo ? 600 : 500,
                      fontFamily: "var(--font-sans)",
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                  >
                    {escala}%
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paleta para daltonismo */}
          <div>
            <label htmlFor={`${painelId}-cb`} style={legendStyle}>Daltonismo</label>
            <select
              id={`${painelId}-cb`}
              value={colorblind}
              onChange={(e) => setColorblind(e.target.value)}
              style={{
                width: "100%",
                minHeight: 44,
                padding: "0 10px",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-1)",
                fontSize: "var(--fs-13)",
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
              }}
            >
              {CB_MODES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            {/*
              Previa ao vivo das cores de prioridade/status. Como os badges usam
              os mesmos tokens que a paleta sobrescreve, eles mudam de cor na
              hora ao trocar o tipo de daltonismo - prova visual imediata,
              independente da tela em que o usuario esteja.
            */}
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              <PriorityBadge value="ALTA" />
              <PriorityBadge value="NORMAL" />
              <PriorityBadge value="BAIXA" />
              <StatusBadge value="ATENDIMENTO" />
              <StatusBadge value="FINALIZADO" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const legendStyle = {
  display: "block",
  fontSize: "var(--fs-11)",
  fontWeight: 600,
  color: "var(--text-2)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 8,
};

// Navegacao por teclado do radiogroup (setas movem e selecionam; Home/End vao aos extremos).
function handleRadioKey(e, atual, setFontScale) {
  const idx = FONT_SCALES.indexOf(atual);
  let proximo = null;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    proximo = FONT_SCALES[(idx + 1) % FONT_SCALES.length];
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    proximo = FONT_SCALES[(idx - 1 + FONT_SCALES.length) % FONT_SCALES.length];
  } else if (e.key === "Home") {
    proximo = FONT_SCALES[0];
  } else if (e.key === "End") {
    proximo = FONT_SCALES[FONT_SCALES.length - 1];
  }
  if (proximo !== null) {
    e.preventDefault();
    setFontScale(proximo);
    // Move o foco para o radio recem-selecionado (roving tabindex).
    const botoes = e.currentTarget.parentElement.querySelectorAll('[role="radio"]');
    botoes[FONT_SCALES.indexOf(proximo)]?.focus();
  }
}
