import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Car, Settings, Shield, Phone, Mail, MapPin, Menu, X } from "lucide-react";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import ServiceTypes from "@/components/ServiceTypes";
import InterventionZones from "@/components/InterventionZones";
import ReservationForm from "@/components/ReservationForm";
import SAVForm from "@/components/SAVForm";

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Ferme le menu après la sélection d'un lien
  };
  
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">OBDExpress</h1>
            </div>
            
            {/* Menu pour tablette/desktop */}
            <nav className="hidden md:flex space-x-6">
              <button onClick={() => scrollToSection('forfaits')} className="text-muted-foreground hover:text-primary transition-colors">Notre Offre</button>
              <button onClick={() => scrollToSection('faq')} className="text-muted-foreground hover:text-primary transition-colors">FAQ</button>
              <button onClick={() => scrollToSection('reservation')} className="text-muted-foreground hover:text-primary transition-colors">Réservation</button>
              <Button variant="outline" onClick={() => scrollToSection('sav')}>SAV</Button>
              <Button variant="default" onClick={() => window.location.href = '/admin/auth'}>Admin</Button>
            </nav>
            
            {/* Bouton du menu hamburger (mobile) */}
            <button 
              className="md:hidden p-2 text-primary" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Menu mobile */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('forfaits')} 
                  className="text-left px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  Notre Offre
                </button>
                <button 
                  onClick={() => scrollToSection('faq')} 
                  className="text-left px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => scrollToSection('reservation')} 
                  className="text-left px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  Réservation
                </button>
                <button 
                  onClick={() => scrollToSection('sav')} 
                  className="text-left px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  SAV
                </button>
                <button 
                  onClick={() => window.location.href = '/admin/auth'} 
                  className="text-left px-2 py-1 font-medium text-primary"
                >
                  Admin
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16 pattern-dots">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Expert en Diagnostic Automobile</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Spécialiste du diagnostic OBD à domicile dans les Alpes-Maritimes. 
              Service professionnel avec rapport détaillé et conseils techniques.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => scrollToSection('reservation')}>
                Réserver maintenant
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection('forfaits')}>
                Voir nos forfaits
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/diagnostic-automobile.webp" 
              alt="Diagnostic automobile professionnel" 
              className="rounded-lg shadow-lg w-full h-auto" 
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Call to Action */}
      <CallToAction />

      {/* Notre Offre */}
      <section id="forfaits" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">Notre Offre Diagnostic OBD</h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Une formule simple et efficace pour tous vos besoins de diagnostic. Déplacement à domicile inclus.
          </p>
          
          <div className="flex justify-center max-w-6xl mx-auto">
            {/* Forfait Essentiel - Offre Unique */}
            <Card className="relative shadow-md border-t-4 border-t-[#16a34a] max-w-md w-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#16a34a] text-white px-6 py-1 rounded-full text-sm font-medium">
                Offre Unique
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-2">Diagnostic Essentiel</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-[#16a34a]">99€</span>
                  <span className="text-muted-foreground"> TTC</span>
                </div>
                <CardDescription>Pour un diagnostic complet et efficace</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-[#16a34a] mr-3 flex-shrink-0" />
                    <span>Lecture des codes défaut</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-[#16a34a] mr-3 flex-shrink-0" />
                    <span>Effacement des voyants</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-[#16a34a] mr-3 flex-shrink-0" />
                    <span>Rapport détaillé</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-[#16a34a] mr-3 flex-shrink-0" />
                    <span>Conseil technique</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-[#16a34a] mr-3 flex-shrink-0" />
                    <span>Déplacement à domicile</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white"
                  onClick={() => scrollToSection('reservation')}
                >
                  Réserver maintenant
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

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Foire Aux Questions</h2>
          <p className="text-muted-foreground text-center mb-12">Tout ce que vous devez savoir sur notre service de diagnostic</p>
          
          <Tabs defaultValue="before" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="before">Avant le diagnostic</TabsTrigger>
              <TabsTrigger value="during">Pendant le diagnostic</TabsTrigger>
              <TabsTrigger value="after">Après le diagnostic</TabsTrigger>
            </TabsList>
            
            <TabsContent value="before" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Comment prendre rendez-vous pour un diagnostic ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Vous pouvez prendre rendez-vous directement en ligne via notre formulaire de réservation, par téléphone au 06 46 02 24 68, ou par WhatsApp. Nous vous proposerons plusieurs créneaux selon vos disponibilités.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Quels sont les délais d'intervention ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Nous intervenons généralement dans les 24-48h suivant votre demande. Pour les urgences, nous proposons des interventions le jour même selon disponibilité.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Faut-il préparer quelque chose avant votre arrivée ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Assurez-vous simplement que votre véhicule soit accessible et que vous ayez les clés. Aucune préparation particulière n'est nécessaire de votre part.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Intervenez-vous tous les jours ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Nous intervenons du lundi au samedi, de 8h à 19h. Les dimanches sont réservés aux urgences uniquement.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="during" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-5" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Combien de temps dure un diagnostic ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Un diagnostic complet prend généralement entre 30 minutes et 1 heure, selon la complexité des problèmes détectés et le forfait choisi.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Puis-je assister au diagnostic ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Bien sûr ! Nous encourageons même votre présence. Nous vous expliquerons chaque étape du diagnostic et répondrons à toutes vos questions en temps réel.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Que se passe-t-il si aucun défaut n'est trouvé ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Si aucun code défaut n'est détecté, nous vous remettons quand même un rapport confirmant le bon état de votre véhicule. Le diagnostic reste facturé car le service a été réalisé.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Utilisez-vous du matériel professionnel ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Oui, nous utilisons des valises de diagnostic professionnelles de dernière génération (iCarsoft, Bosch, etc.) compatibles avec toutes les marques automobiles.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="after" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-9" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Recevrai-je un rapport détaillé ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Oui, vous recevrez un rapport complet par email dans les 2 heures suivant l'intervention, incluant les codes défaut, leur signification et nos recommandations.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-10" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Proposez-vous un suivi après diagnostic ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Selon votre forfait, nous proposons un suivi téléphonique et la possibilité de nous recontacter pour des questions relatives au diagnostic réalisé.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-11" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Puis-je avoir des conseils pour le contrôle technique ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Absolument ! Nous vous donnons tous les conseils nécessaires pour passer votre contrôle technique sereinement et vous indiquons les réparations prioritaires si besoin.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-12" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Que faire si le problème persiste ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Si le problème persiste après effacement des codes défaut, nous vous proposons un nouveau diagnostic approfondi. Certains forfaits incluent une garantie de reprise.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Reservation Form */}
      <ReservationForm />

      {/* SAV Form */}
      <SAVForm />

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
