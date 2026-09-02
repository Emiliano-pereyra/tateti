// separo la funcion del boton repetir ultima partida
export class HistorialPartida {
  constructor() {
    this.ultimaPartida = null;
  }

  guardar(partida) {
    this.ultimaPartida = {
      movimientos: [...partida.movimientos],
      jugadorInicial: partida.jugadorInicial,
    };
  }

  obtener() {
    return this.ultimaPartida;
  }

  existe() {
    return Boolean(this.ultimaPartida);
  }

  limpiar() {
    this.ultimaPartida = null;
  }
}
