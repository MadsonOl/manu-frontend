import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Field from "../components/ui/Field";

describe("Field (acessibilidade)", () => {
  it("associa o label ao controle e marca campo obrigatorio", () => {
    render(<Field id="cpf" label="CPF" value="" onChange={() => {}} required />);
    const input = screen.getByLabelText(/CPF/);
    expect(input).toBeInTheDocument();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("expoe erro com role=alert e o associa via aria-describedby", () => {
    render(<Field id="cpf" label="CPF" value="123" onChange={() => {}} error="CPF invalido." />);
    const input = screen.getByLabelText(/CPF/);
    expect(input).toHaveAttribute("aria-invalid", "true");
    const alerta = screen.getByRole("alert");
    expect(alerta).toHaveTextContent("CPF invalido.");
    expect(input).toHaveAttribute("aria-describedby", alerta.id);
  });

  it("nao marca aria-invalid quando nao ha erro", () => {
    render(<Field id="nome" label="Nome" value="" onChange={() => {}} />);
    expect(screen.getByLabelText(/Nome/)).not.toHaveAttribute("aria-invalid");
  });

  it("dispara onChange com o novo valor ao digitar", () => {
    const onChange = vi.fn();
    render(<Field id="nome" label="Nome" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Nome/), { target: { value: "Maria" } });
    expect(onChange).toHaveBeenCalledWith("Maria");
  });

  it("renderiza textarea e select conforme o type", () => {
    const { rerender } = render(
      <Field id="obs" label="Observacoes" type="textarea" value="" onChange={() => {}} />
    );
    expect(screen.getByLabelText(/Observacoes/).tagName).toBe("TEXTAREA");

    rerender(
      <Field id="uf" label="UF" type="select" value="" onChange={() => {}}>
        <option value="">Selecione</option>
        <option value="CE">CE</option>
      </Field>
    );
    expect(screen.getByLabelText(/UF/).tagName).toBe("SELECT");
  });
});
