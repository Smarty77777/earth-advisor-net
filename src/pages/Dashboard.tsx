import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Chatbot from '@/components/Chatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Sprout, Droplets, ThermometerSun, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [farms, setFarms] = useState<any[]>([]);
  const [recentMonitoring, setRecentMonitoring] = useState<any[]>([]);
  const [recommendationsCount, setRecommendationsCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchFarms();
      fetchRecommendationsCount();
    }
  }, [user]);

  const fetchRecommendationsCount = async () => {
    const { data: farmsData } = await supabase.from('farms').select('id');
    if (farmsData && farmsData.length > 0) {
      const farmIds = farmsData.map(f => f.id);
      const { count } = await supabase
        .from('recommendations')
        .select('*', { count: 'exact', head: true })
        .in('farm_id', farmIds);
      setRecommendationsCount(count || 0);
    }
  };

  const fetchFarms = async () => {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load farms');
    } else {
      setFarms(data || []);
      if (data && data.length > 0) {
        fetchMonitoringData(data[0].id);
      }
    }
  };

  const fetchMonitoringData = async (farmId: string) => {
    const { data, error } = await supabase
      .from('monitoring_data')
      .select('*')
      .eq('farm_id', farmId)
      .order('recorded_at', { ascending: false })
      .limit(1);

    if (!error && data) {
      setRecentMonitoring(data);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const latestData = recentMonitoring[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Farmer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your farm overview.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
              <Sprout className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farms.length}</div>
              <p className="text-xs text-muted-foreground">Active farms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
              <Droplets className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestData?.soil_moisture ? `${latestData.soil_moisture}%` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">Current level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <ThermometerSun className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestData?.temperature ? `${latestData.temperature}°C` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">Current temp</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendationsCount}</div>
              <p className="text-xs text-muted-foreground">Active suggestions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Farms</CardTitle>
              <CardDescription>
                Manage and monitor your agricultural properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              {farms.length > 0 ? (
                <div className="space-y-4">
                  {farms.map((farm) => (
                    <div key={farm.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{farm.farm_name}</h3>
                      <p className="text-sm text-muted-foreground">{farm.location}</p>
                      <p className="text-sm">Area: {farm.area_size} hectares</p>
                      <p className="text-sm">Crop: {farm.crop_type}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => navigate('/farm-details')}>
                    Add New Farm
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="mb-4 text-muted-foreground">No farms registered yet</p>
                  <Button onClick={() => navigate('/farm-details')}>
                    Register Your First Farm
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => navigate('/monitoring')}>
                View Monitoring Data
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/recommendations')}>
                Get Recommendations
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/experts')}>
                Book Expert Consultation
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/help')}>
                Get Help
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default Dashboard;
