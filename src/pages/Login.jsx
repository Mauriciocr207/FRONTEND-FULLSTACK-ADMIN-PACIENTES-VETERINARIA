import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Alerta from "../components/Alert";
import { AxiosError } from "axios";
import clienteAxios from "../config/axios";
import Loader from "../components/Loader";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAuth } = useAuth();
    const [alerta, setAlerta] = useState(null);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        try {
            e.preventDefault();

            if([email, password].includes('')) {
                throw new Error('Todos los campos son obligatorios');
            }

            setLoader(true);
            const {data} = await clienteAxios.post('veterinarios/login', {
                email, password
            });
            
            localStorage.setItem('jwt', data.json_web_token);

            setAuth(data);
            navigate("/admin") 
        } catch (error) {
            console.log(error);
            if( error instanceof AxiosError) {
                if(error.code === "ERR_NETWORK") {
                    setAlerta(<Alerta error={true} message={"Ha ocurrido un error al hacer el registro. Inténtalo de nuevo más tarde"}/>)    
                } else {
                    setAlerta(<Alerta error={true} message={error.response.data.error}/>)
                }
            } else {
                setAlerta(<Alerta error={true} message={error.message}/>)
            }
            setLoader(false);
        }
    }
    

    return (<>
        <div>
            <h1 className="text-center text-indigo-600 font-black text-6xl">Inicia Sesión y administra <span className="text-black">tus Pacientes</span></h1>
        </div>
        <div className="mt-20 md:mt-5 shadow p-10 rounded-lg bg-white">
        <h1 className="text-center text-indigo-600 font-black text-2xl">Inicia Sesión</h1>
            {alerta ?? ''}
            <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
                <div>
                    <label 
                        className="text-centertext-gray-600 block text-lg font-bold"
                    >Email</label>
                    <input 
                        type="email" 
                        placeholder="Tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border w-full px-5 py-2 mt-3 bg-gray-50 rounded-md"/>
                </div>
                <div>
                    <label 
                        className="text-centertext-gray-600 block text-lg font-bold"
                    >Contraseña</label>
                    <input 
                        type="password" 
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border w-full px-5 py-2 mt-3 bg-gray-50 rounded-md"/>
                </div>
                <button type="submit" className="mt-5 w-[10rem] bg-indigo-700 hover:bg-indigo-800 p-3 rounded-lg text-white font-medium cursor-pointer">
                    {loader ? <Loader/>:"Iniciar Sesión"}
                </button>
            </form>
            <nav className="mt-5 text-slate-400 font-medium flex flex-col items-center gap-1">
                <Link to="/registrar" className="block hover:text-indigo-800">Crea tu cuenta</Link>
                <Link to="/password_reset" className="block hover:text-indigo-800">¿Olvidaste tu contraseña?</Link>
            </nav>
        </div>
    </>)
}