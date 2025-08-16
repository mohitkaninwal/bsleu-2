import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AdminDashboard } from "@/components/AdminDashboard";
import { authAPI, isAuthenticated } from "@/services/api";

const Admin: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkAuth = async () => {
    try {
      if (!isAuthenticated()) {
        setIsAuthorized(false);
        return;
      }
      const me = await authAPI.getCurrentUser();
      const admin = me.success && me.user && (me.user.role?.toLowerCase?.() === "admin");
      setIsAuthorized(!!admin);
      if (!admin) {
        toast({
          title: "Access denied",
          description: "Admin privileges are required.",
          variant: "destructive",
        });
      }
    } catch (e) {
      setIsAuthorized(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      if (!res.success) {
        toast({ title: "Login failed", description: res.message || "Invalid credentials", variant: "destructive" });
        return;
      }
      await checkAuth();
    } catch (err) {
      toast({ title: "Login error", description: "Unable to login. Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) {
    return <AdminDashboard onBack={() => (window.location.href = "/")} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Sign in with your admin credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;


