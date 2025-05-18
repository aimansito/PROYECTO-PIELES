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
    Badge,
  } from "reactstrap";
  import Login from "./Login";
  import HistorialCompras from "./HistorialCompras"; // Importamos el componente de historial

  class Cabecera extends Component {
    state = {
      isNavOpen: false,
      isDropdownOpen: false,
      isDropdownCategoriasOpen: false,
      categorias: [],
      modalLogin: false,
      modalHistorial: false, 
    };

    componentDidMount() {
      this.cargarCategorias();
    }

    cargarCategorias = () => {
      axios
        .get("http://localhost/server/categorias.php")
        .then((res) => this.setState({ categorias: res.data }))
        .catch(() => console.error("No se pudieron cargar las categorías"));
    };

    toggleNavbar = () =>
      this.setState((prevState) => ({ isNavOpen: !prevState.isNavOpen }));
    toggleDropdown = () =>
      this.setState((prevState) => ({
        isDropdownOpen: !prevState.isDropdownOpen,
      }));
    toggleDropdownCategorias = () =>
      this.setState((prevState) => ({
        isDropdownCategoriasOpen: !prevState.isDropdownCategoriasOpen,
      }));
    toggleModalLogin = () =>
      this.setState((prevState) => ({ modalLogin: !prevState.modalLogin }));
    toggleModalHistorial = () =>
      this.setState((prevState) => ({ modalHistorial: !prevState.modalHistorial }));

    handleLoginSuccess = (isLogged, usuarioData, rol) => {
      this.props.onLogin(isLogged, usuarioData, rol);
      console.log("Usuario logueado en Cabecera:", {
        isLogged,
        usuarioData,
        rol,
      });
    };

    handleLogout = () => {
      this.props.onLogin(false, null, null);
    };

    render() {
      const {
        categorias,
        isNavOpen,
        modalLogin,
        modalHistorial,
        isDropdownOpen,
        isDropdownCategoriasOpen,
      } = this.state;
      const { logged, usuarioActual, toggleCarrito, numProductosCarrito, rol } =
        this.props;

      return (
        <>
          <Navbar color="dark" dark expand="md" className="px-3">
            <NavbarBrand href="/">Pieles Store</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} />
            <Collapse isOpen={isNavOpen} navbar>
              <Nav className="ms-auto d-flex align-items-center gap-3">
                {logged ? (
                  <>
                    <Dropdown isOpen={isDropdownOpen} toggle={this.toggleDropdown}>
                      <DropdownToggle nav caret className="text-white">
                        Hola, {usuarioActual?.nombre || "Usuario"} ({rol || "Usuario"})
                      </DropdownToggle>
                      <DropdownMenu end>
                        {rol === "admin" && (
                          <DropdownItem onClick={this.toggleModalHistorial}>
                            Consultar Pedidos
                          </DropdownItem>
                        )}
                        <DropdownItem onClick={this.handleLogout}>
                          Cerrar Sesión
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    
                    {rol === "admin" && (
                      <Button 
                        color="info" 
                        size="sm" 
                        onClick={this.toggleModalHistorial}
                      >
                        Consultar Pedidos
                      </Button>
                    )}
                    {rol === "usuario" && (
                      <Button 
                        color="info" 
                        size="sm" 
                        onClick={this.toggleModalHistorial}
                      >
                        Consultar Mis Pedidos
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    color="link"
                    className="text-white p-0 d-flex align-items-center"
                    onClick={this.toggleModalLogin}
                  >
                    <i className="bi bi-person-circle fs-4"></i>
                  </Button>
                )}

                

                {/* Botón del carrito, solo visible para usuarios no admin */}
                {rol !== "admin" && (
                  <Button
                    color="link"
                    className="text-white position-relative"
                    onClick={toggleCarrito}
                  >
                    <i className="bi bi-cart3 fs-4"></i>
                    {numProductosCarrito > 0 && (
                      <Badge color="danger" pill>
                        {numProductosCarrito}
                      </Badge>
                    )}
                  </Button>
                )}

                <Dropdown
                  isOpen={isDropdownCategoriasOpen}
                  toggle={this.toggleDropdownCategorias}
                >
                  <DropdownToggle color="link" className="text-white p-0">
                    Categorías
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem
                      key="0"
                      onClick={() => this.props.setCategoriaSeleccionada("0")}
                    >
                      Todas las categorías
                    </DropdownItem>
                    {categorias.map((cat) => (
                      <DropdownItem
                        key={cat.id_categoria}
                        onClick={() =>
                          this.props.setCategoriaSeleccionada(cat.id_categoria)
                        }
                      >
                        {cat.nomCategoria}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </Nav>
            </Collapse>

            <Login
              isOpen={modalLogin}
              toggle={this.toggleModalLogin}
              onLoginSuccess={this.handleLoginSuccess}
            />
          </Navbar>

          {/* Componente de historial de compras */}
          {logged && (
            <HistorialCompras
              mostrar={modalHistorial}
              toggle={this.toggleModalHistorial}
              usuario={usuarioActual?.nombre}
              rol={rol}
            />
          )}
        </>
      );
    }
  }

  export default Cabecera;