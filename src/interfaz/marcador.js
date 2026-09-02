export class Marcador {
  constructor() {
    this.reiniciar();
  }

  reiniciar() {
    this.resultados = {
      X: 0,
      O: 0,
      empate: 0,
    };
  }

  registrarVictoria(jugador) {
    if (!Object.hasOwn(this.resultados, jugador) || jugador === "empate") {
      return;
    }

    this.resultados[jugador] += 1;
  }

  registrarEmpate() {
    this.resultados.empate += 1;
  }

  registrarResultado(resultado, ganador) {
    if (resultado === "ganador") {
      this.registrarVictoria(ganador);
      return;
    }

    if (resultado === "empate") {
      this.registrarEmpate();
    }
  }

  anularResultado(resultado, ganador) {
    if (resultado === "ganador" && Object.hasOwn(this.resultados, ganador)) {
      this.resultados[ganador] = Math.max(0, this.resultados[ganador] - 1);
      return;
    }

    if (resultado === "empate") {
      this.resultados.empate = Math.max(0, this.resultados.empate - 1);
    }
  }

  obtenerResultados() {
    return { ...this.resultados };
  }

  obtenerEtiqueta(columna) {
    const etiquetas = {
      X: "Gana JX",
      O: "Gana JO",
      empate: "Empates",
    };

    return etiquetas[columna] ?? "";
  }
}
