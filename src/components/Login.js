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
      
      // Depuración de la respuesta completa
      console.log("Respuesta completa del servidor:", response);
      
      if (data.success) {
        // Verificamos explícitamente que el objeto usuario tenga un id
        console.log("Datos de usuario recibidos:", data.usuario);
        
        if (!data.usuario.id) {
          console.error("ADVERTENCIA: El objeto usuario no contiene un ID válido");
          
          // Si no hay id en la respuesta pero hay un id_cliente, lo usamos
          if (data.usuario.id_cliente) {
            console.log("Usando id_cliente como ID:", data.usuario.id_cliente);
            // Creamos una copia del objeto usuario con el id correcto
            const usuarioConId = {
              ...data.usuario,
              id: data.usuario.id_cliente
            };
            // Llamamos a onLoginSuccess con el objeto modificado
            this.props.onLoginSuccess(true, usuarioConId, data.usuario.rol);
          } else {
            // Si no hay ningún tipo de ID, alertamos al usuario
            alert("Error: La respuesta del servidor no incluye un ID de usuario válido.");
            return;
          }
        } else {
          // Si todo está bien, continuamos normalmente
          this.props.onLoginSuccess(true, data.usuario, data.usuario.rol);
        }
        
        this.props.toggle();
      } else {
        alert(data.mensaje || "Error de autenticación");
      }
    } catch (error) {
      console.error("Error en login:", error);
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
