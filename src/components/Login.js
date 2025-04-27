import React, { Component } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { Navigate } from "react-router-dom";
import { PHPLOGIN } from './Datos';
import 'bootstrap/dist/css/bootstrap.min.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: "",
            clave: "",
            redirigir: false
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleLogin = async () => {
        const { usuario, clave } = this.state;
        const datos = { usuario, clave };
    
        try {
            const response = await fetch(PHPLOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });
    
            const resultado = await response.json();
            if (resultado.success) {
                alert("Inicio de sesión exitoso.");

                this.props.setLogged(true, resultado.usuario); 
                this.setState({ redirigir: true });
                console.log("Usuario logueado:", resultado.usuario);
            } else {
                alert(resultado.mensaje);
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
        }
    };

    render() {
        if (this.state.redirigir) {
            return <Navigate to="/" />;
        }

        return (
            <div className="container mt-5">
                <h2>Iniciar Sesión</h2>
                <FormGroup>
                    <Label>Nombre:</Label>
                    <Input
                        id="usuario"
                        name="usuario"
                        type="text"
                        value={this.state.usuario}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Contraseña:</Label>
                    <Input
                        id="clave"
                        name="clave"
                        type="password"
                        value={this.state.clave}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <Button color="primary" onClick={this.handleLogin}>Aceptar</Button>
            </div>
        );
    }
}

export default Login;