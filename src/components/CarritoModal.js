import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Table } from "reactstrap";
import axios from "axios";

const CarritoModal = ({ carrito, mostrar, toggle, usuarioActual, eliminarDelCarrito, cambiarCantidad }) => {
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [procesando, setProcesando] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "direccion") setDireccion(value);
    if (name === "telefono") setTelefono(value);
  };

  const guardarPedidoEnBD = async () => {
    try {
      const API_URL = "http://localhost/server/guardar_pedido.php";
      
      // Preparamos los datos del pedido
      const dataPedido = {
        id_cliente: usuarioActual.id, // Asumimos que el objeto usuarioActual tiene un campo id
        importe: total
      };

      // Llamamos a la API para guardar el pedido usando axios
      const response = await axios.post(API_URL, dataPedido);
      
      if (response.data?.success) {
        // Si el pedido se guardó con éxito, ahora guardamos los detalles del pedido
        const idPedido = response.data.id_pedido;
        
        // Aquí podrías guardar también los productos del pedido en otra tabla si es necesario
        // Por ejemplo, una tabla detalle_pedidos con los productos, cantidades, etc.
        
        return true;
      } else {
        console.error("Error al guardar el pedido:", response.data?.error);
        return false;
      }
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      return false;
    }
  };

  const confirmarCompra = async () => {
    // Verificamos si hay productos en el carrito
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Verificamos que los campos de dirección y teléfono estén completos
    if (!direccion || !telefono) {
        alert("Debes completar todos los campos de dirección y teléfono.");
        return;
    }

    setProcesando(true);

    // Guardamos el pedido en la base de datos
    const resultado = await guardarPedidoEnBD();

    setProcesando(false);

    if (resultado) {
        alert("Compra realizada con éxito.");
        toggle();
    } else {
        alert("Ha ocurrido un error al procesar la compra. Por favor, inténtalo de nuevo.");
    }
};

  // Calcular el total del carrito
  const total = carrito.reduce((suma, producto) => {
    return suma + (producto.precio * producto.cantidad);
  }, 0);

  return (
    <Modal isOpen={mostrar} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>CARRITO DE LA COMPRA</ModalHeader>
      <ModalBody>
        {carrito.length > 0 ? (
          <Table hover responsive>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{parseFloat(producto.precio).toFixed(2)}€</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button 
                        size="sm" 
                        color="secondary"
                        onClick={() => cambiarCantidad(producto.id, producto.cantidad - 1)}
                        disabled={producto.cantidad <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-2">{producto.cantidad}</span>
                      <Button 
                        size="sm" 
                        color="secondary"
                        onClick={() => cambiarCantidad(producto.id, producto.cantidad + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>{(parseFloat(producto.precio) * producto.cantidad).toFixed(2)}€</td>
                  <td>
                    <Button 
                      color="danger" 
                      size="sm"
                      onClick={() => eliminarDelCarrito(producto.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-end fw-bold">Total:</td>
                <td className="fw-bold">{total.toFixed(2)}€</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <p>El carrito está vacío</p>
        )}
        <FormGroup className="mt-3">
          <Label>Dirección</Label>
          <Input type="text" name="direccion" value={direccion} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label>Teléfono</Label>
          <Input type="text" name="telefono" value={telefono} onChange={handleChange} />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button 
          color="success" 
          onClick={confirmarCompra} 
          disabled={carrito.length === 0 || procesando}
        >
          {procesando ? "Procesando..." : "Confirmar Compra"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={procesando}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CarritoModal;