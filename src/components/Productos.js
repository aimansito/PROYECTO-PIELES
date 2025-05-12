import React, { Component } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Button,
  Spinner,
} from "reactstrap";

class Productos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      cargando: true,
      error: null,
      imageErrors: {} // Rastrea qué imágenes fallaron al cargar

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
            cargando: false,
          });
        } else if (response.data.error) {
          this.setState({ error: response.data.error, cargando: false });
        } else {
          this.setState({
            error: "Formato de respuesta inesperado",
            cargando: false,
          });
        }
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        this.setState({
          error: `Error al conectar con el servidor: ${err.message}`,
          cargando: false,
        });
      });
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

  render() {
    const { productos, cargando, error, imageErrors } = this.state;
    const { categoriaSeleccionada, modificarCarrito } = this.props;

    let productosFiltrados = productos;
    if (categoriaSeleccionada) {
      productosFiltrados = productos.filter(
        (prod) =>
          parseInt(prod.id_categoria) === parseInt(categoriaSeleccionada)
      );
    }

    if (cargando) {
      return (
        <div className="container mt-5 text-center">
          <Spinner color="primary" />
          <p>Cargando productos...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h4>Error al cargar productos</h4>
            <p>{error}</p>
            <Button color="primary" onClick={this.cargarProductos}>
              Intentar nuevamente
            </Button>
          </div>
        </div>
      );
    }

    if (Object.keys(imageErrors).length > 0) {
      console.log("Imágenes con errores:", imageErrors);
    }

    if (productosFiltrados.length === 0) {
      return (
        <div className="container mt-5">
          <div className="alert alert-info">
            No hay productos disponibles
            {categoriaSeleccionada && " en esta categoría"}
          </div>
        </div>
      );
    }

    return (
      <div className="container mt-4">
        <div className="row">
          {productosFiltrados.map((prod) => (
            <div key={prod.id_producto} className="col-md-4 mb-4">
              <Card className="h-100 shadow">
                <div className="position-relative">
                  <CardImg
                    top
                    src={this.getImageUrl(prod.imagen_url)}
                    alt={prod.nombre}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Imagen+no+disponible";
                      this.handleImageError(prod.id_producto, prod.imagen_url);
                    }}
                  />
                  {imageErrors[prod.id_producto] && (
                    <div className="position-absolute bottom-0 w-100 bg-danger text-white p-1">
                      <small>Error cargando imagen</small>
                    </div>
                  )}
                </div>
                <CardBody>
                  <CardTitle tag="h5">{prod.nombre}</CardTitle>
                  <CardText>{prod.descripcion}</CardText>
                  <CardText className="fw-bold">
                    Precio: {parseFloat(prod.precio).toFixed(2)}€
                  </CardText>
                  <Button
                    color="success"
                    onClick={() => {
                      modificarCarrito(
                        prod.id_producto,
                        prod.nombre,
                        prod.precio,
                        1
                      );
                    }}
                  >
                    <i className="bi bi-cart-plus me-1"></i> Añadir al carrito
                  </Button>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  getImageUrl(url) {
    if (!url) return "https://via.placeholder.com/300x200?text=Sin+imagen";
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `http://localhost/server/${url}`;
    }
    
    return url;
  }
}

export default Productos;