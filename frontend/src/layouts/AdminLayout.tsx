import { NavLink, Outlet } from "react-router";

function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="flex h-16 items-center justify-between px-6">
          <span className="text-lg font-bold text-slate-900">
            Banking System
          </span>

                    <span className="text-sm font-medium text-slate-500">
            Administration
          </span>
                </div>
            </header>

            <div className="flex min-h-[calc(100vh-4rem)]">
                <aside className="hidden w-64 border-r border-slate-200 bg-white lg:block">
                    <nav className="space-y-1 p-4">
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) =>
                                `block rounded-lg px-4 py-2 text-sm font-medium ${
                                    isActive
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            Admin Dashboard
                        </NavLink>
                    </nav>
                </aside>

                <main className="min-w-0 flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;