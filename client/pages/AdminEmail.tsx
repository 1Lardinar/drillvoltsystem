import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Mail,
  Send,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  ArrowLeft,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  company?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
}

interface EmailLog {
  id: string;
  to: string[];
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  error?: string;
}

export default function AdminEmail() {
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  // Email composition state
  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
    templateId: ""
  });

  // Custom emails state
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Fetch users
      const usersResponse = await fetch("/api/auth/users", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }

      // Fetch email templates
      const templatesResponse = await fetch("/api/email/templates", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        setTemplates(templatesData.templates || []);
      }

      // Fetch email logs
      const logsResponse = await fetch("/api/email/logs", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setEmailLogs(logsData.logs || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    const totalRecipients = selectedUsers.length + customEmails.length;

    if (totalRecipients === 0) {
      toast({
        title: "Error",
        description: "Please select at least one recipient",
        variant: "destructive"
      });
      return;
    }

    if (!emailData.subject || !emailData.body) {
      toast({
        title: "Error",
        description: "Subject and message are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          customEmails: customEmails,
          subject: emailData.subject,
          body: emailData.body,
          templateId: emailData.templateId || null
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Email sent to ${totalRecipients} recipient(s)`
        });

        // Reset form
        setEmailData({ subject: "", body: "", templateId: "" });
        setSelectedUsers([]);
        setCustomEmails([]);
        fetchData(); // Refresh logs
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send email",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive"
      });
    }
  };

  const addCustomEmail = () => {
    const email = emailInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) return;

    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (customEmails.includes(email)) {
      toast({
        title: "Duplicate Email",
        description: "This email is already in the list",
        variant: "destructive"
      });
      return;
    }

    setCustomEmails([...customEmails, email]);
    setEmailInput("");
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-industrial-light-gray py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <h2 className="text-xl font-bold mb-2">Access Denied</h2>
              <p>You need administrator privileges to access email management.</p>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-industrial-light-gray py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Mail className="h-16 w-16 text-industrial-blue mx-auto mb-4 animate-pulse" />
            <div className="text-xl text-industrial-gray">Loading email system...</div>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    totalSent: emailLogs.filter(log => log.status === 'sent').length,
    totalFailed: emailLogs.filter(log => log.status === 'failed').length,
    totalRecipients: emailLogs.reduce((sum, log) => sum + log.to.length, 0),
    totalTemplates: templates.length
  };

  return (
    <div className="min-h-screen bg-industrial-light-gray py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center bg-industrial-blue text-white rounded-full px-4 py-2 mb-4">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Email Management</span>
              </div>
              <h1 className="text-4xl font-bold text-industrial-dark mb-2">Email Campaigns</h1>
              <p className="text-industrial-gray">Send newsletters, announcements, and communicate with your users</p>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-industrial-gray">Emails Sent</p>
                    <p className="text-2xl font-bold text-industrial-dark">{stats.totalSent}</p>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-industrial-gray">Failed</p>
                    <p className="text-2xl font-bold text-industrial-dark">{stats.totalFailed}</p>
                  </div>
                  <div className="bg-red-500/10 p-3 rounded-full">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-industrial-gray">Total Recipients</p>
                    <p className="text-2xl font-bold text-industrial-dark">{stats.totalRecipients}</p>
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
                    <p className="text-sm text-industrial-gray">Templates</p>
                    <p className="text-2xl font-bold text-industrial-dark">{stats.totalTemplates}</p>
                  </div>
                  <div className="bg-industrial-orange/10 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-industrial-orange" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="compose" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compose">Compose Email</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="logs">Email History</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recipients Selection */}
                <Card className="lg:col-span-1 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Recipients ({selectedUsers.length + customEmails.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="users" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="users">Registered Users</TabsTrigger>
                        <TabsTrigger value="custom">Custom Emails</TabsTrigger>
                      </TabsList>

                      <TabsContent value="users" className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedUsers(filteredUsers.map(u => u.id))}
                          >
                            Select All
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedUsers([])}
                          >
                            Clear
                          </Button>
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {filteredUsers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-2 p-2 border rounded">
                              <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedUsers([...selectedUsers, user.id]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                  }
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="custom" className="space-y-4">
                        <div className="space-y-2">
                          <Label>Add Custom Email</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="email@example.com"
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addCustomEmail()}
                            />
                            <Button size="sm" onClick={addCustomEmail}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {customEmails.length > 0 && (
                          <div className="space-y-2">
                            <Label>Custom Recipients ({customEmails.length})</Label>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {customEmails.map((email, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                  <span className="truncate flex-1">{email}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setCustomEmails(customEmails.filter((_, i) => i !== index))}
                                    className="h-6 w-6 p-0 text-red-600"
                                  >
                                    ×
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Email Composition */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Compose Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        placeholder="Enter email subject..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="body">Message</Label>
                      <Textarea
                        id="body"
                        value={emailData.body}
                        onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                        rows={10}
                        placeholder="Type your message here..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tip: Use {"{firstName}"}, {"{lastName}"} for personalization
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {selectedUsers.length + customEmails.length} recipient(s) selected
                      </div>
                      <Button onClick={sendEmail} className="bg-industrial-blue hover:bg-blue-600">
                        <Send className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Email Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  {templates.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-industrial-dark mb-2">No templates yet</h3>
                      <p className="text-industrial-gray">Email templates will appear here when created</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templates.map((template) => (
                        <Card key={template.id} className="border">
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">{template.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                            <p className="text-xs text-gray-500 truncate">{template.body}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Email History</CardTitle>
                </CardHeader>
                <CardContent>
                  {emailLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-industrial-dark mb-2">No emails sent yet</h3>
                      <p className="text-industrial-gray">Email history will appear here once you start sending emails</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {emailLogs.map((log) => (
                        <div key={log.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{log.subject}</h4>
                              <p className="text-sm text-gray-600">To: {log.to.slice(0, 3).join(', ')}{log.to.length > 3 && `... +${log.to.length - 3} more`}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(log.sentAt).toLocaleString()}
                              </p>
                            </div>
                            <Badge className={
                              log.status === 'sent' ? 'bg-green-500' :
                              log.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                            }>
                              {log.status}
                            </Badge>
                          </div>
                          {log.error && (
                            <div className="mt-2 p-2 bg-red-50 text-red-800 rounded text-sm">
                              Error: {log.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
