import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import Alerta from "../components/Alert";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import clienteAxios from "../config/axios";

export default function ConfirmAccount() {
    const {token} = useParams();
    const [alerta, setAlerta] = useState(null);
    const [showModal, setShowModal] = useState(false);
    function closeModal() {
        setShowModal(false);
    }

    const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

    const confirmarCuenta = async () => {
        try {
            const url = `/veterinarios/confirmar/${token}`;
            await clienteAxios.get(url);
            setAlerta(<Alerta error={false} message={'Confirmado correctamente'}/>);
            setShowModal(true);
            setCuentaConfirmada(true);
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
        }
    }

    useEffect(() => {
        confirmarCuenta();
    }, []);

    return (<>
        <div>
            <h1 className="text-center text-indigo-600 font-black text-6xl">Confirma tu cuenta</h1>
        </div>
        <div className="mt-20 md:mt-5 shadow p-10 rounded-lg bg-white">
            {alerta ?? ''}
            <Modal title={"Confirmado correctamente"} open={showModal} onClose={closeModal}>
                <p>Tu cuenta ha sido confirmada</p>
            </Modal>
            <nav className="mt-5 text-slate-400 font-medium flex flex-col items-center gap-1">
                <Link to="/" className="block hover:text-indigo-800">Inciar sesión</Link>
                {cuentaConfirmada && <Link to="/password_reset" className="block hover:text-indigo-800">¿Olvidaste tu contraseña?</Link>}
            </nav>
        </div>
    </>)
}