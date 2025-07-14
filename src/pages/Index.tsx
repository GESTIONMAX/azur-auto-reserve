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

      {/* Nos Forfaits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">Nos Forfaits Diagnostic OBD</h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choisissez le forfait qui correspond à vos besoins. Tous nos forfaits incluent le déplacement à domicile.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Forfait Essentiel */}
            <Card className="relative hover:shadow-lg transition-shadow border-t-4 border-t-primary">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl mb-2">Essentiel</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">99€</span>
                  <span className="text-muted-foreground"> TTC</span>
                </div>
                <CardDescription>Pour un diagnostic rapide et efficace</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Lecture des codes défaut</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Effacement des voyants</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Rapport de base</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Conseil technique</span>
                  </li>
                </ul>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/reservation?forfait=essentiel')}
                >
                  Choisir ce forfait
                </Button>
              </CardContent>
            </Card>

            {/* Forfait Complet */}
            <Card className="relative hover:shadow-lg transition-shadow border-t-4 border-t-secondary scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Populaire
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl mb-2">Complet</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-secondary">149€</span>
                  <span className="text-muted-foreground"> TTC</span>
                </div>
                <CardDescription>Diagnostic approfondi avec analyse détaillée</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Tout du forfait Essentiel</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Diagnostic avancé multisystème</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Rapport détaillé avec photos</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Estimation des réparations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Suivi post-diagnostic</span>
                  </li>
                </ul>
                <Button 
                  className="w-full"
                  variant="secondary"
                  onClick={() => navigate('/reservation?forfait=complet')}
                >
                  Choisir ce forfait
                </Button>
              </CardContent>
            </Card>

            {/* Forfait Premium */}
            <Card className="relative hover:shadow-lg transition-shadow border-t-4 border-t-accent">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl mb-2">Premium</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-accent">199€</span>
                  <span className="text-muted-foreground"> TTC</span>
                </div>
                <CardDescription>Service VIP avec accompagnement personnalisé</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Tout du forfait Complet</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Intervention prioritaire</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Garantie étendue 1 an</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Support téléphonique 6 mois</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Diagnostic de contrôle gratuit</span>
                  </li>
                </ul>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate('/reservation?forfait=premium')}
                >
                  Choisir ce forfait
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Types */}
      <div className="container mx-auto px-4">
        <ServiceTypes />
      </div>

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
