import test from "node:test";
import assert from "node:assert/strict";

import { JuegoTateti } from "../src/reglas/juegoTateti.js";

test("debe iniciar una partida con tablero vacío", () => {
  const juego = new JuegoTateti();

  assert.equal(juego.tablero.length, 9);
  assert.ok(juego.tablero.every((celda) => celda === null));
  assert.equal(juego.finalizado, false);
});

test("debe permitir realizar un movimiento válido", () => {
  const juego = new JuegoTateti();

  juego.reiniciar("X");

  const resultado = juego.realizarMovimiento(0);

  assert.equal(resultado, true);
  assert.equal(juego.tablero[0], "X");
});

test("no debe permitir ocupar una celda utilizada", () => {
  const juego = new JuegoTateti();

  juego.reiniciar("X");

  juego.realizarMovimiento(0);

  assert.equal(juego.realizarMovimiento(0), false);
});

test("debe detectar una victoria horizontal", () => {
  const juego = new JuegoTateti();

  juego.reiniciar("X");

  juego.realizarMovimiento(0); // X
  juego.realizarMovimiento(3); // O
  juego.realizarMovimiento(1); // X
  juego.realizarMovimiento(4); // O
  juego.realizarMovimiento(2); // X

  assert.equal(juego.ganador, "X");
  assert.equal(juego.finalizado, true);
  assert.deepEqual(juego.lineaGanadora, [0, 1, 2]);
});

test("debe permitir deshacer el último movimiento", () => {
  const juego = new JuegoTateti();

  juego.reiniciar("X");

  juego.realizarMovimiento(0);

  assert.equal(juego.tablero[0], "X");

  juego.deshacerMovimiento();

  assert.equal(juego.tablero[0], null);
  assert.equal(juego.finalizado, false);
});
