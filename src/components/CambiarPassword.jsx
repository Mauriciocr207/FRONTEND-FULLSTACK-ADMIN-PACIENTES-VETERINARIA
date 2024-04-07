import AdminNav from "./AdminNav";
import Modal from "./Modal";
import { AxiosError } from "axios";
import Alerta from "./Alert";
import Loader from "./Loader";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function CambiarPassword() {
    const {auth, actualizarPasswordVeterinario} = useAuth();
    const [loader, setLoader] = useState(false);
    const [alerta, setAlerta] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    function closeModal() {
        setShowModal(false)
    }

    async function handleSubmit(e) {
        try {
            e.preventDefault();

            if([password, newPassword].includes('')) {
                throw new Error('Hay campos vacíos');
            }

            if(newPassword.length < 6) {
                throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
            }

            setLoader(true);

            await actualizarPasswordVeterinario(password, newPassword);

            setAlerta(<Alerta error={false} message={"Se ha cambiado tu contraseña correctamente"}/>);
            setShowModal(true);
            setLoader(false);
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
        <AdminNav/>

        <h2 className="font-black text-3xl text-center mt-10">Cambiar contraseña</h2>
        <p className="text-xl mt-5 mb-10 text-center">Modifica tu <span className="text-indigo-600 font-normal">contraseña</span></p>

        <div className="flex justify-center">
            <div className="w-full md:w-1/2 bg-white shadow rounded-lg p-5">
                {alerta ?? ''}
                <Modal title={"Guardado"} open={showModal} onClose={closeModal}>
                    <p>Se ha actualizado tu perfil</p>
                </Modal>
                <form onSubmit={handleSubmit}>
                    <div className="my-3">
                        <label htmlFor="old-password" className="uppercase font-bold text-gray-600">Contraseña Actual</label>
                        <p className="mt-2 text-slate-500">Escribe tu contraseña actual para validar tu identidad</p>
                        <input type="password" name="old-password" className="border bg-gray-50 w-full p-2 mt-5 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="my-5">
                        <label htmlFor="new-password" className="uppercase font-bold text-gray-600">Nueva Contraseña</label>
                        <p className="mt-2 text-slate-500">Escribe tu nueva contraseña</p>
                        <input type="password" name="new-password" className="border bg-gray-50 w-full p-2 mt-5 rounded-lg" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>

                    <button type="submit" className="mt-5 w-[10rem] bg-indigo-700 hover:bg-indigo-800 p-3 rounded-lg text-white font-medium cursor-pointer">
                        {loader ? <Loader/>:"Guardar Cambios"}
                    </button>
                </form>
            </div>
        </div>
    </>)
}