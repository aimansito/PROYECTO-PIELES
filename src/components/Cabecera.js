import React, { Component } from "react";
import axios from "axios";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Badge
} from "reactstrap";
import { Link } from "react-router-dom";
import Login from "./Login";

class Cabecera extends Component {
  state = {
    isNavOpen: false,
    isDropdownOpen: false,
    categorias: [],
    modalLogin: false
  };

  componentDidMount() {
    this.cargarCategorias();
  }

  cargarCategorias = () => {
    axios.get("http://localhost/server/categorias.php")
      .then(res => this.setState({ categorias: res.data }))
      .catch(() => console.error("No se pudieron cargar las categorías"));
  };

  toggleNavbar = () => this.setState(prevState => ({ isNavOpen: !prevState.isNavOpen }));
  toggleDropdown = () => this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
  toggleModalLogin = () => this.setState(prevState => ({ modalLogin: !prevState.modalLogin }));

  render() {
    const { categorias, isNavOpen, modalLogin } = this.state;
    const { logged, usuarioActual, rol, onLogin, onLogout, toggleCarrito, numProductosCarrito } = this.props;

    return (
      <Navbar color="dark" dark expand="md" className="px-3">
        <NavbarBrand href="/">Pieles Store</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} />
        <Collapse isOpen={isNavOpen} navbar>
          <Nav className="ms-auto d-flex align-items-center gap-3">
            {logged ? (
              <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle nav caret className="text-white">
                  Hola, {usuarioActual || "Usuario"}
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem onClick={onLogout}>Cerrar Sesión</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button color="link" className="text-white p-0 d-flex align-items-center" onClick={this.toggleModalLogin}>
                <i className="bi bi-person-circle fs-4"></i>
              </Button>
            )}

            <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.toggleDropdown}>
              <DropdownToggle color="link" className="text-white p-0">
                Categorías
              </DropdownToggle>
              <DropdownMenu end>
                {categorias.map(cat => (
                  <DropdownItem 
                    key={cat.id_categoria} 
                    onClick={() => {
                      if (this.props.setCategoriaSeleccionada) {
                        this.props.setCategoriaSeleccionada(cat.id_categoria);
                      } else if (this.props.onCategoriaSeleccionada) {
                        this.props.onCategoriaSeleccionada(cat.id_categoria);
                      } else {
                        console.log("Categoría seleccionada:", cat.nomCategoria, cat.id_categoria);
                        // Alternativa: usar directamente fetch o axios para cargar productos
                        // axios.get(`http://localhost/server/productos.php?categoria=${cat.id_categoria}`)
                        //  .then(res => this.props.setProductos ? this.props.setProductos(res.data) : console.log(res.data));
                      }
                    }}
                  >
                    {cat.nomCategoria}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button color="link" className="text-white position-relative" onClick={toggleCarrito}>
              <i className="bi bi-cart3 fs-4"></i>
              {numProductosCarrito > 0 && <Badge color="danger" pill>{numProductosCarrito}</Badge>}
            </Button>
          </Nav>
        </Collapse>

        <Login isOpen={modalLogin} toggle={this.toggleModalLogin} onLoginSuccess={onLogin} />
      </Navbar>
    );
  }
}

export default Cabecera;