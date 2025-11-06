import { useState, useRef } from 'react';
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
  const [chatOpen, setChatOpen] = useState(false);
  const ticketFormRef = useRef<HTMLDivElement>(null);

  const handleViewDocs = () => {
    // Scroll to documentation section
    const docsSection = document.getElementById('docs-section');
    docsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleOpenChat = () => {
    setChatOpen(true);
  };

  const handleCreateTicket = () => {
    ticketFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
            Help & Support
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions or contact support
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Documentation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our comprehensive guides and tutorials
              </p>
              <Button variant="outline" className="w-full hover:bg-primary/5 hover:border-primary" onClick={handleViewDocs}>
                View Docs
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-accent/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-accent" />
                </div>
                <CardTitle>AI Assistant</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get instant answers from our AI chatbot
              </p>
              <Button variant="outline" className="w-full hover:bg-accent/5 hover:border-accent" onClick={handleOpenChat}>
                Open Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Send className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle>Contact Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Submit a ticket for personalized assistance
              </p>
              <Button variant="outline" className="w-full hover:bg-secondary/5 hover:border-secondary" onClick={handleCreateTicket}>
                Create Ticket
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2 mb-6 shadow-xl border-border/50" id="docs-section">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-lg">
            <CardTitle className="text-2xl">Documentation & Guides</CardTitle>
            <CardDescription>
              Comprehensive tutorials to help you get the most out of EcoFarm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Learn how to set up your account, register your first farm, and navigate the dashboard.
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monitoring Guide</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Understand sensor data, interpret trends, and use real-time monitoring for better farm management.
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Discover how to generate and implement AI-powered insights for crop selection and farm optimization.
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Expert Consultations</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Book and prepare for consultations with agricultural experts to get personalized advice.
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Learn farming best practices, sustainable techniques, and how to maximize your yields.
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Solutions for common issues, sensor calibration, and technical support resources.
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2" id="faq-section">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-t-lg">
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
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

          <Card ref={ticketFormRef} className="shadow-lg border-border/50">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-accent/5 rounded-t-lg">
              <CardTitle className="text-2xl">Submit Support Ticket</CardTitle>
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
      <Chatbot isOpen={chatOpen} setIsOpen={setChatOpen} />
    </div>
  );
};

export default Help;
