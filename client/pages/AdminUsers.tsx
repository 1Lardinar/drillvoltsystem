import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Users,
  Search,
  UserCheck,
  UserX,
  Crown,
  Mail,
  Building,
  Phone,
  Calendar,
  MoreVertical
} from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "@shared/auth";
import { CreateUserDialog, EditUserDialog, DeleteUserDialog } from "@/components/UserManagement";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("/api/auth/users", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const activeUsers = users.filter(u => u.isActive).length;
    const recentUsers = users.filter(u => {
      const createdDate = new Date(u.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    }).length;

    return { totalUsers, adminUsers, activeUsers, recentUsers };
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = getUserStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-industrial-light-gray py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Users className="h-16 w-16 text-industrial-blue mx-auto mb-4 animate-pulse" />
            <div className="text-xl text-industrial-gray">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-industrial-light-gray py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-industrial-dark">User Management</h1>
          </div>
          <CreateUserDialog onRefresh={fetchUsers} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-industrial-gray">Total Users</p>
                  <p className="text-2xl font-bold text-industrial-dark">{stats.totalUsers}</p>
                </div>
                <div className="bg-industrial-blue/10 p-3 rounded-full">
                  <Users className="h-6 w-6 text-industrial-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-industrial-gray">Admin Users</p>
                  <p className="text-2xl font-bold text-industrial-dark">{stats.adminUsers}</p>
                </div>
                <div className="bg-industrial-orange/10 p-3 rounded-full">
                  <Crown className="h-6 w-6 text-industrial-orange" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-industrial-gray">Active Users</p>
                  <p className="text-2xl font-bold text-industrial-dark">{stats.activeUsers}</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-industrial-gray">New This Month</p>
                  <p className="text-2xl font-bold text-industrial-dark">{stats.recentUsers}</p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-industrial-dark">User</th>
                    <th className="text-left p-4 font-medium text-industrial-dark">Contact</th>
                    <th className="text-left p-4 font-medium text-industrial-dark">Role</th>
                    <th className="text-left p-4 font-medium text-industrial-dark">Status</th>
                    <th className="text-left p-4 font-medium text-industrial-dark">Joined</th>
                    <th className="text-left p-4 font-medium text-industrial-dark">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-industrial-blue text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-industrial-dark">
                              {user.firstName} {user.lastName}
                            </div>
                            {user.company && (
                              <div className="text-sm text-industrial-gray flex items-center">
                                <Building className="h-3 w-3 mr-1" />
                                {user.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm text-industrial-gray flex items-center">
                            <Mail className="h-3 w-3 mr-2" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-industrial-gray flex items-center">
                              <Phone className="h-3 w-3 mr-2" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={user.role === 'admin' ? 'bg-industrial-orange text-white' : 'bg-industrial-blue text-white'}>
                          {user.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={user.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                          {user.isActive ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-industrial-gray">
                          {formatDate(user.createdAt)}
                        </div>
                        {user.lastLoginAt && (
                          <div className="text-xs text-industrial-gray">
                            Last: {formatDate(user.lastLoginAt)}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <EditUserDialog user={user} onRefresh={fetchUsers} />
                          <DeleteUserDialog user={user} onRefresh={fetchUsers} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-industrial-dark mb-2">
                  {searchTerm ? 'No users found' : 'No users yet'}
                </h3>
                <p className="text-industrial-gray mb-6">
                  {searchTerm 
                    ? `No users match "${searchTerm}". Try a different search term.`
                    : 'Users will appear here when they register accounts.'
                  }
                </p>
                {!searchTerm && (
                  <CreateUserDialog onRefresh={fetchUsers} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
