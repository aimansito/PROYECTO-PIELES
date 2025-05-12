// src/App.js
import React, { Component } from "react";
import Cabecera from "./components/Cabecera";
import ListaProductos from "./components/ListaProductos";
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
    logged: false,
    usuarioActual: null,
  };

  componentDidMount() {
    this.cargarProductos();
  }

  cargarProductos = async () => {
    try {
      const API_URL = "http://localhost/server/productos.php";
      const response = await axios.get(API_URL);

      if (Array.isArray(response.data?.productos)) {
        const productosMezclados = this.mezclarArray(response.data.productos);
        this.setState({
          productos: productosMezclados,
          productosFiltrados: productosMezclados, // Inicialmente todos los productos
        });
      } else {
        console.error("La respuesta no contiene un array de productos.");
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  mezclarArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  setCategoriaSeleccionada = (categoriaId) => {
    this.setState({ categoriaSeleccionada: categoriaId }, this.filtrarProductos);
  };

  filtrarProductos = () => {
    const { productos, categoriaSeleccionada } = this.state;

    if (categoriaSeleccionada) {
      const productosFiltrados = productos.filter(
        (producto) => producto.categoria_id === parseInt(categoriaSeleccionada)
      );
      this.setState({ productosFiltrados });
    } else {
      this.setState({ productosFiltrados: productos });
    }
  };

  setLogged = (logged, usuarioActual = null) => {
    this.setState({ logged, usuarioActual });
  };

  render() {
    const { productosFiltrados, logged, usuarioActual } = this.state;

    return (
      <Router>
        <Cabecera 
          onCategoriaSeleccionada={this.setCategoriaSeleccionada} 
          logged={logged} 
          usuarioActual={usuarioActual} 
          setLogged={this.setLogged} 
        />
        <Routes>
          <Route
            path="/"
            element={
              <ListaProductos 
                productos={productosFiltrados} 
              />
            }
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
