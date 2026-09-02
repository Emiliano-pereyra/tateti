import { EstrategiaFacil } from "./estrategias/estrategiaFacil.js";
import { EstrategiaNormal } from "./estrategias/estrategiaNormal.js";
import { EstrategiaDificil } from "./estrategias/estrategiaDificil.js";

export class InteligenciaMaquina {
  constructor() {
    this.jugadorMaquina = "O";
    this.jugadorHumano = "X";

    this.estrategias = new Map([
      ["facil", new EstrategiaFacil()],
      ["normal", new EstrategiaNormal()],
      ["dificil", new EstrategiaDificil()],
    ]);
  }

  configurar(jugadorMaquina) {
    this.jugadorMaquina = jugadorMaquina;
    this.jugadorHumano = jugadorMaquina === "X" ? "O" : "X";
  }

  obtenerMovimiento(dificultad, tablero) {
    const estrategia = this.estrategias.get(dificultad);

    if (!estrategia) {
      throw new Error(`Dificultad de IA no soportada: ${dificultad}`);
    }

    return estrategia.obtenerMovimiento(
      tablero,
      this.jugadorMaquina,
      this.jugadorHumano,
    );
  }
}
