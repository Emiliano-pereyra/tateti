// Solo realiza movimientos aleatorios
export class EstrategiaFacil {
  obtenerMovimiento(tablero) {
    const movimientos = this.obtenerMovimientosDisponibles(tablero);

    if (!movimientos.length) {
      return null;
    }

    return movimientos[Math.floor(Math.random() * movimientos.length)];
  }

  obtenerMovimientosDisponibles(tablero) {
    return tablero
      .map((valor, indice) => (valor === null ? indice : null))
      .filter((indice) => indice !== null);
  }
}
