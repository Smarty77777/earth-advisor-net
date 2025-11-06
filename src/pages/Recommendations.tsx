import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Chatbot from '@/components/Chatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Recommendations = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [generatingAI, setGeneratingAI] = useState(false);

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
      fetchRecommendations();
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

  const fetchRecommendations = async () => {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('farm_id', selectedFarm)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load recommendations');
    } else {
      setRecommendations(data || []);
    }
  };

  const generateAIRecommendations = async () => {
    if (!selectedFarm) return;
    
    setGeneratingAI(true);
    try {
      // Fetch farm and monitoring data
      const { data: farmData } = await supabase
        .from('farms')
        .select('*')
        .eq('id', selectedFarm)
        .single();

      const { data: monitoringData } = await supabase
        .from('monitoring_data')
        .select('*')
        .eq('farm_id', selectedFarm)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      // Call AI for recommendations
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-recommendations', {
        body: { farm: farmData, monitoring: monitoringData }
      });

      if (aiError) throw aiError;

      // Save recommendations
      const recommendationsToSave = aiData.recommendations.map((rec: any) => ({
        farm_id: selectedFarm,
        recommendation_type: rec.type,
        content: rec.content,
        confidence_score: rec.confidence,
        created_by: user?.id,
        status: 'pending'
      }));

      const { error: insertError } = await supabase
        .from('recommendations')
        .insert(recommendationsToSave);

      if (insertError) throw insertError;

      toast.success('AI recommendations generated successfully!');
      fetchRecommendations();
    } catch (error: any) {
      console.error('AI recommendation error:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setGeneratingAI(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      crop: 'bg-green-100 text-green-800',
      fertilizer: 'bg-blue-100 text-blue-800',
      irrigation: 'bg-cyan-100 text-cyan-800',
      pest_control: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            AI Recommendations
          </h1>
          <p className="text-lg text-muted-foreground">
            Get intelligent suggestions for optimizing your farm operations
          </p>
        </div>

        {farms.length > 0 ? (
          <>
            <div className="flex gap-4 mb-6 flex-wrap">
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

              <Button onClick={generateAIRecommendations} disabled={generatingAI} size="lg" className="shadow-lg">
                <Lightbulb className="h-5 w-5 mr-2" />
                {generatingAI ? 'Generating...' : 'Generate AI Recommendations'}
              </Button>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid gap-6">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="shadow-lg border-border/50 hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeBadge(rec.recommendation_type)}>
                              {rec.recommendation_type.replace('_', ' ')}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(rec.status)}
                              <span className="text-sm capitalize">{rec.status}</span>
                            </div>
                          </div>
                          <CardTitle className="text-lg">
                            {rec.recommendation_type === 'crop' && 'Crop Selection Recommendation'}
                            {rec.recommendation_type === 'fertilizer' && 'Fertilizer Application Recommendation'}
                            {rec.recommendation_type === 'irrigation' && 'Irrigation Schedule Recommendation'}
                            {rec.recommendation_type === 'pest_control' && 'Pest Control Recommendation'}
                          </CardTitle>
                        </div>
                        {rec.confidence_score && (
                          <div className="text-right">
                            <div className="text-sm font-medium">Confidence</div>
                            <div className="text-2xl font-bold text-primary">
                              {(rec.confidence_score * 100).toFixed(0)}%
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">{rec.content}</p>
                      <p className="text-xs text-muted-foreground mt-4">
                        Created: {new Date(rec.created_at).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    No recommendations yet for this farm
                  </p>
                  <Button onClick={generateAIRecommendations} disabled={generatingAI}>
                    Generate Your First Recommendations
                  </Button>
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

export default Recommendations;
