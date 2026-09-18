import { createBrowserRouter } from "react-router";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";

import DashboardPage from "../features/dashboard/pages/DashboardPage";

import AccountsPage from "../features/accounts/pages/AccountsPage";
import AccountDetailPage from "../features/accounts/pages/AccountDetailPage";

import TransactionsPage from "../features/transactions/pages/TransactionsPage";
import TransferPage from "../features/transactions/pages/TransferPage";
import TransactionDetailPage from "../features/transactions/pages/TransactionDetailPage";

import LoansPage from "../features/loans/pages/LoansPage";
import CreateLoanPage from "../features/loans/pages/CreateLoanPage";
import LoanDetailPage from "../features/loans/pages/LoanDetailPage";

import ComplaintsPage from "../features/complaints/pages/ComplaintsPage";
import CreateComplaintPage from "../features/complaints/pages/CreateComplaintPage";
import ComplaintDetailPage from "../features/complaints/pages/ComplaintDetailPage";
import AdminComplaintsPage from "../features/complaints/pages/AdminComplaintsPage";

import AdminUsersPage from "../features/users/pages/AdminUsersPage";
import AdminUserDetailPage from "../features/users/pages/AdminUserDetailPage";
import AdminUserEditPage from "../features/users/pages/AdminUserEditPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import {AdminAccountsPage} from "../features/accounts/pages/AdminAccountsPage.tsx";
import {AdminAuditPage} from "../features/audit/pages/AdminAuditPage.tsx";
import {AuditLogDetailPage} from "../features/audit/pages/AuditLogDetailPage.tsx";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            {
                path: "/verify-email",
                element: <VerifyEmailPage />,
            },
        ],
    },

    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <DashboardPage />,
                    },

                    // Accounts
                    {
                        path: "/accounts",
                        element: <AccountsPage />,
                    },
                    {
                        path: "/accounts/:id",
                        element: <AccountDetailPage />,
                    },

                    // Transactions
                    {
                        path: "/transactions",
                        element: <TransactionsPage />,
                    },
                    {
                        path: "/transactions/transfer",
                        element: <TransferPage />,
                    },
                    {
                        path: "/transactions/:id",
                        element: <TransactionDetailPage />,
                    },

                    // Loans
                    {
                        path: "/loans",
                        element: <LoansPage />,
                    },
                    {
                        path: "/loans/new",
                        element: <CreateLoanPage />,
                    },
                    {
                        path: "/loans/:id",
                        element: <LoanDetailPage />,
                    },

                    // Complaints
                    {
                        path: "/complaints",
                        element: <ComplaintsPage />,
                    },
                    {
                        path: "/complaints/new",
                        element: <CreateComplaintPage />,
                    },
                    {
                        path: "/complaints/:id",
                        element: <ComplaintDetailPage />,
                    },
                    {
                        element: <RoleRoute allowedRoles={["ADMIN"]} />,
                        children: [
                            {
                                path: "/admin/complaints",
                                element: <AdminComplaintsPage />,
                            },
                            {
                                path: "/admin/users",
                                element: <AdminUsersPage />,
                            },
                            {
                                path: "/admin/users/:id",
                                element: <AdminUserDetailPage />,
                            },
                            {
                                path: "/admin/users/:id/edit",
                                element: <AdminUserEditPage />,
                            },
                            {
                                path: "/admin/accounts",
                                element: <AdminAccountsPage />,
                            },
                            {
                                path: "/admin/audit",
                                element: <AdminAuditPage />,
                            },
                            {
                                path: "/admin/audit/:id",
                                element: <AuditLogDetailPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        path: "*",
        element: <LoginPage />,
    },
]);