import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Chatbot from '@/components/Chatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Wind, Leaf, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const Monitoring = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [monitoringData, setMonitoringData] = useState<any[]>([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchFarms();
    }
  }, [user]);

  useEffect(() => {
    if (selectedFarm) {
      fetchMonitoringData();
    }
  }, [selectedFarm]);

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
        setSelectedFarm(data[0].id);
      }
    }
  };

  const fetchMonitoringData = async () => {
    const { data, error } = await supabase
      .from('monitoring_data')
      .select('*')
      .eq('farm_id', selectedFarm)
      .order('recorded_at', { ascending: true })
      .limit(20);

    if (error) {
      toast.error('Failed to load monitoring data');
    } else {
      setMonitoringData(data || []);
    }
  };

  const fetchWeatherData = async () => {
    if (!selectedFarm) {
      toast.error('Please select a farm first');
      return;
    }

    setIsLoadingWeather(true);
    try {
      const farm = farms.find(f => f.id === selectedFarm);
      if (!farm) {
        toast.error('Farm not found');
        return;
      }

      // Call the edge function to get weather data
      const { data, error } = await supabase.functions.invoke('fetch-weather', {
        body: { location: farm.location }
      });

      if (error) throw error;

      // Insert the weather data into monitoring_data table
      const { error: insertError } = await supabase
        .from('monitoring_data')
        .insert({
          farm_id: selectedFarm,
          temperature: data.temperature,
          humidity: data.humidity,
          soil_moisture: data.soil_moisture,
          soil_ph: data.soil_ph,
          nitrogen: data.nitrogen,
          phosphorus: data.phosphorus,
          potassium: data.potassium,
          weather_condition: data.weather_condition
        });

      if (insertError) throw insertError;

      toast.success('Weather data fetched and saved successfully!');
      fetchMonitoringData(); // Refresh the data
    } catch (error: any) {
      console.error('Error fetching weather data:', error);
      toast.error(error.message || 'Failed to fetch weather data');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const latestData = monitoringData[monitoringData.length - 1];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Farm Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time environmental and soil data from your farms
          </p>
        </div>

        {farms.length > 0 ? (
          <>
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Select value={selectedFarm} onValueChange={setSelectedFarm}>
                <SelectTrigger className="w-full max-w-sm">
                  <SelectValue placeholder="Select a farm" />
                </SelectTrigger>
                <SelectContent>
                  {farms.map((farm) => (
                    <SelectItem key={farm.id} value={farm.id}>
                      {farm.farm_name} - {farm.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={fetchWeatherData} 
                disabled={isLoadingWeather || !selectedFarm}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingWeather ? 'animate-spin' : ''}`} />
                Fetch Live Weather
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                  <Thermometer className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestData?.temperature ? `${latestData.temperature}°C` : '--'}
                  </div>
                  <p className="text-xs text-muted-foreground">Current reading</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                  <Droplets className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestData?.humidity ? `${latestData.humidity}%` : '--'}
                  </div>
                  <p className="text-xs text-muted-foreground">Air humidity</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
                  <Droplets className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestData?.soil_moisture ? `${latestData.soil_moisture}%` : '--'}
                  </div>
                  <p className="text-xs text-muted-foreground">Soil water content</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Soil pH</CardTitle>
                  <Leaf className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestData?.soil_ph ? latestData.soil_ph.toFixed(1) : '--'}
                  </div>
                  <p className="text-xs text-muted-foreground">Acidity level</p>
                </CardContent>
              </Card>
            </div>

            {monitoringData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Trends</CardTitle>
                  <CardDescription>Historical data from the last 20 readings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monitoringData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="recorded_at"
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(value) => new Date(value).toLocaleString()}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="hsl(var(--destructive))"
                          name="Temperature (°C)"
                        />
                        <Line
                          type="monotone"
                          dataKey="humidity"
                          stroke="hsl(var(--accent))"
                          name="Humidity (%)"
                        />
                        <Line
                          type="monotone"
                          dataKey="soil_moisture"
                          stroke="hsl(var(--primary))"
                          name="Soil Moisture (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No monitoring data available yet. Data will appear here once sensors start recording.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="mb-4 text-muted-foreground">No farms registered yet</p>
              <button
                onClick={() => navigate('/farm-details')}
                className="text-primary hover:underline"
              >
                Register your first farm
              </button>
            </CardContent>
          </Card>
        )}
      </main>
      <Chatbot />
    </div>
  );
};

export default Monitoring;
