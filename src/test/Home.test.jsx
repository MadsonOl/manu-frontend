import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Isola da rede: o formulario publico de chamado usa axios diretamente.
vi.mock("axios", () => ({ default: { post: vi.fn() } }));
import axios from "axios";
import Home from "../pages/Home";

function renderHome() {
  return render(<MemoryRouter><Home /></MemoryRouter>);
}

function preencher() {
  fireEvent.change(screen.getByPlaceholderText("Ex: Bloco A, Sala 101"), { target: { value: "Bloco A" } });
  fireEvent.change(screen.getByPlaceholderText("Descreva o problema..."), { target: { value: "Vazamento" } });
  fireEvent.change(screen.getByPlaceholderText("Seu nome"), { target: { value: "Maria" } });
}

describe("Home - formulario publico de chamado", () => {
  beforeEach(() => vi.clearAllMocks());

  it("envia o chamado com o payload correto e mostra sucesso", async () => {
    axios.post.mockResolvedValue({ data: { id: "1" } });
    renderHome();
    preencher();
    fireEvent.click(screen.getByRole("button", { name: /enviar chamado/i }));

    await waitFor(() => expect(screen.getByText("Chamado aberto com sucesso!")).toBeInTheDocument());
    expect(axios.post).toHaveBeenCalledTimes(1);
    const [url, payload, config] = axios.post.mock.calls[0];
    expect(url).toContain("/chamados");
    expect(payload).toEqual({ local: "Bloco A", descricao: "Vazamento", prioridade: "NORMAL", solicitante: "Maria" });
    expect(config).toMatchObject({ timeout: 75000 });
    expect(screen.getByRole("button", { name: /abrir novo chamado/i })).toBeInTheDocument();
  });

  it("mantem os campos preenchidos e nao mostra sucesso quando o envio falha", async () => {
    axios.post.mockRejectedValue({ response: { status: 422, data: { message: "Dados invalidos" } } });
    renderHome();
    preencher();
    fireEvent.click(screen.getByRole("button", { name: /enviar chamado/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText("Chamado aberto com sucesso!")).not.toBeInTheDocument()
    );
    expect(screen.getByPlaceholderText("Ex: Bloco A, Sala 101").value).toBe("Bloco A");
  });
});
