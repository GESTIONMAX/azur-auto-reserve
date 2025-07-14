import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Shield, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/admin');
      }
    });

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: "Redirection vers le back office...",
      });

      // La redirection sera gérée par useEffect
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <Car className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold text-primary">OBDExpress</h1>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-muted-foreground">Back Office</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Accès réservé aux administrateurs
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder au panneau d'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email administrateur</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@obdexpress.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all focus:scale-105"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-12 transition-all focus:scale-105"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full transition-all hover:scale-105"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Connexion...
                  </div>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>

            {/* Informations de test */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Note:</strong> Créez d'abord un compte administrateur via Supabase Auth
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lien retour */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-primary"
          >
            ← Retour au site principal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;