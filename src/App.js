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
    // Recuperar carrito del localStorage si existe
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.setState({ carrito: JSON.parse(carritoGuardado) });
    }
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
    if (idCategoria === null || idCategoria === "0") {
      // Si no hay categoría seleccionada o es "0", mostrar todos los productos
      this.setState({ productosFiltrados: this.state.productos, categoriaSeleccionada: idCategoria });
    } else {
      const productosFiltrados = this.state.productos.filter(
        (producto) => producto.categoria_id === parseInt(idCategoria)
      );
      this.setState({ productosFiltrados, categoriaSeleccionada: idCategoria });
    }
  };

  toggleCarrito = () => {
    this.setState({ modalCarrito: !this.state.modalCarrito });
  };

  agregarAlCarrito = (producto) => {
    if (!this.state.logged) {
      alert("Debes iniciar sesión para añadir productos.");
      return;
    }

    // Crear una copia completa del producto para asegurar que no hay referencias
    const productoCompleto = {
      id: producto.id_producto,  // Adaptado a la estructura real de los datos
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      descripcion: producto.descripcion,
      imagen_url: producto.imagen_url,
      id_categoria: producto.id_categoria
    };
    
    // Crear una copia real del carrito actual (clonar el array completamente)
    const carritoActualizado = JSON.parse(JSON.stringify(this.state.carrito));
    
    // Buscar si el producto que se está añadiendo ya existe en el carrito
    const index = carritoActualizado.findIndex(item => item.id === productoCompleto.id);
    
    // Si el producto ya existe, incrementar su cantidad
    if (index !== -1) {
      carritoActualizado[index].cantidad += 1;
    } else {
      // Si el producto no existe en el carrito, añadirlo con cantidad 1
      carritoActualizado.push({ ...productoCompleto, cantidad: 1 });
    }
    
    console.log("Producto añadido:", productoCompleto);
    console.log("Carrito actualizado:", carritoActualizado);
    
    // Actualizar el estado con el carrito modificado y guardarlo en localStorage
    this.setState({ carrito: carritoActualizado }, () => {
      localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
    });
    
    // Mostrar confirmación al usuario
    alert(`Añadido al carrito: ${productoCompleto.nombre}`);
  };

  eliminarDelCarrito = (productoId) => {
    const carritoActualizado = this.state.carrito.filter(item => item.id !== productoId);
    this.setState({ carrito: carritoActualizado }, () => {
      localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
    });
  };

  cambiarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    const carritoActualizado = [...this.state.carrito];
    const index = carritoActualizado.findIndex(item => item.id === productoId);
    
    if (index !== -1) {
      carritoActualizado[index].cantidad = nuevaCantidad;
      this.setState({ carrito: carritoActualizado }, () => {
        localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
      });
    }
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
          numProductosCarrito={carrito.reduce((total, producto) => total + producto.cantidad, 0)}
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
          eliminarDelCarrito={this.eliminarDelCarrito}
          cambiarCantidad={this.cambiarCantidad}
        />
      </Router>
    );
  }
}

export default App;