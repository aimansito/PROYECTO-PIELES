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
    categoriaSeleccionada: null
  };

  componentDidMount() {
    this.cargarProductos();
  }

  cargarProductos = async () => {
    try {
      const response = await axios.get("http://localhost/server/productos.php");
      this.setState({ productos: response.data.productos, productosFiltrados: response.data.productos });
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  setCategoriaSeleccionada = (categoriaId) => {
    const productosFiltrados = this.state.productos.filter(prod => prod.id_categoria === categoriaId);
    this.setState({ productosFiltrados });
  };

  render() {
    const { productosFiltrados } = this.state;

    return (
      <Router>
        <Cabecera setCategoriaSeleccionada={this.setCategoriaSeleccionada} />
        <Routes>
          <Route path="/" element={<ListaProductos productos={productosFiltrados} />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
