export const inputStyle = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text-1)",
  padding: "9px 12px",
  borderRadius: "var(--radius-md)",
  fontSize: 14,
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "var(--transition)",
};

export const labelStyle = {
  fontSize: 12,
  fontWeight: 500,
  color: "var(--text-2)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
  display: "block",
};

export const selectStyle = {
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text-1)",
  padding: "7px 12px",
  borderRadius: "var(--radius-md)",
  fontSize: 13,
  fontFamily: "var(--font-sans)",
  outline: "none",
};

export function handleFocus(e) {
  e.target.style.borderColor = "var(--primary)";
  e.target.style.boxShadow = "0 0 0 3px var(--primary-ring)";
}

export function handleBlur(e) {
  e.target.style.borderColor = "var(--border)";
  e.target.style.boxShadow = "none";
}
