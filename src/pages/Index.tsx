import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import logo from '@/assets/ecofarm-logo.png';
import heroImage from '@/assets/farm-hero.jpg';
import { Sprout, TrendingUp, Users, BarChart3, Lightbulb, Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="EcoFarm" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-primary">EcoFarm</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="container relative z-10 mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
              Sustainable Farming Through
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Smart Technology</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Transform your agricultural operations with AI-powered monitoring, 
              intelligent recommendations, and expert guidance—all in one platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/auth')} className="px-8">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/help')}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Farm Management</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to optimize your farming operations
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Sprout className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Real-Time Monitoring</CardTitle>
                <CardDescription>
                  Track soil moisture, temperature, humidity, and nutrient levels with IoT sensors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 24/7 environmental monitoring</li>
                  <li>• Soil health analytics</li>
                  <li>• Weather integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-accent mb-2" />
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>
                  Get intelligent suggestions for crops, irrigation, fertilizers, and pest control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Crop selection guidance</li>
                  <li>• Irrigation scheduling</li>
                  <li>• Fertilizer optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Expert Consultation</CardTitle>
                <CardDescription>
                  Connect with certified agricultural experts for professional advice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 15+ certified experts</li>
                  <li>• 24-hour response time</li>
                  <li>• Personalized solutions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Visualize trends and make data-driven decisions for your farm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Historical data analysis</li>
                  <li>• Performance metrics</li>
                  <li>• Yield predictions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-green-500 mb-2" />
                <CardTitle>Resource Optimization</CardTitle>
                <CardDescription>
                  Reduce waste and increase efficiency with smart resource management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Water conservation</li>
                  <li>• Fertilizer reduction</li>
                  <li>• Cost savings tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security with 99.9% uptime guarantee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Encrypted data storage</li>
                  <li>• Regular backups</li>
                  <li>• GDPR compliant</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of farmers using EcoFarm to increase yields and reduce costs
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="px-8">
            Start Your Free Trial Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <img src={logo} alt="EcoFarm" className="h-8 w-auto" />
              <span className="text-lg font-bold text-primary">EcoFarm</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 EcoFarm. All rights reserved. Sustainable farming through innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
