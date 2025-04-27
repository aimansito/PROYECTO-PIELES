import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from "reactstrap";

const Carrito = ({ carrito, modificarCarrito, mostrar, toggle, usuarioActual }) => {
    console.log("Usuario carrito: " + usuarioActual);
    const [dir, setDir] = useState("");
    const [tlf, setTlf] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "dir") setDir(value);
        if (name === "tlf") setTlf(value);
    };

    // Aquí se gestiona la eliminación de productos si la cantidad llega a 0
    const lista = carrito.length > 0 ? (
        carrito.map(e => (
            <div key={e.id} className="d-flex justify-content-between align-items-center">
                <p className="mb-0">{e.nombre} - {e.cantidad}</p>
                <div>
                    <Button color="success" size="sm" onClick={() => modificarCarrito(e.id, e.nombre, e.precio, 1)}>+</Button>
                    <Button color="danger" size="sm" onClick={() => modificarCarrito(e.id, e.nombre, e.precio, -1)}>-</Button>
                </div>
            </div>
        ))
    ) : (
        <p>El carrito está vacío</p>
    );

    const confirmarCompra = () => {
        const datosCompra = {
            usuarioActual: usuarioActual,
            direccion: dir,
            telefono: tlf,
            productos: carrito.map(e => ({
                id: e.id,
                nombre: e.nombre,
                cantidad: e.cantidad,
                precioTotal: e.cantidad * Number(e.precio)
            })),
            totalCompra: carrito.reduce((acc, e) => acc + e.cantidad * Number(e.precio), 0)
        };

        fetch("http://localhost:5000/guardar-compra", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosCompra)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.mensaje);
            modificarCarrito([]); 
            toggle(); 
        })
        .catch(error => console.error("Error al guardar la compra:", error));
    };

    return (
        <Modal isOpen={mostrar} toggle={toggle}>
            <ModalHeader toggle={toggle}>CARRITO DE LA COMPRA</ModalHeader>
            <ModalBody>
                {lista}

                <FormGroup>
                    <Label>Dirección</Label>
                    <Input
                        type="text"
                        name="dir"
                        value={dir}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Teléfono</Label>
                    <Input
                        type="text"
                        name="tlf"
                        value={tlf}
                        onChange={handleChange}
                    />
                </FormGroup>
            </ModalBody>

            <ModalFooter>
                <Button color="success" onClick={confirmarCompra}>Confirmar Compra</Button>
                <Button color="primary" onClick={toggle}>Cerrar</Button>
            </ModalFooter>
        </Modal>
    );
};

export default Carrito;