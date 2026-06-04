import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PrivateRoute from "../components/PrivateRoute";

// Mock dinamico: cada teste configura o retorno de useAuth para exercitar os
// tres ramos da guarda de rota (carregando / nao autenticado / autenticado).
const { mockUseAuth } = vi.hoisted(() => ({ mockUseAuth: vi.fn() }));
vi.mock("../contexts/AuthContext", () => ({ useAuth: () => mockUseAuth() }));
vi.mock("../components/Layout", () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock("../components/PageLoader", () => ({ default: () => <div>Carregando sessao</div> }));

function renderRota() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<PrivateRoute><div>Conteudo protegido</div></PrivateRoute>} />
        <Route path="/login" element={<div>Pagina de Login</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("PrivateRoute", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redireciona para /login quando usuario nao autenticado", () => {
    mockUseAuth.mockReturnValue({ usuario: null, carregando: false });
    renderRota();
    expect(screen.getByText("Pagina de Login")).toBeInTheDocument();
  });

  it("renderiza o conteudo protegido quando autenticado", () => {
    mockUseAuth.mockReturnValue({ usuario: { uid: "x" }, carregando: false });
    renderRota();
    expect(screen.getByText("Conteudo protegido")).toBeInTheDocument();
    expect(screen.queryByText("Pagina de Login")).not.toBeInTheDocument();
  });

  it("mostra o loader enquanto a sessao carrega, sem redirecionar", () => {
    mockUseAuth.mockReturnValue({ usuario: null, carregando: true });
    renderRota();
    expect(screen.getByText("Carregando sessao")).toBeInTheDocument();
    expect(screen.queryByText("Pagina de Login")).not.toBeInTheDocument();
  });
});
