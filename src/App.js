import React, { Component } from "react";
import Cabecera from "./components/Cabecera";
import Productos from "./components/Productos";

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoriaSeleccionada: null,
      carrito: [],
      logged: false,
      usuarioActual: null,
    };
  }

  setCategoriaSeleccionada = (categoria) => {
    this.setState({ categoriaSeleccionada: categoria });
  };

  modificarCarrito = (productoId, nombre, precio, cantidad) => {
    this.setState((prevState) => {
      let nuevoCarrito = prevState.carrito.map((e) => ({ ...e }));

      let productoEnCarrito = nuevoCarrito.find((e) => e.id === productoId);

      if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;

        if (productoEnCarrito.cantidad <= 0) {
          nuevoCarrito = nuevoCarrito.filter((e) => e.id !== productoId);
        }
      } else {
        if (cantidad > 0) {
          precio = precio ? parseFloat(precio) : 0; 
          nuevoCarrito.push({
            id: productoId,
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
          });
        }
      }

      console.log("Carrito actualizado:", nuevoCarrito);
      return { carrito: nuevoCarrito };
    });
  };

  setLogged = (estado, usuario = null) => {
    console.log("Usuario recibido en setLogged:", usuario);
    this.setState({ logged: estado, usuarioActual: usuario });
  };

  render() {
    return (
      <Router>
        <Cabecera
          setCategoriaSeleccionada={this.setCategoriaSeleccionada}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Productos
                categoriaSeleccionada={this.state.categoriaSeleccionada}
                modificarCarrito={this.modificarCarrito}
              />
            }
          />
        </Routes>
      </Router>
    );
  }
}

export default App;