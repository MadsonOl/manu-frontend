import { inputStyle, labelStyle } from "./InputStyles";

/*
 * Campo de formulario acessivel e reutilizavel. Garante:
 *   - rotulo associado ao controle por htmlFor/id (WCAG 1.3.1);
 *   - indicacao de obrigatorio: asterisco visual + aria-required (WCAG 3.3.2);
 *   - mensagem de erro inline associada por aria-describedby, com aria-invalid
 *     e role="alert" para anuncio por leitores de tela (WCAG 3.3.1).
 *
 * Suporta input (padrao), textarea (type="textarea") e select (type="select",
 * passando as <option> via children).
 */
export default function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  required = false,
  error = "",
  placeholder,
  inputMode,
  autoComplete,
  maxLength,
  children,
}) {
  const aria = {
    id,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-erro` : undefined,
  };

  const baseStyle = {
    ...inputStyle,
    borderColor: error ? "var(--alta)" : "var(--border)",
  };

  function aoFocar(e) {
    e.target.style.borderColor = "var(--primary)";
    e.target.style.boxShadow = "0 0 0 3px var(--primary-ring)";
  }
  function aoDesfocar(e) {
    e.target.style.borderColor = error ? "var(--alta)" : "var(--border)";
    e.target.style.boxShadow = "none";
    onBlur?.(e);
  }

  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: "var(--alta)", marginLeft: 3 }}>*</span>
        )}
      </label>

      {type === "textarea" ? (
        <textarea
          {...aria}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={aoFocar}
          onBlur={aoDesfocar}
          placeholder={placeholder}
          required={required}
          style={{ ...baseStyle, minHeight: 80, resize: "vertical" }}
        />
      ) : type === "select" ? (
        <select
          {...aria}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={aoFocar}
          onBlur={aoDesfocar}
          required={required}
          style={baseStyle}
        >
          {children}
        </select>
      ) : (
        <input
          {...aria}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={aoFocar}
          onBlur={aoDesfocar}
          placeholder={placeholder}
          required={required}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          style={baseStyle}
        />
      )}

      {error && (
        <span
          id={`${id}-erro`}
          role="alert"
          style={{ display: "block", marginTop: 6, fontSize: "var(--fs-12)", color: "var(--alta)" }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
