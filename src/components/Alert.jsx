export default function Alerta({error, message}) {
    return (<>
        <div className={`${error ? 'bg-red-500' : 'bg-green-500'} mt-4 p-2 font-semibold text-white text-center text-lg rounded-lg`}>
            <p>{message}</p>
        </div>
    </>)
}