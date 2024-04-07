import { useContext } from "react";
import PacientesContext from "../context/PacientesProvider";

export default function usePacientes() {
    return useContext(PacientesContext);
}