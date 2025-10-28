import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const FarmDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from('farms').insert({
      user_id: user.id,
      farm_name: formData.get('farmName') as string,
      location: formData.get('location') as string,
      area_size: parseFloat(formData.get('areaSize') as string),
      soil_type: formData.get('soilType') as string,
      crop_type: formData.get('cropType') as string,
    });

    setLoading(false);
    if (error) {
      toast.error('Failed to register farm');
    } else {
      toast.success('Farm registered successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Register Your Farm</CardTitle>
            <CardDescription>
              Provide details about your agricultural property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="farmName">Farm Name</Label>
                <Input
                  id="farmName"
                  name="farmName"
                  placeholder="Green Valley Farm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City, State/Region"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaSize">Area Size (hectares)</Label>
                <Input
                  id="areaSize"
                  name="areaSize"
                  type="number"
                  step="0.1"
                  placeholder="10.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type</Label>
                <Select name="soilType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="silty">Silty</SelectItem>
                    <SelectItem value="peaty">Peaty</SelectItem>
                    <SelectItem value="chalky">Chalky</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cropType">Current Crop Type</Label>
                <Input
                  id="cropType"
                  name="cropType"
                  placeholder="Wheat, Rice, Corn, etc."
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Farm'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FarmDetails;
