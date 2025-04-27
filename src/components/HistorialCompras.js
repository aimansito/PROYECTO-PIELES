import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Table, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import pedidos from '../pedidos.json';

class HistorialCompras extends Component {
    constructor(props) {
        super(props);
        this.state = {
            compras: [],
            cargando: false,
            error: null
        };
    }

    componentDidMount() {
        this.cargarHistorial();
    }

    cargarHistorial = () => {
        try {
            const { usuario } = this.props;
            console.log("Usuario Historial: " + usuario);
            
            let comprasUsuario;
            if (usuario === "admin") {
                comprasUsuario = pedidos;
            } else {
                comprasUsuario = pedidos.filter(compra => compra.usuarioActual === usuario);
            }
            this.setState({ compras: comprasUsuario, cargando: false });
        } catch (error) {
            this.setState({ error: 'Error al cargar el historial de compras.', cargando: false });
        }
    };

    render() {
        const { mostrar, toggle } = this.props;
        const { compras } = this.state;

        return (
            <Modal isOpen={mostrar} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>Historial de Compras</ModalHeader>
                <ModalBody>
                    {compras.length === 0 ? <p>No hay compras registradas.</p> :
                        compras.map((compra, index) => (
                            <div key={index}>
                                <h5>Compra {index + 1} - Total: {compra.totalCompra.toFixed(2)}€</h5>
                                <h5>Usuario {compra.usuarioActual}</h5>
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {compra.productos.map((producto, idx) => (
                                            <tr key={`${index}-${idx}`}>
                                                <td>{producto.nombre}</td>
                                                <td>{producto.cantidad}</td>
                                                <td>{producto.precioTotal.toFixed(2)}€</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="2"><strong>Total de la Compra:</strong></td>
                                            <td><strong>{compra.totalCompra.toFixed(2)}€</strong></td>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </div>
                        ))
                    }
                </ModalBody>
            </Modal>
        );
    }
}

export default HistorialCompras;