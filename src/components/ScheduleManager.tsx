import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { scheduleAPI } from "@/services/api";

interface ScheduleData {
  id: string;
  examLevel: string;
  date: Date;
  timeSlots: Array<'morning'|'evening'>;
  testCenter: string;
  maxCapacity: number;
  currentBookings: number;
}

interface ScheduleManagerProps {
  onScheduleUpdate?: (schedules: ScheduleData[]) => void;
}

export const ScheduleManager = ({ onScheduleUpdate }: ScheduleManagerProps) => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    examLevel: "",
    date: undefined as Date | undefined,
    timeSlots: [] as Array<'morning'|'evening'>,
    testCenter: "BSLEU Main Center, New Delhi",
    maxCapacity: 20,
    examType: 'full' as 'full' | 'partial',
  });

  const examLevels = ["A1", "A2", "B1", "B2", "B1-P", "B2-P", "C1", "C1-P"];
  const availableTimeSlots: Array<'morning'|'evening'> = ['morning','evening'];

  const handleAddTimeSlot = (timeSlot: 'morning'|'evening') => {
    if (!newSchedule.timeSlots.includes(timeSlot)) {
      setNewSchedule(prev => ({
        ...prev,
        timeSlots: [...prev.timeSlots, timeSlot]
      }));
    }
  };

  const handleRemoveTimeSlot = (timeSlot: 'morning'|'evening') => {
    setNewSchedule(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(slot => slot !== timeSlot)
    }));
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.examLevel || !newSchedule.date || newSchedule.timeSlots.length === 0) {
      return;
    }
    // Create one schedule per selected time slot via API
    const dateStr = format(newSchedule.date, 'yyyy-MM-dd');
    for (const slot of newSchedule.timeSlots) {
      await scheduleAPI.createSchedule({
        examDate: dateStr,
        examTime: slot,
        examLevel: newSchedule.examLevel,
        examType: newSchedule.examType,
        totalSlots: newSchedule.maxCapacity,
      });
    }
    // Refresh list
    await fetchSchedules();
    // Reset form
    setNewSchedule({
      examLevel: "",
      date: undefined,
      timeSlots: [],
      testCenter: "BSLEU Main Center, New Delhi",
      maxCapacity: 20,
      examType: 'full',
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteSchedule = async (id: string) => {
    await scheduleAPI.deleteSchedule(Number(id));
    await fetchSchedules();
  };

  const fetchSchedules = async () => {
    const res = await scheduleAPI.getAvailableSchedules();
    if (res.success && res.data) {
      const mapped: ScheduleData[] = res.data.map((s: any) => ({
        id: String(s.id),
        examLevel: s.examLevel,
        date: new Date(s.examDate),
        timeSlots: [s.examTime],
        testCenter: s.testCenter,
        maxCapacity: s.totalSlots,
        currentBookings: s.bookedSlots,
      }));
      setSchedules(mapped);
      onScheduleUpdate?.(mapped);
    }
  };

  // initial load and auto-refresh
  useEffect(() => {
    fetchSchedules();
    // Auto-refresh every 30 seconds to show real-time booking updates
    const interval = setInterval(fetchSchedules, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAvailabilityStatus = (schedule: ScheduleData) => {
    const percentage = (schedule.currentBookings / schedule.maxCapacity) * 100;
    if (percentage >= 100) return { status: "Full", color: "bg-red-100 text-red-800" };
    if (percentage >= 80) return { status: "Almost Full", color: "bg-yellow-100 text-yellow-800" };
    return { status: "Available", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {schedules.reduce((sum, s) => sum + s.currentBookings, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {schedules.reduce((sum, s) => sum + (s.maxCapacity - s.currentBookings), 0)}
            </p>
            <p className="text-sm text-gray-600">Available Seats</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {schedules.length}
            </p>
            <p className="text-sm text-gray-600">Active Schedules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {schedules.reduce((sum, s) => sum + s.maxCapacity, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" size="sm" onClick={fetchSchedules} className="gap-2 w-full sm:w-auto">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
          <span className="sm:hidden">Refresh Data</span>
        </Button>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label className="text-sm font-medium shrink-0">Exam Level</Label>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-32 lg:w-40">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {examLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label className="text-sm font-medium shrink-0">Time</Label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full sm:w-28 lg:w-32">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Times</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* Add Schedule Dialog */}
      <div className="flex justify-start">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Schedule</span>
              <span className="sm:hidden">Add New</span>
            </Button>
          </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Exam Schedule</DialogTitle>
          </DialogHeader>
          <DialogDescription id="dialog-desc" className="sr-only">
            Fill the fields below to add a new exam schedule. Time slots are Morning or Evening and the exam center is fixed.
          </DialogDescription>
          <div className="space-y-4">
            <div>
              <Label htmlFor="examLevel">Exam Level</Label>
              <Select value={newSchedule.examLevel} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, examLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam level" />
                </SelectTrigger>
                <SelectContent>
                  {examLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Exam Date</Label>
              <Calendar
                mode="single"
                selected={newSchedule.date}
                onSelect={(date) => setNewSchedule(prev => ({ ...prev, date }))}
                disabled={(date) => date < new Date()}
                className="rounded-md border pointer-events-auto max-w-full"
              />
            </div>

            <div>
              <Label htmlFor="examType">Exam Type</Label>
              <Select value={newSchedule.examType} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, examType: value as 'full' | 'partial' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full (Written + Oral)</SelectItem>
                  <SelectItem value="partial">Partial (Written OR Oral)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Test center selection removed per single-center model */}

            <div>
              <Label>Time Slots</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableTimeSlots.map(slot => (
                  <Button
                    key={slot}
                    variant={newSchedule.timeSlots.includes(slot) ? "default" : "outline"}
                    size="sm"
                    onClick={() => newSchedule.timeSlots.includes(slot) ? handleRemoveTimeSlot(slot) : handleAddTimeSlot(slot)}
                  >
                    {slot === 'morning' ? 'Morning' : 'Evening'}
                  </Button>
                ))}
              </div>
              {newSchedule.timeSlots.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Selected: </span>
                  {newSchedule.timeSlots.map(slot => (
                    <Badge key={slot} variant="secondary" className="mr-1 mb-1">
                      {slot}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleRemoveTimeSlot(slot)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="maxCapacity">Max Capacity</Label>
              <Input
                id="maxCapacity"
                type="number"
                value={newSchedule.maxCapacity}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) || 20 }))}
                min="1"
                max="50"
              />
            </div>

            <Button onClick={handleAddSchedule} className="w-full">
              Add Schedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Existing Schedules */}
      <div className="space-y-4">
        {schedules
          .filter(s => levelFilter === 'all' || s.examLevel === levelFilter)
          .filter(s => timeFilter === 'all' || s.timeSlots.includes(timeFilter as 'morning'|'evening'))
          .map(schedule => {
          const availability = getAvailabilityStatus(schedule);
          return (
            <Card key={schedule.id} className="border-l-4 border-blue-500">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-800 w-fit text-xs sm:text-sm">
                      {schedule.examLevel}
                    </Badge>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base">
                        {format(schedule.date, "PPP")}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {schedule.testCenter}
                      </p>
                      <p className="text-xs text-gray-500">
                        {schedule.timeSlots.length} time slots available
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div className="text-left sm:text-right">
                      <p className="text-base sm:text-lg font-bold text-blue-600">
                        {schedule.currentBookings}/{schedule.maxCapacity}
                      </p>
                      <p className="text-xs text-gray-500">Booked/Total</p>
                    </div>
                    <Badge className={`${availability.color} text-xs`}>
                      {availability.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Available Seats:</span>
                    <p className="font-medium text-green-600">
                      {schedule.maxCapacity - schedule.currentBookings} remaining
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Booking Progress:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((schedule.currentBookings / schedule.maxCapacity) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((schedule.currentBookings / schedule.maxCapacity) * 100)}% filled
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">{format(schedule.date, "PPP")}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Center:</span>
                    <p className="font-medium">{schedule.testCenter}</p>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 text-xs sm:text-sm">Time Slots:</span>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                    {schedule.timeSlots.map(slot => (
                      <Badge key={slot} variant="outline" className="bg-green-50 text-green-700 text-xs capitalize">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {schedules.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Yet</h3>
            <p className="text-gray-600 mb-4">Add your first exam schedule to get started.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
