import { useLanguage } from '../contexts/LanguageContext';
import { Heart, BookOpen, Church, Users } from 'lucide-react';

const STAINED_GLASS_IMAGE = 'https://images.unsplash.com/photo-1662161422899-bb393b6fe6b9';

export const About = () => {
  const { language } = useLanguage();

  const content = {
    pt: {
      title: 'Sobre Nós',
      missionTitle: 'Nossa Missão',
      mission: `O site milagreseucaristicos.com.br é um blog documental de caráter evangelizador, dedicado exclusivamente aos milagres eucarísticos, com ênfase na conclusão científica dos casos e no parecer oficial da Igreja Católica.

O conteúdo é apresentado em linguagem acessível ao público leigo, com tom pastoral leve.

Nosso objetivo principal é a evangelização, demonstrando a harmonia entre fé e razão por meio da ciência, da investigação histórica e do discernimento da Igreja.`,
      inspirationTitle: 'Nossa Inspiração: Carlo Acutis',
      inspiration: `Este projeto se inspira na iniciativa evangelizadora digital de Carlo Acutis (1991-2006), jovem beato italiano que catalogou milagres eucarísticos de forma clara, didática e fiel à Igreja.

Carlo utilizou seus talentos em programação e internet para evangelizar, criando uma exposição virtual sobre milagres eucarísticos que já percorreu o mundo. Seu trabalho demonstrou que a tecnologia pode ser uma poderosa ferramenta a serviço da fé.

"A Eucaristia é a minha autoestrada para o céu" - Carlo Acutis`,
      valuesTitle: 'Nossos Valores',
      values: [
        {
          icon: Church,
          title: 'Fidelidade à Igreja',
          description: 'Compromisso com a doutrina católica e o magistério da Igreja.'
        },
        {
          icon: BookOpen,
          title: 'Rigor Científico',
          description: 'Apresentação objetiva dos fatos e evidências documentadas.'
        },
        {
          icon: Heart,
          title: 'Tom Pastoral',
          description: 'Linguagem acessível e acolhedora para todos os públicos.'
        },
        {
          icon: Users,
          title: 'Evangelização',
          description: 'Levar a mensagem de Cristo através da harmonia entre fé e razão.'
        }
      ]
    },
    en: {
      title: 'About Us',
      missionTitle: 'Our Mission',
      mission: `The website milagreseucaristicos.com.br is an evangelizing documentary blog, exclusively dedicated to Eucharistic miracles, with emphasis on the scientific conclusions of cases and the official verdict of the Catholic Church.

The content is presented in language accessible to the lay public, with a light pastoral tone.

Our main objective is evangelization, demonstrating the harmony between faith and reason through science, historical investigation, and the discernment of the Church.`,
      inspirationTitle: 'Our Inspiration: Carlo Acutis',
      inspiration: `This project is inspired by the digital evangelization initiative of Carlo Acutis (1991-2006), a young Italian blessed who catalogued Eucharistic miracles in a clear, didactic way, faithful to the Church.

Carlo used his talents in programming and internet to evangelize, creating a virtual exhibition about Eucharistic miracles that has traveled the world. His work demonstrated that technology can be a powerful tool in service of faith.

"The Eucharist is my highway to heaven" - Carlo Acutis`,
      valuesTitle: 'Our Values',
      values: [
        {
          icon: Church,
          title: 'Fidelity to the Church',
          description: 'Commitment to Catholic doctrine and the Magisterium.'
        },
        {
          icon: BookOpen,
          title: 'Scientific Rigor',
          description: 'Objective presentation of documented facts and evidence.'
        },
        {
          icon: Heart,
          title: 'Pastoral Tone',
          description: 'Accessible and welcoming language for all audiences.'
        },
        {
          icon: Users,
          title: 'Evangelization',
          description: 'Bringing the message of Christ through the harmony of faith and reason.'
        }
      ]
    },
    es: {
      title: 'Sobre Nosotros',
      missionTitle: 'Nuestra Misión',
      mission: `El sitio milagreseucaristicos.com.br es un blog documental de carácter evangelizador, dedicado exclusivamente a los milagros eucarísticos, con énfasis en la conclusión científica de los casos y el parecer oficial de la Iglesia Católica.

El contenido se presenta en lenguaje accesible al público laico, con tono pastoral ligero.

Nuestro objetivo principal es la evangelización, demostrando la armonía entre fe y razón a través de la ciencia, la investigación histórica y el discernimiento de la Iglesia.`,
      inspirationTitle: 'Nuestra Inspiración: Carlo Acutis',
      inspiration: `Este proyecto se inspira en la iniciativa evangelizadora digital de Carlo Acutis (1991-2006), joven beato italiano que catalogó milagros eucarísticos de forma clara, didáctica y fiel a la Iglesia.

Carlo utilizó sus talentos en programación e internet para evangelizar, creando una exposición virtual sobre milagros eucarísticos que ya recorrió el mundo. Su trabajo demostró que la tecnología puede ser una poderosa herramienta al servicio de la fe.

"La Eucaristía es mi autopista hacia el cielo" - Carlo Acutis`,
      valuesTitle: 'Nuestros Valores',
      values: [
        {
          icon: Church,
          title: 'Fidelidad a la Iglesia',
          description: 'Compromiso con la doctrina católica y el magisterio de la Iglesia.'
        },
        {
          icon: BookOpen,
          title: 'Rigor Científico',
          description: 'Presentación objetiva de hechos y evidencias documentadas.'
        },
        {
          icon: Heart,
          title: 'Tono Pastoral',
          description: 'Lenguaje accesible y acogedor para todos los públicos.'
        },
        {
          icon: Users,
          title: 'Evangelización',
          description: 'Llevar el mensaje de Cristo a través de la armonía entre fe y razón.'
        }
      ]
    }
  };

  const c = content[language] || content.pt;

  return (
    <div className="min-h-screen pt-16" data-testid="about-page">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={STAINED_GLASS_IMAGE}
            alt="Stained Glass"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-4xl sm:text-5xl text-[#E5E5E5] animate-fade-in-up">
            {c.title}
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto" data-testid="mission-section">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#D4AF37] mb-6">{c.missionTitle}</h2>
        <p className="text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
          {c.mission}
        </p>
      </section>

      {/* Inspiration */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#121214]" data-testid="inspiration-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#D4AF37] mb-6">{c.inspirationTitle}</h2>
          <p className="text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
            {c.inspiration}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-testid="values-section">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#D4AF37] mb-12 text-center">{c.valuesTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {c.values.map((value, index) => (
            <div
              key={index}
              className="text-center p-6 bg-[#121214] border border-[#27272A] card-hover"
            >
              <value.icon className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="font-serif text-lg text-[#E5E5E5] mb-2">{value.title}</h3>
              <p className="text-[#A1A1AA] text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
