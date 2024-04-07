import usePacientes from "../hooks/usePacientes";
import Paciente from "./Paciente";

export default function ListadoPacientes() {
    const {pacientes} = usePacientes();

    return (<>
        {
            pacientes.length ? 
                (<>
                    <h2 className="font-black text-3xl text-center">Listado pacientes</h2>
                    <div className="text-xl mt-5 mb-10 text-center">
                        Administra tus <span className="text-indigo-600 font-bold">Pacientes y Citas</span>
                    </div>
                    <div>
                        {
                            pacientes.map(paciente => (
                                <Paciente 
                                    key={paciente._id}
                                    paciente={paciente}
                                />
                            ))
                        }
                    </div>
                </>)
                :(<>
                    <h2 className="font-black text-3xl text-center">No hay pacientes</h2>
                    <div className="text-xl mt-5 mb-10 text-center">
                        Comienza agregando pacientes <span className="text-indigo-600 font-bold">y aparecerán en este lugar</span>
                    </div>
                </>)
        }
    </>)
}