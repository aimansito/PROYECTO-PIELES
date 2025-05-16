import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table, Alert } from "reactstrap";
import axios from "axios";
import Login from "./Login";

const CarritoModal = ({ carrito, mostrar, toggle, usuarioActual, eliminarDelCarrito, cambiarCantidad, limpiarCarrito }) => {
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const total = carrito.reduce((suma, producto) => suma + producto.precio * producto.cantidad, 0);

  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);

  const guardarPedidoEnBD = async () => {
    try {
      if (!usuarioActual || !usuarioActual.id) {
        setMensaje({
          texto: "No se pudo identificar tu cuenta. Por favor, inicia sesión nuevamente.",
          tipo: "danger",
        });
        return false;
      }

      const API_URL = "http://localhost/server/crear_pedido.php";

      // Fecha actual en formato ISO 'YYYY-MM-DD HH:mm:ss'
      const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const dataPedido = {
        fecha: fechaActual,
        importe: total,
        id_cliente: usuarioActual.id,
      };

      const response = await axios.post(API_URL, dataPedido, { withCredentials: true });

      if (response.data?.success) {
        setMensaje({
          texto: "¡Compra realizada con éxito!",
          tipo: "success",
        });
        return true;
      } else {
        setMensaje({
          texto: response.data?.mensaje || "Error al procesar la compra",
          tipo: "danger",
        });
        return false;
      }
    } catch (error) {
      setMensaje({
        texto: "Error de conexión con el servidor",
        tipo: "danger",
      });
      return false;
    }
  };

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

    const exito = await guardarPedidoEnBD();

    setProcesando(false);

    if (exito) {
      if (limpiarCarrito) {
        limpiarCarrito(); // Limpiar carrito desde el padre
      }
      setTimeout(() => toggle(), 2000);
    }
  };

  return (
    <>
      <Modal isOpen={mostrar} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>CARRITO DE LA COMPRA</ModalHeader>
        <ModalBody>
          {mensaje.texto && <Alert color={mensaje.tipo}>{mensaje.texto}</Alert>}

          {usuarioActual ? (
            <Alert color="info" className="mb-3">
              <p className="mb-0"><strong>Cliente:</strong> {usuarioActual.nombre}</p>
              <p className="mb-0"><strong>ID Usuario:</strong> {usuarioActual.id}</p>
            </Alert>
          ) : (
            <Alert color="warning" className="mb-3">
              No has iniciado sesión.
              <Button color="link" className="p-0 ms-2" onClick={toggleLoginModal}>
                Inicia sesión aquí
              </Button>
              para completar tu compra.
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
                    <td>{(producto.precio * producto.cantidad).toFixed(2)}€</td>
                    <td>
                      <Button color="danger" size="sm" onClick={() => eliminarDelCarrito(producto.id)}>
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

