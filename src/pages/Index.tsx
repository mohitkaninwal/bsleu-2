import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, CheckCircle, FileText, Globe, Shield, Users, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { ExamLevelCard } from "@/components/ExamLevelCard";
import { RegistrationForm } from "@/components/RegistrationForm";
import { BookingSystem } from "@/components/BookingSystem";
import { ExamInformation } from "@/components/ExamInformation";
import { TestCenters } from "@/components/TestCenters";
import { TermsAndConditions } from "@/components/TermsAndConditions";
import { PrivacyPolicy } from "@/components/PrivacyPolicy";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "register" | "book" | "exam-info" | "test-centers" | "terms" | "privacy">("home");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const examLevelsSectionRef = useRef<HTMLDivElement | null>(null);

  const handleViewExamsClick = () => {
    examLevelsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 11 ? 0 : prev + 1));
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const examLevels = [
    { level: "A1", title: "Beginner", description: "Understanding familiar everyday expressions, basic personal communication", fee: "₹20,060", type: "full", note: "Including GST" },
    { level: "A2", title: "Elementary", description: "Sentences and frequently used expressions, simple routine tasks", fee: "₹20,060", type: "full", note: "Including GST" },
    { level: "B1", title: "Intermediate", description: "Main points on familiar matters, travel situations, experiences description", fee: "₹21,240", type: "full", note: "Including GST" },
    { level: "B2", title: "Upper Intermediate", description: "Complex texts, fluent interaction with native speakers", fee: "₹21,240", type: "full", note: "Including GST" },
    { level: "C1", title: "University", description: "Demanding texts with implicit meaning, fluent spontaneous expression", fee: "₹23,600", type: "full", note: "Including GST" },
  ];

  const features = [
    { icon: Shield, title: "Directly Licensed by telc gGmbH", description: "We're an official exam centre you can trust. Find us listed on the telc website for complete authenticity." },
    { icon: Users, title: "Big Space, Bigger Dreams", description: "A sprawling 4,000 sq. ft. Akademie designed to inspire learning." },
    { icon: Calendar, title: "Exams Every Month", description: "No waiting forever. We roll out exam slots every single month." },
    { icon: CheckCircle, title: "250+ Seats, Always Ready", description: "With minimum 250 slots/month, your chance is never missed." },
    { icon: BookOpen, title: "Get Exam-Ready with Confidence", description: "We offer special telc familiarization & simulation sessions to help you master the exam format" },
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

  if (currentView === "terms") {
    return <TermsAndConditions onBack={() => setCurrentView("home")} />;
  }

  if (currentView === "privacy") {
    return <PrivacyPolicy onBack={() => setCurrentView("home")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-0 sm:px-2 lg:px-3 py-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="BSL Akademie logo"
                className="h-14 sm:h-16 md:h-18 lg:h-20 w-auto"
              />
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Gallery
              </button>
              <button
                onClick={() => document.getElementById('language-levels')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Language Levels
              </button>
              <button
                onClick={() => document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                About Us
              </button>
              <button
                onClick={() => document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Why Us
              </button>
            </nav>

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
            telc Language Certification
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-relaxed">
              <span className="block mb-2 sm:mb-3 whitespace-nowrap">From "Hello" to "Hallo Karriere"</span>
              <span className="block text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-gray-700 mb-2 sm:mb-3">your German journey starts at</span>
              <span className="text-blue-600 block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">BSLEU Akademie</span>



              
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
              Join thousands of students who have 
               their careers with our internationally recognized language proficiency examinations. Book your exam today and take the next step in your professional journey.
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
            <p className="text-sm text-gray-500 mt-4 text-center max-w-2xl mx-auto leading-relaxed">
              BSLEU Akademie LLP is a direct licenced testing center of telc gGmbH (license number 105007)
            </p>
          </div>
        </div>
      </section>

      {/* Photo Slideshow Section */}
      <section id="gallery" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Learning Environment
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Experience our modern facilities and supportive learning atmosphere
            </p>
          </div>
          
          {/* Slideshow Container */}
          <div className="relative max-w-4xl mx-auto">
            <div 
              className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-100"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slides */}
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {[
                  "Screenshot 2025-09-02 232724.png", // Two men with certificate - first slide
                  "d5f55f26-1946-4469-a1de-8f85e14bf4fc.JPG",
                  "ca9b18f6-2f58-4c3b-bdf3-4a13d312547e.JPG",
                  "e556be69-0e4d-4da1-8d84-0be9886f7dec.JPG",
                  "b00b9f8a-119b-4907-8382-f903de868f82.JPG",
                  "25ab83aa-b3ee-4ba8-8d9a-b55fa5af07f8.JPG",
                  "c0dfb111-df3e-4770-88e3-78c58544fda2.JPG",
                  "65ecaed6-0f48-4428-b096-40e24d89b967.JPG",
                  "811dfa7b-9c70-4dcb-a8dd-d66f75fcc4b3.JPG",
                  "0301061e-8e9f-4218-ba74-0f0405fcad09.JPG",
                  "14cf047b-ed81-41c1-bf25-0ebe01b60e7c.JPG",
                  "5967399e-809f-46f3-a15f-67381a2552d7.JPG"
                ].map((imageName, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className={index === 0 ? "aspect-[3/2] sm:aspect-[4/3] md:aspect-[5/3]" : "aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9]"}>
                      <img
                        src={`/bsleu-photos/${imageName}`}
                        alt={`BSLEU Akademie facility ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={index === 0 ? { objectPosition: 'center 20%' } : { objectPosition: 'center' }}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? 11 : prev - 1))}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 11 ? 0 : prev + 1))}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                    currentSlide === index
                      ? "bg-blue-600 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Students Choose BSLEU
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the advantages that make us the preferred choice for language certification
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Slots Available */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-3">250+</div>
                <div className="text-lg sm:text-xl font-semibold text-gray-800">Slots Available</div>
              </div>
            </div>

            {/* Exams Every Month */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
                <div className="absolute top-4 right-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-3">A1 to C1</div>
                <div className="text-lg sm:text-xl font-semibold text-gray-800">Exams Every Month</div>
              </div>
            </div>

            {/* Results Timeline */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
                <div className="absolute top-4 right-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-600 mb-3">3 Weeks</div>
                <div className="text-lg sm:text-xl font-semibold text-gray-800">Results Timeline</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Levels */}
      <section id="language-levels" ref={examLevelsSectionRef} className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Choose Your Proficiency Level</h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Our structured examination system encompasses all
proficiency levels, from basic to advance. Select the level that matches your current language goal for
Full or Partial Exams.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {examLevels.map((exam) => (
              <ExamLevelCard key={exam.level} {...exam} />
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">About Us</h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Meet the passionate leaders behind BSLEU Akademie</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Mr. Heinz */}
            <Card className="hover:shadow-lg transition-all duration-300 h-full border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Meet Mr. Heinz
                </CardTitle>
                <CardDescription className="text-blue-600 font-medium">
                  The German Founder of BSLEU Akademie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-blue-200 rounded-full"></div>
                  <div className="pl-4">
                    <p className="text-gray-600 leading-relaxed">
                      At the heart of BSLEU Akademie stands Mr. Heinz, our German founder, bringing over 15 years of expertise in conducting telc exams both in Germany and abroad. A government-approved teacher in Germany, he has guided learners across all age groups — from young students to seasoned professionals.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      Since 2010, Mr. Heinz has successfully conducted more than 10,000 telc exams, a testament not only to his vast experience but also to the trust telc gGmbH places in his ethics, precision, and commitment. His leadership ensures that candidates from South Asia can rely on BSLEU Akademie for the same standards of quality and trust upheld in Germany.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mr. Aarsh S. Arun */}
            <Card className="hover:shadow-lg transition-all duration-300 h-full border-l-4 border-l-green-500 bg-gradient-to-br from-white to-green-50/30">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Meet Mr. Aarsh S. Arun
                </CardTitle>
                <CardDescription className="text-green-600 font-medium">
                  Founder & Managing Partner, BSLEU Akademie LLP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-green-200 rounded-full"></div>
                  <div className="pl-4">
                    <p className="text-gray-600 leading-relaxed">
                      With over 10 years of dedicated experience in global markets, Aarsh S. Arun is passionate about building bridges between talent and opportunity worldwide. As an advisor to leading international firms, he has worked extensively across Europe, the Middle East, and North America, shaping strategies in recruitment, education, and workforce mobility.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      At BSLEU Akademie LLP, Aarsh champions youth-driven growth, language training, and global career pathways. His vision is simple yet powerful — to create transparent, future-ready opportunities for students and professionals, making international careers more accessible than ever.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="why-us" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Why Choose BSLEU?</h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Experience the benefits of our modern examination platform</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
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
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
             <div className="text-center lg:text-left">
               <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4 sm:mb-6">
                 <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                 <img
                   src="/logo.png"
                   alt="BSL Akademie"
                   className="h-8 sm:h-10 lg:h-12 w-auto"
                 />
               </div>
               <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
               telc Language Certification platform trusted by thousands of students worldwide.
               </p>
             </div>
             <div className="text-center lg:text-right">
               <h4 className="font-semibold mb-4 text-base sm:text-lg">Contact</h4>
               <div className="text-gray-400 space-y-2 text-sm sm:text-base">
                 <p className="flex items-center justify-center lg:justify-end"><span className="mr-2">📧</span> support@bsleu.com</p>
                 <p className="flex items-center justify-center lg:justify-end"><span className="mr-2">📞</span> +91 1800-123-4567</p>
                 <p className="flex items-center justify-center lg:justify-end"><span className="mr-2">🕐</span> Mon-Fri: 9AM-6PM</p>
               </div>
             </div>
           </div>
           <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
             <p className="text-xs sm:text-sm">&copy; 2025 BSLEU. All rights reserved. | <button onClick={() => setCurrentView("privacy")} className="underline hover:text-blue-400 transition-colors">Privacy Policy</button> | <button onClick={() => setCurrentView("terms")} className="underline hover:text-blue-400 transition-colors">Terms and Conditions</button></p>
           </div>
         </div>
       </footer>
    </div>
  );
};

export default Index;
