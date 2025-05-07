import React, { Component } from 'react';
import axios from 'axios';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Badge } from 'reactstrap';

class Cabecera extends Component {
  state = {
    isNavOpen: false,       // Para el toggle del navbar
    isDropdownOpen: false,  // Para el toggle del dropdown
    categorias: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    this.cargarCategorias();
  }

  cargarCategorias = () => {
    axios.get('http://localhost/server/categorias.php')
      .then(res => this.setState({ categorias: res.data, loading: false, error: null }))
      .catch(error => this.setState({ error: 'No se pudieron cargar las categorías', loading: false }));
  };

  // Separamos los toggles para navbar y dropdown
  toggleNavbar = () => {
    this.setState({ isNavOpen: !this.state.isNavOpen });
  };

  toggleDropdown = () => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  render() {
    const { categorias, isNavOpen, isDropdownOpen, loading, error } = this.state;
    const { numProductosCarrito } = this.props;

    return (
      <Navbar color="dark" dark expand="md" className="px-3 shadow-sm mb-3">
        <NavbarBrand href="/">Pieles Store</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} />
        <Collapse isOpen={isNavOpen} navbar className="justify-content-end">
          <Nav className="d-flex align-items-center">
            <Button color="link" className="text-white me-3 p-0" aria-label="Usuario" href="/perfil">
              <i className="bi bi-person-fill fs-5"></i>
            </Button>
            <Button color="link" className="text-white me-3 p-0" aria-label="Carrito" href="/carrito">
              <i className="bi bi-cart3 fs-5"></i>
              {numProductosCarrito > 0 && <Badge color="danger" pill>{numProductosCarrito}</Badge>}
            </Button>
            <Dropdown isOpen={isDropdownOpen} toggle={this.toggleDropdown} direction="down">
              <DropdownToggle color="link" className="text-white p-0">
                <i className="bi bi-list fs-4"></i>
              </DropdownToggle>
              <DropdownMenu end className="shadow border-0">
                {loading && <DropdownItem disabled>Cargando categorías...</DropdownItem>}
                {error && <DropdownItem disabled>{error}</DropdownItem>}
                {categorias.map(cat => (
                  <DropdownItem key={cat.id_categoria} onClick={() => this.props.setCategoriaSeleccionada(cat.id_categoria)}>
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