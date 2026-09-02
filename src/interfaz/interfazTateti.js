import { JuegoTateti } from "../reglas/juegoTateti.js";
import { InteligenciaMaquina } from "../ia/inteligenciaMaquina.js";
import { Marcador } from "./marcador.js";
import { Modal } from "./modal.js";
import { HistorialPartida } from "../servicios/historialPartida.js";

export class InterfazTateti {
  constructor(elementoRaiz) {
    this.elementoRaiz = elementoRaiz;
    this.juego = new JuegoTateti();
    this.marcador = new Marcador();
    this.historialPartida = new HistorialPartida();
    this.ia = new InteligenciaMaquina();

    this.reproduciendo = false;
    this.esperandoIA = false;
    this.resultadoYaRegistrado = false;
    this.movimientosActuales = [];

    this.configurarElementos();
    this.modal = new Modal(this.elementos.modal);
    this.crearTablero();
    this.configurarIA();
    this.configurarEventos();
    this.iniciarPartida();
  }

  configurarElementos() {
    const raiz = this.elementoRaiz;

    this.elementos = {
      tablero: raiz.querySelector("#tablero"),
      panelResultado: raiz.querySelector("#panel-resultado"),
      tituloResultado: raiz.querySelector("#titulo-resultado"),
      mensajeResultado: raiz.querySelector("#mensaje-resultado"),
      nombreJugadorX: raiz.querySelector("#nombre-jugador-x"),
      nombreJugadorO: raiz.querySelector("#nombre-jugador-o"),
      selectorModo: raiz.querySelector("#selector-modo"),
      selectorDificultad: raiz.querySelector("#selector-dificultad"),
      contenedorDificultad: raiz.querySelector("#contenedor-dificultad"),
      botonReiniciar: raiz.querySelector("#boton-reiniciar"),
      botonReiniciarPrincipal: raiz.querySelector("#boton-reiniciar-principal"),
      botonRepetir: raiz.querySelector("#boton-repetir"),
      botonDeshacer: raiz.querySelector("#boton-deshacer"),
      marcadorX: raiz.querySelector("#marcador-x"),
      marcadorO: raiz.querySelector("#marcador-o"),
      marcadorEmpates: raiz.querySelector("#marcador-empate"),
      marcadorNombreX: raiz.querySelector("#marcador-nombre-x"),
      marcadorNombreO: raiz.querySelector("#marcador-nombre-o"),
      modal: raiz.querySelector("#modal-resultado"),
      barraJuego: raiz.querySelector(".barra-juego"),
    };
  }

  crearTablero() {
    const fragmento = document.createDocumentFragment();
    const total = this.juego.tablero.length;

    for (let indice = 0; indice < total; indice++) {
      const celda = document.createElement("button");
      celda.type = "button";
      celda.className = "celda";
      celda.dataset.indice = String(indice);
      celda.setAttribute("role", "gridcell");
      celda.setAttribute("aria-label", `Celda ${indice + 1}`);
      fragmento.appendChild(celda);
    }

    this.elementos.tablero.replaceChildren(fragmento);
  }

  configurarEventos() {
    this.elementos.tablero.addEventListener("click", (evento) =>
      this.manejarMovimiento(evento),
    );
    
    this.elementos.botonReiniciar.addEventListener("click", () =>
      this.iniciarPartida(),
    );

    this.elementos.botonReiniciarPrincipal?.addEventListener("click", () =>
      this.iniciarPartida(),
    );

    this.elementos.botonRepetir.addEventListener("click", () =>
      this.repetirPartida(),
    );

    this.elementos.botonDeshacer.addEventListener("click", () =>
      this.deshacerMovimiento(),
    );

    this.elementos.selectorModo.addEventListener("change", () =>
      this.cambiarModo(),
    );

    this.elementos.selectorDificultad?.addEventListener("change", () =>
      this.cambiarDificultad(),
    );

    this.elementos.nombreJugadorX.addEventListener("change", () =>
      this.cambiarConfiguracion(),
    );

    this.elementos.nombreJugadorO.addEventListener("change", () =>
      this.cambiarConfiguracion(),
    );
  }

  configurarIA() {
    this.ia.configurar("O");
  }

  esModoMaquina() {
    return this.elementos.selectorModo.value === "maquina";
  }

  obtenerDificultad() {
    return this.elementos.selectorDificultad?.value ?? "normal";
  }

  obtenerNombre(simbolo) {
    const campo =
      simbolo === "X"
        ? this.elementos.nombreJugadorX
        : this.elementos.nombreJugadorO;
    return campo.value.trim();
  }

  obtenerCodigoJugador(simbolo) {
    return simbolo === "X" ? "JX" : "JO";
  }

  obtenerTituloTurno(simbolo) {
    const nombre = this.obtenerNombre(simbolo);
    if (!nombre) {
      return `Turno de jugador ${simbolo}`;
    }
    return `Turno de ${nombre} (${this.obtenerCodigoJugador(simbolo)})`;
  }

  obtenerEtiquetaJugador(simbolo) {
    const nombre = this.obtenerNombre(simbolo);
    if (!nombre) {
      return simbolo;
    }
    return `${nombre} (${simbolo})`;
  }

  obtenerMensajeVictoria(simbolo) {
    return `Ganó ${this.obtenerEtiquetaJugador(simbolo)}`;
  }

  iniciarPartida(jugadorInicial = null) {
    this.reproduciendo = false;
    this.esperandoIA = false;
    this.resultadoYaRegistrado = false;
    this.movimientosActuales = [];

    this.juego.reiniciar(jugadorInicial);
    this.modal.cerrar();
    this.actualizarVista();
    this.intentarTurnoMaquina();
  }

  manejarMovimiento(evento) {
    if (this.reproduciendo || this.esperandoIA || this.juego.finalizado) {
      return;
    }

    const celda = evento.target;
    if (!celda || !this.elementos.tablero.contains(celda)) {
      return;
    }

    const indice = Number(celda.dataset.indice);

    if (this.esModoMaquina() && this.juego.obtenerJugadorActual() === "O") {
      return;
    }

    this.aplicarMovimiento(indice);
    this.intentarTurnoMaquina();
  }

  aplicarMovimiento(indice) {
    const seRealizo = this.juego.realizarMovimiento(indice);
    if (!seRealizo) {
      return false;
    }

    this.movimientosActuales.push(indice);
    this.actualizarVista();
    this.procesarFinDePartida();
    return true;
  }

  intentarTurnoMaquina() {
    if (
      !this.esModoMaquina() ||
      this.juego.finalizado ||
      this.reproduciendo ||
      this.juego.obtenerJugadorActual() !== "O"
    ) {
      return;
    }

    this.esperandoIA = true;
    this.actualizarControles();

    window.setTimeout(() => {
      if (
        !this.esModoMaquina() ||
        this.juego.finalizado ||
        this.juego.obtenerJugadorActual() !== "O"
      ) {
        this.esperandoIA = false;
        this.actualizarControles();
        return;
      }

      const indice = this.ia.obtenerMovimiento(this.obtenerDificultad(), [
        ...this.juego.tablero,
      ]);

      this.esperandoIA = false;

      if (indice !== null && indice !== undefined) {
        this.aplicarMovimiento(indice);
      } else {
        this.actualizarVista();
      }
    }, 350);
  }

  deshacerMovimiento() {
    if (this.reproduciendo || this.esperandoIA) {
      return;
    }
    if (!this.juego.historial.length) {
      return;
    }
    if (this.resultadoYaRegistrado) {
      this.marcador.anularResultado(
        this.juego.obtenerResultado(),
        this.juego.ganador,
      );
      this.resultadoYaRegistrado = false;
    }
    this.juego.deshacerMovimiento();
    this.movimientosActuales.pop();
    this.modal.cerrar();
    this.actualizarVista();
  }

  cambiarModo() {
    this.actualizarBarraControles();
    this.iniciarPartida();
  }

  actualizarBarraControles() {
    const contraMaquina = this.esModoMaquina();

    if (this.elementos.contenedorDificultad) {
      this.elementos.contenedorDificultad.hidden = !contraMaquina;
    }

    this.elementos.barraJuego?.classList.toggle(
      "barra-juego--con-dificultad",
      contraMaquina,
    );
  }

  cambiarDificultad() {
    this.iniciarPartida();
  }

  cambiarConfiguracion() {
    this.actualizarNombres();
    this.actualizarPanel();
  }

  repetirPartida() {
    const partida = this.historialPartida.obtener();
    if (!partida) {
      return;
    }

    this.reproduciendo = true;
    this.esperandoIA = false;
    this.resultadoYaRegistrado = true;
    this.movimientosActuales = [];
    this.juego.reiniciar(partida.jugadorInicial);
    this.modal.cerrar();
    this.actualizarVista();

    partida.movimientos.forEach((indice, orden) => {
       const timerId = window.setTimeout(
        () => {
          this.juego.realizarMovimiento(indice);
          this.movimientosActuales.push(indice);
          this.actualizarVista();

          if (orden === partida.movimientos.length - 1) {
            this.reproduciendo = false;
            this.actualizarControles();
            this.mostrarModalResultado();
          }
        },
        450 * (orden + 1),
      );
      
    });   
  }

  procesarFinDePartida() {
    if (
      !this.juego.finalizado ||
      this.resultadoYaRegistrado ||
      this.reproduciendo
    ) {
      return;
    }

    this.resultadoYaRegistrado = true;

    const resultado = this.juego.obtenerResultado();
    this.marcador.registrarResultado(resultado, this.juego.ganador);

    this.historialPartida.guardar({
      movimientos: [...this.movimientosActuales],
      jugadorInicial: this.juego.jugadorInicial,
    });

    this.actualizarMarcador();
    this.actualizarControles();
    this.mostrarModalResultado();
  }

  mostrarModalResultado() {
    const { ganador, esEmpate } = this.juego.obtenerEstado();

    if (esEmpate) {
      this.modal.abrir("Empate", "La partida terminó sin ganador.", "empate");
      return;
    }

    if (ganador) {
      this.modal.abrir(this.obtenerMensajeVictoria(ganador), "", "victoria");
    }
  }

  actualizarVista() {
    this.actualizarTablero();
    this.actualizarPanel();
    this.actualizarNombres();
    this.actualizarMarcador();
    this.actualizarControles();
  }

  actualizarTablero() {
    const estado = this.juego.obtenerEstado();
    const celdas = this.elementos.tablero.querySelectorAll("[data-indice]");

    celdas.forEach((celda) => {
      const indice = Number(celda.dataset.indice);
      const valor = estado.tablero[indice];
      const esGanadora = estado.lineaGanadora.includes(indice);

      celda.textContent = valor ?? "";
      celda.classList.toggle("celda-x", valor === "X");
      celda.classList.toggle("celda-o", valor === "O");
      celda.classList.toggle("celda-ganadora", esGanadora);
      celda.disabled =
        Boolean(valor) ||
        estado.finalizado ||
        this.reproduciendo ||
        this.esperandoIA;
    });
  }

  actualizarPanel() {
    const estado = this.juego.obtenerEstado();
    const panel = this.elementos.panelResultado;
    const clasesEstado = [
      "estado-turno-x",
      "estado-turno-o",
      "estado-ganador-x",
      "estado-ganador-o",
      "estado-empate",
    ];

    panel.classList.remove(...clasesEstado);

    if (estado.esEmpate) {
      panel.classList.add("estado-empate");
      this.elementos.tituloResultado.textContent = "Empate";
      this.elementos.mensajeResultado.textContent =
        "No quedan movimientos disponibles.";
      return;
    }

    if (estado.ganador) {
      const mensajeVictoria = this.obtenerMensajeVictoria(estado.ganador);
      panel.classList.add(
        estado.ganador === "X" ? "estado-ganador-x" : "estado-ganador-o",
      );
      this.elementos.tituloResultado.textContent = mensajeVictoria;
      this.elementos.mensajeResultado.textContent = mensajeVictoria;
      return;
    }

    const actual = estado.jugadorActual;
    const partidaSinMovimientos = this.juego.historial.length === 0;
    panel.classList.add(actual === "X" ? "estado-turno-x" : "estado-turno-o");
    this.elementos.tituloResultado.textContent =
      this.obtenerTituloTurno(actual);
    this.elementos.mensajeResultado.textContent = partidaSinMovimientos
      ? `${estado.jugadorInicial} comienza la partida.`
      : "Seleccione la casilla donde hacer su movimiento.";
  }

  actualizarNombres() {
    if (this.elementos.marcadorNombreX) {
      this.elementos.marcadorNombreX.textContent =
        this.marcador.obtenerEtiqueta("X");
    }
    if (this.elementos.marcadorNombreEmpate) {
      this.elementos.marcadorNombreEmpate.textContent =
        this.marcador.obtenerEtiqueta("empate");
    }
    if (this.elementos.marcadorNombreO) {
      this.elementos.marcadorNombreO.textContent =
        this.marcador.obtenerEtiqueta("O");
    }
  }

  actualizarMarcador() {
    const puntos = this.marcador.obtenerResultados();
    this.elementos.marcadorX.textContent = String(puntos.X);
    this.elementos.marcadorEmpates.textContent = String(puntos.empate);
    this.elementos.marcadorO.textContent = String(puntos.O);
  }

  actualizarControles() {
    this.elementos.botonDeshacer.disabled =
      this.reproduciendo ||
      this.esperandoIA ||
      this.juego.historial.length === 0;
    this.elementos.botonRepetir.disabled =
      this.reproduciendo || !this.historialPartida.existe();
  }
}
