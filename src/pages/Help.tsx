import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Chatbot from '@/components/Chatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, BookOpen, Send } from 'lucide-react';
import { toast } from 'sonner';

const Help = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to submit a ticket');
      navigate('/auth');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from('help_tickets').insert({
      user_id: user.id,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      priority: formData.get('priority') as string,
    });

    setLoading(false);
    if (error) {
      toast.error('Failed to submit ticket');
    } else {
      toast.success('Support ticket submitted successfully!');
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers to common questions or contact support
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Documentation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our comprehensive guides and tutorials
              </p>
              <Button variant="outline" className="w-full">
                View Docs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-accent" />
                <CardTitle>AI Assistant</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get instant answers from our AI chatbot
              </p>
              <Button variant="outline" className="w-full">
                Open Chat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-secondary" />
                <CardTitle>Contact Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Submit a ticket for personalized assistance
              </p>
              <Button variant="outline" className="w-full">
                Create Ticket
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I register my farm?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Dashboard and click on "Register Your First Farm" or "Add New Farm". 
                    Fill in the required details including farm name, location, area size, soil type, and crop type.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How does the monitoring system work?</AccordionTrigger>
                  <AccordionContent>
                    Our monitoring system collects real-time data from IoT sensors including temperature, humidity, 
                    soil moisture, pH levels, and NPK values. This data is displayed on your monitoring dashboard 
                    with historical trends and analysis.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What are AI recommendations?</AccordionTrigger>
                  <AccordionContent>
                    Our AI engine analyzes your farm's environmental data, soil conditions, and crop type to provide 
                    intelligent suggestions for crop selection, fertilizer application, irrigation schedules, and 
                    pest control measures. Click "Generate AI Recommendations" in the Recommendations section.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I book an expert consultation?</AccordionTrigger>
                  <AccordionContent>
                    Go to the Experts page, click "Book New Appointment", select your farm, choose a preferred date, 
                    and add any notes about your concerns. Our agricultural experts will review your request and 
                    confirm the appointment within 24 hours.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Is my farm data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, all your data is encrypted and stored securely. We use industry-standard security practices 
                    and your information is never shared with third parties without your explicit consent.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>Can I export my monitoring data?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can export your monitoring data in CSV format for further analysis. This feature 
                    will be available in your monitoring dashboard soon.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Support Ticket</CardTitle>
              <CardDescription>
                Need personalized help? Submit a ticket and we'll get back to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default Help;
