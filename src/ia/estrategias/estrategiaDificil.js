// busca usando minimax los movimientos para "nunca" perder
export class EstrategiaDificil {
    obtenerMovimiento(
      tablero,
      jugadorMaquina,
      jugadorHumano,
    ) {
      let mejorPuntaje = -Infinity;
      let mejorMovimiento = null;
  
      for (const indice of this.obtenerMovimientosDisponibles(tablero)) {
        tablero[indice] = jugadorMaquina;
  
        const puntaje = this.minimax(
          tablero,
          jugadorHumano,
          jugadorMaquina,
          jugadorHumano,
          0,
        );
  
        tablero[indice] = null;
  
        if (puntaje > mejorPuntaje) {
          mejorPuntaje = puntaje;
          mejorMovimiento = indice;
        }
      }
  
      return mejorMovimiento;
    }
  
    minimax(
      tablero,
      jugador,
      jugadorMaquina,
      jugadorHumano,
      profundidad,
    ) {
      const resultado = this.evaluarTablero(tablero);
  
      if (resultado === jugadorMaquina) {
        return 10 - profundidad;
      }
  
      if (resultado === jugadorHumano) {
        return profundidad - 10;
      }
  
      if (resultado === "empate") {
        return 0;
      }
  
      const movimientos =
        this.obtenerMovimientosDisponibles(tablero);
  
      const puntajes = [];
  
      for (const indice of movimientos) {
        tablero[indice] = jugador;
  
        const siguienteJugador =
          jugador === jugadorMaquina
            ? jugadorHumano
            : jugadorMaquina;
  
        const puntaje = this.minimax(
          tablero,
          siguienteJugador,
          jugadorMaquina,
          jugadorHumano,
          profundidad + 1,
        );
  
        tablero[indice] = null;
  
        puntajes.push(puntaje);
      }
  
      return jugador === jugadorMaquina
        ? Math.max(...puntajes)
        : Math.min(...puntajes);
    }
  
    obtenerMovimientosDisponibles(tablero) {
      return tablero
        .map((valor, indice) =>
          valor === null ? indice : null,
        )
        .filter((indice) => indice !== null);
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
  
      return tablero.every(Boolean)
        ? "empate"
        : null;
    }
  }