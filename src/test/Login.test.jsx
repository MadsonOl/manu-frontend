import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockLogin, mockNavigate } = vi.hoisted(() => ({ mockLogin: vi.fn(), mockNavigate: vi.fn() }));
vi.mock("../contexts/AuthContext", () => ({ useAuth: () => ({ login: mockLogin }) }));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});
import Login from "../pages/Login";

function renderLogin() {
  return render(<MemoryRouter><Login /></MemoryRouter>);
}

function preencher() {
  fireEvent.change(screen.getByPlaceholderText("seu@email.com"), { target: { value: "g@x.com" } });
  fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "secret" } });
}

describe("Login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("navega para /dashboard no sucesso", async () => {
    mockLogin.mockResolvedValue({});
    renderLogin();
    preencher();
    fireEvent.click(screen.getByRole("button", { name: /^entrar$/i }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dashboard"));
  });

  it("mostra 'Senha incorreta' para auth/invalid-credential e nao navega", async () => {
    mockLogin.mockRejectedValue({ code: "auth/invalid-credential" });
    renderLogin();
    preencher();
    fireEvent.click(screen.getByRole("button", { name: /^entrar$/i }));
    await waitFor(() => expect(screen.getByText("Senha incorreta")).toBeInTheDocument());
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("mostra mensagem generica para erro desconhecido", async () => {
    mockLogin.mockRejectedValue({ code: "auth/network-request-failed" });
    renderLogin();
    preencher();
    fireEvent.click(screen.getByRole("button", { name: /^entrar$/i }));
    await waitFor(() => expect(screen.getByText("Erro ao fazer login. Tente novamente.")).toBeInTheDocument());
  });
});
