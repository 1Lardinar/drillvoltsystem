import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  LogIn, 
  Mail, 
  Lock, 
  Factory,
  Eye,
  EyeOff,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login({ email, password });
      
      if (result.success && result.user?.role === 'admin') {
        navigate('/');
      } else if (result.success && result.user?.role !== 'admin') {
        setError("Access denied. Admin privileges required.");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Factory className="h-8 w-8 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold text-white">IndustrialCo</span>
              <span className="text-sm text-blue-200 -mt-1">Admin Panel</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-blue-200">Sign in to manage your industrial platform</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Administrator Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@industrialco.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing In..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => window.open("/", "_blank")}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                ← Return to Main Website
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 border-0 shadow-lg bg-blue-50/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Demo Admin Credentials
            </h3>
            <div className="bg-white p-3 rounded border border-blue-200">
              <div className="font-medium text-blue-900">Administrator Access:</div>
              <div className="text-sm text-blue-700">Email: admin@industrialco.com</div>
              <div className="text-sm text-blue-700">Password: password</div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Use these credentials to access the admin panel
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
