import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Button,
  Spinner,
} from "reactstrap";

function ListaProductos(props) {

    console.log(props)
    return (
      <div className="container mt-4">
        <div className="row">
          {props.productos.map((prod) => (
            <div key={prod.id_producto} className="col-md-4 mb-4">
              <Card className="h-100 shadow">
                <div className="position-relative">
                  <CardImg
                    top
                    src={prod.imagen_url}
                    alt={prod.nombre}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </div>
                <CardBody>
                  <CardTitle tag="h5">{prod.nombre}</CardTitle>
                  <CardText>{prod.descripcion}</CardText>
                  <CardText className="fw-bold">
                    Precio: {parseFloat(prod.precio).toFixed(2)}€
                  </CardText>
                  <Button
                    color="success"
                    onClick={() => { }}
                  >
                    <i className="bi bi-cart-plus me-1"></i> Añadir al carrito
                  </Button>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Método auxiliar para asegurar que las URLs estén correctamente formateadas
 function getImageUrl(url) {
    if (!url) return "https://via.placeholder.com/300x200?text=Sin+imagen";
    
    // Si la URL es relativa (no comienza con http:// o https://)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Asumimos que es relativa a tu servidor
      return `http://localhost/server/${url}`;
    }
    
    return url;
  }


export default ListaProductos;