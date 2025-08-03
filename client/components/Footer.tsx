import { Link } from "react-router-dom";
import { Factory, Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-industrial-dark text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-industrial-blue p-2 rounded-lg">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">IndustrialCo</h3>
                <p className="text-sm text-gray-400">Industrial Solutions</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Leading provider of industrial equipment and solutions for manufacturing, 
              construction, and heavy industry applications worldwide.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-industrial-orange text-industrial-orange hover:bg-industrial-orange hover:text-white"
              >
                Get Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-industrial-orange transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-industrial-orange transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-industrial-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-industrial-orange transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-industrial-orange transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products/category/machinery" className="text-gray-300 hover:text-industrial-orange transition-colors">
                  Heavy Machinery
                </Link>
              </li>
              <li>
                <Link to="/products/category/tools" className="text-gray-300 hover:text-industrial-orange transition-colors">
                  Industrial Tools
                </Link>
              </li>
              <li>
                <Link to="/products/category/safety" className="text-gray-300 hover:text-industrial-orange transition-colors">
                  Safety Equipment
                </Link>
              </li>
              <li>
                <Link to="/products/category/parts" className="text-gray-300 hover:text-industrial-orange transition-colors">
                  Spare Parts
                </Link>
              </li>
              <li>
                <Link to="/products/category/services" className="text-gray-300 hover:text-industrial-orange transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-industrial-orange mt-0.5" />
                <div className="text-gray-300 text-sm">
                  <p>1234 Industrial Blvd</p>
                  <p>Manufacturing District</p>
                  <p>City, State 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-industrial-orange" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-industrial-orange" />
                <span className="text-gray-300 text-sm">info@industrialco.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-industrial-orange" />
                <div className="text-gray-300 text-sm">
                  <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p>Sat: 9:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 IndustrialCo. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-industrial-orange transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-industrial-orange transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-industrial-orange transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
