import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import AdminNav from "./AdminNav";
import Modal from "./Modal";
import { AxiosError } from "axios";
import Alerta from "./Alert";
import Loader from "./Loader";

export default function EditarPerfil() {
    const {auth, setAuth, actualizarVeterinario} = useAuth();
    const [loader, setLoader] = useState(false);
    const [alerta, setAlerta] = useState(null);
    const [showModal, setShowModal] = useState(false);
    function closeModal() {
        setShowModal(false)
    }

    const [perfil, setPerfil] = useState({});

    useEffect(() => {
        setPerfil(auth);
    }, []);

    function handleOnChangeInput(e) {
        setPerfil({
            ...perfil, 
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            
            const {name, email} = perfil;

            if([name, email].includes('')) {
                throw new Error('Nombre e Email son obligatorios');
            }

            setLoader(true);

            await actualizarVeterinario(perfil);

            setAuth(perfil);
            setAlerta(<Alerta error={false} message={"Cambios guardados"}/>);
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

        <h2 className="font-black text-3xl text-center mt-10">Editar Perfil</h2>
        <p className="text-xl mt-5 mb-10 text-center">Modifica tu <span className="text-indigo-600 font-normal">información</span></p>

        <div className="flex justify-center">
            <div className="w-full md:w-1/2 bg-white shadow rounded-lg p-5">
                {alerta ?? ''}
                <Modal title={"Guardado"} open={showModal} onClose={closeModal}>
                    <p>Se ha actualizado tu perfil</p>
                </Modal>
                <form onSubmit={handleSubmit}>
                    <div className="my-3">
                        <label htmlFor="name" className="uppercase font-bold text-gray-600">Nombre</label>
                        <input type="text" name="name" className="border bg-gray-50 w-full p-2 mt-5 rounded-lg" value={perfil.name || ''} onChange={handleOnChangeInput}/>
                    </div>
                    <div className="my-3">
                        <label htmlFor="web" className="uppercase font-bold text-gray-600">Sitio Web</label>
                        <input type="text" name="web" className="border bg-gray-50 w-full p-2 mt-5 rounded-lg" value={perfil.web || ''} onChange={handleOnChangeInput}/>
                    </div>
                    <div className="my-3">
                        <label htmlFor="phone" className="uppercase font-bold text-gray-600">Teléfono</label>
                        <input type="tel" name="phone" className="border bg-gray-50 w-full p-2 mt-5 rounded-lg" value={perfil.phone || ''} onChange={handleOnChangeInput}/>
                    </div>
                    <div className="my-3">
                        <label htmlFor="email" className="uppercase font-bold text-gray-600">Email</label>
                        <input type="text" name="email" className="border bg-gray-50 w-full p-2 mt-5 rounded-lg" value={perfil.email || ''} onChange={handleOnChangeInput}/>
                    </div>

                    <button type="submit" className="mt-5 w-[10rem] bg-indigo-700 hover:bg-indigo-800 p-3 rounded-lg text-white font-medium cursor-pointer">
                        {loader ? <Loader/>:"Guardar Cambios"}
                    </button>
                </form>
            </div>
        </div>
    </>)
}