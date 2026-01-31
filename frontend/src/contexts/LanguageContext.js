import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
  pt: {
    // Navigation
    home: 'Início',
    about: 'Sobre',
    miracles: 'Milagres',
    admin: 'Admin',
    login: 'Entrar',
    logout: 'Sair',
    
    // Hero
    heroTitle: 'Milagres Eucarísticos',
    heroSubtitle: 'Fé e Ciência em Harmonia',
    heroDescription: 'Descubra os milagres eucarísticos reconhecidos pela Igreja Católica, documentados pela ciência e preservados pela história.',
    explore: 'Explorar Milagres',
    scrollToDiscover: 'Role para descobrir',
    
    // Filters
    searchPlaceholder: 'Buscar milagre...',
    allCountries: 'Todos os países',
    allCenturies: 'Todos os séculos',
    allStatus: 'Todos os status',
    recognized: 'Reconhecido',
    investigating: 'Em investigação',
    showInvestigating: 'Mostrar em investigação',
    
    // Miracle details
    historicalContext: 'Contexto Histórico',
    phenomenon: 'O Fenômeno',
    timeline: 'Linha do Tempo',
    scientificEvidence: 'Evidências Científicas',
    churchVerdict: 'Parecer da Igreja',
    media: 'Mídia',
    documents: 'Documentos',
    references: 'Referências',
    generateSummary: 'Gerar Resumo com IA',
    generatingSummary: 'Gerando resumo...',
    summary: 'Resumo',
    
    // Status
    statusRecognized: 'Reconhecido pela Igreja',
    statusInvestigating: 'Em Investigação',
    
    // Footer
    footerMission: 'Evangelização através da harmonia entre fé e razão.',
    footerInspiration: 'Inspirado na obra evangelizadora de Carlo Acutis.',
    privacyPolicy: 'Política de Privacidade',
    termsOfUse: 'Termos de Uso',
    disclaimer: 'Disclaimer',
    
    // About
    aboutTitle: 'Sobre Nós',
    aboutMission: 'Nossa Missão',
    aboutInspiration: 'Nossa Inspiração: Carlo Acutis',
    
    // Admin
    dashboard: 'Painel',
    newMiracle: 'Novo Milagre',
    bulkImport: 'Importar JSON',
    edit: 'Editar',
    delete: 'Excluir',
    save: 'Salvar',
    cancel: 'Cancelar',
    confirmDelete: 'Confirmar exclusão?',
    importSuccess: 'Importação concluída',
    importError: 'Erro na importação',
    downloadTemplate: 'Baixar Template JSON',
    
    // Auth
    email: 'Email',
    password: 'Senha',
    name: 'Nome',
    signIn: 'Entrar',
    signUp: 'Registrar',
    noAccount: 'Não tem conta?',
    hasAccount: 'Já tem conta?',
    
    // General
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    noResults: 'Nenhum resultado encontrado',
    century: 'Século',
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    miracles: 'Miracles',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    
    // Hero
    heroTitle: 'Eucharistic Miracles',
    heroSubtitle: 'Faith and Science in Harmony',
    heroDescription: 'Discover the Eucharistic miracles recognized by the Catholic Church, documented by science and preserved by history.',
    explore: 'Explore Miracles',
    scrollToDiscover: 'Scroll to discover',
    
    // Filters
    searchPlaceholder: 'Search miracle...',
    allCountries: 'All countries',
    allCenturies: 'All centuries',
    allStatus: 'All status',
    recognized: 'Recognized',
    investigating: 'Under investigation',
    showInvestigating: 'Show under investigation',
    
    // Miracle details
    historicalContext: 'Historical Context',
    phenomenon: 'The Phenomenon',
    timeline: 'Timeline',
    scientificEvidence: 'Scientific Evidence',
    churchVerdict: 'Church Verdict',
    media: 'Media',
    documents: 'Documents',
    references: 'References',
    generateSummary: 'Generate AI Summary',
    generatingSummary: 'Generating summary...',
    summary: 'Summary',
    
    // Status
    statusRecognized: 'Recognized by the Church',
    statusInvestigating: 'Under Investigation',
    
    // Footer
    footerMission: 'Evangelization through the harmony between faith and reason.',
    footerInspiration: 'Inspired by the evangelizing work of Carlo Acutis.',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    disclaimer: 'Disclaimer',
    
    // About
    aboutTitle: 'About Us',
    aboutMission: 'Our Mission',
    aboutInspiration: 'Our Inspiration: Carlo Acutis',
    
    // Admin
    dashboard: 'Dashboard',
    newMiracle: 'New Miracle',
    bulkImport: 'Import JSON',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirmDelete: 'Confirm deletion?',
    importSuccess: 'Import completed',
    importError: 'Import error',
    downloadTemplate: 'Download JSON Template',
    
    // Auth
    email: 'Email',
    password: 'Password',
    name: 'Name',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    
    // General
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noResults: 'No results found',
    century: 'Century',
  },
  es: {
    // Navigation
    home: 'Inicio',
    about: 'Acerca de',
    miracles: 'Milagros',
    admin: 'Admin',
    login: 'Entrar',
    logout: 'Salir',
    
    // Hero
    heroTitle: 'Milagros Eucarísticos',
    heroSubtitle: 'Fe y Ciencia en Armonía',
    heroDescription: 'Descubra los milagros eucarísticos reconocidos por la Iglesia Católica, documentados por la ciencia y preservados por la historia.',
    explore: 'Explorar Milagros',
    scrollToDiscover: 'Desplácese para descubrir',
    
    // Filters
    searchPlaceholder: 'Buscar milagro...',
    allCountries: 'Todos los países',
    allCenturies: 'Todos los siglos',
    allStatus: 'Todos los estados',
    recognized: 'Reconocido',
    investigating: 'En investigación',
    showInvestigating: 'Mostrar en investigación',
    
    // Miracle details
    historicalContext: 'Contexto Histórico',
    phenomenon: 'El Fenómeno',
    timeline: 'Línea de Tiempo',
    scientificEvidence: 'Evidencia Científica',
    churchVerdict: 'Veredicto de la Iglesia',
    media: 'Medios',
    documents: 'Documentos',
    references: 'Referencias',
    generateSummary: 'Generar Resumen con IA',
    generatingSummary: 'Generando resumen...',
    summary: 'Resumen',
    
    // Status
    statusRecognized: 'Reconocido por la Iglesia',
    statusInvestigating: 'En Investigación',
    
    // Footer
    footerMission: 'Evangelización a través de la armonía entre fe y razón.',
    footerInspiration: 'Inspirado en la obra evangelizadora de Carlo Acutis.',
    privacyPolicy: 'Política de Privacidad',
    termsOfUse: 'Términos de Uso',
    disclaimer: 'Aviso Legal',
    
    // About
    aboutTitle: 'Sobre Nosotros',
    aboutMission: 'Nuestra Misión',
    aboutInspiration: 'Nuestra Inspiración: Carlo Acutis',
    
    // Admin
    dashboard: 'Panel',
    newMiracle: 'Nuevo Milagro',
    bulkImport: 'Importar JSON',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirmDelete: '¿Confirmar eliminación?',
    importSuccess: 'Importación completada',
    importError: 'Error de importación',
    downloadTemplate: 'Descargar Plantilla JSON',
    
    // Auth
    email: 'Correo electrónico',
    password: 'Contraseña',
    name: 'Nombre',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    
    // General
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    noResults: 'No se encontraron resultados',
    century: 'Siglo',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'pt';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['pt'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
