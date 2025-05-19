import React from "react";
import { Modal, Button } from "react-bootstrap";

const MensajeModal = ({ mostrar, tipo, texto, cerrarMensaje }) => {
  // Determinar la clase según el tipo de mensaje
  const getClaseEstilo = () => {
    switch (tipo) {
      case "error":
        return "text-danger";
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "info":
        return "text-info";
      default:
        return "text-dark";
    }
  };

  return (
    <Modal show={mostrar} onHide={cerrarMensaje} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {tipo === "error" && "Error"}
          {tipo === "success" && "¡Éxito!"}
          {tipo === "warning" && "Advertencia"}
          {tipo === "info" && "Información"}
          {!["error", "success", "warning", "info"].includes(tipo) && "Mensaje"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={getClaseEstilo()}>{texto}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cerrarMensaje}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MensajeModal;