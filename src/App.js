import React, { Component } from "react";
import Cabecera from "./components/Cabecera";
import ListaProductos from "./components/ListaProductos";
import axios from "axios";

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

  cargarProductos = () => {
    const API_URL = "http://localhost/server/productos.php";

    axios
      .get(API_URL)
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        if (Array.isArray(response.data.productos)) {
          // Registra las URLs de imágenes para depuración
          console.log("URLs de imágenes recibidas:", 
            response.data.productos.map(p => p.imagen_url));
          
          this.setState({
            productos: response.data.productos,
          });
        }
      }    
      )
  };

  handleImageError = (id, url) => {
    console.error(`Error cargando imagen para producto ID ${id}: ${url}`);
    this.setState(prevState => ({
      imageErrors: {
        ...prevState.imageErrors,
        [id]: url
      }
    }));
  };

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
    let productShow = this.state.productos;

    return (
      <Router>
        <Cabecera
          setCategoriaSeleccionada={this.setCategoriaSeleccionada}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ListaProductos
                productos={productShow}
              />
            }
          />
        </Routes>
      </Router>
    );
  }
}

export default App;