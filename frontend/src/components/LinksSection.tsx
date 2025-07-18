import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, AlertTriangle, Info, Wrench, MapPin } from "lucide-react";

const LinksSection = () => {
  const linkCategories = [
    {
      title: "Contrôle Technique",
      icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
      description: "Informations officielles sur le contrôle technique",
      links: [
        {
          title: "Site officiel du contrôle technique",
          url: "https://www.securite-routiere.gouv.fr/reglementation-liee-aux-modes-de-deplacements/reglementation-du-vehicule/controle-technique",
          description: "Réglementation et informations officielles"
        },
        {
          title: "Trouver un centre de contrôle technique",
          url: "https://www.controle-technique.gouv.fr/",
          description: "Localisateur de centres agréés"
        },
        {
          title: "Défaillances les plus courantes",
          url: "https://www.dekra-norisko.fr/conseils-controle-technique/defaillances-courantes",
          description: "Guide des principales défaillances"
        }
      ]
    },
    {
      title: "Diagnostic OBD",
      icon: <Wrench className="h-6 w-6 text-blue-500" />,
      description: "Ressources techniques sur le diagnostic automobile",
      links: [
        {
          title: "Comprendre les codes défaut OBD",
          url: "https://www.obd-codes.com/",
          description: "Base de données des codes d'erreur"
        },
        {
          title: "Guide du diagnostic automobile",
          url: "https://www.fiches-auto.fr/articles-auto/fonctionnement-d-une-auto/s-693-le-diagnostic-electronique-automobile.php",
          description: "Fonctionnement du diagnostic électronique"
        },
        {
          title: "Voyants du tableau de bord",
          url: "https://www.lepermislibre.fr/conseils-conduite/voyants-tableau-de-bord",
          description: "Signification des voyants d'alerte"
        }
      ]
    },
    {
      title: "Réglementation & Normes",
      icon: <FileText className="h-6 w-6 text-green-500" />,
      description: "Textes officiels et réglementations",
      links: [
        {
          title: "Code de la route",
          url: "https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006074228",
          description: "Texte officiel du code de la route"
        },
        {
          title: "Normes européennes Euro",
          url: "https://www.ademe.fr/particuliers-eco-citoyens/transports/acheter-vehicule/vehicule-propre-criteres-choix",
          description: "Standards d'émissions européens"
        },
        {
          title: "Carte grise et démarches",
          url: "https://www.service-public.fr/particuliers/vosdroits/N367",
          description: "Démarches administratives véhicules"
        }
      ]
    },
    {
      title: "Assistance & Urgences",
      icon: <Info className="h-6 w-6 text-red-500" />,
      description: "Numéros utiles et assistance routière",
      links: [
        {
          title: "Numéro d'urgence européen",
          url: "tel:112",
          description: "112 - Urgences (gratuit 24h/24)"
        },
        {
          title: "Info trafic en temps réel",
          url: "https://www.bison-fute.gouv.fr/",
          description: "Conditions de circulation"
        },
        {
          title: "Assistance 0 km",
          url: "https://www.service-public.fr/particuliers/vosdroits/F2686",
          description: "Droits en cas de panne"
        }
      ]
    },
    {
      title: "Zones d'intervention",
      icon: <MapPin className="h-6 w-6 text-purple-500" />,
      description: "Informations locales Alpes-Maritimes",
      links: [
        {
          title: "Préfecture des Alpes-Maritimes",
          url: "https://www.alpes-maritimes.gouv.fr/",
          description: "Services préfectoraux"
        },
        {
          title: "Info circulation PACA",
          url: "https://www.inforoute-paca.fr/",
          description: "Trafic et travaux en région"
        },
        {
          title: "Centres de contrôle technique 06",
          url: "https://www.pagesjaunes.fr/annuaire/alpes-maritimes-06/controle-technique-automobile",
          description: "Annuaire des centres du département"
        }
      ]
    }
  ];

  return (
    <section id="liens-utiles" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Liens Utiles</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ressources et informations officielles pour vous accompagner dans l'entretien de votre véhicule
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {linkCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {category.icon}
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="group">
                      <a
                        href={link.url}
                        target={link.url.startsWith('tel:') ? '_self' : '_blank'}
                        rel={link.url.startsWith('tel:') ? '' : 'noopener noreferrer'}
                        className="flex items-start gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                            {link.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {link.description}
                          </p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note légale */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-muted/50 rounded-lg p-4 max-w-2xl">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Ces liens externes sont fournis à titre informatif. 
              OBDExpress n'est pas responsable du contenu des sites tiers. 
              Vérifiez toujours les informations auprès des sources officielles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinksSection;