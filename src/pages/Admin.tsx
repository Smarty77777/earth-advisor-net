import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Users, Sprout, TrendingUp, Calendar } from 'lucide-react';

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarms: 0,
    totalRecommendations: 0,
    totalAppointments: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [farms, setFarms] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchUsers();
      fetchFarms();
      fetchAppointments();
    }
  }, [user]);

  const fetchStats = async () => {
    const [usersCount, farmsCount, recsCount, aptsCount] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('farms').select('*', { count: 'exact', head: true }),
      supabase.from('recommendations').select('*', { count: 'exact', head: true }),
      supabase.from('expert_appointments').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      totalUsers: usersCount.count || 0,
      totalFarms: farmsCount.count || 0,
      totalRecommendations: recsCount.count || 0,
      totalAppointments: aptsCount.count || 0,
    });
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    setUsers(data || []);
  };

  const fetchFarms = async () => {
    const { data } = await supabase
      .from('farms')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(10);
    setFarms(data || []);
  };

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('expert_appointments')
      .select('*, farms(farm_name)')
      .order('created_at', { ascending: false })
      .limit(10);
    setAppointments(data || []);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, farms, and system operations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered farmers & experts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
              <Sprout className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFarms}</div>
              <p className="text-xs text-muted-foreground">Registered properties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRecommendations}</div>
              <p className="text-xs text-muted-foreground">AI suggestions made</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">Expert consultations</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="farms">Farms</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest registered users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-semibold">{user.full_name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farms">
            <Card>
              <CardHeader>
                <CardTitle>Recent Farms</CardTitle>
                <CardDescription>Latest registered farms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farms.map((farm) => (
                    <div key={farm.id} className="border-b pb-4">
                      <p className="font-semibold">{farm.farm_name}</p>
                      <p className="text-sm text-muted-foreground">{farm.location}</p>
                      <p className="text-sm">
                        {farm.area_size} ha • {farm.crop_type} • {farm.soil_type} soil
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Latest expert consultation requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-semibold">{apt.farms?.farm_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: <span className="capitalize">{apt.status}</span>
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {apt.appointment_date
                          ? new Date(apt.appointment_date).toLocaleDateString()
                          : 'TBD'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
