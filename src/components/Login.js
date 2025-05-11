// src/components/Login.js
import React, { Component } from "react";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, FormGroup, Label, Input, Button } from "reactstrap";

class Login extends Component {
  state = {
    modalOpen: false,
    usuario: "",
    clave: ""
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  handleLogin = async () => {
    const { usuario, clave } = this.state;
    try {
      const response = await axios.post("http://localhost/server/login.php", { nombre: usuario, clave: clave });
      if (response.data.success) {
        this.props.setLogged(true, response.data.usuario.nombre);
        this.toggleModal();
      } else {
        alert(response.data.mensaje);
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  render() {
    return (
      <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>Iniciar Sesión</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Usuario</Label>
            <Input type="text" onChange={(e) => this.setState({ usuario: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label>Contraseña</Label>
            <Input type="password" onChange={(e) => this.setState({ clave: e.target.value })} />
          </FormGroup>
          <Button color="primary" onClick={this.handleLogin}>Ingresar</Button>
        </ModalBody>
      </Modal>
    );
  }
}

export default Login;
