// En orden las acciones que realiza son ganar, bloquear, centro, esquinas, movimiento aleatorio
export class EstrategiaNormal {
  obtenerMovimiento(tablero, jugadorMaquina, jugadorHumano) {
    const movimientos = this.obtenerMovimientosDisponibles(tablero);

    if (!movimientos.length) {
      return null;
    }

    const movimientoGanador = this.buscarMovimientoGanador(
      tablero,
      jugadorMaquina,
    );

    if (movimientoGanador !== null) {
      return movimientoGanador;
    }

    const movimientoBloqueo = this.buscarMovimientoGanador(
      tablero,
      jugadorHumano,
    );

    if (movimientoBloqueo !== null) {
      return movimientoBloqueo;
    }

    if (movimientos.includes(4)) {
      return 4;
    }

    const esquinas = [0, 2, 6, 8].filter((indice) =>
      movimientos.includes(indice),
    );

    if (esquinas.length) {
      return esquinas[Math.floor(Math.random() * esquinas.length)];
    }

    return movimientos[Math.floor(Math.random() * movimientos.length)];
  }

  obtenerMovimientosDisponibles(tablero) {
    return tablero
      .map((valor, indice) => (valor === null ? indice : null))
      .filter((indice) => indice !== null);
  }

  buscarMovimientoGanador(tablero, jugador) {
    for (const indice of this.obtenerMovimientosDisponibles(tablero)) {
      const tableroSimulado = [...tablero];

      tableroSimulado[indice] = jugador;

      if (this.evaluarTablero(tableroSimulado) === jugador) {
        return indice;
      }
    }

    return null;
  }

  evaluarTablero(tablero) {
    const lineas = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lineas) {
      if (
        tablero[a] &&
        tablero[a] === tablero[b] &&
        tablero[a] === tablero[c]
      ) {
        return tablero[a];
      }
    }

    return tablero.every(Boolean) ? "empate" : null;
  }
}
