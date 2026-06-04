import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ useChamados: vi.fn(), navigate: vi.fn() }));
vi.mock("../hooks/useChamados", () => ({
  useChamados: () => h.useChamados(),
  useExcluirChamado: () => ({ mutate: vi.fn() }),
}));
vi.mock("../contexts/ToastContext", () => ({ useToast: () => ({ showToast: vi.fn() }) }));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => h.navigate };
});
import Chamados from "../pages/Chamados";

function renderChamados() {
  return render(<MemoryRouter><Chamados /></MemoryRouter>);
}

describe("Chamados", () => {
  beforeEach(() => vi.clearAllMocks());

  it("mostra o estado de erro com a mensagem da API", () => {
    h.useChamados.mockReturnValue({ data: [], isLoading: false, isError: true, error: { message: "Falha ao carregar" }, refetch: vi.fn() });
    renderChamados();
    expect(screen.getByText("Falha ao carregar")).toBeInTheDocument();
  });

  it("mostra o estado vazio quando nao ha chamados", () => {
    h.useChamados.mockReturnValue({ data: [], isLoading: false, isError: false, refetch: vi.fn() });
    renderChamados();
    expect(screen.getByText("Nenhum registro encontrado")).toBeInTheDocument();
  });

  it("lista os chamados e navega para Nova OS com o chamado no state", () => {
    const chamado = { id: "c1", data: "01/01/2026", local: "Bloco A", descricao: "Vazamento", prioridade: "NORMAL", solicitante: "Maria" };
    h.useChamados.mockReturnValue({ data: [chamado], isLoading: false, isError: false, refetch: vi.fn() });
    renderChamados();

    expect(screen.getByText("Bloco A")).toBeInTheDocument();
    fireEvent.click(screen.getByTitle("Gerar OS"));
    expect(h.navigate).toHaveBeenCalledWith("/ordens-servico/nova", { state: { chamado } });
  });
});
