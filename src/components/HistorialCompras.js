    import React, { Component } from 'react';
    import { Modal, ModalHeader, ModalBody, Table, Button, Alert, Spinner } from 'reactstrap';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import axios from 'axios';

    class HistorialCompras extends Component {
        constructor(props) {
            super(props);
            this.state = {
                pedidos: [],
                pedidosAgrupados: [],
                cargando: true,
                error: null,
                eliminando: false,
                mensajeExito: null
            };
        }

        componentDidMount() {
            this.cargarPedidos();
        }

        componentDidUpdate(prevProps) {
            if (!prevProps.mostrar && this.props.mostrar) {
                this.cargarPedidos();
            }
        }

        cargarPedidos = async () => {
            try {
                this.setState({ cargando: true, error: null });
                
                const { usuario, rol } = this.props;
                console.log("Cargando pedidos para:", usuario, "Rol:", rol);
                
                // Llamada al servidor para obtener los pedidos
                const respuesta = await axios.get('http://localhost/server/consultar_pedidos.php', {
                    params: {
                        usuario: usuario,
                        rol: rol
                    }
                });
                
                if (respuesta.data.error) {
                    this.setState({ error: respuesta.data.error, cargando: false });
                    return;
                }
                
                console.log("Pedidos cargados:", respuesta.data);
                
                // Si no hay pedidos, establecemos un array vacío
                if (!respuesta.data || respuesta.data.length === 0) {
                    this.setState({ 
                        pedidos: [],
                        pedidosAgrupados: [],
                        cargando: false 
                    });
                    return;
                }
                
                // Guardamos los datos originales
                this.setState({ pedidos: respuesta.data });
                
                const pedidosAgrupados = this.agruparPedidos(respuesta.data);
                
                this.setState({ 
                    pedidosAgrupados,
                    cargando: false 
                });
            } catch (error) {
                console.error("Error al cargar pedidos:", error);
                this.setState({ 
                    error: 'Error al cargar el historial de pedidos. Comprueba la conexión al servidor.', 
                    cargando: false 
                });
            }
        };
        
        // Función para agrupar los pedidos por id_pedido
        agruparPedidos = (datos) => {
            const pedidosMap = {};
            
            datos.forEach(item => {
                if (!pedidosMap[item.id_pedido]) {
                    pedidosMap[item.id_pedido] = {
                        id_pedido: item.id_pedido,
                        fecha: item.fecha,
                        usuario: item.nombre_usuario,
                        id_cliente: item.id_cliente,
                        importe: parseFloat(item.importe),
                        productos: []
                    };
                }
                
                pedidosMap[item.id_pedido].productos.push({
                    id_producto: item.id_producto,
                    nombre: item.nombre_producto || `Producto ID: ${item.id_producto}`,
                    cantidad: parseInt(item.cantidad),
                    precioTotal: parseFloat(item.importeProducto)
                });
            });
            
            // Convertimos el objeto en un array ordenado por id_pedido descendente
            return Object.values(pedidosMap).sort((a, b) => b.id_pedido - a.id_pedido);
        };
        
        // Función para formatear la fecha
        formatearFecha = (fechaStr) => {
            if (!fechaStr) return '';
            
            try {
                const fecha = new Date(fechaStr);
                return fecha.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) {
                return fechaStr; 
            }
        };
        
        // Función para eliminar un pedido
        eliminarPedido = async (idPedido) => {
            try {
                this.setState({ eliminando: true, mensajeExito: null, error: null });
                
                const respuesta = await axios.post('http://localhost/server/borrar_pedidos.php', {
                    id_pedido: idPedido
                });
                
                console.log("Respuesta al eliminar:", respuesta.data);
                
                if (respuesta.data.error) {
                    this.setState({ 
                        error: `Error al eliminar el pedido: ${respuesta.data.error}`,
                        eliminando: false
                    });
                    return;
                }
                
                // Actualizamos el estado eliminando el pedido
                const pedidosActualizados = this.state.pedidosAgrupados.filter(
                    pedido => pedido.id_pedido !== idPedido
                );
                
                this.setState({
                    pedidosAgrupados: pedidosActualizados,
                    mensajeExito: `Pedido #${idPedido} eliminado correctamente`,
                    eliminando: false
                });
                
                // Limpiamos el mensaje después de 3 segundos
                setTimeout(() => {
                    this.setState({ mensajeExito: null });
                }, 3000);
                
            } catch (error) {
                console.error("Error al eliminar pedido:", error);
                this.setState({ 
                    error: 'Error al eliminar el pedido. Comprueba la conexión al servidor.',
                    eliminando: false
                });
            }
        };

        render() {
            const { mostrar, toggle, rol } = this.props;
            const { pedidosAgrupados, cargando, error, eliminando, mensajeExito } = this.state;

            return (
                <Modal isOpen={mostrar} toggle={toggle} size="lg">
                    <ModalHeader toggle={toggle}>
                        {rol === 'admin' ? 'Gestión de Pedidos' : 'Mis Pedidos'}
                    </ModalHeader>
                    <ModalBody>
                        {mensajeExito && (
                            <Alert color="success">{mensajeExito}</Alert>
                        )}
                        
                        {error && (
                            <Alert color="danger">{error}</Alert>
                        )}
                        
                        {cargando ? (
                            <div className="text-center p-4">
                                <Spinner color="primary" />
                                <p className="mt-2">Cargando pedidos...</p>
                            </div>
                        ) : pedidosAgrupados.length === 0 ? (
                            <Alert color="info">No hay pedidos registrados.</Alert>
                        ) : (
                            pedidosAgrupados.map((pedido) => (
                                <div key={pedido.id_pedido} className="mb-5 border-bottom pb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5>
                                            Pedido #{pedido.id_pedido}
                                            {pedido.fecha && ` - ${this.formatearFecha(pedido.fecha)}`}
                                        </h5>
                                        
                                        {rol === 'admin' && (
                                            <Button 
                                                color="danger" 
                                                size="sm"
                                                onClick={() => this.eliminarPedido(pedido.id_pedido)}
                                                disabled={eliminando}
                                            >
                                                {eliminando ? 'Eliminando...' : 'Eliminar Pedido'}
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {pedido.usuario && (
                                        <p>
                                            <strong>Cliente:</strong> {pedido.usuario} 
                                            {pedido.id_cliente && ` (ID: ${pedido.id_cliente})`}
                                        </p>
                                    )}
                                    
                                    <Table striped responsive>
                                        <thead>
                                            <tr>
                                                <th>ID Producto</th>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Importe</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedido.productos.map((producto, idx) => (
                                                <tr key={`${pedido.id_pedido}-${idx}`}>
                                                    <td>{producto.id_producto}</td>
                                                    <td>{producto.nombre}</td>
                                                    <td>{producto.cantidad}</td>
                                                    <td>{producto.precioTotal.toFixed(2)}€</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3"><strong>Total del Pedido:</strong></td>
                                                <td><strong>{pedido.importe.toFixed(2)}€</strong></td>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </div>
                            ))
                        )}
                        
                        {rol === 'admin' && (
                            <div className="text-muted mt-4">
                                <small>* Como administrador, puedes ver todos los pedidos y eliminarlos del sistema.</small>
                            </div>
                        )}
                    </ModalBody>
                </Modal>
            );
        }
    }

    export default HistorialCompras;