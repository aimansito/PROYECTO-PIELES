import React, { Component } from 'react';
import axios from 'axios';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';

class MainProductos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            cargando: true,
            error: null
        };
    }

    componentDidMount() {
        const API_URL = "/2daw/pieles.json";
        axios.get(API_URL)
            .then(response => {
                console.log("Respuesta de la API:", response.data);
                if (response.data && response.data.productos) {
                    const productosConId = response.data.productos.map((prod, index) => ({
                        ...prod,
                        id: index + 1
                    }));
                    this.setState({ productos: productosConId, cargando: false });
                } else {
                    this.setState({ error: "Error al cargar los productos", cargando: false });
                }
            })
            .catch(err => {
                this.setState({ error: `Error: ${err.message}`, cargando: false });
            });
    }

    render() {
        const { productos } = this.state;
        const { categoriaSeleccionada, modificarCarrito } = this.props;

        let productosFiltrados = categoriaSeleccionada
            ? productos.filter(prod => prod.categoria === categoriaSeleccionada)
            : productos;

        return (
            <div className="container mt-4">
                <div className="row">
                    {productosFiltrados.map((prod) => (
                        <div key={prod.id} className="col-md-4 mb-4">
                            <Card>
                                <CardBody>
                                    <img src={prod.imagen_url} className="card-img-top" alt={prod.nombre} />
                                    <CardTitle tag="h5">{prod.nombre}</CardTitle>
                                    <CardText>{prod.descripcion}</CardText>
                                    <CardText>{prod.categoria}</CardText>
                                    <CardText>Precio: {prod.precio}€</CardText>
                                    <Button color="success" onClick={() => {
                                        console.log("Producto seleccionado:", prod);
                                        modificarCarrito(prod.id, prod.nombre, prod.precio, 1);
                                    }}>
                                        Comprar
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

export default MainProductos;