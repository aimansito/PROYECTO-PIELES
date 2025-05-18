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
    productosCompletos: [], // Almacena TODOS los productos sin filtrar ni limitar
    productos: [], // Muestra aleatoria inicial (15 productos)
    productosFiltrados: [], // Los productos que se muestran actualmente
    categoriaSeleccionada: null,
    carrito: [],
    modalCarrito: false,
    logged: false,
    usuarioActual: null,
    rol: null,
  };

  componentDidMount() {
    this.cargarProductos();

    // Cargar carrito almacenado en localStorage
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      this.setState({ carrito: JSON.parse(carritoGuardado) });
    }

    // Cargar usuario almacenado en localStorage
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.setState({
        logged: true,
        usuarioActual: usuario,
        rol: usuario.rol,
      });
    }
  }

  cargarProductos = async () => {
    try {
      const API_URL = "http://localhost/server/productos.php";
      const response = await axios.get(API_URL);
      console.log("Datos recibidos de API:", response.data);

      if (Array.isArray(response.data?.productos)) {
        // Guardar todos los productos en productosCompletos
        const todosLosProductos = response.data.productos;

        // Para la vista inicial, seleccionar 15 aleatorios
        const productosAleatorios = [...todosLosProductos]
          .sort(() => Math.random() - 0.5)
          .slice(0, 15);

        this.setState({
          productosCompletos: todosLosProductos, // Guardar todos los productos
          productos: productosAleatorios, // Vista inicial aleatoria
          productosFiltrados: productosAleatorios, // Lo que se muestra
        });

        console.log(
          `Cargados ${todosLosProductos.length} productos en total. Mostrando 15 aleatorios inicialmente.`
        );
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // Función mejorada para filtrar por categoría
  setCategoriaSeleccionada = (idCategoria) => {
    console.log("Filtrando por categoría ID:", idCategoria);

    // Si es categoría "0" o nula, mostrar productos aleatorios iniciales
    if (!idCategoria || idCategoria === "0") {
      this.setState({
        productosFiltrados: this.state.productos, // Volver a los 15 aleatorios
        categoriaSeleccionada: null,
      });
      console.log("Mostrando selección aleatoria inicial");
    } else {
      // Buscar en TODOS los productos (no solo en los 15 aleatorios)
      const productosFiltrados = this.state.productosCompletos.filter(
        (producto) => {
          // Verificar ambos posibles nombres de campo para categoría
          const productoCategoria =
            producto.categoria_id || producto.id_categoria;
          return String(productoCategoria) === String(idCategoria);
        }
      );

      this.setState({
        productosFiltrados, // Actualizar los productos mostrados
        categoriaSeleccionada: idCategoria,
      });

      console.log(
        `Encontrados ${productosFiltrados.length} productos para categoría ${idCategoria}`
      );
    }
  };
  toggleCarrito = () => {
    // Solo permitir abrir el carrito si el usuario no es administrador
    if (this.state.rol === "admin") {
      alert("Como administrador, no puedes realizar compras.");
      return;
    }
    this.setState((prevState) => ({ modalCarrito: !prevState.modalCarrito }));
  };

  agregarAlCarrito = (producto) => {
    // Verificar primero si está logueado
    if (!this.state.logged) {
      alert("Debes iniciar sesión para añadir productos.");
      return;
    }

    // Verificar el rol - solo usuarios no administradores pueden comprar
    if (this.state.rol === "admin") {
      alert("Como administrador, no puedes realizar compras.");
      return;
    }

    // Crear nueva copia del carrito para evitar mutaciones directas
    const carritoActualizado = [...this.state.carrito];

    // Buscar si el producto ya está en el carrito
    const index = carritoActualizado.findIndex(
      (item) => item.id === producto.id_producto
    );

    if (index !== -1) {
      carritoActualizado[index].cantidad += 1;
    } else {
      // Añadir nuevo producto con cantidad 1
      carritoActualizado.push({
        id: producto.id_producto,
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        descripcion: producto.descripcion,
        imagen_url: producto.imagen_url,
        id_categoria: producto.id_categoria,
        cantidad: 1,
      });
    }

    this.setState({ carrito: carritoActualizado }, () => {
      localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
    });

    alert(`Añadido al carrito: ${producto.nombre}`);
  };

  eliminarDelCarrito = (productoId) => {
    const carritoActualizado = this.state.carrito.filter(
      (item) => item.id !== productoId
    );
    this.setState({ carrito: carritoActualizado }, () => {
      localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
    });
  };

  cambiarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const carritoActualizado = [...this.state.carrito];
    const index = carritoActualizado.findIndex(
      (item) => item.id === productoId
    );

    if (index !== -1) {
      carritoActualizado[index].cantidad = nuevaCantidad;
      this.setState({ carrito: carritoActualizado }, () => {
        localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
      });
    }
  };

  // Actualizar estado global cuando inicie o cierre sesión el usuario
  setLogged = (logged, usuarioActual = null, rol = null) => {
    this.setState({ logged, usuarioActual, rol }, () => {
      if (logged && usuarioActual) {
        // Guardar todos los datos de usuario en localStorage
        localStorage.setItem("usuario", JSON.stringify(usuarioActual));

        // Si es administrador, vaciar el carrito
        if (rol === "admin") {
          this.setState({ carrito: [] }, () => {
            localStorage.removeItem("carrito");
          });
        }
      } else {
        localStorage.removeItem("usuario");
        this.setState({ carrito: [] }, () => {
          localStorage.removeItem("carrito");
        });
      }
    });
  };

  render() {
    const {
      productosFiltrados,
      logged,
      usuarioActual,
      rol,
      modalCarrito,
      carrito,
    } = this.state;

    return (
      <Router>
        <Cabecera
          onLogin={this.setLogged}
          logged={logged}
          usuarioActual={usuarioActual}
          rol={rol}
          toggleCarrito={this.toggleCarrito}
          numProductosCarrito={carrito.reduce(
            (total, p) => total + p.cantidad,
            0
          )}
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
                rol={rol} // Pasar el rol para controlar botones de compra
              />
            }
          />
        </Routes>

        {/* Solo mostrar el carrito si el usuario no es administrador */}
        {rol !== "admin" && (
          <Carrito
            mostrar={modalCarrito}
            toggle={this.toggleCarrito}
            carrito={carrito}
            usuarioActual={usuarioActual}
            eliminarDelCarrito={this.eliminarDelCarrito}
            cambiarCantidad={this.cambiarCantidad}
          />
        )}
      </Router>
    );
  }
}

export default App;
