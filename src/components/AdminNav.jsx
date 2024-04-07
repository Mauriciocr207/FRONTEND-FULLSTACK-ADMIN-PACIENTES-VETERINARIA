import { Link } from "react-router-dom";

export default function AdminNav() {
    return (<>
        <nav className="flex gap-3">
            <Link to={"/admin/perfil"}
                className="font-bold uppercase text-gray-500"
            >Perfil</Link>
            <Link to={"/admin/reset_password"}
                className="font-bold uppercase text-gray-500"
            >Cambiar Contraseña</Link>
        </nav>
    </>)
}