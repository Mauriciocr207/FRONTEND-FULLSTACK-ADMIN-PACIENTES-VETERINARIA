import { useState, createContext, useEffect } from "react";
import clienteAxios from "../config/axios";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [auth, setAuth] = useState({});
    const [loadAuthResponse, setLoadAuthResponse] = useState(false);

    useEffect(() => {
        const autenticarUsuario = async () => {
            try {
                const token = localStorage.getItem('jwt');

                if(token) {
                    const config = {
                        headers: {
                            "Content-Type":"application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }

                    const {data:{veterinario}} = await clienteAxios('/veterinarios/perfil', config);

                    setAuth(veterinario);
                } else {
                    setAuth({});
                }
            } catch (error) {
                console.log(error.response.data.error);
                setAuth({});
                console.log('hey');
            }

            setLoadAuthResponse(true);
        }
        autenticarUsuario();
    }, [loadAuthResponse]);

    function cerrarSesion() {
        localStorage.removeItem('jwt');
        setAuth({});
    }

    function actualizarVeterinario(perfil) {
        const token = localStorage.getItem('jwt');
        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
        return clienteAxios.put(`/veterinarios/perfil/${perfil._id}`, perfil, config);
    }

    function actualizarPasswordVeterinario(password, newPassword) {
        const token = localStorage.getItem('jwt');
        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
        return clienteAxios.put('/veterinarios/update-password', {password, newPassword}, config);
    }

    return (<>
        <AuthContext.Provider 
            value={{
                auth,
                setAuth,
                loadAuthResponse,
                setLoadAuthResponse,
                cerrarSesion,
                actualizarVeterinario,
                actualizarPasswordVeterinario
            }}
        >
            {children}
        </AuthContext.Provider>
    </>)
}

export default AuthContext;