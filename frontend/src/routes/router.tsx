import {createBrowserRouter} from "react-router";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import AccountsPage from "../features/accounts/pages/AccountsPage";
import TransactionsPage from "../features/transactions/pages/TransactionsPage";
import LoansPage from "../features/loans/pages/LoansPage";
import ComplaintsPage from "../features/complaints/pages/ComplaintsPage";

import AccountDetailPage from "../features/accounts/pages/AccountDetailPage";

import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
    {
        element: <AuthLayout/>,
        children: [
            {
                path: "/login",
                element: <LoginPage/>,
            },
            {
                path: "/register",
                element: <RegisterPage/>,
            },
            {
                path: "/verify-email",
                element: <VerifyEmailPage/>,
            },
        ],
    },
    {
        element: <ProtectedRoute/>,
        children: [
            {
                element: <DashboardLayout/>,
                children: [
                    {
                        path: "/dashboard",
                        element: <DashboardPage/>,
                    },
                    {
                        path: "/accounts",
                        element: <AccountsPage/>,
                    },
                    {   path: "/accounts",
                        element: <AccountsPage/>
                    },
                    {
                        path: "/accounts/:id",
                        element: <AccountDetailPage/>
                    },
                    {
                        path: "/transactions",
                        element: <TransactionsPage/>,
                    },
                    {
                        path: "/loans",
                        element: <LoansPage/>,
                    },
                    {
                        path: "/complaints",
                        element: <ComplaintsPage/>,
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <LoginPage/>,
    },
]);