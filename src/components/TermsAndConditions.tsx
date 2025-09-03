import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";

interface TermsAndConditionsProps {
  onBack: () => void;
  returnToPayment?: boolean;
}

export const TermsAndConditions = ({ onBack, returnToPayment = false }: TermsAndConditionsProps) => {
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
                <FileText className="h-8 w-8" />
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  Terms & Conditions
                </CardTitle>
              </div>
              <p className="text-blue-100 text-sm sm:text-base">
                BSLEU Akademie - Language Examination Terms
              </p>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="prose prose-lg max-w-none">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                  <p className="text-yellow-800 font-medium text-sm sm:text-base">
                    <strong>Important:</strong> All candidates are required to carefully read and comply with the following Terms & Conditions. By registering for the examination, you agree to abide by these rules.
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Section 1 */}
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">1</span>
                      Mandatory Identification
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">1.1</span>
                        <p className="text-gray-700 leading-relaxed">Candidates must present a valid passport on the day of the exam.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">1.2</span>
                        <p className="text-gray-700 leading-relaxed">Entry to the examination premises will not be permitted without a valid passport.</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">2</span>
                      Reporting Times
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">2.1</span>
                        <p className="text-gray-700 leading-relaxed"><strong>Written Examination:</strong> Candidates must report by 08:30 AM on the day of the written examination.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">2.2</span>
                        <p className="text-gray-700 leading-relaxed"><strong>Oral Examination:</strong> Candidates must report by 12:00 Noon on the day of the oral examination.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">2.3</span>
                        <p className="text-gray-700 leading-relaxed"><strong>Outstation Candidates:</strong> Oral examinations may continue until 06:30 PM. Candidates are advised to plan their travel accordingly.</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">3</span>
                      Examination Format
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">3.1</span>
                        <p className="text-gray-700 leading-relaxed">Examinations may be conducted in either full-day or partial-day formats, depending on scheduling.</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div className="border-l-4 border-red-500 pl-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">4</span>
                      Cancellations & Refund Policy
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">4.1</span>
                        <p className="text-gray-700 leading-relaxed">Cancellation Requests will only be accepted up to three (3) weeks prior to the scheduled exam date.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">4.2</span>
                        <p className="text-gray-700 leading-relaxed">In case of cancellation three (3) weeks before the exam date, a cancellation fee of <strong>₹6,278</strong> will be deducted from the exam fee.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">4.3</span>
                        <p className="text-gray-700 leading-relaxed">Cancellations after the 3-week period will not be accepted, and the full exam fee will be forfeited.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">4.4</span>
                        <p className="text-gray-700 leading-relaxed"><strong>Late Arrival:</strong> Candidates arriving late will not be permitted to take the exam. No refunds will be issued in such cases.</p>
                      </div>
                    </div>
                                     </div>

                   {/* Section 5 */}
                   <div className="border-l-4 border-orange-500 pl-6">
                     <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">5</span>
                       Code of Conduct & Compliance
                     </h2>
                     <div className="space-y-3">
                       <div className="flex items-start gap-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">5.1</span>
                         <p className="text-gray-700 leading-relaxed"><strong>Identification Fraud:</strong> Any attempt at fraudulent identification or misrepresentation will lead to immediate expulsion from the examination without refund. The candidate may also be barred from appearing in future telc examinations.</p>
                       </div>
                       <div className="flex items-start gap-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">5.2</span>
                         <p className="text-gray-700 leading-relaxed"><strong>Misconduct or Inappropriate Behavior:</strong> Any misconduct, abusive language, or inappropriate behavior towards the BSLEU team, staff, or oral examiners will result in immediate expulsion from the exam without refund.</p>
                       </div>
                       <div className="flex items-start gap-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">5.3</span>
                         <p className="text-gray-700 leading-relaxed"><strong>Compliance:</strong> Candidates are required to comply with all rules and regulations of the examination premises and with the official telc examination guidelines in force during the test.</p>
                       </div>
                     </div>
                   </div>

                   {/* Section 6 */}
                   <div className="border-l-4 border-indigo-500 pl-6">
                     <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold">6</span>
                       Additional Provisions
                     </h2>
                     <div className="space-y-3">
                       <div className="flex items-start gap-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">6.1</span>
                         <p className="text-gray-700 leading-relaxed"><strong>Rights of Admission:</strong> Admission rights are strictly reserved with BSL EU Akademie.</p>
                       </div>
                       <div className="flex items-start gap-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">6.2</span>
                         <p className="text-gray-700 leading-relaxed"><strong>Accompanying Persons:</strong> No parent, guardian, or accompanying person is permitted inside the examination premises. Accompanying persons must wait outside the campus at their own responsibility.</p>
                       </div>
                       <div className="flex items-start gap-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">6.3</span>
                         <p className="text-gray-700 leading-relaxed"><strong>Personal Belongings:</strong> Examinees are solely responsible for their personal items and valuables. BSL EU Akademie and its staff do not assume responsibility for the loss, theft, or damage of any belongings.</p>
                       </div>
                     </div>
                   </div>

                   {/* Section 7 */}
                   <div className="border-l-4 border-teal-500 pl-6">
                     <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">7</span>
                       Personal Data & Certificate Details
                     </h2>
                     <div className="space-y-3">
                       <div className="flex items-start gap-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">7.1</span>
                         <p className="text-gray-700 leading-relaxed">All examinees must ensure that their personal details are filled exactly as per their Passport (or valid government-issued ID proof) at the time of registration.</p>
                       </div>
                       <div className="flex items-start gap-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">7.2</span>
                         <p className="text-gray-700 leading-relaxed">Any corrections or changes to personal data can only be entertained before the exam date. Incorrect details provided by the examinee will be considered their own responsibility.</p>
                       </div>
                       <div className="flex items-start gap-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">7.3</span>
                         <p className="text-gray-700 leading-relaxed">If any change to personal data is requested after the exam or after result issuance, a correction fee of <strong>EUR 40</strong> will be charged in accordance with telc gGmbH rules and guidelines. This amount is payable directly towards telc.</p>
                       </div>
                       <div className="flex items-start gap-3">
                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-0.5">7.4</span>
                         <p className="text-gray-700 leading-relaxed">The processing time for corrections on certificates is up to 2 months by telc gGmbH. Examinees are therefore strongly advised to be very particular and careful while filling in their details during registration to avoid unnecessary delays and additional charges.</p>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Contact Information</h3>
                  <p className="text-blue-800 text-sm sm:text-base">
                    For any questions regarding these terms and conditions, please contact us at:
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
