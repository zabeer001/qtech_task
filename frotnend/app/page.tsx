"use client"


import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Search,
  ChevronRight,
  CheckCircle,
  Users,
  Award,
  Shield,
  ArrowRight,
  Menu,
  X,
} from "lucide-react"

import Link from "next/link"
import { BACKEND_URL } from '../config';



const testimonials = [
  {
    name: "Sarah Johnson",
    service: "Home Deep Cleaning",
    rating: 5,
    comment: "Absolutely amazing service! My house has never been cleaner. The team was professional and thorough.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Mike Chen",
    service: "Premium Car Wash",
    rating: 5,
    comment: "My car looks brand new! Great attention to detail and excellent customer service.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Emily Davis",
    service: "Pet Grooming",
    rating: 5,
    comment: "They took such good care of my dog. Professional, gentle, and the results were fantastic!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function Homepage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch services on mount
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`${BACKEND_URL}api/services?paginate_count=9`);
        if (!res.ok) throw new Error("Failed to fetch services");
        const json = await res.json();
        const services = json.data?.data || [];
        setServices(services);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      }
    }
    fetchServices();
  }, []);

  // const categories = ["All", ...new Set(services.map((service) => service.category))];

  // const filteredServices = services.filter((service) => {
  //   const matchesCategory = selectedCategory === "All" || service.category === selectedCategory
  //   const matchesSearch =
  //     service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     service.description.toLowerCase().includes(searchQuery.toLowerCase())
  //   return matchesCategory && matchesSearch
  // })

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

const handleSubmit = async (service: any) => {
  const token = localStorage.getItem("token");
  const formattedBookingDate = `${selectedDate} ${selectedTime}:00`;

  const formData = {
    service_id: service.id,
    booking_date: formattedBookingDate,
  };

  console.log("Submitting booking with data:", formData);

  try {
    // Step 1: Create Booking (JSON)
    const res = await fetch(`${BACKEND_URL}api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Booking failed");

    const bookingId = data?.data?.id || data?.booking?.id;
    if (!bookingId) throw new Error("Booking ID not found");

    // Step 2: Prepare FormData for Stripe checkout
    const checkoutFormData = new FormData();
    checkoutFormData.append("booking_id", bookingId);

    // Step 3: Call Stripe checkout endpoint with FormData
    const stripeRes = await fetch(`${BACKEND_URL}api/stripe/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // DO NOT set Content-Type here when using FormData
      },
      body: checkoutFormData,
    });

    const stripeData = await stripeRes.json();

    if (!stripeRes.ok || !stripeData?.checkout_url) {
      throw new Error(stripeData.message || "Failed to get Stripe checkout URL");
    }

    console.log("Stripe checkout URL:", stripeData.checkout_url);

    // Step 4: Redirect to Stripe checkout URL
    window.location.href = stripeData.checkout_url;

  } catch (error) {
    console.error("Booking error:", error);
    alert("Failed to book. Please try again.");
  }
};



  return (




    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Calendar className="size-4" />
                </div>
                <span className="text-xl font-bold">BookingPro</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-primary transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors">
                About
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary transition-colors">
                Reviews
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">
                Contact
              </a>
            </nav>


            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button>Sign In</Button>
                </Link>
              )}
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-primary">
                  Services
                </a>
                <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-primary">
                  About
                </a>
                <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-primary">
                  Reviews
                </a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-primary">
                  Contact
                </a>
                <div className="flex flex-col space-y-2 px-3 pt-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign In
                  </Button>
                  <Button className="w-full">Get Started</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Book Premium Services
              <span className="block text-primary">At Your Convenience</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional services delivered to your doorstep. From home cleaning to car wash, we connect you with
              trusted professionals in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3">
                Browse Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Service Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Premium Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of professional services, all delivered with excellence and care.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {/* {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))} */}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={(service?.image ? BACKEND_URL + service.image : "/placeholder.svg")}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4">{service.category}</Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${service.price}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {service.duration}min
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{service?.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({service?.reviews} reviews)</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{service?.description}</CardDescription>
                  {/* <div className="space-y-2 mb-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div> */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setSelectedService(service)}>
                        Book Now
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Book {service?.name}</DialogTitle>
                        <DialogDescription>
                          Select a preferred date and time. We’ll confirm your appointment shortly.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Preferred Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Preferred Time</Label>
                            <Select onValueChange={(value) => setSelectedTime(value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="09:00">9:00 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                                <SelectItem value="14:00">2:00 PM</SelectItem>
                                <SelectItem value="15:00">3:00 PM</SelectItem>
                                <SelectItem value="16:00">4:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Service Total:</span>
                            <span className="text-2xl font-bold text-primary">
                              ${service?.price}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Duration: {service?.duration} minutes
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="w-full" onClick={() => handleSubmit(service)}>
                          Confirm Booking
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose BookingPro?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best service experience possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Professionals</h3>
              <p className="text-gray-600">
                All our service providers are vetted, insured, and highly rated by customers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">We guarantee satisfaction with every service or we'll make it right.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer support team is available around the clock to help you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.service}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Service?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust BookingPro for their service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Browse All Services
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-primary bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Calendar className="size-4" />
                </div>
                <span className="text-xl font-bold">BookingPro</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional services at your doorstep. Book with confidence, get quality results.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home Cleaning
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Car Wash
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pet Grooming
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Garden Care
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Appliance Repair
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  hello@bookingpro.com
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  123 Business Ave, City, State
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BookingPro. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
