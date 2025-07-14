
import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="text-center my-16 bg-destructive text-destructive-foreground p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-4">⚠️ Voyant moteur allumé ?</h2>
      <p className="mb-6 text-lg">
        Diagnostic automobile à domicile avec valise iCarsoft. Antibes, Cannes, Cagnes, Grasse...
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <a 
          href="tel:+33646022468" 
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <Phone className="w-5 h-5" />
          Appel immédiat
        </a>
        <a 
          href="https://wa.me/33646022468?text=Bonjour%2C%20je%20souhaite%20un%20diagnostic%20automobile%20rapide%20à%20domicile." 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp direct
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
