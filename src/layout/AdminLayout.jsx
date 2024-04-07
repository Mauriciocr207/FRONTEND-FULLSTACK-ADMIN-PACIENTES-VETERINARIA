import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminLayout() {
    const {auth, loadAuthResponse} = useAuth();

    if(loadAuthResponse) {
        return (<>
            <Header/>
            {auth._id ? 
                <main className="container p-5 mx-auto mt-10 ">
                    <Outlet/>
                </main>
                :<Navigate to={"/"}/>}
            <Footer/>
        </>)
    }

    return 'cargando...';
}