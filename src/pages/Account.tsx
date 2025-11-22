import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Mail, Settings, HelpCircle, LogOut } from "lucide-react";

const Account = () => {
  return (
    <div className="min-h-screen pb-24 pt-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Account</h1>
          <p className="text-muted-foreground">Manage your profile and settings</p>
        </div>

        {/* Profile card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
              U
            </div>
            <div>
              <h2 className="text-xl font-semibold">Demo User</h2>
              <p className="text-sm text-muted-foreground">demo@ymoavatar.com</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="mr-2 h-4 w-4" />
              Email Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </Button>
          </div>
        </Card>

        {/* Help & Support */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              FAQ
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Contact Support
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Button variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Account;
