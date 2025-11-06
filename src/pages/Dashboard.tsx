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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Farmer Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Welcome back! Here's your farm overview.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-in fade-in slide-in-from-bottom duration-700">
          <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sprout className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{farms.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active farms registered</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Droplets className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {latestData?.soil_moisture ? `${latestData.soil_moisture}%` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Current moisture level</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <ThermometerSun className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {latestData?.temperature ? `${latestData.temperature}°C` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Current temperature</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{recommendationsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Active AI suggestions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-lg">
              <CardTitle className="text-2xl">Your Farms</CardTitle>
              <CardDescription>
                Manage and monitor your agricultural properties
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {farms.length > 0 ? (
                <div className="space-y-4">
                  {farms.map((farm) => (
                    <div key={farm.id} className="p-5 border rounded-xl bg-gradient-to-br from-card to-muted/30 hover:shadow-md transition-all duration-300 hover:border-primary/30">
                      <h3 className="font-bold text-lg mb-2 text-primary">{farm.farm_name}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">📍 {farm.location}</p>
                        <p className="text-muted-foreground">📏 {farm.area_size} hectares</p>
                        <p className="text-muted-foreground col-span-2">🌾 {farm.crop_type}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5" onClick={() => navigate('/farm-details')}>
                    + Add New Farm
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
                  <div className="mb-4 text-6xl">🌱</div>
                  <p className="mb-6 text-muted-foreground text-lg">No farms registered yet</p>
                  <Button size="lg" onClick={() => navigate('/farm-details')} className="shadow-lg">
                    Register Your First Farm
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-t-lg">
              <CardTitle className="text-2xl">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <Button className="w-full justify-start text-left h-auto py-4 shadow-md hover:shadow-lg transition-all" onClick={() => navigate('/monitoring')}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                    📊
                  </div>
                  <div>
                    <div className="font-semibold">View Monitoring Data</div>
                    <div className="text-xs opacity-90">Real-time farm metrics</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-4 hover:bg-primary/5 hover:border-primary" onClick={() => navigate('/recommendations')}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    💡
                  </div>
                  <div>
                    <div className="font-semibold">Get Recommendations</div>
                    <div className="text-xs text-muted-foreground">AI-powered insights</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-4 hover:bg-accent/5 hover:border-accent" onClick={() => navigate('/experts')}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    👨‍🌾
                  </div>
                  <div>
                    <div className="font-semibold">Book Expert Consultation</div>
                    <div className="text-xs text-muted-foreground">Professional advice</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-4 hover:bg-secondary/5 hover:border-secondary" onClick={() => navigate('/help')}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    ❓
                  </div>
                  <div>
                    <div className="font-semibold">Get Help</div>
                    <div className="text-xs text-muted-foreground">Support & documentation</div>
                  </div>
                </div>
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
