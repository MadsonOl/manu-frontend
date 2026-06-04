import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock do cliente HTTP para isolar o hook da rede e do Firebase.
vi.mock("../services/api", () => ({ default: { get: vi.fn() } }));
import api from "../services/api";
import { useChamados } from "../hooks/useChamados";

function criarWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

describe("useChamados", () => {
  beforeEach(() => vi.clearAllMocks());

  it("busca e retorna a lista de chamados", async () => {
    api.get.mockResolvedValue({ data: [{ id: "1", local: "Bloco A" }] });

    const { result } = renderHook(() => useChamados(), { wrapper: criarWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/chamados");
    expect(result.current.data).toEqual([{ id: "1", local: "Bloco A" }]);
  });

  it("expoe estado de erro quando a requisicao falha", async () => {
    api.get.mockRejectedValue(new Error("Falha na rede"));

    const { result } = renderHook(() => useChamados(), { wrapper: criarWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Falha na rede");
  });
});
