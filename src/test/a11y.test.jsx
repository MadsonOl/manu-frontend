import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";

import Field from "../components/ui/Field";
import Modal from "../components/Modal";
import ErrorState from "../components/ui/ErrorState";
import ColdStartBanner from "../components/ui/ColdStartBanner";
import { PriorityBadge, StatusBadge } from "../components/ui/Badge";

/*
 * Testes de acessibilidade automatizados (axe). Protegem contra regressoes nas
 * regras de ARIA/semantica dos componentes-chave. O contraste de cor nao e
 * checado em jsdom (sem layout) e foi validado a parte por calculo de luminancia.
 */
describe("Acessibilidade (axe)", () => {
  it("Field nao tem violacoes (com erro associado)", async () => {
    const { container } = render(
      <Field id="cpf" label="CPF" value="123" onChange={() => {}} required error="CPF invalido." />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Modal aberto nao tem violacoes", async () => {
    const { container } = render(
      <Modal isOpen title="Detalhes" onClose={() => {}}>
        <p>Conteudo do dialogo</p>
      </Modal>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ErrorState nao tem violacoes", async () => {
    const { container } = render(<ErrorState message="Falhou" onRetry={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ColdStartBanner nao tem violacoes", async () => {
    const { container } = render(<ColdStartBanner />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Badges de prioridade e status nao tem violacoes", async () => {
    const { container } = render(
      <div>
        <PriorityBadge value="ALTA" />
        <PriorityBadge value="NORMAL" />
        <PriorityBadge value="BAIXA" />
        <StatusBadge value="EM_ATENDIMENTO" />
        <StatusBadge value="FINALIZADO" />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
