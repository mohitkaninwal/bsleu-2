
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileText, Mic } from "lucide-react";

interface ExamLevelCardProps {
  level: string;
  title: string;
  description: string;
  fee: string;
  type?: string;
  note?: string;
}

export const ExamLevelCard = ({ level, title, description, fee, type = "full", note }: ExamLevelCardProps) => {
  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      "A1": "bg-green-100 text-green-800",
      "A2": "bg-green-200 text-green-900",
      "B1": "bg-blue-100 text-blue-800",
      "B2": "bg-blue-200 text-blue-900",
      "B1-P": "bg-blue-50 text-blue-700 border-2 border-blue-200",
      "B2-P": "bg-blue-50 text-blue-700 border-2 border-blue-200",
      "C1": "bg-purple-100 text-purple-800",
      "C1-P": "bg-purple-50 text-purple-700 border-2 border-purple-200",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const getExamDetails = (level: string) => {
    const details: { [key: string]: { skills: string[] } } = {
      "A1": { skills: ["Familiar everyday expressions", "Basic personal communication", "Simple interactions"] },
      "A2": { skills: ["Frequently used expressions", "Simple routine tasks", "Basic information exchange"] },
      "B1": { skills: ["Main points on familiar matters", "Travel situations", "Experience descriptions"] },
      "B2": { skills: ["Complex texts", "Fluent interaction", "Abstract topics"] },
      "B1-P": { skills: ["Targeted skill improvement", "Previously failed component", "TELC certificate required"] },
      "B2-P": { skills: ["Targeted skill improvement", "Previously failed component", "TELC certificate required"] },
      "C1": { skills: ["Demanding texts with implicit meaning", "Fluent spontaneous expression", "Academic/professional topics"] },
      "C1-P": { skills: ["Advanced skill improvement", "Previously failed component", "TELC certificate required"] },
    };
    return details[level] || { skills: [] };
  };

  const examDetails = getExamDetails(level);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <Badge className={`text-2xl font-bold px-4 py-2 ${getLevelColor(level)}`}>
            {level}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          {description}
        </CardDescription>
        <div className="mt-4">
          <div className="text-center">
            <span className="text-2xl font-bold text-blue-600">{fee}</span>
            {note && <div className="text-xs text-gray-500 mt-1">{note}</div>}
            {type === "partial" && (
              <Badge variant="outline" className="ml-2 text-xs">
                Partial Exam
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Partial Exam Information for B1, B2, C1 */}
          {(level === "B1" || level === "B2" || level === "C1") && (
            <div className="text-center">
              <div className="flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-blue-600">Partial exams available (written/oral)</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
