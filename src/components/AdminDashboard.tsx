
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage bookings, users, and system settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards (authorized only) */}
        {isAuthorized && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
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
          <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Manage and track examination bookings</CardDescription>
                  </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={bookingStatusFilter} onValueChange={(v) => setBookingStatusFilter(v as any)}>
              <SelectTrigger className="w-[160px]">
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
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Center</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
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
                      .map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.bookingReference || booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{`${booking.User?.firstName || ''} ${booking.User?.familyName || ''}`.trim()}</p>
                            <p className="text-sm text-gray-600">{booking.User?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{booking.examLevel}</Badge>
                        </TableCell>
                        <TableCell>{booking.examType === 'full' ? 'Both' : (booking.partialComponent === 'written' ? 'Written' : 'Oral')}</TableCell>
                        <TableCell>
                          <div>
                            <p>{booking.Schedule?.examDate}</p>
                            <p className="text-sm text-gray-600">{booking.Schedule?.examTime === 'morning' ? 'Morning' : 'Evening'}</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.Schedule?.testCenter}</TableCell>
                        <TableCell className="font-medium">₹{Number(booking.examFee || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status || '')}>
                            {booking.status || 'pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage registered users</CardDescription>
                  </div>
          <div className="relative flex items-center space-x-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
            {/* Export removed */}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                   <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                       <TableHead>Bookings</TableHead>
                      <TableHead>Status</TableHead>
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
                            <TableCell className="font-medium">
                              <span title={String(user.id)}>{formatUserId(user.id)}</span>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{`${user.firstName || ''} ${user.familyName || ''}`.trim()}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{user.telephone || '-'}</TableCell>
                            <TableCell>{user.currentCity || user.placeOfResidence || '-'}</TableCell>
                            <TableCell>{userIdToBookingsCount.get(user.id) || 0}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(user.isActive ? 'active' : 'inactive')}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Exam Schedule Management</CardTitle>
                <CardDescription>Manage exam availability for each level</CardDescription>
              </CardHeader>
              <CardContent>
                <ScheduleManager />
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};
