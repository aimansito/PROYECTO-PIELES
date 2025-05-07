import React from "react";
import { Card, CardBody, CardTitle, CardText, CardImg, Button } from "reactstrap";

function ListaProductos({ productos, categoriaSeleccionada }) {

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter(prod => prod.id_categoria === parseInt(categoriaSeleccionada))
    : productos;

  return (
    <div className="container mt-4">
      <div className="row">
        {productosFiltrados.map((prod) => (
          <div key={prod.id_producto} className="col-md-4 mb-4">
            <Card className="h-100 shadow">
              <CardImg
                top
                src={prod.imagen_url || "https://via.placeholder.com/300x200?text=Sin+imagen"}
                alt={prod.nombre}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <CardBody>
                <CardTitle tag="h5">{prod.nombre}</CardTitle>
                <CardText>{prod.descripcion}</CardText>
                <CardText className="fw-bold">Precio: {parseFloat(prod.precio).toFixed(2)}€</CardText>
                <Button color="success">Añadir al carrito</Button>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaProductos;
