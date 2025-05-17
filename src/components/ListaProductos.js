import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Spinner } from "reactstrap";

class ListaProductos extends Component {
  render() {
    const { productos, agregarAlCarrito, logged, rol } = this.props;

    if (!productos || productos.length === 0) {
      return (
        <Container className="mt-5 text-center">
          <Spinner color="primary" />
          <p className="mt-3">Cargando productos...</p>
        </Container>
      );
    }

    return (
      <Container className="mt-4 mb-5">
        <h2 className="mb-4 text-center">Nuestros Productos</h2>
        <Row>
          {productos.map((producto) => (
            <Col key={producto.id_producto} xs="12" sm="6" md="4" lg="3" className="mb-4">
              <Card className="h-100 shadow-sm">
                {producto.imagen_url && (
                  <div 
                    className="card-img-top" 
                    style={{
                      height: "200px",
                      backgroundImage: `url(${producto.imagen_url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />
                )}
                <CardBody className="d-flex flex-column">
                  <CardTitle tag="h5">{producto.nombre}</CardTitle>
                  <CardText className="flex-grow-1">
                    {producto.descripcion}
                  </CardText>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold">{parseFloat(producto.precio).toFixed(2)}€</span>
                    
                    {/* Botón condicional según rol */}
                    {logged && rol !== "admin" ? (
                      <Button 
                        color="primary" 
                        size="sm" 
                        onClick={() => agregarAlCarrito(producto)}
                      >
                        Añadir al carrito
                      </Button>
                    ) : rol === "admin" ? (
                      <span className="text-muted fst-italic">
                        Modo administrador
                      </span>
                    ) : (
                      <Button 
                        color="secondary" 
                        size="sm" 
                        onClick={() => alert("Debes iniciar sesión para comprar")}
                      >
                        Iniciar sesión para comprar
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* Mensaje informativo para administradores */}
        {rol === "admin" && (
          <div className="alert alert-info mt-4">
            <i className="bi bi-info-circle me-2"></i>
            Estás en modo administrador. En este modo, no puedes realizar compras, pero puedes consultar y gestionar los pedidos desde el botón "Consultar Pedidos" en la cabecera.
          </div>
        )}
      </Container>
    );
  }
}

export default ListaProductos;