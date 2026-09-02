export class JuegoTateti {
  constructor(tamanio = 3) {
    this.tamanio = tamanio;
    this.jugadores = ["X", "O"];

    this.reiniciar();
  }

  reiniciar(jugadorInicial = null) {
    this.tablero = Array(this.tamanio * this.tamanio).fill(null);

    this.jugadorInicial =
      jugadorInicial ?? this.obtenerJugadorInicialAleatorio();

    this.indiceJugadorActual = this.jugadores.indexOf(this.jugadorInicial);

    this.ganador = null;
    this.lineaGanadora = [];
    this.esEmpate = false;
    this.finalizado = false;
    this.historial = [];
  }

  obtenerJugadorInicialAleatorio() {
    return this.jugadores[Math.floor(Math.random() * this.jugadores.length)];
  }

  obtenerJugadorActual() {
    return this.jugadores[this.indiceJugadorActual];
  }

  obtenerResultado() {
    if (this.ganador) {
      return "ganador";
    }

    if (this.esEmpate) {
      return "empate";
    }

    return "jugando";
  }

  // Valido el movimiento permitido, se fija que jugador tiene el turno y procede (guarda mov para undo, actualiza tablero, etc)
  realizarMovimiento(indice) {
    if (!this.puedeRealizarMovimiento(indice)) {
      return false;
    }

    const jugador = this.obtenerJugadorActual();

    const tableroAnterior = [...this.tablero];
    const turnoAnterior = jugador;

    this.tablero[indice] = jugador;

    this.historial.push({
      indice,
      jugador,
      tableroAnterior,
      turnoAnterior,
    });

    this.evaluarMovimiento(indice, jugador);

    if (!this.finalizado) {
      this.cambiarTurno();
    }

    return true;
  }

  puedeRealizarMovimiento(indice) {
    return (
      Number.isInteger(indice) &&
      indice >= 0 &&
      indice < this.tablero.length &&
      !this.finalizado &&
      this.tablero[indice] === null
    );
  }

  cambiarTurno() {
    this.indiceJugadorActual =
      (this.indiceJugadorActual + 1) % this.jugadores.length;
  }

  evaluarMovimiento(indice, jugador) {
    const fila = Math.floor(indice / this.tamanio);
    const columna = indice % this.tamanio;

    const lineas = this.obtenerLineas(fila, columna);

    const lineaGanadora = lineas.find((linea) =>
      linea.every((indiceCelda) => this.tablero[indiceCelda] === jugador),
    );

    if (lineaGanadora) {
      this.ganador = jugador;
      this.lineaGanadora = lineaGanadora;
      this.finalizado = true;
      return;
    }

    if (this.tablero.every(Boolean)) {
      this.esEmpate = true;
      this.finalizado = true;
    }
  }

  obtenerLineas(fila, columna) {
    const lineas = [this.obtenerFila(fila), this.obtenerColumna(columna)];

    if (fila === columna) {
      lineas.push(this.obtenerDiagonalPrincipal());
    }

    if (fila + columna === this.tamanio - 1) {
      lineas.push(this.obtenerDiagonalSecundaria());
    }

    return lineas;
  }

  obtenerFila(fila) {
    return Array.from(
      { length: this.tamanio },
      (_, indice) => fila * this.tamanio + indice,
    );
  }

  obtenerColumna(columna) {
    return Array.from(
      { length: this.tamanio },
      (_, indice) => indice * this.tamanio + columna,
    );
  }

  obtenerDiagonalPrincipal() {
    return Array.from(
      { length: this.tamanio },
      (_, indice) => indice * this.tamanio + indice,
    );
  }

  obtenerDiagonalSecundaria() {
    return Array.from(
      { length: this.tamanio },
      (_, indice) => indice * this.tamanio + (this.tamanio - 1 - indice),
    );
  }

  deshacerMovimiento() {
    const ultimoMovimiento = this.historial.pop();

    if (!ultimoMovimiento) {
      return false;
    }

    this.tablero = [...ultimoMovimiento.tableroAnterior];

    this.indiceJugadorActual = this.jugadores.indexOf(ultimoMovimiento.jugador);

    this.ganador = null;
    this.lineaGanadora = [];
    this.esEmpate = false;
    this.finalizado = false;

    return true;
  }

  obtenerEstado() {
    return {
      tablero: [...this.tablero],
      jugadorActual: this.obtenerJugadorActual(),
      jugadorInicial: this.jugadorInicial,
      ganador: this.ganador,
      lineaGanadora: [...this.lineaGanadora],
      esEmpate: this.esEmpate,
      finalizado: this.finalizado,
      resultado: this.obtenerResultado(),
    };
  }
}
