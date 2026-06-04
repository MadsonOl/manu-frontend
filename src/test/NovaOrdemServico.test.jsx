import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockMutate, mockNavigate, mockShowToast } = vi.hoisted(() => ({
  mockMutate: vi.fn(), mockNavigate: vi.fn(), mockShowToast: vi.fn(),
}));
vi.mock("../hooks/useProfissionais", () => ({
  useProfissionais: () => ({ data: [{ id: "p1", nome: "Carlos" }], isLoading: false, isError: false, refetch: vi.fn() }),
}));
vi.mock("../hooks/useEmpresas", () => ({
  useEmpresas: () => ({ data: [{ id: "e1", nome: "Acme" }], isLoading: false, isError: false, refetch: vi.fn() }),
}));
vi.mock("../hooks/useOrdens", () => ({ useCriarOrdem: () => ({ mutate: mockMutate, isPending: false }) }));
vi.mock("../contexts/ToastContext", () => ({ useToast: () => ({ showToast: mockShowToast }) }));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});
import NovaOrdemServico from "../pages/NovaOrdemServico";

const chamado = { id: "c1", local: "Bloco A", descricao: "Vazamento", prioridade: "ALTA", solicitante: "Maria", empresa_id: "e1" };

function renderNova() {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/ordens-servico/nova", state: { chamado } }]}>
      <NovaOrdemServico />
    </MemoryRouter>
  );
}

describe("NovaOrdemServico", () => {
  beforeEach(() => vi.clearAllMocks());

  it("pre-preenche os campos a partir do chamado de origem", () => {
    renderNova();
    expect(screen.getByDisplayValue("Bloco A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Vazamento")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Maria")).toBeInTheDocument();
  });

  it("envia o payload com profissional e chamado_id e navega no sucesso", async () => {
    renderNova();
    // Selects sem label associada: [0] Prioridade, [1] Empresa, [2] Responsavel.
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[2], { target: { value: "Carlos" } });
    fireEvent.click(screen.getByRole("button", { name: /cadastrar os/i }));

    expect(mockMutate).toHaveBeenCalledTimes(1);
    const [payload, opcoes] = mockMutate.mock.calls[0];
    expect(payload).toEqual({
      local: "Bloco A",
      descricao: "Vazamento",
      prioridade: "ALTA",
      solicitante: "Maria",
      profissional: "Carlos",
      chamado_id: "c1",
      empresa_id: "e1",
    });

    // O sucesso da mutation mostra toast e navega para a lista.
    opcoes.onSuccess();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/ordens-servico"));
    expect(mockShowToast).toHaveBeenCalledWith("Ordem de serviço criada com sucesso", "success");
  });

  it("exibe a mensagem de erro especifica no banner quando a criacao falha", async () => {
    renderNova();
    fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "Carlos" } });
    fireEvent.click(screen.getByRole("button", { name: /cadastrar os/i }));

    const { onError } = mockMutate.mock.calls[0][1];
    onError(new Error("Sessao expirada"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Sessao expirada"));
  });
});
