import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import useAuth from "../hooks/useAuth";

const PacientesContext = createContext();

export function PacientesProvider({children}) {
    const [pacientes, setPacientes] = useState([]);
    const [paciente, setPaciente] = useState({});
    const {auth} = useAuth();

    useEffect(() => {
        const obtenerPacientes = async () => {
            try {
                const jwt = localStorage.getItem('jwt');
                if(!jwt) {
                    return;
                }

                const {data:pacientes} = await clienteAxios('/pacientes', getRequestConfig());

                setPacientes(pacientes);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacientes();
    }, [auth]);


    function guardarPaciente(paciente) {
        return clienteAxios.post('/pacientes', paciente, getRequestConfig());
    }

    function actualizarPaciente(paciente) {
        return clienteAxios.put(`/pacientes/${paciente.id}`, paciente, getRequestConfig());
    }

    function borrarPaciente(id) {
        return clienteAxios.delete(`/pacientes/${id}`, getRequestConfig());
    }

    function getRequestConfig() {
        const jwt = localStorage.getItem('jwt');
        return {
            headers: {
                "Content-Type":"application/json",
                Authorization:`Bearer ${jwt}`,
            }
        }
    }

    function setEdicion(paciente) {
        setPaciente(paciente);
    }

    return (<>
        <PacientesContext.Provider
            value={{
                pacientes,
                setPacientes,
                setEdicion,
                paciente,
                setPaciente,
                guardarPaciente,
                actualizarPaciente,
                borrarPaciente
            }}
        >
            {children}
        </PacientesContext.Provider>
    </>)
}

export default PacientesContext;