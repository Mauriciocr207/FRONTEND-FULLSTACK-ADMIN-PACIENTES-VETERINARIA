import { Outlet } from "react-router-dom"
export default function AuthLayout() {
  return (<>
    <main className="h-screen mx-auto container items-center md:grid md:grid-cols-2 items-center gap-10 p-5">
      <Outlet/>   
    </main>
  </>)
}