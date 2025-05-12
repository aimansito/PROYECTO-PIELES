// src/components/Cabecera.js
import React, { Component } from "react";
import axios from "axios";
import { 
  Navbar, 
  NavbarBrand, 
  NavbarToggler, 
  Collapse, 
  Nav, 
  Dropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem, 
  Button, 
  Badge 
} from "reactstrap";
import Login from "./Login";

class Cabecera extends Component {
  state = {
    isNavOpen: false,
    isDropdownOpen: false,
    isCategoriesOpen: false,
    categorias: [],
    modalLogin: false,
    usuarioActual: "",
    logged: false,
    numProductosCarrito: 0,
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
  toggleCategoriesDropdown = () => this.setState(prevState => ({ isCategoriesOpen: !prevState.isCategoriesOpen }));
  toggleDropdown = () => this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
  toggleModalLogin = () => this.setState(prevState => ({ modalLogin: !prevState.modalLogin }));

  handleLoginSuccess = (usuario) => {
    this.setState({
      usuarioActual: usuario,
      logged: true,
      modalLogin: false
    });
  };

  handleLogout = () => {
    this.setState({
      usuarioActual: "",
      logged: false
    });
  };

  handleCategoriaSeleccionada = (categoriaId) => {
    this.props.onCategoriaSeleccionada(categoriaId); // Notificar a App.js
  };

  render() {
    const { 
      categorias, 
      isNavOpen, 
      isDropdownOpen, 
      isCategoriesOpen, 
      modalLogin, 
      usuarioActual, 
      logged, 
      numProductosCarrito 
    } = this.state;

    return (
      <>
        <Navbar color="dark" dark expand="md" className="px-3 shadow-sm mb-3">
          <NavbarBrand href="/" className="me-auto">Pieles Store</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={isNavOpen} navbar className="justify-content-end">
            <Nav className="d-flex align-items-center gap-3">
              {!logged ? (
                <Button color="link" className="text-white p-0 d-flex align-items-center" onClick={this.toggleModalLogin}>
                  <i className="bi bi-person-circle fs-4"></i>
                </Button>
              ) : (
                <Dropdown isOpen={isDropdownOpen} toggle={this.toggleDropdown} direction="down">
                  <DropdownToggle color="link" className="text-white p-0 d-flex align-items-center">
                    <span className="me-2">Hola, {usuarioActual}</span>
                    <i className="bi bi-caret-down-fill"></i>
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem onClick={this.handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}

              <Button color="link" className="text-white p-0 position-relative" href="/carrito">
                <i className="bi bi-cart3 fs-4"></i>
                {numProductosCarrito > 0 && (
                  <Badge color="danger" pill className="position-absolute top-0 start-100 translate-middle">
                    {numProductosCarrito}
                  </Badge>
                )}
              </Button>

              <Dropdown isOpen={isCategoriesOpen} toggle={this.toggleCategoriesDropdown} direction="down">
                <DropdownToggle color="link" className="text-white p-0">
                  <i className="bi bi-list fs-3"></i>
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem header>Categorías</DropdownItem>
                  <DropdownItem divider />
                  {categorias.map(cat => (
                    <DropdownItem 
                      key={cat.id_categoria} 
                      onClick={() => this.handleCategoriaSeleccionada(cat.id_categoria)}
                    >
                      {cat.nomCategoria}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Nav>
          </Collapse>
        </Navbar>

        <Login 
          isOpen={modalLogin} 
          toggle={this.toggleModalLogin} 
          onLoginSuccess={this.handleLoginSuccess} 
        />
      </>
    );
  }
}

export default Cabecera;
