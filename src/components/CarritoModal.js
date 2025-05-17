import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Alert,
} from "reactstrap";
import axios from "axios";
import Login from "./Login";

const CarritoModal = ({
  carrito,
  mostrar,
  toggle,
  usuarioActual,
  eliminarDelCarrito,
  cambiarCantidad,
  limpiarCarrito,
}) => {
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const total = carrito.reduce(
    (suma, producto) => suma + producto.precio * producto.cantidad,
    0
  );

  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);

  // ✅ Guardar Pedido en BD (solo pedidos)
  const guardarPedidoEnBD = async () => {
    try {
      if (!usuarioActual || !usuarioActual.id) {
        setMensaje({
          texto:
            "No se pudo identificar tu cuenta. Por favor, inicia sesión nuevamente.",
          tipo: "danger",
        });
        return false;
      }

      const API_URL = "http://localhost/server/crear_pedido.php";
      const dataPedido = {
        id_cliente: usuarioActual.id,
        importe: total,
      };

      const response = await axios.post(API_URL, dataPedido);

      if (response.data?.success) {
        return response.data.id_pedido;
      } else {
        setMensaje({
          texto: response.data?.mensaje || "Error al procesar el pedido",
          tipo: "danger",
        });
        return null;
      }
    } catch (error) {
      setMensaje({
        texto: "Error de conexión con el servidor",
        tipo: "danger",
      });
      return null;
    }
  };

  // ✅ Guardar Detalles del Pedido en BD (pedidos_productos)
  const guardarDetallesPedidoEnBD = async (idPedido) => {
    try {
      const API_URL = "http://localhost/server/crear_detalles_pedido.php";
      const productos = carrito.map((producto) => ({
        id_pedido: idPedido,
        id_producto: producto.id,
        cantidad: producto.cantidad,
        importeProducto: producto.precio * producto.cantidad,
      }));

      const response = await axios.post(API_URL, { productos });

      return response.data?.success;
    } catch (error) {
      setMensaje({
        texto: "Error al guardar los productos del pedido",
        tipo: "danger",
      });
      return false;
    }
  };

  // ✅ Confirmar Compra
  const confirmarCompra = async () => {
    if (carrito.length === 0) {
      setMensaje({
        texto: "El carrito está vacío",
        tipo: "warning",
      });
      return;
    }

    if (!usuarioActual) {
      setMensaje({
        texto: "Debes iniciar sesión para realizar la compra",
        tipo: "warning",
      });
      toggleLoginModal();
      return;
    }

    setProcesando(true);
    setMensaje({ texto: "", tipo: "" });

    const idPedido = await guardarPedidoEnBD();
    
    if (idPedido) {
      const exito = await guardarDetallesPedidoEnBD(idPedido);

      if (exito) {
        setMensaje({
          texto: "¡Compra realizada con éxito!",
          tipo: "success",
        });
        if (limpiarCarrito) limpiarCarrito();
        setTimeout(() => toggle(), 2000);
      } else {
        setMensaje({
          texto: "Error al guardar los productos del pedido",
          tipo: "danger",
        });
      }
    }

    setProcesando(false);
  };

  return (
    <>
      <Modal isOpen={mostrar} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>CARRITO DE LA COMPRA</ModalHeader>
        <ModalBody>
          {mensaje.texto && <Alert color={mensaje.tipo}>{mensaje.texto}</Alert>}

          {usuarioActual ? (
            <Alert color="info" className="mb-3">
              <p className="mb-0">
                <strong>Cliente:</strong> {usuarioActual.nombre}
              </p>
              <p className="mb-0">
                <strong>ID Usuario:</strong> {usuarioActual.id}
              </p>
            </Alert>
          ) : (
            <Alert color="warning" className="mb-3">
              No has iniciado sesión.
              <Button color="link" className="p-0 ms-2" onClick={toggleLoginModal}>
                Inicia sesión aquí
              </Button>
            </Alert>
          )}

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
                    <td>{producto.precio.toFixed(2)}€</td>
                    <td>{producto.cantidad}</td>
                    <td>{(producto.precio * producto.cantidad).toFixed(2)}€</td>
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
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={confirmarCompra} disabled={carrito.length === 0 || procesando}>
            {procesando ? "Procesando..." : "Confirmar Compra"}
          </Button>
          <Button color="secondary" onClick={toggle} disabled={procesando}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de Login */}
      <Login isOpen={showLoginModal} toggle={toggleLoginModal} onLoginSuccess={() => {}} />
    </>
  );
};

export default CarritoModal;
