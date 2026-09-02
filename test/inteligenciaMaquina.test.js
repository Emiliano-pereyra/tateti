import test from "node:test";
import assert from "node:assert/strict";

import { InteligenciaMaquina } from "../src/ia/inteligenciaMaquina.js";

test("la IA normal debe ganar si tiene un movimiento disponible", () => {
  const ia = new InteligenciaMaquina();

  ia.configurar("O");

  const tablero = [
    "O", "O", null,
    "X", "X", null,
    null, null, null,
  ];

  const movimiento = ia.obtenerMovimiento(
    "normal",
    tablero
  );

  assert.equal(movimiento, 2);
});