import { NavLink } from "react-router-dom";
import { LayoutDashboard, Cubes, ArrowRightLeft, Server, Activity, Map, Radio, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Blocks", href: "/blocks", icon: Cubes },
    { name: "Transactions", href: "/txs", icon: ArrowRightLeft },
    { name: "Hosts", href: "/hosts", icon: Server },
    { name: "Analytics", href: "/analytics", icon: Activity, disabled: true },
    { name: "Map", href: "/map", icon: Map, disabled: true },
    { name: "Alerts", href: "/alerts", icon: ShieldAlert, disabled: true },
    { name: "API", href: "/api-docs", icon: Radio, disabled: true },
];

export function Sidebar() {
    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card px-4 py-6">
            <div className="flex items-center gap-2 px-2 mb-8">
                <img src="/logo.png" alt="DARTSIA" className="h-8 w-8" />
                <span className="text-xl font-bold text-primary">DARTSIA</span>
            </div>
            <nav className="flex flex-1 flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={(e) => item.disabled && e.preventDefault()}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                item.disabled && "opacity-50 cursor-not-allowed"
                            )
                        }
                    >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                        {item.disabled && (
                            <span className="ml-auto text-[10px] uppercase font-bold text-muted-foreground">Soon</span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
