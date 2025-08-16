import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Clock, Mail } from "lucide-react";

interface TestCentersProps {
  onBack: () => void;
}

export const TestCenters = ({ onBack }: TestCentersProps) => {
  const testCenters = [
    {
      id: 1,
      name: "BSLEU Main Center",
      address: "Connaught Place, New Delhi - 110001",
      city: "New Delhi",
      state: "Delhi",
      phone: "+91 11 2345 6789",
      email: "info@bsleu.com",
      timings: "9:00 AM - 6:00 PM",
      facilities: ["AC Rooms", "Computer Lab", "Audio Equipment", "Parking"],
      capacity: 150
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

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-12 w-12 text-blue-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">Test Centers</h1>
            </div>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               BSLEU operates a single exam center. Center details are displayed on your payment confirmation and receipt.
             </p>
          </div>

          {/* Centers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {testCenters.map((center) => (
              <Card key={center.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-blue-600">{center.name}</CardTitle>
                      <CardDescription className="mt-1">{center.city}, {center.state}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {center.capacity} seats
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{center.address}</span>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">{center.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">{center.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">{center.timings}</span>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <h5 className="font-medium text-sm mb-2">Facilities:</h5>
                    <div className="flex flex-wrap gap-1">
                      {center.facilities.map((facility, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Information */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-2xl">Center Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Booking Guidelines</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Book at least 2 weeks in advance</li>
                   <li>• Single center model, selection not required</li>
                   <li>• Center details shown after payment confirmation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Accessibility</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Wheelchair accessible facilities</li>
                  <li>• Special arrangements for differently-abled</li>
                  <li>• Sign language interpreters available</li>
                  <li>• Extended time options when needed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Contact Support</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Call: +91 1800-123-BSLEU</li>
                  <li>• Email: support@bsleu.com</li>
                  <li>• Live chat: 9 AM - 6 PM</li>
                  <li>• Technical support available</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};