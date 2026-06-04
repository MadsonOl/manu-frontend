import "@testing-library/jest-dom";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

// Matcher de acessibilidade (axe) disponivel em todos os testes.
expect.extend(toHaveNoViolations);
