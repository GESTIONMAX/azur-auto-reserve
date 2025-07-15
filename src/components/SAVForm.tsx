import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Phone, Mail, User, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SAVForm = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    sujet: "",
    description: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const sujets = [
    "Problème technique après diagnostic",
    "Question sur mon rapport",
    "Demande de rappel",
    "Réclamation",
    "Demande de devis réparation",
    "Autre"
  ];

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Fichier trop volumineux",
          description: "Le fichier ne doit pas dépasser 10MB.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('sav-files')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('sav-files')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let fichierUrl = null;
      
      if (selectedFile) {
        fichierUrl = await uploadFile(selectedFile);
      }

      const { error } = await supabase
        .from('demandes_sav')
        .insert({
          ...formData,
          fichier_url: fichierUrl
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: "Nous vous contacterons sous 24h pour traiter votre demande.",
      });

      // Reset form
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        sujet: "",
        description: ""
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Erreur SAV:', error);
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      setErrorMessage(errorMsg);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="sav" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Service Après-Vente</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une question après votre diagnostic ? Un problème technique ? Contactez-nous, nous sommes là pour vous aider.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Formulaire SAV */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Formulaire de contact SAV
              </CardTitle>
              <CardDescription>
                Décrivez votre problème en détail pour un traitement rapide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      required
                      value={formData.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      required
                      value={formData.prenom}
                      onChange={(e) => handleInputChange("prenom", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        required
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="telephone"
                        required
                        className="pl-10"
                        value={formData.telephone}
                        onChange={(e) => handleInputChange("telephone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sujet">Sujet *</Label>
                  <Select value={formData.sujet} onValueChange={(value) => handleInputChange("sujet", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez le motif de votre demande" />
                    </SelectTrigger>
                    <SelectContent>
                      {sujets.map((sujet) => (
                        <SelectItem key={sujet} value={sujet}>
                          {sujet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description détaillée *</Label>
                  <Textarea
                    id="description"
                    required
                    placeholder="Décrivez votre problème le plus précisément possible..."
                    className="min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Pièce jointe (optionnel)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      Max 10MB
                    </div>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-green-600 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {selectedFile.name}
                    </p>
                  )}
                </div>

                {errorMessage && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
                  <h3 className="text-red-800 font-medium mb-2">Erreur détectée:</h3>
                  <pre className="text-red-700 text-sm whitespace-pre-wrap break-all">{errorMessage}</pre>
                </div>
              )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact direct</CardTitle>
                <CardDescription>
                  Pour une réponse immédiate, contactez-nous directement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-muted-foreground">06 46 02 24 68</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">contact@obdexpress.fr</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nos engagements SAV</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Réponse sous 24h</p>
                      <p className="text-sm text-muted-foreground">Nous traitons toutes les demandes rapidement</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Suivi personnalisé</p>
                      <p className="text-sm text-muted-foreground">Un technicien dédié pour votre dossier</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Garantie respectée</p>
                      <p className="text-sm text-muted-foreground">Nous honorons nos garanties sans condition</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SAVForm;