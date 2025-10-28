import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Chatbot from '@/components/Chatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Users, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Experts = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [farms, setFarms] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [date, setDate] = useState<Date>();
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchFarms();
      fetchAppointments();
    }
  }, [user]);

  const fetchFarms = async () => {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setFarms(data || []);
    }
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('expert_appointments')
      .select('*, farms(farm_name)')
      .eq('farmer_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setAppointments(data || []);
    }
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !date) return;

    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from('expert_appointments').insert({
      farmer_id: user.id,
      farm_id: formData.get('farmId') as string,
      appointment_date: date.toISOString(),
      notes: formData.get('notes') as string,
      status: 'pending',
    });

    if (error) {
      toast.error('Failed to book appointment');
    } else {
      toast.success('Appointment request sent successfully!');
      setShowBooking(false);
      setDate(undefined);
      fetchAppointments();
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={styles[status] || ''}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Expert Consultation</h1>
          <p className="text-muted-foreground">
            Connect with agricultural experts for professional advice
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Available Experts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">15+</div>
              <p className="text-sm text-muted-foreground">Certified agricultural experts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24h</div>
              <p className="text-sm text-muted-foreground">Average response time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">95%</div>
              <p className="text-sm text-muted-foreground">Problem resolution rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Book Expert Consultation</CardTitle>
              <CardDescription>
                Schedule a session with our agricultural specialists
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showBooking ? (
                <Button onClick={() => setShowBooking(true)} className="w-full">
                  Book New Appointment
                </Button>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Farm</Label>
                    <Select name="farmId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a farm" />
                      </SelectTrigger>
                      <SelectContent>
                        {farms.map((farm) => (
                          <SelectItem key={farm.id} value={farm.id}>
                            {farm.farm_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Describe your concerns or questions..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBooking(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Submit Request
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
              <CardDescription>
                Track your consultation requests and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{apt.farms?.farm_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {apt.appointment_date
                              ? format(new Date(apt.appointment_date), 'PPP')
                              : 'Date TBD'}
                          </p>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>
                      {apt.notes && (
                        <p className="text-sm text-muted-foreground">{apt.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No appointments yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default Experts;
