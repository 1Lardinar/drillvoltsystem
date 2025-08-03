import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
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
  Eye,
  Edit,
  Trash2,
  Settings
} from "lucide-react";

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
  createdAt: string;
  updatedAt: string;
}

interface EmailLog {
  id: string;
  to: string[];
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  templateId?: string;
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

  // Email composition state
  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
    templateId: ""
  });

  // Non-user email state
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [bulkEmailInput, setBulkEmailInput] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

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

  const applyTemplate = (template: EmailTemplate) => {
    setEmailData({
      ...emailData,
      subject: template.subject,
      body: template.body,
      templateId: template.id
    });
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getEmailStats = () => {
    const totalSent = emailLogs.filter(log => log.status === 'sent').length;
    const totalFailed = emailLogs.filter(log => log.status === 'failed').length;
    const totalPending = emailLogs.filter(log => log.status === 'pending').length;
    const totalRecipients = emailLogs.reduce((sum, log) => sum + log.to.length, 0);

    return { totalSent, totalFailed, totalPending, totalRecipients };
  };

  const stats = getEmailStats();

  // Email management functions
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

  const removeCustomEmail = (email: string) => {
    setCustomEmails(customEmails.filter(e => e !== email));
  };

  const addBulkEmails = () => {
    const emails = bulkEmailInput
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails: string[] = [];
    const invalidEmails: string[] = [];

    emails.forEach(email => {
      if (emailRegex.test(email) && !customEmails.includes(email)) {
        validEmails.push(email);
      } else if (!emailRegex.test(email)) {
        invalidEmails.push(email);
      }
    });

    if (validEmails.length > 0) {
      setCustomEmails([...customEmails, ...validEmails]);
      setBulkEmailInput("");

      toast({
        title: "Success",
        description: `Added ${validEmails.length} email(s) to the list`
      });
    }

    if (invalidEmails.length > 0) {
      toast({
        title: "Warning",
        description: `${invalidEmails.length} invalid email(s) were skipped`,
        variant: "destructive"
      });
    }
  };

  const clearAllCustomEmails = () => {
    setCustomEmails([]);
  };

  function EmailTemplateDialog() {
    const [open, setOpen] = useState(false);
    const [templateData, setTemplateData] = useState({
      name: "",
      subject: "",
      body: ""
    });

    const saveTemplate = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch("/api/email/templates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(templateData)
        });

        const data = await response.json();

        if (data.success) {
          toast({
            title: "Success",
            description: "Template saved successfully"
          });
          setOpen(false);
          setTemplateData({ name: "", subject: "", body: "" });
          fetchData();
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to save template",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save template",
          variant: "destructive"
        });
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Email Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateData.name}
                onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                placeholder="Welcome Email"
              />
            </div>
            <div>
              <Label htmlFor="templateSubject">Subject</Label>
              <Input
                id="templateSubject"
                value={templateData.subject}
                onChange={(e) => setTemplateData({ ...templateData, subject: e.target.value })}
                placeholder="Welcome to IndustrialCo!"
              />
            </div>
            <div>
              <Label htmlFor="templateBody">Message</Label>
              <Textarea
                id="templateBody"
                value={templateData.body}
                onChange={(e) => setTemplateData({ ...templateData, body: e.target.value })}
                rows={6}
                placeholder="Dear {firstName},&#10;&#10;Welcome to IndustrialCo!..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {"{firstName}"}, {"{lastName}"}, {"{email}"} for personalization
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveTemplate}>
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Mail className="h-16 w-16 text-industrial-blue mx-auto mb-4 animate-pulse" />
          <div className="text-xl text-industrial-gray">Loading email system...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-industrial-dark">Email Management</h1>
        <div className="flex space-x-3">
          <EmailTemplateDialog />
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Email Settings
          </Button>
        </div>
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
                <p className="text-2xl font-bold text-industrial-dark">{templates.length}</p>
              </div>
              <div className="bg-industrial-orange/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-industrial-orange" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recipients Selection */}
            <Card className="lg:col-span-1">
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
                      <Label>Add Individual Email</Label>
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

                    <div className="space-y-2">
                      <Label>Bulk Add Emails</Label>
                      <Textarea
                        placeholder="Enter multiple emails separated by commas, semicolons, or new lines..."
                        value={bulkEmailInput}
                        onChange={(e) => setBulkEmailInput(e.target.value)}
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={addBulkEmails}>
                          Add Bulk
                        </Button>
                        <Button size="sm" variant="outline" onClick={clearAllCustomEmails}>
                          Clear All
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
                                onClick={() => removeCustomEmail(email)}
                                className="h-6 w-6 p-0 text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
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
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Compose Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {templates.length > 0 && (
                  <div>
                    <Label>Quick Templates</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {templates.slice(0, 3).map((template) => (
                        <Button
                          key={template.id}
                          size="sm"
                          variant="outline"
                          onClick={() => applyTemplate(template)}
                        >
                          {template.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

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
                    {selectedUsers.length > 0 && customEmails.length > 0 && (
                      <span className="block text-xs">
                        ({selectedUsers.length} users + {customEmails.length} custom)
                      </span>
                    )}
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
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-industrial-dark mb-2">No templates yet</h3>
                  <p className="text-industrial-gray mb-4">Create email templates to speed up your workflow</p>
                  <EmailTemplateDialog />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{template.name}</h4>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => applyTemplate(template)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
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
          <Card>
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
                          <p className="text-sm text-gray-600">To: {log.to.join(', ')}</p>
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

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 text-blue-800 rounded">
                <h4 className="font-semibold mb-2">Email Service Setup Required</h4>
                <p className="text-sm">
                  To send emails, you'll need to configure an email service provider like SendGrid, Mailgun, or AWS SES. 
                  Add your API credentials to the environment variables.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>From Name</Label>
                  <Input placeholder="IndustrialCo Support" />
                </div>
                <div>
                  <Label>From Email</Label>
                  <Input type="email" placeholder="support@industrialco.com" />
                </div>
                <div>
                  <Label>Reply-To Email</Label>
                  <Input type="email" placeholder="no-reply@industrialco.com" />
                </div>
              </div>

              <Button>Save Email Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
