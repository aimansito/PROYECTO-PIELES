import React, { Component } from "react";
import Cabecera from "./components/Cabecera";
import ListaProductos from "./components/ListaProductos";
import Carrito from "./components/CarritoModal";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

class App extends Component {
  state = {
    productos: [],
    productosFiltrados: [],
    categoriaSeleccionada: null,
    carrito: [],
    modalCarrito: false,
    logged: false,
    usuarioActual: null,
    rol: null
  };

  componentDidMount() {
    this.cargarProductos();
  }

  cargarProductos = async () => {
    try {
      const API_URL = "http://localhost/server/productos.php";
      const response = await axios.get(API_URL);
      if (Array.isArray(response.data?.productos)) {
        this.setState({ productos: response.data.productos, productosFiltrados: response.data.productos });
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  setCategoriaSeleccionada = (idCategoria) => {
    const productosFiltrados = this.state.productos.filter(
      (producto) => producto.categoria_id === parseInt(idCategoria)
    );
    this.setState({ productosFiltrados, categoriaSeleccionada: idCategoria });
  };

  toggleCarrito = () => {
    this.setState({ modalCarrito: !this.state.modalCarrito });
  };

  agregarAlCarrito = (producto) => {
    if (!this.state.logged) return alert("Debes iniciar sesión para añadir productos.");

    const carritoActualizado = [...this.state.carrito];
    const productoExistente = carritoActualizado.find(p => p.id === producto.id);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carritoActualizado.push({ ...producto, cantidad: 1 });
    }

    this.setState({ carrito: carritoActualizado });
  };

  setLogged = (logged, usuarioActual = null, rol = null) => {
    this.setState({ logged, usuarioActual, rol });
  };

  render() {
    const { productosFiltrados, logged, usuarioActual, rol, modalCarrito, carrito } = this.state;

    return (
      <Router>
        <Cabecera 
          onLogin={this.setLogged} 
          logged={logged} 
          usuarioActual={usuarioActual} 
          rol={rol}
          toggleCarrito={this.toggleCarrito} 
          numProductosCarrito={carrito.length} 
          setCategoriaSeleccionada={this.setCategoriaSeleccionada}
        />

        <Routes>
          <Route
            path="/"
            element={
              <ListaProductos 
                productos={productosFiltrados} 
                agregarAlCarrito={this.agregarAlCarrito} 
                logged={logged}
              />
            }
          />
        </Routes>

        <Carrito 
          mostrar={modalCarrito} 
          toggle={this.toggleCarrito} 
          carrito={carrito} 
          usuarioActual={usuarioActual} 
        />
      </Router>
    );
  }
}

export default App;
