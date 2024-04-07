import {BrowserRouter, Routes, Route} from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Login"
;
import ForgotPassword from "./pages/ForgotPassword";
import ConfirmAccount from "./pages/ConfirmAccount";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./context/AuthProvider";
import AdminLayout from "./layout/AdminLayout";
import AdministrarPacientes from "./pages/admin/AdministrarPacientes";
import { PacientesProvider } from "./context/PacientesProvider";
import EditarPerfil from "./components/EditarPerfil";
import CambiarPassword from "./components/CambiarPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <PacientesProvider>
            <Routes>
              <Route path="/" element={<AuthLayout/>}>
                <Route index element={<Login/>}/>
                <Route path="registrar" element={<Register/>}/>
                <Route path="password_reset" element={<ForgotPassword/>}/>
                <Route path="password_reset/:token" element={<ResetPassword/>}/>
                <Route path="confirmar/:token" element={<ConfirmAccount/>}/> 
              </Route>
              
              <Route path="/admin" element={<AdminLayout/>}>
                <Route index element={<AdministrarPacientes/>}/>
                <Route path="perfil" element={<EditarPerfil/>}/>
                <Route path="reset_password" element={<CambiarPassword/>}/>
              </Route>


            </Routes>

          </PacientesProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
