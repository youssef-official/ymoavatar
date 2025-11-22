import { Home, Plus, FolderOpen, Scan, User } from "lucide-react";
import { NavLink } from "./NavLink";

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Plus, label: "Create", path: "/create" },
    { icon: FolderOpen, label: "Projects", path: "/dashboard" },
    { icon: Scan, label: "Scan", path: "/viewer" },
    { icon: User, label: "Account", path: "/account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent/50"
              activeClassName="text-primary"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
