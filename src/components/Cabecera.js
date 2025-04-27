import React, { Component } from 'react';
import axios from 'axios';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carrito from './Carrito';
import HistorialCompras from './HistorialCompras';

class Cabecera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categorias: [],
            cargando: true,
            error: null,
            isOpen: false,
            dropdownOpen: false,
            mostrarCarrito: false,
            mostrarHistorial: false
        };
    }

    componentDidMount() {
        const API_URL = "/2daw/pieles.json";
        axios.get(API_URL)
            .then(response => {
                if (response.data && response.data.productos) {
                    const categoriasUnicas = response.data.productos
                        .filter((prod, index, array) =>
                            array.findIndex(p => p.categoria === prod.categoria) === index
                        )
                        .map(prod => prod.categoria);

                    this.setState({ categorias: categoriasUnicas, cargando: false });
                } else {
                    this.setState({ error: "Error: ", cargando: false });
                }
            })
            .catch(err => {
                this.setState({ error: `Error cargando productos: ${err.message}`, cargando: false });
            });
    }

    toggleMenu = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    toggleDropdown = () => {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    };

    toggleCarrito = () => {
        this.setState({ mostrarCarrito: !this.state.mostrarCarrito });
    };

    toggleHistorial = () => {
        this.setState({ mostrarHistorial: !this.state.mostrarHistorial });
    };

    render() {
        const { categorias, isOpen, dropdownOpen, mostrarCarrito, mostrarHistorial } = this.state;
        const { setCategoriaSeleccionada, carrito, modificarCarrito, usuarioActual } = this.props;
        console.log("usuarioActual en render:", usuarioActual);
        let numProd = 0;
        carrito.map(e => numProd += e.cantidad);
        return (
            <Navbar color="dark" dark expand="md" className="px-3">
                <NavbarBrand href="#" onClick={() => setCategoriaSeleccionada(null)}>Pieles Store</NavbarBrand>
                <NavbarToggler onClick={this.toggleMenu} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdown} nav inNavbar>
                            <DropdownToggle nav caret>
                                Categorías
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => setCategoriaSeleccionada(null)}>Todos</DropdownItem>
                                {categorias.map((categoria, index) => (
                                    <DropdownItem key={index} onClick={() => setCategoriaSeleccionada(categoria)}>
                                        {categoria}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </Nav>
                    <div className="d-flex align-items-center">
                        <span className="text-white me-3">
                            {usuarioActual ? `Hola, ${usuarioActual}` : "Invitado"}
                        </span>
                        <Button color="link" className="me-2 text-white text-decoration-none" onClick={this.toggleCarrito}>
                            Carrito ({numProd})
                        </Button>
                        <Button color="link" className="me-2 text-white text-decoration-none" onClick={this.toggleHistorial}>
                            Pedidos
                        </Button>
                        <Carrito carrito={carrito} modificarCarrito={modificarCarrito} mostrar={mostrarCarrito} toggle={this.toggleCarrito} usuarioActual={usuarioActual}/>
                    </div>
                </Collapse>
                <HistorialCompras mostrar={mostrarHistorial} toggle={this.toggleHistorial} usuario={usuarioActual} />
            </Navbar>
        );
    }
}

export default Cabecera;