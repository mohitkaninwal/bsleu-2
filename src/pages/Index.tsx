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
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="BSL Akademie logo"
                className="h-10 sm:h-14 w-auto transform origin-left scale-125 sm:scale-150"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setCurrentView("register")}>
                Book Exam
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              Professional Language Certification
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Master Your Language Skills with
              <span className="text-blue-600"> BSLEU Certification</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of students who have advanced their careers with our internationally recognized language proficiency examinations. Book your exam today and take the next step in your professional journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => setCurrentView("register")}>
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Exam
              </Button>
              <Button size="lg" variant="outline" onClick={handleViewExamsClick}>
                <FileText className="mr-2 h-5 w-5" />
                View Exams
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">Students Certified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            {/* Removed Test Centers stat per single-center model */}
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Levels */}
      <section ref={examLevelsSectionRef} className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Proficiency Level</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive examination system covers all proficiency levels from beginner to expert. 
              Select the level that matches your current skills and career goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examLevels.map((exam) => (
              <ExamLevelCard key={exam.level} {...exam} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BSLEU?</h3>
            <p className="text-lg text-gray-600">Experience the benefits of our modern examination platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-xl mb-8 opacity-90">
            Book your BSLEU examination today and take the first step towards professional certification
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => setCurrentView("register")}
          >
            <Zap className="mr-2 h-5 w-5" />
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <img
                  src="/logo.png"
                  alt="BSL Akademie"
                  className="h-10 sm:h-12 w-auto transform scale-110"
                />
              </div>
              <p className="text-gray-400">
                Professional language certification platform trusted by thousands of students worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                {/* Removed links per requirements */}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="text-gray-400 space-y-2">
                <p>📧 support@bsleu.com</p>
                <p>📞 +91 1800-123-4567</p>
                <p>🕐 Mon-Fri: 9AM-6PM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BSLEU. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
