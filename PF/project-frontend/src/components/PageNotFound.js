import { useLocation } from "react-router-dom";

export default function PageNotFound(props) {
    const { state } = useLocation();
    return (
        <div>
            <h1>Page Not Found</h1>
            <h3>{state.message}</h3>
        </div>
    );
}