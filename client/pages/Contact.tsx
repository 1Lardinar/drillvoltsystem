import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Headphones,
  FileText,
  Building
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert("Thank you for your inquiry! We'll get back to you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: ""
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our technical experts",
      details: "+1 (555) 123-4567",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM EST"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed assistance via email",
      details: "support@industrialco.com",
      hours: "Response within 24 hours"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Instant help from our team",
      details: "Available on website",
      hours: "Mon-Fri: 9:00 AM - 5:00 PM EST"
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Expert technical assistance",
      details: "tech@industrialco.com",
      hours: "24/7 Emergency Support"
    }
  ];

  const offices = [
    {
      name: "North America HQ",
      address: "1234 Industrial Blvd\nManufacturing District\nCity, State 12345",
      phone: "+1 (555) 123-4567",
      email: "na.sales@industrialco.com"
    },
    {
      name: "European Office",
      address: "456 Europa Street\nIndustrial Park\nLondon, UK EC1A 1BB",
      phone: "+44 20 1234 5678",
      email: "eu.sales@industrialco.com"
    },
    {
      name: "Asia Pacific Office",
      address: "789 Asia Road\nBusiness District\nSingapore 123456",
      phone: "+65 6234 5678",
      email: "ap.sales@industrialco.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-industrial-dark via-gray-900 to-industrial-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center bg-industrial-blue/20 backdrop-blur-sm border border-industrial-blue/30 rounded-full px-4 py-2 mb-6">
              <MessageSquare className="h-4 w-4 mr-2 text-industrial-blue" />
              <span className="text-sm">Get in Touch</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Contact <span className="text-industrial-orange">Our Team</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Ready to discuss your industrial needs? Our experts are here to help you find 
              the perfect solutions for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-industrial-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark mb-4">
              How Can We Help You?
            </h2>
            <p className="text-xl text-industrial-gray max-w-2xl mx-auto">
              Choose the contact method that works best for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="border-0 shadow-lg text-center h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-blue/10 text-industrial-blue rounded-full mb-4">
                    <method.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-industrial-dark mb-2">{method.title}</h3>
                  <p className="text-industrial-gray text-sm mb-3">{method.description}</p>
                  <div className="text-industrial-blue font-medium mb-1">{method.details}</div>
                  <div className="text-xs text-industrial-gray">{method.hours}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Send className="h-6 w-6 mr-2 text-industrial-blue" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="product">Product Information</SelectItem>
                        <SelectItem value="quote">Request Quote</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="careers">Careers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-industrial-blue hover:bg-blue-600"
                  >
                    {isSubmitting ? (
                      "Sending Message..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Main Contact Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Building className="h-6 w-6 mr-2 text-industrial-blue" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-industrial-orange mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-industrial-dark">Address</h4>
                      <p className="text-industrial-gray">
                        1234 Industrial Blvd<br />
                        Manufacturing District<br />
                        City, State 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-industrial-orange mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-industrial-dark">Phone</h4>
                      <p className="text-industrial-gray">+1 (555) 123-4567</p>
                      <p className="text-sm text-industrial-gray">24/7 Emergency: +1 (555) 123-4568</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-industrial-orange mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-industrial-dark">Email</h4>
                      <p className="text-industrial-gray">info@industrialco.com</p>
                      <p className="text-sm text-industrial-gray">support@industrialco.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-industrial-orange mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-industrial-dark">Business Hours</h4>
                      <p className="text-industrial-gray">Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p className="text-industrial-gray">Saturday: 9:00 AM - 4:00 PM</p>
                      <p className="text-industrial-gray">Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Support */}
              <Card className="border-0 shadow-lg bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">Emergency Support</h4>
                      <p className="text-red-700 mb-2">
                        For urgent technical issues or equipment failures, call our 24/7 emergency line:
                      </p>
                      <p className="text-xl font-bold text-red-800">+1 (555) 911-HELP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Global Offices */}
      <section className="py-20 bg-industrial-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark mb-4">
              Global Offices
            </h2>
            <p className="text-xl text-industrial-gray max-w-2xl mx-auto">
              With locations worldwide, we're always close to our customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-blue/10 text-industrial-blue rounded-full mb-4">
                    <Building className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-industrial-dark mb-4">{office.name}</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-industrial-orange mt-1 flex-shrink-0" />
                      <span className="text-industrial-gray text-sm whitespace-pre-line">{office.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-industrial-orange flex-shrink-0" />
                      <span className="text-industrial-gray text-sm">{office.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-industrial-orange flex-shrink-0" />
                      <span className="text-industrial-gray text-sm">{office.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
