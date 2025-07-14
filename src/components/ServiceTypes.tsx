
import React from 'react';
import { Settings, Wrench, FileText, CheckCircle } from 'lucide-react';

const ServiceTypes = () => {
  const services = [
    {
      icon: Settings,
      title: "Lecture codes défaut",
      color: "border-blue-400 text-blue-400"
    },
    {
      icon: Wrench,
      title: "Valise iCarsoft CR Max",
      color: "border-green-400 text-green-400"
    },
    {
      icon: FileText,
      title: "Rapport détaillé",
      color: "border-purple-400 text-purple-400"
    },
    {
      icon: CheckCircle,
      title: "Conseils contrôle technique",
      color: "border-yellow-400 text-yellow-400"
    }
  ];

  return (
    <section className="bg-muted text-foreground rounded-lg p-6 shadow-md mb-12">
      <h2 className="text-2xl font-bold text-center text-primary mb-8">Nos services</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {services.map((service, index) => (
          <div key={index} className="text-center">
            <div className={`w-16 h-16 mx-auto mb-2 rounded-full border-4 ${service.color} flex items-center justify-center bg-background`}>
              <service.icon className={`w-8 h-8 ${service.color.split(' ')[1]}`} />
            </div>
            <p className="text-sm font-semibold">{service.title}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm">Diagnostic professionnel avec équipement de dernière génération</p>
    </section>
  );
};

export default ServiceTypes;
