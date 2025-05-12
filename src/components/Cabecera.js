// src/components/Cabecera.js
import React, { Component } from "react";
import axios from "axios";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Badge } from "reactstrap";
import { Link } from "react-router-dom";

class Cabecera extends Component {
  state = {
    isNavOpen: false,
    isDropdownOpen: false,
    categorias: []
  };

  componentDidMount() {
    this.cargarCategorias();
  }

  cargarCategorias = () => {
    axios.get("http://localhost/server/categorias.php")
      .then(res => this.setState({ categorias: res.data }))
      .catch(() => console.error("No se pudieron cargar las categorías"));
  };

  toggleNavbar = () => this.setState({ isNavOpen: !this.state.isNavOpen });
  toggleDropdown = () => this.setState({ isDropdownOpen: !this.state.isDropdownOpen });

  handleCategoriaSeleccionada = (categoriaId) => {
    this.props.setCategoriaSeleccionada(categoriaId);
  };

  render() {
    const { categorias, isNavOpen, isDropdownOpen } = this.state;
    const { numProductosCarrito, logged, usuarioActual } = this.props;

    return (
      <Navbar color="dark" dark expand="md" className="px-3 shadow-sm mb-3">
        <NavbarBrand href="/">Pieles Store</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} />
        <Collapse isOpen={isNavOpen} navbar className="justify-content-end">
          <Nav className="d-flex align-items-center">

            {/* Icono de Usuario */}
            <Link to={logged ? "#" : "/login"} className="text-white me-3 p-0">
              <i className="bi bi-person-circle fs-4"></i>
              {logged && <span className="ms-2">Hola, {usuarioActual}</span>}
            </Link>

             {/* Icono del Carrito */}
             <Button color="link" className="text-white me-3 p-0" href="/carrito">
              <i className="bi bi-cart3 fs-5"></i>
              {numProductosCarrito > 0 && (
                <Badge color="danger" pill className="ms-1">
                  {numProductosCarrito}
                </Badge>
              )}
            </Button>

           {/* Menú Hamburguesa */}
            <Dropdown isOpen={isDropdownOpen} toggle={this.toggleDropdown} direction="down">
              <DropdownToggle color="link" className="text-white me-3">
                <i className="bi bi-list fs-4"></i>
              </DropdownToggle>
              <DropdownMenu end>
                {categorias.map(cat => (
                  <DropdownItem key={cat.id_categoria} onClick={() => this.handleCategoriaSeleccionada(cat.id_categoria)}>
                    {cat.nomCategoria}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default Cabecera;
