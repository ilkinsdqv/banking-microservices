import { useLocation, useNavigate } from "react-router";

import LoginForm from "../components/LoginForm";

interface LoginLocationState {
    from?: {
        pathname?: string;
    };
}

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as LoginLocationState | null;

    const handleSuccess = () => {
        const destination = state?.from?.pathname ?? "/dashboard";

        navigate(destination, { replace: true });
    };

    return <LoginForm onSuccess={handleSuccess} />;
}

export default LoginPage;