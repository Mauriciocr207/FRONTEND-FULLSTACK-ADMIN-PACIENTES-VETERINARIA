import usePacientes from "../hooks/usePacientes";
import moment from "moment";
import Loader from "./Loader";
import { useState } from "react";
import Modal from "./Modal";
import { AxiosError } from "axios";

export default function Paciente({paciente}) {
    const {email, registration, name, owner, symptoms, _id} = paciente;
    const {setEdicion, borrarPaciente, setPacientes} = usePacientes();
    const [loader, setLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState({});
    function closeModal() {
        setShowModal(false);
    }

    const formatearFecha = (date) => {
        return moment(date).format('DD/MM/YYYY');
    }

    const formatearFechaToInput = (date) => {
        return moment(date).format('yyyy-MM-DD');
    }

    async function handleBorrarPaciente(id) {
        try {
            setLoader(true);
            await borrarPaciente(id);
            setLoader(false);
            setPacientes(prevPacientes => prevPacientes.filter(pacienteObj => pacienteObj._id !== id));
        } catch (error) {
            if( error instanceof AxiosError) {
                if(error.code === "ERR_NETWORK") {
                    setContentModal({title:"Error", message:"Ha ocurrido un error al hacer el registro. Inténtalo de nuevo más tarde"});
                } else {
                    setContentModal({title:"Error", message:error.response.data.error});
                }
            } else {
                setContentModal({title:"Error", message:error.message});
            }
            setShowModal(true);
            setLoader(false);
        }
    }

    return (<>
        <div className="mx-5 my-10 bg-white shadow-md px-5 py-7 rounded-xl">
            <p className="font-bold uppercase text-indigo-700">Nombre: <span className="font-normal normal-case text-black">{name}</span></p>
            <p className="font-bold uppercase text-indigo-700">Propietario: <span className="font-normal normal-case text-black">{owner}</span></p>
            <p className="font-bold uppercase text-indigo-700">Email: <span className="font-normal normal-case text-black">{email}</span></p>
            <p className="font-bold uppercase text-indigo-700">Síntomas: <span className="font-normal normal-case text-black">{symptoms}</span></p>
            <p className="font-bold uppercase text-indigo-700">Alta: <span className="font-normal normal-case text-black">{formatearFecha(registration)}</span></p>
            <Modal title={contentModal.title} open={showModal} onClose={closeModal}>
                <p>{contentModal.message}</p>
            </Modal>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 my-5">
                <button onClick={() => setEdicion({...paciente, registration: formatearFechaToInput(registration)})} type="button" className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-bold rounded-lg">
                    Editar
                </button>
                <button onClick={() => handleBorrarPaciente(_id)} type="button" className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white uppercase font-bold rounded-lg">
                    {loader ? <Loader/>:"Eliminar"}
                </button>
            </div>
        </div>
    </>)
}