// compruebo estados, victorias, empates, quitar los puntos, reinicio y validación
import test from "node:test";
import assert from "node:assert/strict";

import { Marcador } from "../src/interfaz/marcador.js";

test("el marcador debe iniciar todos los resultados en cero", () => {
  const marcador = new Marcador();

  assert.deepEqual(marcador.obtenerResultados(), {
    X: 0,
    O: 0,
    empate: 0,
  });
});

test("debe registrar una victoria para X", () => {
  const marcador = new Marcador();

  marcador.registrarVictoria("X");

  assert.equal(marcador.obtenerResultados().X, 1);
  assert.equal(marcador.obtenerResultados().O, 0);
  assert.equal(marcador.obtenerResultados().empate, 0);
});

test("debe registrar un empate", () => {
  const marcador = new Marcador();

  marcador.registrarEmpate();

  assert.equal(marcador.obtenerResultados().empate, 1);
});

test("debe registrar correctamente una victoria mediante registrarResultado", () => {
  const marcador = new Marcador();

  marcador.registrarResultado("ganador", "O");

  assert.deepEqual(marcador.obtenerResultados(), {
    X: 0,
    O: 1,
    empate: 0,
  });
});

test("debe registrar correctamente un empate mediante registrarResultado", () => {
  const marcador = new Marcador();

  marcador.registrarResultado("empate");

  assert.deepEqual(marcador.obtenerResultados(), {
    X: 0,
    O: 0,
    empate: 1,
  });
});

test("debe anular una victoria registrada", () => {
  const marcador = new Marcador();

  marcador.registrarVictoria("X");
  marcador.anularResultado("ganador", "X");

  assert.equal(marcador.obtenerResultados().X, 0);
});

test("debe anular un empate registrado", () => {
  const marcador = new Marcador();

  marcador.registrarEmpate();
  marcador.anularResultado("empate");

  assert.equal(marcador.obtenerResultados().empate, 0);
});

test("no debe permitir resultados negativos al anular una victoria", () => {
  const marcador = new Marcador();

  marcador.anularResultado("ganador", "X");

  assert.equal(marcador.obtenerResultados().X, 0);
});

test("no debe permitir resultados negativos al anular un empate", () => {
  const marcador = new Marcador();

  marcador.anularResultado("empate");

  assert.equal(marcador.obtenerResultados().empate, 0);
});

test("debe ignorar un jugador inválido al registrar una victoria", () => {
  const marcador = new Marcador();

  marcador.registrarVictoria("Z");

  assert.deepEqual(marcador.obtenerResultados(), {
    X: 0,
    O: 0,
    empate: 0,
  });
});

test("reiniciar debe devolver todos los resultados a cero", () => {
  const marcador = new Marcador();

  marcador.registrarVictoria("X");
  marcador.registrarVictoria("O");
  marcador.registrarEmpate();

  marcador.reiniciar();

  assert.deepEqual(marcador.obtenerResultados(), {
    X: 0,
    O: 0,
    empate: 0,
  });
});

test("debe devolver las etiquetas correctas para cada columna", () => {
  const marcador = new Marcador();

  assert.equal(marcador.obtenerEtiqueta("X"), "Gana JX");
  assert.equal(marcador.obtenerEtiqueta("O"), "Gana JO");
  assert.equal(marcador.obtenerEtiqueta("empate"), "Empates");
});

test("debe devolver una etiqueta vacía para una columna desconocida", () => {
  const marcador = new Marcador();

  assert.equal(marcador.obtenerEtiqueta("Z"), "");
});
