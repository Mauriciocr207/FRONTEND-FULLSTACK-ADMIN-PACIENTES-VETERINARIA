import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import usePacientes from "../hooks/usePacientes";


export default function Header() {

    const {cerrarSesion} = useAuth();
    const {setPacientes} = usePacientes();

    function closeSession() {
        setPacientes({});
        cerrarSesion();
    }

    return (<>
        <header className="py-10 bg-indigo-600 p-5">
            <div className="container mx-auto gap-5 flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-center font-bold text-2xl text-indigo-200">Administrador de Pacientes de <span className="text-white">Veterinaria</span></h1>
                <nav className="flex gap-4">
                    <Link to={"/admin"} className="text-white text-sm uppercase font-bold">Pacientes</Link>
                    <Link to={"/admin/perfil"} className="text-white text-sm uppercase font-bold">Perfil</Link>
                    <button onClick={closeSession} type="button" className="text-white text-sm uppercase font-bold">Cerrar Sesión</button>
                </nav>
            </div>

        </header>
    </>)
}