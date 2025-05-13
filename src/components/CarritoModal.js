import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from "reactstrap";

const CarritoModal = ({ carrito, mostrar, toggle, usuarioActual }) => {
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "direccion") setDireccion(value);
        if (name === "telefono") setTelefono(value);
    };

    const confirmarCompra = () => {
        if (!usuarioActual) {
            alert("Debes iniciar sesión para realizar una compra.");
            return;
        }

        if (!direccion || !telefono) {
            alert("Debes completar todos los campos de dirección y teléfono.");
            return;
        }

        alert("Compra realizada con éxito.");
        toggle();
    };

    return (
        <Modal isOpen={mostrar} toggle={toggle}>
            <ModalHeader toggle={toggle}>CARRITO DE LA COMPRA</ModalHeader>
            <ModalBody>
                {carrito.length > 0 ? carrito.map((producto) => (
                    <div key={producto.id}>
                        {producto.nombre} - {producto.cantidad} unidades
                    </div>
                )) : <p>El carrito está vacío</p>}

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
                <Button color="success" onClick={confirmarCompra}>Confirmar Compra</Button>
                <Button color="secondary" onClick={toggle}>Cerrar</Button>
            </ModalFooter>
        </Modal>
    );
};

export default CarritoModal;
