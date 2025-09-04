
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScheduleManager } from "@/components/ScheduleManager";
import { UserDetailsModal } from "@/components/UserDetailsModal";
import { adminAPI, authAPI, isAuthenticated } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all'|'confirmed'|'pending'|'cancelled'>('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    confirmedBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const formatUserId = (id: string | number): string => {
    const raw = String(id || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase();
    const short = raw.slice(0, 8) || 'UNKNOWN';
    return `USR-${short}`;
  };

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Require authentication and admin role before hitting admin endpoints
        if (!isAuthenticated()) {
          setIsAuthorized(false);
          toast({
            title: "Unauthorized",
            description: "Please log in to access the admin dashboard.",
            variant: "destructive",
          });
          return;
        }

        const me = await authAPI.getCurrentUser();
        const isAdmin = me.success && me.user && (me.user.role?.toLowerCase?.() === "admin");
        if (!isAdmin) {
          setIsAuthorized(false);
          toast({
            title: "Access denied",
            description: "Admin privileges are required to view this panel.",
            variant: "destructive",
          });
          return;
        }
        setIsAuthorized(true);

        const [statsResponse, bookingsResponse, usersResponse] = await Promise.all([
          adminAPI.getDashboardStats(),
          adminAPI.getAllBookings(),
          adminAPI.getAllUsers()
        ]);

        if (statsResponse.success) {
          // stats endpoint returns { success, data }
          setStats(statsResponse.data || stats);
        }
        if (bookingsResponse.success) {
          setBookings(bookingsResponse.data || []);
        }
        if (usersResponse.success) {
          setUsersData(usersResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Dashboard stats cards
  const statsCards: Array<{ title: string; value: string; icon: React.ComponentType<{ className?: string }>; color: string }> = [
    { title: "Total Bookings", value: stats.totalBookings.toString(), icon: Calendar, color: "text-blue-600" },
    { title: "Active Users", value: stats.totalUsers.toString(), icon: Users, color: "text-green-600" },
  ];

  // Build a map of bookings count per user for display in Users tab
  const userIdToBookingsCount = React.useMemo(() => {
    const map = new Map<string, number>();
    (bookings as any[]).forEach((b) => {
      const uid = b.userId || b.User?.id;
      if (!uid) return;
      map.set(uid, (map.get(uid) || 0) + 1);
    });
    return map;
  }, [bookings]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUserHover = (userId: string) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    // Set a delay before opening the modal
    const timeout = setTimeout(() => {
      setSelectedUserId(userId);
      setIsUserModalOpen(true);
    }, 800); // 800ms delay
    
    setHoverTimeout(timeout);
  };

  const handleUserLeave = () => {
    // Clear the timeout when user stops hovering
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUserId(null);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm sm:text-base hidden sm:block">Manage bookings, users, and system settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Back to Site</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards (authorized only) */}
        {isAuthorized && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Main Content */}
        {!isAuthorized ? (
          <Card>
            <CardHeader>
              <CardTitle>Admin access required</CardTitle>
              <CardDescription>You must be logged in with an admin account to view the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Please contact your administrator to gain access to the admin dashboard.</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="bookings" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="bookings" className="text-xs sm:text-sm py-2">Bookings</TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm py-2">Users</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm py-2">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Recent Bookings</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Manage and track examination bookings</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-48 lg:w-64"
                      />
                    </div>
                    <Select value={bookingStatusFilter} onValueChange={(v) => setBookingStatusFilter(v as any)}>
                      <SelectTrigger className="w-full sm:w-[140px] lg:w-[160px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Booking ID</TableHead>
                        <TableHead className="min-w-[150px]">Student</TableHead>
                        <TableHead className="min-w-[80px]">Level</TableHead>
                        <TableHead className="min-w-[80px] hidden sm:table-cell">Type</TableHead>
                        <TableHead className="min-w-[120px]">Date & Time</TableHead>
                        <TableHead className="min-w-[100px] hidden lg:table-cell">Center</TableHead>
                        <TableHead className="min-w-[80px]">Amount</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                     {(bookings as any[])
                      .filter(booking => 
                        (booking.User?.firstName + ' ' + booking.User?.familyName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (booking.User?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (booking.bookingReference || String(booking.id)).toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (booking.examLevel || '').toLowerCase().includes(searchTerm.toLowerCase())
                      )
                       .filter(booking => bookingStatusFilter === 'all' || (booking.status || '').toLowerCase() === bookingStatusFilter)
                       .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <span className="block truncate max-w-[80px] sm:max-w-none">
                            {booking.bookingReference || `#${booking.id}`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <div
                              onMouseEnter={() => booking.User?.id && handleUserHover(booking.User.id)}
                              onMouseLeave={handleUserLeave}
                              className="relative group/hover"
                            >
                              <span className="font-medium text-xs sm:text-sm truncate text-left hover:text-blue-600 transition-all duration-300 cursor-pointer inline-block relative group">
                                {`${booking.User?.firstName || ''} ${booking.User?.familyName || ''}`.trim()}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                              </span>
                              
                              {/* Hover tooltip */}
                              <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover/hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Hover to view details
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 truncate hidden sm:block">
                              {booking.User?.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {booking.examLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {booking.examType === 'full' ? 'Both' : (booking.partialComponent === 'written' ? 'Written' : 'Oral')}
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium">{booking.Schedule?.examDate}</p>
                            <p className="text-xs text-gray-600">
                              {booking.Schedule?.examTime === 'morning' ? 'Morning' : 'Evening'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
                          <span className="truncate max-w-[100px]">
                            {booking.Schedule?.testCenter}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          ₹{Number(booking.examFee || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(booking.status || '')} text-xs`}>
                            {booking.status || 'pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
                    <CardDescription className="text-sm sm:text-base">View and manage registered users</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-48 lg:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[80px]">User ID</TableHead>
                        <TableHead className="min-w-[150px]">Name</TableHead>
                        <TableHead className="min-w-[100px] hidden sm:table-cell">Contact</TableHead>
                        <TableHead className="min-w-[120px] hidden lg:table-cell">Location</TableHead>
                        <TableHead className="min-w-[80px]">Bookings</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {(usersData as any[])
                      .filter((user) => {
                        const fullName = `${user.firstName || ''} ${user.familyName || ''}`.trim().toLowerCase();
                        return (
                          fullName.includes(userSearchTerm.toLowerCase()) ||
                          (user.email || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                          String(user.id).toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                          (user.currentCity || '').toLowerCase().includes(userSearchTerm.toLowerCase())
                        );
                      })
                      .map((user) => {
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium text-xs sm:text-sm">
                              <span title={String(user.id)} className="block truncate max-w-[70px] sm:max-w-none">
                                {formatUserId(user.id)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="min-w-0">
                                <p className="font-medium text-xs sm:text-sm truncate">
                                  {`${user.firstName || ''} ${user.familyName || ''}`.trim()}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                              {user.telephone || '-'}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
                              <span className="truncate max-w-[100px]">
                                {user.currentCity || user.placeOfResidence || '-'}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm font-medium text-center">
                              {userIdToBookingsCount.get(user.id) || 0}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(user.isActive ? 'active' : 'inactive')} text-xs`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg sm:text-xl">Exam Schedule Management</CardTitle>
                <CardDescription className="text-sm sm:text-base">Manage exam availability for each level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ScheduleManager />
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        )}
      </div>
      
      {/* User Details Modal */}
      {selectedUserId && (
        <UserDetailsModal
          isOpen={isUserModalOpen}
          onClose={handleCloseUserModal}
          userId={selectedUserId}
        />
      )}
    </div>
  );
};
