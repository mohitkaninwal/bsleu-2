import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";

interface PrivacyPolicyProps {
  onBack: () => void;
  returnToPayment?: boolean;
}

export const PrivacyPolicy = ({ onBack, returnToPayment = false }: PrivacyPolicyProps) => {
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
            <Button 
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {returnToPayment ? "Back to Payment" : "Back to Home"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Shield className="h-8 w-8" />
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  Privacy Policy
                </CardTitle>
              </div>
              <p className="text-blue-100 text-sm sm:text-base">
                BSLEU Akademie - Data Protection & Privacy
              </p>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="prose prose-lg max-w-none">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
                  <p className="text-blue-800 font-medium text-sm sm:text-base">
                    <strong>BSL Group of Companies</strong> is committed to protecting the confidentiality and security of your personal information. This Privacy Statement describes the types of information we collect, how we use and safeguard it, and your rights concerning your data. We encourage you to peruse this policy thoroughly so that you can comprehend our privacy practices and make informed decisions.
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Information Gathering */}
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">1</span>
                      Information Gathering
                    </h2>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        When you interact with our website, services, or resources, we may collect personal information such as your name, contact information, professional credentials, and demographic data.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        We collect information about how you use our platform, including browsing history, IP address, device information, and access periods.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Cookies and Tracking Technologies:</strong> We use cookies and other tracking technologies to enhance user experience, personalize content, analyze trends, and monitor user engagement.
                      </p>
                    </div>
                  </div>

                  {/* Utilization of Information */}
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">2</span>
                      Utilization of Obtained Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalization</h3>
                        <p className="text-gray-700 leading-relaxed">
                          We use your information to personalize your experience, cater the content and resources to your specific requirements, and make pertinent suggestions.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Communication</h3>
                        <p className="text-gray-700 leading-relaxed">
                          We may use your contact information to send you critical announcements, newsletters, and educational materials and respond to your inquiries or requests.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Improvement</h3>
                        <p className="text-gray-700 leading-relaxed">
                          We analyze user behaviour and preferences to enhance our website, services, and offerings by identifying trends, functionality, and user experience.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Legal Compliance</h3>
                        <p className="text-gray-700 leading-relaxed">
                          We may disclose your information if required by applicable laws, regulations, or government requests.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data Protection */}
                  <div className="border-l-4 border-red-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">3</span>
                      Data Protection
                    </h2>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        We employ stringent security measures to prevent unauthorized access, modification, disclosure, or destruction of your personal information. To ensure the confidentiality and integrity of your data, we routinely review and update our security procedures.
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-yellow-800 text-sm sm:text-base">
                          <strong>Important:</strong> Please note, however, that no method of data transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* External Services */}
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">4</span>
                      External Services
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      We may utilize third-party services, such as analytics providers and advertising networks, to deliver and enhance our services. Subject to their privacy policies, these third-party services may collect information about your usage patterns and preferences.
                    </p>
                  </div>

                  {/* Children's Privacy */}
                  <div className="border-l-4 border-indigo-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold">5</span>
                      Children's Confidentiality
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      Our website and services are not intended for users younger than 13. We do not intentionally acquire children's personal information without parental consent. If we discover that we have collected personal information from a minor without parental consent, we will promptly remove that information.
                    </p>
                  </div>

                  {/* Policy Modifications */}
                  <div className="border-l-4 border-teal-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">6</span>
                      Modifications to the Privacy Policy
                    </h2>
                    <div className="space-y-3">
                      <p className="text-gray-700 leading-relaxed">
                        We reserve the right to revise or amend this Privacy Statement at any time to reflect changes in our business practices, legal requirements, or industry standards.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        We will notify you of any significant changes by prominently posting a notice on our website or contacting you in another manner.
                      </p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-l-4 border-pink-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-bold">7</span>
                      Contact Information
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      If you have any queries, concerns, or requests about this Privacy Statement or our privacy practices, please contact us using the information listed on our website.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Your Consent</h3>
                  <p className="text-green-800 text-sm sm:text-base">
                    You acknowledge and consent to collecting, using, and processing your personal information as described in this Privacy Policy by using our website and services.
                  </p>
                </div>

                <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Contact Information</h3>
                  <p className="text-blue-800 text-sm sm:text-base">
                    For any questions regarding this privacy policy, please contact us at:
                  </p>
                  <div className="mt-3 space-y-1 text-sm sm:text-base text-blue-800">
                    <p>📧 Email: support@bsleu.com</p>
                    <p>📞 Phone: +91 1800-123-4567</p>
                    <p>🕐 Hours: Mon-Fri: 9AM-6PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
