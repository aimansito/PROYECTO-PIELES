// src/components/Cabecera.js
import React, { Component } from "react";
import axios from "axios";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Badge } from "reactstrap";

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

    return (
      <Navbar color="dark" dark expand="md" className="px-3 shadow-sm mb-3">
        <NavbarBrand href="/">Pieles Store</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} />
        <Collapse isOpen={isNavOpen} navbar className="justify-content-end">
          <Nav className="d-flex align-items-center">
            <Dropdown isOpen={isDropdownOpen} toggle={this.toggleDropdown} direction="down">
              <DropdownToggle color="link" className="text-white">
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
