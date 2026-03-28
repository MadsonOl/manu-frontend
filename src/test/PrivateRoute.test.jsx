import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import PrivateRoute from "../components/PrivateRoute";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ usuario: null, carregando: false }),
}));

vi.mock("../components/Layout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

describe("PrivateRoute", () => {
  it("redireciona para /login quando usuario nao autenticado", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div>Conteudo protegido</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={<div>Pagina de Login</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Pagina de Login")).toBeInTheDocument();
  });
});
