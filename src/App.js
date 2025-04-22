import React, { Component } from "react";
import Cabecera from "./componentes/Cabecera";
import MainProductos from "./componentes/MainProductos";
import Login from "./componentes/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

        // Si la cantidad es 0 o menor, elimina el producto del carrito
        if (productoEnCarrito.cantidad <= 0) {
          nuevoCarrito = nuevoCarrito.filter((e) => e.id !== productoId);
        }
      } else {
        if (cantidad > 0) {
          // Verifica que el precio sea válido antes de agregar el producto
          precio = precio ? precio : 0;
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
        <Routes>
          {!this.state.logged ? (
            <Route path="*" element={<Login setLogged={this.setLogged} />} />
          ) : (
            <>
              <Route
                path="/"
                element={
                  <>
                    <Cabecera
                      setCategoriaSeleccionada={this.setCategoriaSeleccionada}
                      carrito={this.state.carrito}
                      modificarCarrito={this.modificarCarrito}
                      usuarioActual={this.state.usuarioActual}
                    />
                    <MainProductos
                      categoriaSeleccionada={this.state.categoriaSeleccionada}
                      modificarCarrito={this.modificarCarrito}
                    />
                  </>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    );
  }
}

export default App;
