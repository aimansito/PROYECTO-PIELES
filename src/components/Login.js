// src/components/Login.js
import React, { Component } from "react";
import { Button, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

class Login extends Component {
  state = {
    nombre: "",
    clave: ""
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = async () => {
    const { nombre, clave } = this.state;

    if (!nombre || !clave) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await axios.post("http://localhost/server/login.php", {
        nombre,
        clave
      });

      const data = response.data;
      if (data.success) {
        this.props.onLoginSuccess(data.usuario.nombre);
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  render() {
    const { isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Iniciar Sesión</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="nombre">Usuario</Label>
            <Input 
              type="text" 
              name="nombre" 
              value={this.state.nombre} 
              onChange={this.handleChange} 
              placeholder="Ingresa tu nombre de usuario" 
            />
          </FormGroup>
          <FormGroup>
            <Label for="clave">Contraseña</Label>
            <Input 
              type="password" 
              name="clave" 
              value={this.state.clave} 
              onChange={this.handleChange} 
              placeholder="Ingresa tu contraseña" 
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleLogin}>Aceptar</Button>
          <Button color="secondary" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default Login;
