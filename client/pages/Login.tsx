import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  LogIn, 
  Mail, 
  Lock, 
  UserPlus, 
  Factory,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login({ email, password });
      
      if (result.success) {
        // Redirect based on user role
        if (result.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from);
        }
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: "Admin", email: "admin@industrialco.com", password: "password" },
    { role: "User", email: "user@example.com", password: "password" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-industrial-light-gray to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-industrial-blue p-2 rounded-lg">
              <Factory className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold text-industrial-dark">IndustrialCo</span>
              <span className="text-xs text-industrial-gray -mt-1">Industrial Solutions</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-industrial-dark">Welcome Back</h1>
          <p className="text-industrial-gray">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-center justify-center">
              <LogIn className="h-5 w-5 mr-2 text-industrial-blue" />
              Sign In
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
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
                className="w-full bg-industrial-blue hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center space-y-4">
              <p className="text-sm text-industrial-gray">
                Don't have an account?{" "}
                <Link to="/register" className="text-industrial-blue hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
              
              <Link to="/" className="text-sm text-industrial-gray hover:text-industrial-blue">
                ← Back to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 border-0 shadow-lg bg-blue-50">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-industrial-dark mb-3 flex items-center">
              <UserPlus className="h-4 w-4 mr-2 text-industrial-blue" />
              Demo Credentials
            </h3>
            <div className="space-y-2 text-xs">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="bg-white p-2 rounded border">
                  <div className="font-medium text-industrial-dark">{cred.role} Access:</div>
                  <div className="text-industrial-gray">Email: {cred.email}</div>
                  <div className="text-industrial-gray">Password: {cred.password}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-industrial-gray mt-2">
              Use these credentials to test the system features
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
