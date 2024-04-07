import { Link } from "react-router-dom";
import Alerta from "../components/Alert";
import Loader from "../components/Loader";
import { useState } from "react";
import Modal from "../components/Modal";
import clienteAxios from "../config/axios";
import { AxiosError } from "axios";

export default function ForgotPassword() {
    const [showForm, setShowForm] = useState(true);
    const [email, setEmail] = useState('');
    const [loader, setLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);
    function closeModal() {
        setShowModal(false)
    }
    const [alerta, setAlerta] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if(email === "") {
                throw new Error('El email es obligatorio');
            }

            setAlerta(null);
            setLoader(true);

            await clienteAxios.post('/veterinarios/password_reset', { email });
            
            setAlerta(<Alerta error={false} message={"Enviado correctamente"}/>);
            setEmail('');
            setShowModal(true);
            setLoader(false);
            setShowForm(false);
        } catch (error) {
            if( error instanceof AxiosError) {
                if(error.code === "ERR_NETWORK") {
                    setAlerta(<Alerta error={true} message={"Ha ocurrido un error al enviar el email. Inténtalo de nuevo más tarde"}/>)    
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
            <h1 className="text-center text-indigo-600 font-black text-6xl">Recupera tu acceso y no pierdas a <span className="text-black">tus Pacientes</span></h1>
        </div>
        <div className="mt-20 md:mt-5 shadow p-10 rounded-lg bg-white">
        <h1 className="text-center text-indigo-600 font-black text-2xl">Enviaremos un email para cambiar tu contraseña</h1>
            {alerta ?? ''}
            <Modal title={"Email enviado"} open={showModal} onClose={closeModal}>
                <p>Hemos enviado un correo a tu email para reestablecer tu contraseña</p>
            </Modal>
            {showForm && (<>
                <form 
                    className="flex flex-col gap-5 mt-5" 
                    onSubmit={handleSubmit}
                >
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

                    <button type="submit" className=" w-[10rem] bg-indigo-700 hover:bg-indigo-800 p-3 rounded-lg text-white font-medium cursor-pointer">
                        {loader ? <Loader/>:"Enviar email"}
                    </button>
                </form>
            </>)}
            <nav className="mt-5 text-slate-400 font-medium flex flex-col items-center gap-1">
                <Link to="/" className="block hover:text-indigo-800">Inicia Sesión</Link>
                <Link to="/registrar" className="block hover:text-indigo-800">Crea tu cuenta</Link>
            </nav>
        </div>
    </>)
}