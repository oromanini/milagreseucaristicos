import { useLanguage } from '../contexts/LanguageContext';

export const Disclaimer = () => {
  const { language } = useLanguage();

  const content = {
    pt: {
      title: 'Disclaimer',
      content: `Este site apresenta informações sobre milagres eucarísticos reconhecidos ou em investigação pela Igreja Católica. O conteúdo aqui disponibilizado tem caráter informativo e evangelizador.

SOBRE A CIÊNCIA E A FÉ

Os laudos científicos apresentados neste site são resumos acessíveis de documentos técnicos originais. A ciência, por sua própria natureza metodológica, não pode afirmar ou negar a existência de milagres no sentido teológico. O que a ciência pode fazer é constatar fenômenos que, segundo os métodos científicos disponíveis, não encontram explicação natural conhecida.

A interpretação desses fenômenos como "milagres" é uma conclusão de fé, feita pela Igreja Católica através de seu processo de discernimento, que inclui tanto a análise científica quanto a avaliação teológica.

LIMITAÇÕES

- Este site não substitui o estudo direto das fontes originais
- Os resumos científicos são simplificados para compreensão leiga
- As conclusões apresentadas refletem o estado atual do conhecimento
- Novos estudos podem complementar ou revisar conclusões anteriores

FONTES

Utilizamos apenas fontes oficiais e acadêmicas:
- Documentos do Vaticano e dioceses
- Publicações em revistas científicas revisadas por pares
- Estudos de universidades reconhecidas

RESPONSABILIDADE

O conteúdo deste site é de responsabilidade exclusiva de seus administradores e não representa posição oficial de nenhuma diocese ou da Santa Sé, exceto quando explicitamente citado de documentos oficiais.`
    },
    en: {
      title: 'Disclaimer',
      content: `This website presents information about Eucharistic miracles recognized or under investigation by the Catholic Church. The content provided here is for informational and evangelization purposes.

ABOUT SCIENCE AND FAITH

The scientific reports presented on this site are accessible summaries of original technical documents. Science, by its own methodological nature, cannot affirm or deny the existence of miracles in the theological sense. What science can do is observe phenomena that, according to available scientific methods, have no known natural explanation.

The interpretation of these phenomena as "miracles" is a conclusion of faith, made by the Catholic Church through its discernment process, which includes both scientific analysis and theological evaluation.

LIMITATIONS

- This site does not replace direct study of original sources
- Scientific summaries are simplified for lay understanding
- The conclusions presented reflect the current state of knowledge
- New studies may complement or revise previous conclusions

SOURCES

We use only official and academic sources:
- Vatican and diocesan documents
- Publications in peer-reviewed scientific journals
- Studies from recognized universities

RESPONSIBILITY

The content of this site is the sole responsibility of its administrators and does not represent an official position of any diocese or the Holy See, except when explicitly cited from official documents.`
    },
    es: {
      title: 'Aviso Legal',
      content: `Este sitio web presenta información sobre milagros eucarísticos reconocidos o en investigación por la Iglesia Católica. El contenido aquí proporcionado tiene carácter informativo y evangelizador.

SOBRE LA CIENCIA Y LA FE

Los informes científicos presentados en este sitio son resúmenes accesibles de documentos técnicos originales. La ciencia, por su propia naturaleza metodológica, no puede afirmar o negar la existencia de milagros en sentido teológico. Lo que la ciencia puede hacer es constatar fenómenos que, según los métodos científicos disponibles, no encuentran explicación natural conocida.

La interpretación de estos fenómenos como "milagros" es una conclusión de fe, hecha por la Iglesia Católica a través de su proceso de discernimiento, que incluye tanto el análisis científico como la evaluación teológica.

LIMITACIONES

- Este sitio no sustituye el estudio directo de las fuentes originales
- Los resúmenes científicos están simplificados para comprensión laica
- Las conclusiones presentadas reflejan el estado actual del conocimiento
- Nuevos estudios pueden complementar o revisar conclusiones anteriores

FUENTES

Utilizamos únicamente fuentes oficiales y académicas:
- Documentos del Vaticano y diócesis
- Publicaciones en revistas científicas revisadas por pares
- Estudios de universidades reconocidas

RESPONSABILIDAD

El contenido de este sitio es responsabilidad exclusiva de sus administradores y no representa posición oficial de ninguna diócesis o de la Santa Sede, excepto cuando se cita explícitamente de documentos oficiales.`
    }
  };

  const c = content[language] || content.pt;

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20" data-testid="disclaimer-page">
      <h1 className="font-serif text-3xl sm:text-4xl text-[#E5E5E5] mb-8">{c.title}</h1>
      <div className="text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
        {c.content}
      </div>
    </div>
  );
};

export const Privacy = () => {
  const { language } = useLanguage();

  const content = {
    pt: {
      title: 'Política de Privacidade',
      content: `Última atualização: Janeiro de 2026

INFORMAÇÕES QUE COLETAMOS

Este site coleta apenas informações mínimas necessárias para seu funcionamento:

1. Dados de navegação: Coletamos dados anônimos sobre como os visitantes usam o site (páginas visitadas, tempo de permanência) através de ferramentas de análise.

2. Cookies: Utilizamos cookies essenciais para manter suas preferências de idioma e, se aplicável, sua sessão de login na área administrativa.

3. Dados de administradores: Se você se registrar como administrador do site, coletamos seu nome e email para fins de autenticação.

USO DAS INFORMAÇÕES

- Melhorar a experiência do usuário
- Manter estatísticas de acesso
- Gerenciar contas de administradores

COMPARTILHAMENTO

Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando exigido por lei.

ANÚNCIOS

Os anúncios exibidos neste site são exclusivamente de conteúdo católico e podem utilizar cookies próprios conforme suas respectivas políticas de privacidade.

SEUS DIREITOS

Você tem direito a:
- Solicitar acesso aos seus dados pessoais
- Solicitar correção de dados incorretos
- Solicitar exclusão de seus dados

CONTATO

Para questões sobre privacidade, entre em contato através do email disponível na página "Sobre Nós".`
    },
    en: {
      title: 'Privacy Policy',
      content: `Last updated: January 2026

INFORMATION WE COLLECT

This website collects only minimal information necessary for its operation:

1. Navigation data: We collect anonymous data about how visitors use the site (pages visited, time spent) through analytics tools.

2. Cookies: We use essential cookies to maintain your language preferences and, if applicable, your login session in the administrative area.

3. Administrator data: If you register as a site administrator, we collect your name and email for authentication purposes.

USE OF INFORMATION

- Improve user experience
- Maintain access statistics
- Manage administrator accounts

SHARING

We do not sell, rent, or share your personal information with third parties, except when required by law.

ADVERTISING

Advertisements displayed on this site are exclusively Catholic content and may use their own cookies according to their respective privacy policies.

YOUR RIGHTS

You have the right to:
- Request access to your personal data
- Request correction of incorrect data
- Request deletion of your data

CONTACT

For privacy questions, please contact us through the email available on the "About Us" page.`
    },
    es: {
      title: 'Política de Privacidad',
      content: `Última actualización: Enero de 2026

INFORMACIÓN QUE RECOPILAMOS

Este sitio web recopila solo la información mínima necesaria para su funcionamiento:

1. Datos de navegación: Recopilamos datos anónimos sobre cómo los visitantes usan el sitio (páginas visitadas, tiempo de permanencia) a través de herramientas de análisis.

2. Cookies: Utilizamos cookies esenciales para mantener sus preferencias de idioma y, si corresponde, su sesión de inicio de sesión en el área administrativa.

3. Datos de administradores: Si se registra como administrador del sitio, recopilamos su nombre y correo electrónico para fines de autenticación.

USO DE LA INFORMACIÓN

- Mejorar la experiencia del usuario
- Mantener estadísticas de acceso
- Gestionar cuentas de administradores

COMPARTIR

No vendemos, alquilamos ni compartimos su información personal con terceros, excepto cuando lo exija la ley.

PUBLICIDAD

Los anuncios mostrados en este sitio son exclusivamente de contenido católico y pueden utilizar sus propias cookies según sus respectivas políticas de privacidad.

SUS DERECHOS

Usted tiene derecho a:
- Solicitar acceso a sus datos personales
- Solicitar corrección de datos incorrectos
- Solicitar eliminación de sus datos

CONTACTO

Para preguntas sobre privacidad, contáctenos a través del correo electrónico disponible en la página "Sobre Nosotros".`
    }
  };

  const c = content[language] || content.pt;

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20" data-testid="privacy-page">
      <h1 className="font-serif text-3xl sm:text-4xl text-[#E5E5E5] mb-8">{c.title}</h1>
      <div className="text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
        {c.content}
      </div>
    </div>
  );
};

export const Terms = () => {
  const { language } = useLanguage();

  const content = {
    pt: {
      title: 'Termos de Uso',
      content: `Última atualização: Janeiro de 2026

Ao acessar e usar este site, você concorda com os seguintes termos:

USO DO CONTEÚDO

Todo o conteúdo deste site é disponibilizado para fins educacionais e de evangelização. Você pode:
- Ler e compartilhar o conteúdo com atribuição da fonte
- Usar as informações para estudo pessoal ou catequético

Você NÃO pode:
- Reproduzir o conteúdo para fins comerciais sem autorização
- Modificar ou distorcer o conteúdo de forma a alterar seu significado
- Apresentar o conteúdo como se fosse de sua autoria

PRECISÃO DAS INFORMAÇÕES

Nos esforçamos para manter as informações precisas e atualizadas, porém não garantimos que todo o conteúdo esteja livre de erros. As informações são fornecidas "como estão".

LINKS EXTERNOS

Este site pode conter links para sites externos. Não nos responsabilizamos pelo conteúdo de sites de terceiros.

ÁREA ADMINISTRATIVA

O acesso à área administrativa é restrito a usuários autorizados. O uso indevido das credenciais de acesso pode resultar em bloqueio.

MODIFICAÇÕES

Reservamo-nos o direito de modificar estes termos a qualquer momento. Modificações entram em vigor imediatamente após publicação.

JURISDIÇÃO

Estes termos são regidos pelas leis do Brasil.`
    },
    en: {
      title: 'Terms of Use',
      content: `Last updated: January 2026

By accessing and using this website, you agree to the following terms:

USE OF CONTENT

All content on this site is made available for educational and evangelization purposes. You may:
- Read and share content with source attribution
- Use information for personal or catechetical study

You may NOT:
- Reproduce content for commercial purposes without authorization
- Modify or distort content in a way that alters its meaning
- Present content as if it were your own authorship

ACCURACY OF INFORMATION

We strive to keep information accurate and up-to-date, but we do not guarantee that all content is error-free. Information is provided "as is".

EXTERNAL LINKS

This site may contain links to external websites. We are not responsible for the content of third-party sites.

ADMINISTRATIVE AREA

Access to the administrative area is restricted to authorized users. Misuse of access credentials may result in blocking.

MODIFICATIONS

We reserve the right to modify these terms at any time. Modifications take effect immediately upon publication.

JURISDICTION

These terms are governed by the laws of Brazil.`
    },
    es: {
      title: 'Términos de Uso',
      content: `Última actualización: Enero de 2026

Al acceder y usar este sitio web, usted acepta los siguientes términos:

USO DEL CONTENIDO

Todo el contenido de este sitio está disponible para fines educativos y de evangelización. Usted puede:
- Leer y compartir el contenido con atribución de la fuente
- Usar la información para estudio personal o catequético

Usted NO puede:
- Reproducir el contenido con fines comerciales sin autorización
- Modificar o distorsionar el contenido de manera que altere su significado
- Presentar el contenido como si fuera de su autoría

PRECISIÓN DE LA INFORMACIÓN

Nos esforzamos por mantener la información precisa y actualizada, pero no garantizamos que todo el contenido esté libre de errores. La información se proporciona "tal cual".

ENLACES EXTERNOS

Este sitio puede contener enlaces a sitios web externos. No nos responsabilizamos por el contenido de sitios de terceros.

ÁREA ADMINISTRATIVA

El acceso al área administrativa está restringido a usuarios autorizados. El uso indebido de las credenciales de acceso puede resultar en bloqueo.

MODIFICACIONES

Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entran en vigor inmediatamente después de su publicación.

JURISDICCIÓN

Estos términos se rigen por las leyes de Brasil.`
    }
  };

  const c = content[language] || content.pt;

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20" data-testid="terms-page">
      <h1 className="font-serif text-3xl sm:text-4xl text-[#E5E5E5] mb-8">{c.title}</h1>
      <div className="text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
        {c.content}
      </div>
    </div>
  );
};
