import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, CheckCircle, FileText, Globe, Shield, Users, Zap } from "lucide-react";
import { ExamLevelCard } from "@/components/ExamLevelCard";
import { RegistrationForm } from "@/components/RegistrationForm";
import { BookingSystem } from "@/components/BookingSystem";
import { ExamInformation } from "@/components/ExamInformation";
import { TestCenters } from "@/components/TestCenters";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "register" | "book" | "exam-info" | "test-centers">("home");
  const examLevelsSectionRef = useRef<HTMLDivElement | null>(null);

  const handleViewExamsClick = () => {
    examLevelsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const examLevels = [
    { level: "A1", title: "Beginner", description: "Understanding familiar everyday expressions, basic personal communication", fee: "₹20,060", type: "full", note: "Including GST" },
    { level: "A2", title: "Elementary", description: "Sentences and frequently used expressions, simple routine tasks", fee: "₹20,060", type: "full", note: "Including GST" },
    { level: "B1", title: "Intermediate", description: "Main points on familiar matters, travel situations, experiences description", fee: "₹21,240", type: "full", note: "Including GST" },
    { level: "B2", title: "Upper Intermediate", description: "Complex texts, fluent interaction with native speakers", fee: "₹21,240", type: "full", note: "Including GST" },
    { level: "B1-P", title: "B1 Partial", description: "Re-take only the failed module (Written OR Oral)", fee: "₹20,650", type: "partial", note: "Written/Oral only" },
    { level: "B2-P", title: "B2 Partial", description: "Re-take only the failed module (Written OR Oral)", fee: "₹20,650", type: "partial", note: "Written/Oral only" },
    { level: "C1", title: "Advanced", description: "Demanding texts with implicit meaning, fluent spontaneous expression", fee: "₹23,600", type: "full", note: "Including GST" },
    { level: "C1-P", title: "C1 Partial", description: "Re-take only the failed module (Written OR Oral)", fee: "₹23,010", type: "partial", note: "Written/Oral only" },
  ];

  const features = [
    { icon: Calendar, title: "Admin-Controlled Scheduling", description: "All schedules managed centrally by admins" },
    { icon: Shield, title: "Secure Payment", description: "Safe and secure payment processing with Razorpay" },
    { icon: FileText, title: "Digital Certificates", description: "Instant certificate generation upon exam completion" },
    { icon: Globe, title: "Language Support", description: "Support for multiple interface languages" },
  ];

  if (currentView === "register") {
    return <RegistrationForm onBack={() => setCurrentView("home")} onNext={() => setCurrentView("book")} />;
  }

  if (currentView === "book") {
    return <BookingSystem onBack={() => setCurrentView("register")} />;
  }

  // Admin panel is now a separate route at /admin; removed from user site

  if (currentView === "exam-info") {
    return <ExamInformation onBack={() => setCurrentView("home")} />;
  }

  if (currentView === "test-centers") {
    return <TestCenters onBack={() => setCurrentView("home")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="BSL Akademie logo"
                className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
              />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                onClick={() => setCurrentView("register")}
                className="text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <span className="hidden sm:inline">Book Exam</span>
                <span className="sm:hidden">Book</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs sm:text-sm">
              Professional Language Certification
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Master Your Language Skills with
              <span className="text-blue-600 block sm:inline"> BSLEU Certification</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
              Join thousands of students who have advanced their careers with our internationally recognized language proficiency examinations. Book your exam today and take the next step in your professional journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4" 
                onClick={() => setCurrentView("register")}
              >
                <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Book Your Exam
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                onClick={handleViewExamsClick}
              >
                <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                View Exams
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <div className="text-center p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-sm sm:text-base text-gray-600">Students Certified</div>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-sm sm:text-base text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm sm:text-base text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Levels */}
      <section ref={examLevelsSectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Choose Your Proficiency Level</h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Our comprehensive examination system covers all proficiency levels from beginner to expert. 
              Select the level that matches your current skills and career goals.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {examLevels.map((exam) => (
              <ExamLevelCard key={exam.level} {...exam} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Why Choose BSLEU?</h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Experience the benefits of our modern examination platform</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow h-full">
                <CardHeader className="pb-4">
                  <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 text-sm sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Ready to Start Your Journey?</h3>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 max-w-3xl mx-auto">
            Book your BSLEU examination today and take the first step towards professional certification
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            onClick={() => setCurrentView("register")}
          >
            <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                <img
                  src="/logo.png"
                  alt="BSL Akademie"
                  className="h-8 sm:h-10 lg:h-12 w-auto"
                />
              </div>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Professional language certification platform trusted by thousands of students worldwide.
              </p>
            </div>
            <div className="hidden sm:block lg:block">
              <h4 className="font-semibold mb-4 text-base sm:text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                {/* Removed links per requirements */}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-base sm:text-lg">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-base sm:text-lg">Contact</h4>
              <div className="text-gray-400 space-y-2 text-sm sm:text-base">
                <p className="flex items-center"><span className="mr-2">📧</span> support@bsleu.com</p>
                <p className="flex items-center"><span className="mr-2">📞</span> +91 1800-123-4567</p>
                <p className="flex items-center"><span className="mr-2">🕐</span> Mon-Fri: 9AM-6PM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-xs sm:text-sm">&copy; 2024 BSLEU. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
