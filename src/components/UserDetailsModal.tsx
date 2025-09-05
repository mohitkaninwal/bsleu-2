import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Image, Calendar, MapPin, Phone, Mail, User, CreditCard } from 'lucide-react';
import { adminAPI, bookingAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface UserData {
  id: string;
  firstName: string;
  familyName: string;
  email: string;
  telephone: string;
  dateOfBirth: string;
  gender: string;
  countryOfBirth: string;
  birthPlace: string;
  nativeLanguage: string;
  placeOfResidence: string;
  countryOfResidence: string;
  idType: string;
  idNumber: string;
  profilePictureUrl: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  Documents: DocumentData[];
}

interface DocumentData {
  id: number;
  documentType: string;
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  verificationStatus: string;
  createdAt: string;
  downloadCount: number;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserDetails(userId);
      if (response.success) {
        setUserData(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch user details",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      toast({
        title: "Error",
        description: "Network error while fetching user details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentDownload = async (document: DocumentData) => {
    try {
      const blob = await bookingAPI.downloadDocument(document.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: `Downloading ${document.originalName}`
      });
    } catch (error) {
      console.error('Failed to download document:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the document",
        variant: "destructive"
      });
    }
  };


  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'passport_front': 'Passport Front',
      'passport_back': 'Passport Back',
      'passport_photo': 'Passport Photo',
      'telc_certificate': 'TELC Certificate'
    };
    return labels[type] || type;
  };

  const getDocumentIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading user details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!userData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-8">
            <p className="text-gray-500">No user data available</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border-0 shadow-2xl">
        <DialogHeader className="relative">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-2xl -z-10"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-3 pb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                {userData.firstName} {userData.familyName}
              </DialogTitle>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>
            
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture */}
          {userData.profilePictureUrl && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    <Image className="h-4 w-4 text-white" />
                  </div>
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
                    <img
                      src={userData.profilePictureUrl}
                      alt="Profile"
                      className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-blue-500/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personal Information */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <CardTitle className="text-lg flex items-center gap-3 text-gray-800 relative z-10">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Personal Information
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-sm text-gray-900">{userData.firstName} {userData.familyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {userData.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {userData.telephone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {userData.dateOfBirth ? format(new Date(userData.dateOfBirth), 'PPP') : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-sm text-gray-900 capitalize">{userData.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Native Language</label>
                  <p className="text-sm text-gray-900">{userData.nativeLanguage || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <CardTitle className="text-lg flex items-center gap-3 text-gray-800 relative z-10">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  Location Information
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Birth Place</label>
                  <p className="text-sm text-gray-900">{userData.birthPlace || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Country of Birth</label>
                  <p className="text-sm text-gray-900">{userData.countryOfBirth || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Place of Residence</label>
                  <p className="text-sm text-gray-900">{userData.placeOfResidence}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Country of Residence</label>
                  <p className="text-sm text-gray-900">{userData.countryOfResidence}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ID Information */}
          {(userData.idType || userData.idNumber) && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                <CardTitle className="text-lg flex items-center gap-3 text-gray-800 relative z-10">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
                    Identification
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID Type</label>
                    <p className="text-sm text-gray-900 capitalize">{userData.idType?.replace('_', ' ') || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID Number</label>
                    <p className="text-sm text-gray-900">{userData.idNumber || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/50 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <CardTitle className="text-lg flex items-center gap-3 text-gray-800 relative z-10">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  Account Information
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <Badge variant="outline" className="capitalize">
                    {userData.role}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge className={userData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {userData.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Registered</label>
                  <p className="text-sm text-gray-900">
                    {format(new Date(userData.createdAt), 'PPP')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/50 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <CardTitle className="text-lg flex items-center gap-3 text-gray-800 relative z-10">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-orange-600 to-red-700 bg-clip-text text-transparent">
                  Uploaded Documents ({userData.Documents?.length || 0})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!userData.Documents || userData.Documents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No documents uploaded</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userData.Documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/50 rounded-xl hover:shadow-md hover:border-gray-300/50 transition-all duration-300 group/doc"
                    >
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(document.mimeType)}
                        <div>
                          <p className="font-medium text-sm">{getDocumentTypeLabel(document.documentType)}</p>
                          <p className="text-xs text-gray-500">
                            {document.originalName} • {formatFileSize(document.fileSize)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Uploaded {format(new Date(document.createdAt), 'PPP')} • Downloaded {document.downloadCount} times
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getVerificationStatusColor(document.verificationStatus)}>
                          {document.verificationStatus}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleDocumentDownload(document)}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover/doc:scale-105"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end pt-6">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
