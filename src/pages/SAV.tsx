
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SAV = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    description: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fichier_url = null;

      // Upload du fichier si présent
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('sav-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('sav-files')
          .getPublicUrl(fileName);

        fichier_url = publicUrl;
      }

      // Insertion de la demande SAV
      const { error } = await supabase
        .from('demandes_sav')
        .insert({
          ...formData,
          fichier_url
        });

      if (error) throw error;

      toast({
        title: "Demande SAV envoyée !",
        description: "Votre demande a été enregistrée. Nous vous recontacterons sous 48h.",
      });

      // Reset du formulaire
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        sujet: '',
        description: ''
      });
      setFile(null);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande SAV:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold">Service Après-Vente</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Demande d'assistance</CardTitle>
              <CardDescription>
                Vous rencontrez un problème suite à notre intervention ? 
                Décrivez votre situation et nous vous aiderons rapidement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Vos informations</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        required
                        value={formData.prenom}
                        onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone *</Label>
                    <Input
                      id="telephone"
                      required
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    />
                  </div>
                </div>

                {/* Détails de la demande */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Votre demande</h3>
                  <div>
                    <Label htmlFor="sujet">Sujet *</Label>
                    <Input
                      id="sujet"
                      required
                      value={formData.sujet}
                      onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                      placeholder="Problème moteur, dysfonctionnement, question..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description détaillée *</Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Décrivez précisément le problème rencontré, les symptômes, le contexte..."
                      rows={6}
                    />
                  </div>
                </div>

                {/* Upload de fichier */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pièce jointe (optionnel)</h3>
                  <div>
                    <Label htmlFor="file">Photo ou document</Label>
                    <div className="mt-2">
                      <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx"
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Formats acceptés : JPG, PNG, PDF, DOC (max 10MB)
                      </p>
                      {file && (
                        <p className="text-sm text-green-600 mt-2">
                          Fichier sélectionné : {file.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Notre engagement SAV</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Réponse sous 48h maximum</li>
                    <li>• Diagnostic gratuit si problème lié à notre intervention</li>
                    <li>• Garantie 2 ans sur toutes nos prestations</li>
                    <li>• Support technique par téléphone</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Envoyer la demande"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SAV;
