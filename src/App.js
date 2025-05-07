import React, { Component } from "react";
import Cabecera from "./components/Cabecera";
import ListaProductos from "./components/ListaProductos";
import axios from "axios";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      categoriaSeleccionada: null,
      carrito: [],
      logged: false,
      usuarioActual: null,
    };
  }

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
          loading: false 
        });
      }
    } catch (error) {
      // Manejo de errores
    }
  };
  
  // Función para mezclar array (añadir en App.js)
  mezclarArray = (array) => {
    const nuevoArray = [...array];
    for (let i = nuevoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
    }
    return nuevoArray;
  };

  setCategoriaSeleccionada = (categoria) => {
    this.setState({ categoriaSeleccionada: categoria });
  };

  render() {
    const { productos, categoriaSeleccionada } = this.state;

    return (
      <Router>
        <Cabecera setCategoriaSeleccionada={this.setCategoriaSeleccionada} />
        <Routes>
          <Route
            path="/"
            element={
              <ListaProductos productos={productos} categoriaSeleccionada={categoriaSeleccionada} />
            }
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
