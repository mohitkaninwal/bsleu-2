import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock, FileText, Award } from "lucide-react";

interface ExamInformationProps {
  onBack: () => void;
}

export const ExamInformation = ({ onBack }: ExamInformationProps) => {
  const examLevels = [
    {
      level: "A1",
      title: "Beginner",
      description: "Basic expressions and everyday phrases",
      duration: "2 hours",
      skills: ["Basic greetings", "Simple questions", "Familiar topics"],
      fee: "₹2,500"
    },
    {
      level: "A2", 
      title: "Elementary",
      description: "Simple communication on familiar topics",
      duration: "2.5 hours",
      skills: ["Personal information", "Shopping", "Local geography"],
      fee: "₹3,000"
    },
    {
      level: "B1",
      title: "Intermediate", 
      description: "Clear standard input on familiar matters",
      duration: "3 hours",
      skills: ["Work situations", "Travel", "Hobbies and interests"],
      fee: "₹3,500"
    },
    {
      level: "B2",
      title: "Upper Intermediate",
      description: "Complex text and spontaneous interaction", 
      duration: "3.5 hours",
      skills: ["Abstract topics", "Technical discussions", "Detailed arguments"],
      fee: "₹4,000"
    },
    {
      level: "C1",
      title: "Advanced",
      description: "Wide range of demanding texts",
      duration: "4 hours", 
      skills: ["Complex texts", "Fluent expression", "Academic/professional use"],
      fee: "₹4,500"
    },
    {
      level: "C2",
      title: "Proficiency",
      description: "Virtually everything heard or read",
      duration: "4.5 hours",
      skills: ["Effortless understanding", "Precise expression", "Subtle meaning"],
      fee: "₹5,000"
    },
    {
      level: "D1",
      title: "Expert",
      description: "Professional level communication",
      duration: "5 hours",
      skills: ["Professional expertise", "Leadership communication", "Complex negotiations"],
      fee: "₹5,500"
    },
    {
      level: "D2",
      title: "Master", 
      description: "Highest level of linguistic competence",
      duration: "5.5 hours",
      skills: ["Native-like proficiency", "Cultural nuances", "Expert-level discourse"],
      fee: "₹6,000"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 hover:bg-blue-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 text-blue-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">BSLEU Exam Information</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive guide to our language proficiency examinations. Choose the level that best matches your current skills and career objectives.
            </p>
          </div>

          {/* General Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <FileText className="mr-3 h-6 w-6 text-blue-600" />
                Exam Format & Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-lg">Written Examination</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Reading Comprehension</li>
                  <li>• Writing Skills Assessment</li>
                  <li>• Grammar & Vocabulary</li>
                  <li>• Listening Comprehension</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-lg">Oral Examination</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Pronunciation Assessment</li>
                  <li>• Conversation Skills</li>
                  <li>• Presentation Abilities</li>
                  <li>• Interactive Communication</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Exam Levels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {examLevels.map((exam) => (
              <Card key={exam.level} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="mr-3 text-lg px-3 py-1">
                        {exam.level}
                      </Badge>
                      <CardTitle className="text-xl">{exam.title}</CardTitle>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">{exam.duration}</span>
                    </div>
                  </div>
                  <CardDescription className="text-base">{exam.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h5 className="font-semibold mb-2">Key Skills Assessed:</h5>
                    <ul className="space-y-1">
                      {exam.skills.map((skill, index) => (
                        <li key={index} className="text-gray-600 text-sm">• {skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-2xl font-bold text-blue-600">{exam.fee}</span>
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Important Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Exam Policies</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Valid ID required for exam entry</li>
                  <li>• Arrive 30 minutes before exam time</li>
                  <li>• No electronic devices allowed</li>
                  <li>• Results available within 2 weeks</li>
                  <li>• Certificates issued upon successful completion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Preparation Guidelines</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Study materials available online</li>
                  <li>• Practice tests recommended</li>
                  <li>• Mock interviews for oral exams</li>
                  <li>• Technical support available</li>
                  <li>• Rescheduling allowed with 48hr notice</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};