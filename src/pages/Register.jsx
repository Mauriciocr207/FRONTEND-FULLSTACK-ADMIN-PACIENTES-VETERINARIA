import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alert";
import clienteAxios from "../config/axios";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { AxiosError } from "axios";


export default function Register() {
    const [name, setName] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loader, setLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);
    function closeModal() {
        setShowModal(false)
    }

    const [alerta, setAlerta] = useState(null);


    async function handleSubmit(e) {     
        try {
            e.preventDefault();
            if([name, email, password, confirmPassword].includes('')) {
                throw new Error("Hay campos vacíos");
            }
    
            if(password !== confirmPassword) {
                throw new Error("Las contraseñas no coinciden");
            }
    
            if(password.length < 6) {
                throw new Error("La contraseña debe tener al menos 6 caracteres");
            }
    
            setAlerta(null);


            setLoader(true);
            await clienteAxios.post('/veterinarios', {name, email, password});
            setAlerta(<Alerta error={false} message={"Creado correctamente, revisa tu email para confirmar"}/>);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setShowModal(true);
            setLoader(false);
            setShowForm(false);
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
            <h1 className="text-center text-indigo-600 font-black text-6xl">Crea tu cuenta y administra <span className="text-black">tus Pacientes</span></h1>
        </div>
        <div className="mt-20 md:mt-5 shadow p-10 rounded-lg bg-white">
        <h1 className="text-center text-indigo-600 font-black text-2xl">Registro</h1>
            {alerta ?? ''}
            <Modal title={"Registro exitoso"} open={showModal} onClose={closeModal}>
                <p>Hemos enviado un correo a tu email para confirmar tu cuenta.</p>
            </Modal>
            {showForm && (<>
                <form 
                    className="flex flex-col gap-5 mt-5" 
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label 
                            className="text-centertext-gray-600 block text-lg font-bold"
                        >Nombre</label>
                        <input 
                            type="text" 
                            placeholder="Tu Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border w-full px-5 py-2 mt-3 bg-gray-50 rounded-md"/>
                    </div>
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
                    <div>
                        <label 
                            className="text-centertext-gray-600 block text-lg font-bold"
                        >Confirmar contraseña</label>
                        <input 
                            type="password" 
                            placeholder="confirma tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border w-full px-5 py-2 mt-3 bg-gray-50 rounded-md"/>
                    </div>

                    <button type="submit" className="mt-5 w-[10rem] bg-indigo-700 hover:bg-indigo-800 p-3 rounded-lg text-white font-medium cursor-pointer">
                        {loader ? <Loader/>:"Crear cuenta"}
                    </button>
                </form>
            </>)}
            <nav className="mt-5 text-slate-400 font-medium flex flex-col items-center gap-1">
                <Link to="/" className="block hover:text-indigo-800">Inciar sesión</Link>
                <Link to="/password_reset" className="block hover:text-indigo-800">¿Olvidaste tu contraseña?</Link>
            </nav>
        </div>
    </>)
}