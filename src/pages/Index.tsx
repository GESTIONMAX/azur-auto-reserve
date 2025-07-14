import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Car, Settings, Shield, Phone, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import ServiceTypes from "@/components/ServiceTypes";
import InterventionZones from "@/components/InterventionZones";
import PricingSection from "@/components/PricingSection";

const Index = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'suppression_fap',
      title: 'Suppression FAP',
      description: 'Suppression complète du filtre à particules',
      price: 299,
      duration: '2-3h',
      features: ['Diagnostic complet', 'Reprogrammation moteur', 'Test sur route', 'Garantie 2 ans']
    },
    {
      id: 'suppression_egr',
      title: 'Suppression EGR',
      description: 'Désactivation de la vanne EGR',
      price: 249,
      duration: '1-2h',
      features: ['Diagnostic complet', 'Reprogrammation ECU', 'Vérification émissions', 'Garantie 2 ans']
    },
    {
      id: 'suppression_adblue',
      title: 'Suppression AdBlue',
      description: 'Suppression système SCR AdBlue',
      price: 399,
      duration: '3-4h',
      features: ['Diagnostic approfondi', 'Reprogrammation complète', 'Test performance', 'Garantie 2 ans']
    },
    {
      id: 'reprogrammation_stage1',
      title: 'Reprogrammation Stage 1',
      description: 'Optimisation moteur niveau 1',
      price: 349,
      duration: '2h',
      features: ['+15% puissance', '+20% couple', 'Économie carburant', 'Garantie 2 ans']
    },
    {
      id: 'reprogrammation_stage2',
      title: 'Reprogrammation Stage 2',
      description: 'Optimisation moteur niveau 2',
      price: 499,
      duration: '3h',
      features: ['+25% puissance', '+30% couple', 'Modifications hardwares', 'Garantie 2 ans']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">OBDExpress</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#services" className="text-muted-foreground hover:text-primary">Services</a>
              <a href="#zones" className="text-muted-foreground hover:text-primary">Zones</a>
              <a href="#tarifs" className="text-muted-foreground hover:text-primary">Tarifs</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary">Contact</a>
              <Button variant="outline" onClick={() => navigate('/sav')}>SAV</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Expert en Reprogrammation Moteur</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Spécialiste de la suppression FAP, EGR, AdBlue et reprogrammation moteur. 
            Service professionnel avec garantie 2 ans.
          </p>
          <Button size="lg" onClick={() => navigate('/reservation')}>
            Réserver maintenant
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Call to Action */}
      <CallToAction />

      {/* Service Types */}
      <div className="container mx-auto px-4">
        <ServiceTypes />
      </div>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Nos diagnostic ODB à domicile</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {service.title}
                    <span className="text-2xl font-bold text-primary">{service.price}€</span>
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Settings className="h-4 w-4 mr-2" />
                      Durée: {service.duration}
                    </div>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate(`/reservation?service=${service.id}`)}
                    >
                      Réserver ce service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Intervention Zones */}
      <div className="container mx-auto px-4">
        <InterventionZones />
      </div>

      {/* Pricing Section */}
      <PricingSection />

      {/* About Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Pourquoi choisir OBDExpress ?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Expertise reconnue</h4>
                    <p className="text-muted-foreground">Plus de 10 ans d'expérience en reprogrammation moteur</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Settings className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Équipement professionnel</h4>
                    <p className="text-muted-foreground">Outils de diagnostic et reprogrammation dernière génération</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Garantie 2 ans</h4>
                    <p className="text-muted-foreground">Toutes nos interventions sont garanties 2 ans</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold mb-4">Processus d'intervention</h4>
              <ol className="space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <span>Diagnostic complet du véhicule</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <span>Sauvegarde de l'original</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <span>Reprogrammation sécurisée</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <span>Test et validation</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Contact</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Phone className="h-12 w-12 text-primary mb-4" />
              <h4 className="font-semibold mb-2">Téléphone</h4>
              <p className="text-muted-foreground">06 46 02 24 68</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-12 w-12 text-primary mb-4" />
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-muted-foreground">contact@obdexpress.fr</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <h4 className="font-semibold mb-2">Zone d'intervention</h4>
              <p className="text-muted-foreground">Antibes et alentours<br />Alpes-Maritimes (06)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2024 OBDExpress. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
