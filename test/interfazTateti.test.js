// compruebo configuracion, interacciones, estado de la partida, cartel con mensaje, marcador y modos de juegos
import test from "node:test";
import assert from "node:assert/strict";

import { InterfazTateti } from "../src/interfaz/interfazTateti.js";
import { JuegoTateti } from "../src/reglas/juegoTateti.js";
import { Marcador } from "../src/interfaz/marcador.js";

class ElementoFalso {
  constructor(valor = "") {
    this.value = valor;
    this.textContent = "";
    this.hidden = false;
    this.disabled = false;
    this.classList = {
      clases: new Set(),

      add: (...clases) => {
        clases.forEach((clase) => {
          this.classList.clases.add(clase);
        });
      },

      remove: (...clases) => {
        clases.forEach((clase) => {
          this.classList.clases.delete(clase);
        });
      },

      toggle: (clase, activo) => {
        if (activo) {
          this.classList.clases.add(clase);
        } else {
          this.classList.clases.delete(clase);
        }
      },

      contains: (clase) => this.classList.clases.has(clase),
    };
  }
}

function crearInterfazDePrueba() {
  const interfaz = Object.create(InterfazTateti.prototype);

  interfaz.juego = new JuegoTateti();
  interfaz.marcador = new Marcador();

  interfaz.reproduciendo = false;
  interfaz.esperandoIA = false;
  interfaz.resultadoYaRegistrado = false;
  interfaz.movimientosActuales = [];

  interfaz.elementos = {
    tablero: {
      querySelectorAll: () => [],
    },

    panelResultado: new ElementoFalso(),
    tituloResultado: new ElementoFalso(),
    mensajeResultado: new ElementoFalso(),

    nombreJugadorX: new ElementoFalso(),
    nombreJugadorO: new ElementoFalso(),

    selectorModo: new ElementoFalso("jugadores"),
    selectorDificultad: new ElementoFalso("normal"),

    contenedorDificultad: new ElementoFalso(),
    barraJuego: new ElementoFalso(),

    botonDeshacer: new ElementoFalso(),
    botonRepetir: new ElementoFalso(),

    marcadorX: new ElementoFalso(),
    marcadorO: new ElementoFalso(),
    marcadorEmpates: new ElementoFalso(),

    marcadorNombreX: new ElementoFalso(),
    marcadorNombreO: new ElementoFalso(),
  };

  interfaz.modal = {
    abrir() {},
    cerrar() {},
  };

  interfaz.historialPartida = {
    existe: () => false,
    obtener: () => null,
    guardar() {},
  };

  interfaz.ia = {
    configurar() {},
    obtenerMovimiento() {
      return null;
    },
  };

  return interfaz;
}

test("debe identificar correctamente el modo de dos jugadores", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.elementos.selectorModo.value = "jugadores";

  assert.equal(interfaz.esModoMaquina(), false);
});

test("debe identificar correctamente el modo contra máquina", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.elementos.selectorModo.value = "maquina";

  assert.equal(interfaz.esModoMaquina(), true);
});

test("debe obtener la dificultad seleccionada", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.elementos.selectorDificultad.value = "dificil";

  assert.equal(interfaz.obtenerDificultad(), "dificil");
});

test("debe obtener el nombre del jugador X sin espacios innecesarios", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.elementos.nombreJugadorX.value = "  Emiliano  ";

  assert.equal(interfaz.obtenerNombre("X"), "Emiliano");
});

test("debe obtener el código correcto de cada jugador", () => {
  const interfaz = crearInterfazDePrueba();

  assert.equal(interfaz.obtenerCodigoJugador("X"), "JX");
  assert.equal(interfaz.obtenerCodigoJugador("O"), "JO");
});

test("debe generar el título del turno utilizando el nombre del jugador", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.elementos.nombreJugadorX.value = "Emiliano";

  assert.equal(interfaz.obtenerTituloTurno("X"), "Turno de Emiliano (JX)");
});

test("debe utilizar el símbolo cuando el jugador no tiene nombre", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.elementos.nombreJugadorX.value = "";

  assert.equal(interfaz.obtenerTituloTurno("X"), "Turno de jugador X");
});

test("debe generar correctamente el mensaje de victoria", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.elementos.nombreJugadorX.value = "Emiliano";

  assert.equal(interfaz.obtenerMensajeVictoria("X"), "Ganó Emiliano (X)");
});

test("debe iniciar una partida reiniciando el estado de la interfaz", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.reproduciendo = true;
  interfaz.esperandoIA = true;
  interfaz.resultadoYaRegistrado = true;
  interfaz.movimientosActuales = [0, 1, 2];

  interfaz.iniciarPartida("X");

  assert.equal(interfaz.reproduciendo, false);
  assert.equal(interfaz.esperandoIA, false);
  assert.equal(interfaz.resultadoYaRegistrado, false);
  assert.deepEqual(interfaz.movimientosActuales, []);

  assert.equal(interfaz.juego.jugadorInicial, "X");
  assert.equal(
    interfaz.juego.tablero.every((celda) => celda === null),
    true,
  );
});

test("debe aplicar un movimiento válido al juego", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.juego.reiniciar("X");

  const resultado = interfaz.aplicarMovimiento(0);

  assert.equal(resultado, true);
  assert.equal(interfaz.juego.tablero[0], "X");
  assert.deepEqual(interfaz.movimientosActuales, [0]);
});

test("no debe registrar un movimiento inválido", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.juego.reiniciar("X");
  interfaz.aplicarMovimiento(0);

  const resultado = interfaz.aplicarMovimiento(0);

  assert.equal(resultado, false);
  assert.deepEqual(interfaz.movimientosActuales, [0]);
});

test("debe actualizar el marcador visual con los resultados actuales", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.marcador.registrarVictoria("X");
  interfaz.marcador.registrarVictoria("O");
  interfaz.marcador.registrarEmpate();

  interfaz.actualizarMarcador();

  assert.equal(interfaz.elementos.marcadorX.textContent, "1");
  assert.equal(interfaz.elementos.marcadorO.textContent, "1");
  assert.equal(interfaz.elementos.marcadorEmpates.textContent, "1");
});

test("debe mostrar el turno de X en el panel cuando comienza la partida", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.juego.reiniciar("X");
  interfaz.actualizarPanel();

  assert.equal(
    interfaz.elementos.tituloResultado.textContent,
    "Turno de jugador X",
  );

  assert.equal(
    interfaz.elementos.mensajeResultado.textContent,
    "X comienza la partida.",
  );

  assert.equal(
    interfaz.elementos.panelResultado.classList.contains("estado-turno-x"),
    true,
  );
});

test("debe mostrar el turno de O después de un movimiento de X", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.juego.reiniciar("X");
  interfaz.juego.realizarMovimiento(0);

  interfaz.actualizarPanel();

  assert.equal(
    interfaz.elementos.tituloResultado.textContent,
    "Turno de jugador O",
  );

  assert.equal(
    interfaz.elementos.panelResultado.classList.contains("estado-turno-o"),
    true,
  );
});

test("debe actualizar los nombres mostrados en el marcador", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.actualizarNombres();

  assert.equal(interfaz.elementos.marcadorNombreX.textContent, "Gana JX");

  assert.equal(interfaz.elementos.marcadorNombreO.textContent, "Gana JO");
});

test("debe mostrar la dificultad únicamente cuando se juega contra la máquina", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.elementos.selectorModo.value = "maquina";

  interfaz.actualizarBarraControles();

  assert.equal(interfaz.elementos.contenedorDificultad.hidden, false);
  assert.equal(
    interfaz.elementos.barraJuego.classList.contains(
      "barra-juego--con-dificultad",
    ),
    true,
  );
});

test("debe ocultar la dificultad en el modo de dos jugadores", () => {
  const interfaz = crearInterfazDePrueba();

  interfaz.elementos.selectorModo.value = "jugadores";

  interfaz.actualizarBarraControles();

  assert.equal(interfaz.elementos.contenedorDificultad.hidden, true);
  assert.equal(
    interfaz.elementos.barraJuego.classList.contains(
      "barra-juego--con-dificultad",
    ),
    false,
  );
});
