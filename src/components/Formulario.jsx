import { useEffect, useState } from 'react';
import Alerta from './Alert';
import { AxiosError } from 'axios';
import Loader from './Loader';
import Modal from './Modal';
import moment from "moment";
import usePacientes from '../hooks/usePacientes';

export default function Formulario() {
    const [name, setName] = useState('');
    const [owner, setOwner] = useState('');
    const [email, setEmail] = useState('');
    const [registration, setRegistration] = useState(moment().format('yyyy-MM-DD'));
    const [symptoms, setSymptoms] = useState('');
    const [id, setId] = useState(null);
    const [editando, setEditando] = useState(false);
    const [alerta, setAlerta] = useState(null);
    const [loader, setLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);
    function closeModal() {
        setShowModal(false)
    }

    const {
        setPacientes, 
        paciente,
        setPaciente,
        guardarPaciente, 
        actualizarPaciente,
    } = usePacientes();

    useEffect(() => {
        if(paciente?.name) {
            setName(paciente.name);
            setOwner(paciente.owner);
            setEmail(paciente.email);
            setRegistration(paciente.registration);
            setSymptoms(paciente.symptoms);
            setId(paciente._id);
            setEditando(true);
            setAlerta(null);
        }
    }, [paciente]);

    async function handleSubmit(e) {
        try {
            e.preventDefault();

            if([name, owner, email, registration, symptoms].includes('')) {
                throw new Error('Todos los campos son obligatorios');
            }

            setLoader(true);
            setAlerta(null);
            
            if(editando) {
                const paciente = {name, owner, email, registration, symptoms, id};
                const {data} = await actualizarPaciente(paciente);
                console.log(data);
                setAlerta(<Alerta error={false} message={"Se ha actualizado correctamente"}/>);
                setEditando(false);
                setPaciente({});
                setPacientes(prevPacientes => prevPacientes.map(pacienteObj => pacienteObj._id === paciente.id ? {...paciente, _id: paciente.id} : pacienteObj))
            } else {
                const {data: paciente} = await guardarPaciente({name, owner, email, registration, symptoms});
                setPacientes(pacientes => [paciente, ...pacientes]);
                setAlerta(<Alerta error={false} message={"Se ha guardado correctamente"}/>);
                console.log('creando');
            }

            setLoader(false);
            setShowModal(true);

            setName('');
            setOwner('');
            setEmail('');
            setRegistration('');
            setSymptoms('');
        } catch (error) {
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

    return (
        <>
            <h2 className='font-black text-3xl text-center'>Administrador de Pacientes</h2>
            <p className="text-xl mt-5 text-center mb-10">
                Añade tus pacientes y {''}
                <span className="text-indigo-600 font-bold">Adminístralos</span>        
            </p>
            <Modal title={"Registro exitoso"} open={showModal} onClose={closeModal}>
                <p>Se ha registrado el paciente correctamente</p>
            </Modal>
            <form onSubmit={handleSubmit} className="bg-white py-10 px-5 mb-10 lg:mb-0 shadow-md rounded-xl">
                {alerta ?? ''}
                <div className="mb-5 mt-5"> 
                    <label htmlFor="name" className="text-gray-700 uppercase font-bold">Mascota</label>
                    <input 
                        id="name" 
                        name="name" 
                        type="text" 
                        placeholder="Nombre de la mascota"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="owner" className="text-gray-700 uppercase font-bold">Propietario</label>
                    <input 
                        id="owner" 
                        name="owner" 
                        type="text" 
                        placeholder="Nombre del propietario"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="email" className="text-gray-700 uppercase font-bold">Email</label>
                    <input 
                        id="email" 
                        name="email" 
                        type="text" 
                        placeholder="Email del propietario"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="registration" className="text-gray-700 uppercase font-bold">Fecha</label>
                    <input 
                        id="registration" 
                        name="registration" 
                        type="date" 
                        placeholder="Fecha de alta"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        value={registration}
                        onChange={(e) => setRegistration(e.target.value)}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="symptoms" className="text-gray-700 uppercase font-bold">Síntomas</label>
                    <textarea 
                        id="symptoms" 
                        name="symptoms" 
                        type="text" 
                        placeholder="Síntomas de la mascota"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-indigo-600 w-[15rem] rounded-lg px-5 py-2 text-white cursor-pointer hover:bg-indigo-700" 
                >{loader ? <Loader/>: id ? "Editar Paciente":"Guardar Paciente"}</button>
            </form>
        </>
    );
}
