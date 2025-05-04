import React, { Component } from 'react';
import {
  Navbar, NavbarBrand, NavbarToggler, Collapse, Nav,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Button, Badge
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// Importar los iconos de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';

class Cabecera extends Component {
  state = {
    isOpen: false,
    dropdownOpen: false,
    categorias: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    this.cargarCategorias();
  }

  cargarCategorias = () => {
    this.setState({ loading: true });
    fetch('http://localhost/server/categorias.php')
      .then(res => {
        if (!res.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return res.json();
      })
      .then(data => this.setState({ 
        categorias: data, 
        loading: false,
        error: null 
      }))
      .catch(error => {
        console.error('Error al cargar categorías:', error);
        this.setState({ 
          error: 'No se pudieron cargar las categorías', 
          loading: false 
        });
      });
  };

  toggleMenu = () => this.setState({ isOpen: !this.state.isOpen });
  toggleDropdown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });

  render() {
    const { categorias, dropdownOpen, isOpen, loading, error } = this.state;
    const { numProductosCarrito = 0 } = this.props;

    return (
      <Navbar color="dark" dark expand="md" className="px-3 shadow-sm mb-3">
        <NavbarBrand href="/" className="fw-bold">
          Pieles Store
        </NavbarBrand>

        <NavbarToggler onClick={this.toggleMenu} />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar />
          {/* Iconos a la derecha */}
          <div className="d-flex align-items-center">


             <Button color="link" className="text-white position-relative me-3 p-0" aria-label="Carrito" href="/carrito">
              <i className="bi bi-cart3 fs-5"></i>
              {numProductosCarrito > 0 && (
                <Badge color="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {numProductosCarrito}
                </Badge>
              )}
            </Button>

            <Button color="link" className="text-white me-3 p-0" aria-label="Usuario" href="/perfil">
              <i className="bi bi-person-fill fs-5"></i>
            </Button>

      

            <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdown} direction="down">
              <DropdownToggle color="link" className="text-white me-3 p-0" aria-label="Categorías">
                <i className="bi bi-list fs-4"></i>
              </DropdownToggle>
              <DropdownMenu className="shadow border-0">
                <DropdownItem header>Categorías</DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag="a" href="/productos">Todos los productos</DropdownItem>
                
                {loading && (
                  <DropdownItem disabled>Cargando categorías...</DropdownItem>
                )}
                
                {error && (
                  <DropdownItem disabled className="text-danger">{error}</DropdownItem>
                )}
                
                {!loading && !error && categorias.map((cat) => (
                  <DropdownItem key={cat.id_categoria} tag="a" href={`/categoria/${cat.id_categoria}`}>
                    {cat.nomCategoria}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </Collapse>
      </Navbar>
    );
  }
}

export default Cabecera;