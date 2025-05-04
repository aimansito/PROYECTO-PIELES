import React, { Component } from 'react';
import axios from 'axios';
import { Card, CardBody, CardTitle, CardText, Button, Spinner } from 'reactstrap';

class Productos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            cargando: true,
            error: null
        };
    }

    componentDidMount() {
        this.cargarProductos();
    }

    cargarProductos = () => {
        const API_URL = "http://localhost/server/productos.php";
        
        axios.get(API_URL)
            .then(response => {
                console.log("Respuesta de la API:", response.data);
                if (Array.isArray(response.data)) {
                    this.setState({ productos: response.data, cargando: false });
                } else if (response.data.error) {
                    this.setState({ error: response.data.error, cargando: false });
                } else {
                    this.setState({ error: "Formato de respuesta inesperado", cargando: false });
                }
            })
            .catch(err => {
                console.error("Error al cargar productos:", err);
                this.setState({ 
                    error: `Error al conectar con el servidor: ${err.message}`, 
                    cargando: false 
                });
            });
    }

    render() {
        const { productos, cargando, error } = this.state;
        const { categoriaSeleccionada, modificarCarrito } = this.props;

        // Filtrar productos por categoría si es necesario
        let productosFiltrados = productos;
        
        if (categoriaSeleccionada) {
            productosFiltrados = productos.filter(
                prod => parseInt(prod.id_categoria) === parseInt(categoriaSeleccionada)
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
                                <CardBody>
                                    {prod.imagen_url ? (
                                        <img
                                            src={prod.imagen_url}
                                            className="card-img-top mb-3"
                                            alt={prod.nombre}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                                            }}
                                        />
                                    ) : (
                                        <div className="bg-light text-center py-5 mb-3" style={{ height: '200px' }}>
                                            <span className="text-muted">Imagen no disponible</span>
                                        </div>
                                    )}
                                    <CardTitle tag="h5">{prod.nombre}</CardTitle>
                                    <CardText>{prod.descripcion}</CardText>
                                    <CardText className="fw-bold">Precio: {parseFloat(prod.precio).toFixed(2)}€</CardText>
                                    <Button color="success" onClick={() => {
                                        modificarCarrito(prod.id_producto, prod.nombre, prod.precio, 1);
                                    }}>
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
}

export default Productos;