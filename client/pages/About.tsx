import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Award, 
  Users, 
  Globe, 
  Factory, 
  Shield, 
  Truck, 
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const milestones = [
    { year: "1999", title: "Company Founded", description: "Started as a small industrial equipment supplier" },
    { year: "2005", title: "International Expansion", description: "Opened first overseas office in Europe" },
    { year: "2012", title: "ISO Certification", description: "Achieved ISO 9001 and safety certifications" },
    { year: "2018", title: "Digital Transformation", description: "Launched e-commerce platform and digital services" },
    { year: "2024", title: "Sustainability Focus", description: "Leading green industrial solutions initiative" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "We prioritize safety in every product and service we provide, maintaining the highest industry standards."
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Our commitment to quality drives continuous improvement and innovation in all our offerings."
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "We build lasting partnerships by understanding and exceeding our customers' expectations."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "With operations worldwide, we provide consistent service and support across all markets."
    }
  ];

  const team = [
    {
      name: "John Smith",
      role: "Chief Executive Officer",
      description: "25+ years in industrial manufacturing and leadership",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Sarah Johnson", 
      role: "Chief Technology Officer",
      description: "Expert in industrial automation and digital transformation",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Mike Chen",
      role: "VP of Operations",
      description: "Specializes in global supply chain and logistics optimization",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Lisa Rodriguez",
      role: "VP of Safety & Quality",
      description: "Industry leader in safety protocols and quality assurance",
      image: "/api/placeholder/300/300"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-industrial-dark via-gray-900 to-industrial-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center bg-industrial-blue/20 backdrop-blur-sm border border-industrial-blue/30 rounded-full px-4 py-2 mb-6">
              <Factory className="h-4 w-4 mr-2 text-industrial-blue" />
              <span className="text-sm">About IndustrialCo</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Built on Trust, <span className="text-industrial-orange">Powered by Innovation</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              For over 25 years, IndustrialCo has been the trusted partner for manufacturing, 
              construction, and industrial operations worldwide. Our commitment to quality, 
              safety, and innovation drives everything we do.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-industrial-orange hover:bg-orange-600 text-white">
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-industrial-dark"
                >
                  View Our Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-industrial-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-blue text-white rounded-full mb-4">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-industrial-dark">2,500+</div>
              <div className="text-industrial-gray">Global Clients</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-blue text-white rounded-full mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-industrial-dark">45+</div>
              <div className="text-industrial-gray">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-blue text-white rounded-full mb-4">
                <Factory className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-industrial-dark">10,000+</div>
              <div className="text-industrial-gray">Products Available</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-blue text-white rounded-full mb-4">
                <Award className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-industrial-dark">25+</div>
              <div className="text-industrial-gray">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-industrial-gray max-w-2xl mx-auto">
              These principles guide every decision we make and every relationship we build
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center h-full">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-blue/10 text-industrial-blue rounded-full mb-4">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-industrial-dark mb-3">{value.title}</h3>
                  <p className="text-industrial-gray">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-industrial-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-industrial-gray max-w-2xl mx-auto">
              Key milestones that shaped IndustrialCo into the industry leader we are today
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-industrial-blue hidden md:block"></div>
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div className="hidden md:flex absolute left-6 w-4 h-4 bg-industrial-blue rounded-full border-4 border-white shadow-lg"></div>
                    
                    {/* Content */}
                    <Card className="md:ml-16 w-full border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-2">
                          <div className="bg-industrial-orange text-white px-3 py-1 rounded-full text-sm font-bold mr-4">
                            {milestone.year}
                          </div>
                          <h3 className="text-xl font-bold text-industrial-dark">{milestone.title}</h3>
                        </div>
                        <p className="text-industrial-gray">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-industrial-gray max-w-2xl mx-auto">
              Meet the experienced professionals leading IndustrialCo toward continued success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Users className="h-20 w-20 text-gray-400" />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-industrial-dark mb-1">{member.name}</h3>
                  <div className="text-industrial-blue font-medium mb-3">{member.role}</div>
                  <p className="text-sm text-industrial-gray">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Quality */}
      <section className="py-20 bg-industrial-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark mb-6">
                Quality & Certifications
              </h2>
              <p className="text-lg text-industrial-gray mb-8">
                We maintain the highest industry standards through rigorous quality control 
                and continuous improvement processes.
              </p>
              <div className="space-y-4">
                {[
                  "ISO 9001:2015 Quality Management",
                  "ISO 14001:2015 Environmental Management", 
                  "OHSAS 18001 Occupational Health & Safety",
                  "CE Marking for European Compliance",
                  "UL Listed for North American Markets"
                ].map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-industrial-gray">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-industrial-blue/20 to-industrial-orange/20 rounded-3xl flex items-center justify-center">
                <Award className="h-32 w-32 text-industrial-blue opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-industrial-blue to-industrial-dark">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Partner with Us?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied customers who trust IndustrialCo for their industrial needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-industrial-orange hover:bg-orange-600 text-white">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Us Today
                </Button>
              </Link>
              <Link to="/products">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-industrial-blue"
                >
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
