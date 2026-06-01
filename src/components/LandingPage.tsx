import { useState, useEffect } from 'react';
import { 
  Apple, 
  Dumbbell, 
  Ruler, 
  Heart, 
  Wind, 
  Check, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Star,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lock,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { 
  dietSteps, 
  workoutSteps, 
  bodySteps, 
  wellnessSteps, 
  mindfulnessSteps, 
  faqItems
} from './TourData';
import type { TourStep } from './TourData';


type Language = 'it' | 'en';
type Page = 'home' | 'diet' | 'workout' | 'body' | 'wellness' | 'mindfulness';

const FATTORI_LAF = {
  sedentario: 1.2,
  leggero: 1.375,
  moderato: 1.55,
  intenso: 1.725,
  atleta: 1.9,
};

function calcolaBmrETdeeLocal(peso: number, altezza: number, eta: number, sesso: 'm' | 'f', livelloAttivita: keyof typeof FATTORI_LAF, goal: 'perdita_peso' | 'mantenimento' | 'ipertrofia') {
  // Mifflin-St Jeor
  const base = 10 * peso + 6.25 * altezza - 5 * eta;
  const bmr = sesso === 'm' ? base + 5 : base - 161;
  const tdee = bmr * FATTORI_LAF[livelloAttivita];

  let kcalTarget = tdee;
  let pctP = 20; // % Proteine
  let pctC = 50; // % Carboidrati
  let pctG = 30; // % Grassi

  if (goal === 'perdita_peso') {
    kcalTarget = tdee * 0.82;
    pctP = 28;
    pctC = 42;
    pctG = 30;
  } else if (goal === 'ipertrofia') {
    kcalTarget = tdee * 1.10;
    pctP = 24;
    pctC = 51;
    pctG = 25;
  }

  const finalKcal = Math.round(kcalTarget);
  const proteineGrams = Math.round((finalKcal * (pctP / 100)) / 4);
  const carboidratiGrams = Math.round((finalKcal * (pctC / 100)) / 4);
  const grassiGrams = Math.round((finalKcal * (pctG / 100)) / 9);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    kcalTarget: finalKcal,
    proteineGrams,
    carboidratiGrams,
    grassiGrams
  };
}

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('it');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [deviceTab, setDeviceTab] = useState<'mobile' | 'desktop'>('desktop');

  // Stati per il calcolatore interattivo BMR a 4 passi in Homepage
  const [calcStep, setCalcStep] = useState(1);
  const [calcNome, setCalcNome] = useState('');
  const [calcSesso, setCalcSesso] = useState<'m' | 'f'>('m');
  const [calcEta, setCalcEta] = useState<string>('28');
  const [calcAltezza, setCalcAltezza] = useState<string>('175');
  const [calcPeso, setCalcPeso] = useState<string>('70');
  const [calcAttivita, setCalcAttivita] = useState<'sedentario' | 'leggero' | 'moderato' | 'intenso' | 'atleta'>('moderato');
  const [calcGoal, setCalcGoal] = useState<'perdita_peso' | 'mantenimento' | 'ipertrofia'>('perdita_peso');

  // Stati per i 4 Form di Prova (lead capture)
  // Form 1: Hero Block
  const [heroEmail, setHeroEmail] = useState('');
  const [heroSuccess, setHeroSuccess] = useState(false);
  const [heroLoading, setHeroLoading] = useState(false);

  // Form 2: BMR Calculator Step 4 (Results)
  const [calcEmail, setCalcEmail] = useState('');
  const [calcSuccess, setCalcSuccess] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);

  // Form 3: Pricing Modal Activation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState<'trial' | 'monthly' | 'yearly' | 'lifetime'>('trial');
  const [modalEmail, setModalEmail] = useState('');
  const [modalNome, setModalNome] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Form 4: Pre-Footer CTA Form
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSuccess, setFooterSuccess] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  
  // Stati per i caroselli della Homepage
  const [activeDesktopIdx, setActiveDesktopIdx] = useState(0);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  // Stati per il Tour Interattivo nelle sottopagine
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Stato per le FAQ Accordion (memorizza gli ID aperti)
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  // Stato per il menu dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Stati per il layout responsive mobile
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 950);
      if (window.innerWidth >= 950) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScrollTo = (anchorId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Forza lo scorrimento in cima alla pagina ad ogni cambio rotta o cambio passo
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveStepIdx(0); // Resetta il passo ad ogni cambio pagina
    setIsMobileMenuOpen(false); // Chiude il menu mobile ad ogni cambio pagina
  }, [currentPage]);

  const desktopScreens = [
    { src: '/screenshots/desktop1.jpg', titleIt: 'Dashboard Principale', titleEn: 'Main Dashboard' },
    { src: '/screenshots/desktop2.jpg', titleIt: 'Grafici Composizione Corporea', titleEn: 'Body Composition Trends' },
    { src: '/screenshots/desktop3.jpg', titleIt: 'Diet Editor & Macrobar', titleEn: 'Diet Editor & Macrobar' },
    { src: '/screenshots/desktop4.jpg', titleIt: 'Workout Planner', titleEn: 'Workout Planner' }
  ];

  const mobileScreens = [
    { src: '/screenshots/mobile1.png', titleIt: 'Paywall & Premium', titleEn: 'Paywall & Premium' },
    { src: '/screenshots/mobile2.png', titleIt: 'Registro Wellness & Allenamenti', titleEn: 'Wellness & Workouts Log' },
    { src: '/screenshots/mobile3.png', titleIt: 'Mindfulness & Sonno', titleEn: 'Mindfulness & Sleep' },
    { src: '/screenshots/mobile4.png', titleIt: 'Dieta Giornaliera', titleEn: 'Daily Diet' }
  ];

  const handleNextDesktop = () => {
    setActiveDesktopIdx((prev) => (prev + 1) % desktopScreens.length);
  };
  const handlePrevDesktop = () => {
    setActiveDesktopIdx((prev) => (prev - 1 + desktopScreens.length) % desktopScreens.length);
  };

  const handleNextMobile = () => {
    setActiveMobileIdx((prev) => (prev + 1) % mobileScreens.length);
  };
  const handlePrevMobile = () => {
    setActiveMobileIdx((prev) => (prev - 1 + mobileScreens.length) % mobileScreens.length);
  };

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // Ottieni i passi del tour in base alla pagina corrente
  const getActiveSteps = (): TourStep[] => {
    switch (currentPage) {
      case 'diet': return dietSteps;
      case 'workout': return workoutSteps;
      case 'body': return bodySteps;
      case 'wellness': return wellnessSteps;
      case 'mindfulness': return mindfulnessSteps;
      default: return [];
    }
  };

  const activeSteps = getActiveSteps();
  const currentStep = activeSteps[activeStepIdx] || null;

  // Testi tradotti
  const t = {
    it: {
      metaTitle: 'MyDietPlan Pro - Il tuo corpo, progettato scientificamente',
      navFeatures: 'Funzioni',
      navScreenshots: 'Esplora',
      navPricing: 'Prezzi',
      navFaq: 'FAQ',
      btnOpenApp: 'Accedi all\'App',
      btnBackHome: 'Torna alla Home',
      heroTag: 'L\'EVOLUZIONE DEL FITNESS LOCAL-FIRST',
      heroTitleLine1: 'Il tuo corpo,',
      heroTitleLine2: 'progettato scientificamente.',
      heroSub: 'Crea diete flessibili auto-bilancianti, programma schede d\'allenamento avanzate e monitora la composizione corporea con la plicometria. Il tutto racchiuso in una favolosa interfaccia glassmorphic ultra-veloce, 100% sicura e offline-first.',
      btnStartFree: 'Inizia Ora - Prova Gratuita',
      btnLearnMore: 'Scopri le Funzioni',
      trustedBy: 'SCELTO DA CHI CANCELLA I COMPROMESSI',
      secFeaturesTitle: 'Ingegneria del Benessere a Portata di Mano',
      secFeaturesSub: 'Una suite completa di strumenti scientifici per riprendere il controllo totale dei tuoi progressi, senza alcun abbonamento forzato o tracciamento dati.',
      
      featDietTitle: 'Diet Architect & Equalizzatore',
      featDietDesc: 'Crea diete a scelta multipla e bilancia Kcal e macronutrienti all\'istante. Calcoli precisi in grammature in base alle portate primarie.',
      
      featWorkoutTitle: 'Workout Hub & Timer',
      featWorkoutDesc: 'Progetta schede d\'allenamento personalizzate. Traccia serie, ripetizioni e stima l\'energia bruciata con algoritmi MET avanzati.',
      
      featCircTitle: 'Mappa Corporea & Plicometria',
      featCircDesc: 'Calcola la massa grassa e magra tramite il protocollo plicometrico a 3 o 7 pliche. Grafici biometrici interattivi millimetrati (mm).',
      
      featWellnessTitle: 'Bio-Tracker & Sonno',
      featWellnessDesc: 'Monitora la qualità del sonno, i passi giornalieri, l\'idratazione, la frequenza cardiaca a riposo e la pressione arteriosa.',
      
      featMindTitle: 'Spazio Mindfulness',
      featMindDesc: 'Ritrova il focus e la stabilità con sessioni di respirazione guidate (Box Breathing, 4-7-8) con animazione respiratoria fluida.',
      
      secScreensTitle: 'Un\'Esperienza Estetica Stellare',
      secScreensSub: 'Progettato con una ricca estetica glassmorphic, ombre neon e micro-animazioni. Scopri l\'interfaccia sia su smartphone che su desktop.',
      tabMobile: '📱 Vista Smartphone',
      tabDesktop: '💻 Vista Desktop',
      
      secPricingTitle: 'Scegli il tuo Piano Premium',
      secPricingSub: 'Inizia con una prova gratuita di 7 giorni senza carta di credito. Sblocca il potenziale completo dell\'app con i nostri abbonamenti flessibili e sicuri.',
      paymentGuaranteed: 'Pagamenti elaborati in modo sicuro da Lemon Squeezy (Merchant of Record). Garanzia 30 giorni soddisfatti o rimborsati.',
      
      planMonthlyName: 'Premium Mensile',
      planMonthlyDesc: 'Ideale per testare l\'ecosistema e raggiungere obiettivi a breve termine.',
      planYearlyName: 'Premium Annuale',
      planYearlyDesc: 'La scelta più popolare per chi si impegna a trasformare il proprio stile di vita.',
      planLifetimeName: 'Premium Lifetime',
      planLifetimeDesc: 'Acquisto unico. Nessun rinnovo, nessun canone mensile. Tua per sempre.',
      
      checkoutBtn: 'Acquista Ora',
      trialNotice: 'Inizia con 7 giorni di Prova Gratuita',
      lifetimeNotice: 'Pagamento Unico - Accesso Illimitato',
      moneyBack: 'Garanzia Soddisfatti o Rimborsati',
      
      planTrialName: 'Prova Gratuita',
      planTrialDesc: 'Prova tutte le funzioni Premium senza inserire nessuna carta di credito.',
      trialWarn: 'Dopo 7 giorni verrà richiesto il pagamento per continuare a usare l\'app.',
      btnStartTrial: 'Inizia Prova Gratis',
      
      featureUnlimitedProfiles: 'Profili utenti illimitati nello stesso dispositivo',
      featureFullDiagnostics: 'Calcolo scientifico di BMR, TDEE e Fabbisogno',
      featureCloudSync: 'Sincronizzazione Cloud sicura con Supabase',
      featureExportDoc: 'Esportazione PDF/Word professionale delle diete',
      featureAllAccess: 'Accesso completo a Dieta, Allenamento e Pliche',
      featureNoAds: 'Nessuna pubblicità, 100% offline-first',
      btnLearnMoreDetail: 'Tour Interattivo e Screenshots',
      backToFeatures: 'Vedi le altre funzioni',
      
      tourHeaderTag: 'TOUR DI PRODOTTO PASSO-PASSO',
      tourTitle: 'Scopri come funziona MyDietPlan Pro',
      tourSub: 'Esplora l\'interfaccia reale dell\'app cliccando sui passaggi del tutorial. I mockup si aggiorneranno in tempo reale mostrando gli screenshot del software.',
      tourInstructions: 'Clicca su un passo a sinistra per cambiare screenshot nei mockup a destra:',
      tourPrev: 'Passo Prec',
      tourNext: 'Passo Succ',
      
      secFaqTitle: 'Domande Frequenti (FAQ)',
      secFaqSub: 'Hai dubbi su come funziona MyDietPlan Pro? Trova le risposte scientifiche e tecniche qui sotto.',
      
      footerText: '© 2026 MyDietPlan Pro. Progettato con passione per l\'ingegneria del corpo umano.'
    },
    en: {
      metaTitle: 'MyDietPlan Pro - Your body, scientifically engineered',
      navFeatures: 'Features',
      navScreenshots: 'Explore',
      navPricing: 'Pricing',
      navFaq: 'FAQ',
      btnOpenApp: 'Open App',
      btnBackHome: 'Back to Home',
      heroTag: 'THE LOCAL-FIRST FITNESS EVOLUTION',
      heroTitleLine1: 'Your body,',
      heroTitleLine2: 'scientifically engineered.',
      heroSub: 'Create auto-balancing flexible diets, program advanced workout routines, and track body composition with skinfold caliper metrics. All wrapped in a stunning glassmorphic interface that is ultra-fast, 100% secure, and offline-first.',
      btnStartFree: 'Get Started - Free Trial',
      btnLearnMore: 'Explore Features',
      trustedBy: 'TRUSTED BY PEOPLE DEMANDING THE BEST',
      secFeaturesTitle: 'Wellness Engineering at Your Fingertips',
      secFeaturesSub: 'A comprehensive suite of scientific tools to take total control of your progress, without forced subscriptions or data tracking.',
      
      featDietTitle: 'Diet Architect & Equalizer',
      featDietDesc: 'Create multi-choice diet plans and balance calories/macros instantly. Precise food scale calculations based on primary options.',
      
      featWorkoutTitle: 'Workout Hub & Tracker',
      featWorkoutDesc: 'Design custom training routines. Track sets, reps, and estimate calories burned using advanced MET algorithms.',
      
      featCircTitle: 'Body Map & Skinfolds Caliper',
      featCircDesc: 'Calculate fat/lean mass using 3-point or 7-point caliper protocols. Interactive biometric charts millimetrically scaled (mm).',
      
      featWellnessTitle: 'Bio-Tracker & Sleep',
      featWellnessDesc: 'Monitor sleep quality, daily steps, water intake, resting heart rate, oxygen levels, and blood pressure.',
      
      featMindTitle: 'Mindfulness Space',
      featMindDesc: 'Reclaim focus and stability with guided breathing sessions (Box Breathing, 4-7-8) with smooth pace animations.',
      
      secScreensTitle: 'A Stellar Aesthetic Experience',
      secScreensSub: 'Designed with a rich glassmorphic look, neon glows, and micro-animations. Explore the interface on both mobile and desktop.',
      tabMobile: '📱 Smartphone View',
      tabDesktop: '💻 Desktop View',
      
      secPricingTitle: 'Choose Your Premium Plan',
      secPricingSub: 'Start with a 7-day free trial, no credit card required. Unlock the full potential with our flexible and secure subscriptions.',
      paymentGuaranteed: 'Payments securely processed by Lemon Squeezy (Merchant of Record). 30-day money-back guarantee.',
      
      planMonthlyName: 'Premium Monthly',
      planMonthlyDesc: 'Ideal for testing the ecosystem and reaching short-term goals.',
      planYearlyName: 'Premium Yearly',
      planYearlyDesc: 'The most popular choice for those committed to transforming their lifestyle.',
      planLifetimeName: 'Premium Lifetime',
      planLifetimeDesc: 'One-time purchase. No renewals, no monthly fees. Yours forever.',
      
      checkoutBtn: 'Purchase Now',
      trialNotice: 'Starts with 7 Days Free Trial',
      lifetimeNotice: 'One-time Payment - Lifetime Access',
      moneyBack: 'Money-back Guarantee',
      
      planTrialName: 'Free Trial',
      planTrialDesc: 'Try all Premium features for free without entering a credit card.',
      trialWarn: 'After 7 days, payment will be requested to continue using the app.',
      btnStartTrial: 'Start Free Trial',
      
      featureUnlimitedProfiles: 'Unlimited user profiles on the same device',
      featureFullDiagnostics: 'Scientific BMR, TDEE, and Target calculations',
      featureCloudSync: 'Secure Cloud Sync with Supabase Database',
      featureExportDoc: 'Professional PDF/Word exports for diet sheets',
      featureAllAccess: 'Full access to Diet, Workouts, and Skinfolds Caliper',
      featureNoAds: 'Zero ads, 100% offline-first privacy',
      btnLearnMoreDetail: 'Interactive Tour & Screenshots',
      backToFeatures: 'See other features',
      
      tourHeaderTag: 'STEP-BY-STEP PRODUCT TOUR',
      tourTitle: 'Discover how MyDietPlan Pro works',
      tourSub: 'Explore the actual app interface by clicking through the tutorial steps. The mockups update in real-time showing software screenshots.',
      tourInstructions: 'Click on a step on the left to change the screenshots in the mockups on the right:',
      tourPrev: 'Prev Step',
      tourNext: 'Next Step',
      
      secFaqTitle: 'Frequently Asked Questions (FAQ)',
      secFaqSub: 'Have questions about MyDietPlan Pro? Find scientific and technical answers below.',
      
      footerText: '© 2026 MyDietPlan Pro. Engineered with passion for human performance.'
    }
  };

  const currentT = t[lang];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      
      {/* NAVBAR */}
      <header className="glass" style={{ 
        position: 'sticky', 
        top: '16px', 
        zIndex: 100, 
        margin: '16px 24px', 
        padding: '12px 24px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
          <svg width="32" height="32" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))' }}>
            <circle cx="50" cy="50" r="46" fill="radial-gradient(circle at 50% 50%, #082f49 0%, #020617 100%)" stroke="var(--accent-cyan)" strokeWidth="3" />
            <path d="M50,15 C60,15 67,29 67,51 C67,69 60,80 50,80 C40,80 33,69 33,51 C33,29 40,15 50,15 Z" fill="#022c22" stroke="#0f766e" strokeWidth="1.5" />
            <path d="M50,19 C58,19 63,31 63,51 C63,66 58,76 50,76 C42,76 37,66 37,51 C37,31 42,19 50,19 Z" fill="linear-gradient(180deg, #14b8a6 0%, #047857 100%)" />
            <circle cx="50" cy="54" r="11" fill="radial-gradient(circle, #ffffff 0%, #06b6d4 100%)" />
          </svg>
          <span style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
            MyDietPlan <span style={{ color: 'var(--accent-cyan)' }}>Pro</span>
          </span>
        </div>

        {/* NAVIGATION LINKS & ACTIONS */}
        {!isMobile ? (
          <>
            {/* DESKTOP NAV LINKS */}
            <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: '600', alignItems: 'center' }} className="nav-links">
              {/* HOME */}
              <button 
                type="button"
                onClick={() => setCurrentPage('home')}
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentPage === 'home' ? '#22d3ee' : '#94a3b8', 
                  transition: 'color 0.2s' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#22d3ee'}
                onMouseLeave={(e) => {
                  if (currentPage !== 'home') e.currentTarget.style.color = '#94a3b8';
                }}
              >
                Home
              </button>

              {/* DROPDOWN TRIGGER (FUNZIONI) */}
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: currentPage !== 'home' ? '#22d3ee' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#22d3ee'}
                  onMouseLeave={(e) => {
                    if (currentPage === 'home') e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <span>{currentT.navFeatures}</span>
                  <ChevronDown size={14} style={{ 
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', 
                    transition: 'transform 0.2s',
                    color: currentPage !== 'home' ? '#22d3ee' : '#64748b'
                  }} />
                </button>

                {/* DROPDOWN MENU - COMPLETAMENTE OPACO E AD ALTO CONTRASTO */}
                {isDropdownOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: 'calc(100% - 2px)', /* SOVRAPPOSIZIONE DI 2PX PER EVITARE GAP */
                      left: '50%', /* PERFETTAMENTE CENTRATO */
                      transform: 'translateX(-50%)', /* RIMOSSO IL GAP VERTICALE */
                      width: '260px',
                      padding: '8px',
                      borderRadius: '12px',
                      background: '#090d16', /* OPACO SOLID DI SFONDO */
                      border: '1px solid rgba(34, 211, 238, 0.3)', /* BORDO NEON FORTE */
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(34, 211, 238, 0.1)',
                      zIndex: 1000,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    {[
                      { id: 'diet', icon: Apple, labelIt: '🍏 Diet Architect', labelEn: '🍏 Diet Architect' },
                      { id: 'workout', icon: Dumbbell, labelIt: '🏋️ Workout Hub', labelEn: '🏋️ Workout Hub' },
                      { id: 'body', icon: Ruler, labelIt: '📊 Composizione Corporea', labelEn: '📊 Body Composition' },
                      { id: 'wellness', icon: Heart, labelIt: '🛌 Bio-Tracker & Sonno', labelEn: '🛌 Bio-Tracker & Sleep' },
                      { id: 'mindfulness', icon: Wind, labelIt: '🌬️ Spazio Mindfulness', labelEn: '🌬️ Mindfulness Space' }
                    ].map((sub) => {
                      const isCurrentSub = currentPage === sub.id;
                      const Icon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setCurrentPage(sub.id as Page);
                            setIsDropdownOpen(false);
                          }}
                          style={{
                            background: isCurrentSub ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: '700',
                            color: isCurrentSub ? '#22d3ee' : '#f8fafc', /* TESTO CHIARISSIMO AD ALTO CONTRASTO */
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            width: '100%'
                          }}
                          onMouseEnter={(e) => {
                            if (!isCurrentSub) {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                              e.currentTarget.style.color = '#22d3ee';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isCurrentSub) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#f8fafc';
                            }
                          }}
                        >
                          <Icon size={14} style={{ color: isCurrentSub ? '#22d3ee' : '#64748b' }} />
                          <span>{lang === 'it' ? sub.labelIt : sub.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* EXPLORE */}
              <button 
                type="button"
                onClick={() => handleScrollTo('screenshots')}
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#94a3b8', 
                  transition: 'color 0.2s' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#22d3ee'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                {currentT.navScreenshots}
              </button>

              {/* PRICING */}
              <button 
                type="button"
                onClick={() => handleScrollTo('pricing')}
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#94a3b8', 
                  transition: 'color 0.2s' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#22d3ee'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                {currentT.navPricing}
              </button>

              {/* FAQ */}
              <button 
                type="button"
                onClick={() => handleScrollTo('faq')}
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#94a3b8', 
                  transition: 'color 0.2s' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#22d3ee'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                {currentT.navFaq}
              </button>
            </nav>

            {/* DESKTOP ACTIONS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* LANGUAGE PICKER */}
              <button 
                type="button" 
                onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#22d3ee'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <Globe size={13} style={{ color: '#22d3ee' }} />
                <span>{lang.toUpperCase()}</span>
              </button>

              {/* ACTION BUTTON */}
              <a 
                href="https://mydietplan-pro.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass glow-btn" 
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderColor: 'rgba(34, 211, 238, 0.4)',
                  background: 'rgba(34, 211, 238, 0.05)',
                  color: '#22d3ee',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(34, 211, 238, 0.1)',
                  transition: 'all 0.2s'
                }}
              >
                {currentT.btnOpenApp}
              </a>
            </div>
          </>
        ) : (
          /* MOBILE HEADER CONTROLS */
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* LANGUAGE PICKER (sempre visibile) */}
            <button 
              type="button" 
              onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                color: '#94a3b8',
                fontSize: '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Globe size={12} style={{ color: '#22d3ee' }} />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* HAMBURGER TOGGLE BUTTON */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: '#22d3ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        )}
      </header>

    {/* MOBILE DROPDOWN NAVIGATION OVERLAY (COMPLETAMENTE OPACO, PREMIUM E AD ALTO CONTRASTO) */}
    {isMobile && isMobileMenuOpen && (
      <div 
        style={{
          position: 'fixed',
          top: '80px',
          left: '16px',
          right: '16px',
          background: '#090d16', /* OPACO AL 100% */
          border: '1px solid rgba(34, 211, 238, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.95), 0 0 35px rgba(34, 211, 238, 0.15)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* HOME LINK */}
        <button
          type="button"
          onClick={() => {
            setCurrentPage('home');
            setIsMobileMenuOpen(false);
          }}
          style={{
            background: currentPage === 'home' ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 16px',
            textAlign: 'left',
            fontSize: '15px',
            fontWeight: '800',
            color: currentPage === 'home' ? '#22d3ee' : '#f8fafc',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span>🏠 Home</span>
        </button>

        {/* TOUR DI PRODOTTO SUBPAGES LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', paddingLeft: '16px', marginBottom: '4px' }}>
            {currentT.navFeatures}
          </span>
          {[
            { id: 'diet', icon: Apple, labelIt: '🍏 Diet Architect', labelEn: '🍏 Diet Architect' },
            { id: 'workout', icon: Dumbbell, labelIt: '🏋️ Workout Hub', labelEn: '🏋️ Workout Hub' },
            { id: 'body', icon: Ruler, labelIt: '📊 Composizione Corporea', labelEn: '📊 Body Composition' },
            { id: 'wellness', icon: Heart, labelIt: '🛌 Bio-Tracker & Sonno', labelEn: '🛌 Bio-Tracker & Sleep' },
            { id: 'mindfulness', icon: Wind, labelIt: '🌬️ Spazio Mindfulness', labelEn: '🌬️ Mindfulness Space' }
          ].map((sub) => {
            const isCurrentSub = currentPage === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  setCurrentPage(sub.id as Page);
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: isCurrentSub ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  color: isCurrentSub ? '#22d3ee' : '#f8fafc',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  paddingLeft: '24px'
                }}
              >
                <sub.icon size={14} style={{ color: isCurrentSub ? '#22d3ee' : '#64748b' }} />
                <span>{lang === 'it' ? sub.labelIt : sub.labelEn}</span>
              </button>
            );
          })}
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />

        {/* EXPLORE LINK */}
        <button
          type="button"
          onClick={() => {
            handleScrollTo('screenshots');
            setIsMobileMenuOpen(false);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 16px',
            textAlign: 'left',
            fontSize: '15px',
            fontWeight: '700',
            color: '#f8fafc',
            width: '100%'
          }}
        >
          🔍 {currentT.navScreenshots}
        </button>

        {/* PRICING LINK */}
        <button
          type="button"
          onClick={() => {
            handleScrollTo('pricing');
            setIsMobileMenuOpen(false);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 16px',
            textAlign: 'left',
            fontSize: '15px',
            fontWeight: '700',
            color: '#f8fafc',
            width: '100%'
          }}
        >
          💎 {currentT.navPricing}
        </button>

        {/* FAQ LINK */}
        <button
          type="button"
          onClick={() => {
            handleScrollTo('faq');
            setIsMobileMenuOpen(false);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 16px',
            textAlign: 'left',
            fontSize: '15px',
            fontWeight: '700',
            color: '#f8fafc',
            width: '100%'
          }}
        >
          ❓ {currentT.navFaq}
        </button>

        {/* ACTION BUTTON MOBILE */}
        <a
          href="https://mydietplan-pro.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsMobileMenuOpen(false)}
          className="btn btn-primary glow-btn"
          style={{
            padding: '14px',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)',
            color: '#020617',
            boxShadow: '0 4px 15px rgba(34, 211, 238, 0.3)',
            textAlign: 'center',
            width: '100%',
            display: 'block'
          }}
        >
          🚀 {currentT.btnOpenApp}
        </a>
      </div>
    )}

      {/* VIEWPORT CONTROLLER */}
      {currentPage === 'home' ? (
        /* HOMEPAGE VIEW */
        <>
          {/* HERO SECTION */}
          <section style={{ padding: '80px 24px 60px 24px', textAlign: 'center', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50vw',
              height: '50vw',
              maxHeight: '400px',
              maxWidth: '400px',
              background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div className="animate-fade-up" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--cyan-glow)',
                border: '1px solid rgba(34, 211, 238, 0.25)',
                color: 'var(--accent-cyan)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '10px',
                fontWeight: '800',
                letterSpacing: '1px'
              }}>
                <Sparkles size={11} className="animate-pulse" />
                <span>{currentT.heroTag}</span>
              </div>

              <h1 className="animate-fade-up" style={{ 
                fontSize: 'calc(32px + 2vw)', 
                fontWeight: '900', 
                fontFamily: 'var(--font-title)', 
                lineHeight: '1.15', 
                letterSpacing: '-1.5px',
                maxWidth: '850px' 
              }}>
                {currentT.heroTitleLine1} <br />
                <span style={{ 
                  background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 10px rgba(34, 211, 238, 0.15))'
                }}>
                  {currentT.heroTitleLine2}
                </span>
              </h1>

              <p className="animate-fade-up" style={{ 
                fontSize: '16px', 
                color: 'var(--text-secondary)', 
                maxWidth: '650px', 
                lineHeight: '1.7',
                marginTop: '8px'
              }}>
                {currentT.heroSub}
              </p>

              {!heroSuccess ? (
                <form 
                  className="animate-fade-up animate-pulse-glow" 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!heroEmail) return;
                    setHeroLoading(true);
                    setTimeout(() => {
                      setHeroLoading(false);
                      setHeroSuccess(true);
                    }, 1200);
                  }}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '12px', 
                    marginTop: '20px', 
                    width: '100%', 
                    maxWidth: '520px' 
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px', 
                    width: '100%', 
                    background: 'rgba(15, 23, 42, 0.6)', 
                    padding: '6px', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(34, 211, 238, 0.25)', 
                    boxShadow: '0 0 20px rgba(34, 211, 238, 0.05), inset 0 0 10px rgba(34, 211, 238, 0.03)' 
                  }}>
                    <input 
                      type="email" 
                      required 
                      placeholder={lang === 'it' ? 'La tua migliore email...' : 'Your best email...'} 
                      value={heroEmail}
                      onChange={(e) => setHeroEmail(e.target.value)}
                      style={{ 
                        flex: '1 1 240px', 
                        background: 'transparent', 
                        border: 'none', 
                        outline: 'none', 
                        color: '#fff', 
                        padding: '12px 16px', 
                        fontSize: '14px',
                        fontFamily: 'inherit'
                      }} 
                    />
                    <button 
                      type="submit" 
                      disabled={heroLoading}
                      className="btn glow-btn" 
                      style={{ 
                        padding: '12px 24px', 
                        borderRadius: '12px', 
                        fontSize: '13px', 
                        fontWeight: '800', 
                        background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)', 
                        color: '#020617', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        flex: '1 0 auto',
                        minWidth: '160px'
                      }}
                    >
                      {heroLoading ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <>
                          <Zap size={14} fill="#020617" />
                          <span>{lang === 'it' ? 'Inizia Prova 7 Giorni' : 'Start 7-Day Trial'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '700', textShadow: '0 0 6px rgba(34, 211, 238, 0.3)', textAlign: 'center' }}>
                    ⚠️ {lang === 'it' 
                      ? 'Dopo 7 giorni verrà richiesto il pagamento per continuare a usare l\'app.' 
                      : 'After 7 days, payment will be requested to continue using the app.'}
                  </span>
                </form>
              ) : (
                <div 
                  className="glass animate-fade-up" 
                  style={{ 
                    padding: '24px 30px', 
                    borderRadius: '16px', 
                    borderColor: 'var(--accent-teal)', 
                    background: 'rgba(20, 184, 166, 0.05)', 
                    boxShadow: '0 0 25px rgba(20, 184, 166, 0.15)',
                    marginTop: '20px',
                    maxWidth: '520px',
                    width: '100%',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--accent-teal)', marginBottom: '8px' }}>
                    <ShieldCheck size={20} />
                    <span style={{ fontWeight: '800', fontSize: '15px' }}>
                      {lang === 'it' ? 'PROVA GRATUITA ATTIVATA!' : 'FREE TRIAL ACTIVATED!'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0 }}>
                    {lang === 'it' 
                      ? `Grazie! Abbiamo inviato le istruzioni di accesso a ${heroEmail}.`
                      : `Thank you! We've sent access instructions to ${heroEmail}.`}
                  </p>
                </div>
              )}

              {/* Tasti di navigazione rapida per scoprire di più */}
              <div className="animate-fade-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px' }}>
                <a 
                  href="#features" 
                  style={{ 
                    fontSize: '13px', 
                    fontWeight: '700',
                    color: 'var(--text-secondary)',
                    textDecoration: 'underline',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#22d3ee'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {currentT.btnLearnMore}
                </a>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <a 
                  href="#pricing" 
                  style={{ 
                    fontSize: '13px', 
                    fontWeight: '700',
                    color: 'var(--text-secondary)',
                    textDecoration: 'underline',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#22d3ee'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {lang === 'it' ? 'Vedi le tariffe' : 'View plans & rates'}
                </a>
              </div>

              <div className="animate-fade-up" style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                  {currentT.trustedBy}
                </span>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES GRID */}
          <section id="features" style={{ padding: '80px 24px', position: 'relative' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-title)' }}>
                  {currentT.secFeaturesTitle}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '550px', margin: '8px auto 0 auto' }}>
                  {currentT.secFeaturesSub}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                
                {/* Feature 1: Dieta Flessibile */}
                <div className="glass feature-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="feature-icon-wrapper">
                    <Apple size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                    {currentT.featDietTitle}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                    {currentT.featDietDesc}
                  </p>
                  <button 
                    type="button"
                    onClick={() => setCurrentPage('diet')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      alignSelf: 'flex-start',
                      transition: 'gap 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.gap = '8px'}
                    onMouseLeave={(e) => e.currentTarget.style.gap = '4px'}
                  >
                    <span>{currentT.btnLearnMoreDetail}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Feature 2: Allenamento */}
                <div className="glass feature-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="feature-icon-wrapper">
                    <Dumbbell size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                    {currentT.featWorkoutTitle}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                    {currentT.featWorkoutDesc}
                  </p>
                  <button 
                    type="button"
                    onClick={() => setCurrentPage('workout')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      alignSelf: 'flex-start',
                      transition: 'gap 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.gap = '8px'}
                    onMouseLeave={(e) => e.currentTarget.style.gap = '4px'}
                  >
                    <span>{currentT.btnLearnMoreDetail}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Feature 3: Plicometria */}
                <div className="glass feature-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="feature-icon-wrapper">
                    <Ruler size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                    {currentT.featCircTitle}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                    {currentT.featCircDesc}
                  </p>
                  <button 
                    type="button"
                    onClick={() => setCurrentPage('body')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      alignSelf: 'flex-start',
                      transition: 'gap 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.gap = '8px'}
                    onMouseLeave={(e) => e.currentTarget.style.gap = '4px'}
                  >
                    <span>{currentT.btnLearnMoreDetail}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Feature 4: Bio-Tracker */}
                <div className="glass feature-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="feature-icon-wrapper">
                    <Heart size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                    {currentT.featWellnessTitle}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                    {currentT.featWellnessDesc}
                  </p>
                  <button 
                    type="button"
                    onClick={() => setCurrentPage('wellness')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      alignSelf: 'flex-start',
                      transition: 'gap 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.gap = '8px'}
                    onMouseLeave={(e) => e.currentTarget.style.gap = '4px'}
                  >
                    <span>{currentT.btnLearnMoreDetail}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Feature 5: Mindfulness */}
                <div className="glass feature-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="feature-icon-wrapper">
                    <Wind size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                    {currentT.featMindTitle}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                    {currentT.featMindDesc}
                  </p>
                  <button 
                    type="button"
                    onClick={() => setCurrentPage('mindfulness')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      alignSelf: 'flex-start',
                      transition: 'gap 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.gap = '8px'}
                    onMouseLeave={(e) => e.currentTarget.style.gap = '4px'}
                  >
                    <span>{currentT.btnLearnMoreDetail}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

              </div>
            </div>
          </section>

          {/* TRIAL CALCULATOR WIDGET (L'ALGORITMO DI PROVA) */}
          <section id="trial-calculator" style={{ padding: '80px 24px', background: 'rgba(255, 255, 255, 0.002)', borderTop: '1px solid rgba(255,255,255,0.015)' }}>
            <div className="container" style={{ maxWidth: '750px' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--cyan-glow)',
                  border: '1px solid rgba(34, 211, 238, 0.25)',
                  color: 'var(--accent-cyan)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '800',
                  letterSpacing: '1px',
                  marginBottom: '12px'
                }}>
                  <Sparkles size={11} className="animate-pulse" />
                  <span>TEST ALGORITMO INTEGRATO</span>
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-title)' }}>
                  {lang === 'it' ? "Prova l'Algoritmo di MyDietPlan Pro" : "Try MyDietPlan Pro's Algorithm"}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '550px', margin: '8px auto 0 auto' }}>
                  {lang === 'it' 
                    ? 'Calcola all\'istante il tuo metabolismo basale (BMR), fabbisogno giornaliero (TDEE) e i macronutrienti ideali in base ai tuoi obiettivi biologici.'
                    : 'Instantly calculate your basal metabolic rate (BMR), daily energy expenditure (TDEE), and perfect macronutrient targets based on your biological goals.'}
                </p>
              </div>

              <div className="glass" style={{ padding: '35px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                
                {/* Step indicators */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      style={{
                        width: '23%',
                        height: '5px',
                        background: s <= calcStep ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)',
                        boxShadow: s <= calcStep ? '0 0 10px rgba(34, 211, 238, 0.5)' : 'none',
                        borderRadius: '3px',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>

                {/* STEP 1: DATI FISICI */}
                {calcStep === 1 && (
                  <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', textAlign: 'center', color: '#fff' }}>
                      {lang === 'it' ? 'Passo 1: Le tue caratteristiche fisiche' : 'Step 1: Your physical profile'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        {lang === 'it' ? 'Il tuo nome' : 'Your name'}
                      </label>
                      <input 
                        type="text" 
                        value={calcNome} 
                        onChange={(e) => setCalcNome(e.target.value)} 
                        placeholder={lang === 'it' ? 'Metti qui il tuo Nome' : 'Enter your Name here'}
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        {lang === 'it' ? 'Sesso biologico' : 'Biological gender'}
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => setCalcSesso('m')}
                          style={{
                            background: calcSesso === 'm' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255,255,255,0.02)',
                            border: calcSesso === 'm' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                            borderRadius: '12px', padding: '12px', color: calcSesso === 'm' ? '#22d3ee' : 'var(--text-secondary)',
                            fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px'
                          }}
                        >
                          🙋‍♂️ {lang === 'it' ? 'Uomo' : 'Male'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalcSesso('f')}
                          style={{
                            background: calcSesso === 'f' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255,255,255,0.02)',
                            border: calcSesso === 'f' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                            borderRadius: '12px', padding: '12px', color: calcSesso === 'f' ? '#22d3ee' : 'var(--text-secondary)',
                            fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px'
                          }}
                        >
                          🙋‍♀️ {lang === 'it' ? 'Donna' : 'Female'}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                          {lang === 'it' ? 'Età' : 'Age'}
                        </label>
                        <input 
                          type="number" 
                          value={calcEta} 
                          onChange={(e) => setCalcEta(e.target.value)} 
                          placeholder="es. 28" 
                          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                          {lang === 'it' ? 'Altezza (cm)' : 'Height (cm)'}
                        </label>
                        <input 
                          type="number" 
                          value={calcAltezza} 
                          onChange={(e) => setCalcAltezza(e.target.value)} 
                          placeholder="es. 175" 
                          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                          {lang === 'it' ? 'Peso (kg)' : 'Weight (kg)'}
                        </label>
                        <input 
                          type="number" 
                          value={calcPeso} 
                          onChange={(e) => setCalcPeso(e.target.value)} 
                          placeholder="es. 70" 
                          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCalcStep(2)}
                      disabled={!calcNome.trim() || !calcEta || !calcAltezza || !calcPeso}
                      className="btn btn-primary"
                      style={{
                        padding: '12px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', marginTop: '10px',
                        background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)',
                        color: '#020617', border: 'none', cursor: 'pointer', transition: 'all 0.2s', opacity: (!calcNome.trim() || !calcEta || !calcAltezza || !calcPeso) ? 0.5 : 1
                      }}
                    >
                      {lang === 'it' ? 'Avanti' : 'Next'}
                    </button>
                  </div>
                )}

                {/* STEP 2: LIVELLO DI ATTIVITA */}
                {calcStep === 2 && (
                  <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', textAlign: 'center', color: '#fff', marginBottom: '8px' }}>
                      {lang === 'it' ? 'Passo 2: Livello di attività fisica' : 'Step 2: Physical activity level'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { id: 'sedentario', labelIt: 'Sedentario 🛋️', labelEn: 'Sedentary 🛋️', descIt: 'Lavoro d\'ufficio, pochissimo movimento.', descEn: 'Office job, very little movement.' },
                        { id: 'leggero', labelIt: 'Leggero 🚶‍♂️', labelEn: 'Lightly Active 🚶‍♂️', descIt: 'Attività leggera o passeggiate 1-3 volte a settimana.', descEn: 'Light exercise or walks 1-3 times a week.' },
                        { id: 'moderato', labelIt: 'Moderato 💪', labelEn: 'Moderately Active 💪', descIt: 'Allenamento a media intensità 3-5 volte a settimana.', descEn: 'Moderate training 3-5 times a week.' },
                        { id: 'intenso', labelIt: 'Intenso ⚡', labelEn: 'Very Active ⚡', descIt: 'Attività pesante e sport 6-7 volte a settimana.', descEn: 'Heavy exercise and sports 6-7 times a week.' },
                        { id: 'atleta', labelIt: 'Atleta 🏆', labelEn: 'Athlete 🏆', descIt: 'Allenamenti bisettimanali ad altissima intensità.', descEn: 'Very heavy twice-a-day workouts.' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCalcAttivita(item.id as any)}
                          style={{
                            background: calcAttivita === item.id ? 'rgba(34, 211, 238, 0.08)' : 'rgba(255,255,255,0.02)',
                            border: calcAttivita === item.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                            borderRadius: '14px', padding: '14px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                            alignItems: 'flex-start', gap: '4px', width: '100%', transition: 'all 0.2s', textAlign: 'left'
                          }}
                        >
                          <span style={{ fontSize: '14px', fontWeight: '800', color: calcAttivita === item.id ? '#22d3ee' : '#fff' }}>
                            {lang === 'it' ? item.labelIt : item.labelEn}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {lang === 'it' ? item.descIt : item.descEn}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setCalcStep(1)}
                        style={{
                          flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                          background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: '700'
                        }}
                      >
                        {lang === 'it' ? 'Indietro' : 'Back'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcStep(3)}
                        style={{
                          flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                          background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)',
                          color: '#020617', cursor: 'pointer', fontWeight: '800'
                        }}
                      >
                        {lang === 'it' ? 'Avanti' : 'Next'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: OBIETTIVO BIOLOGICO */}
                {calcStep === 3 && (
                  <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', textAlign: 'center', color: '#fff', marginBottom: '8px' }}>
                      {lang === 'it' ? 'Passo 3: Seleziona il tuo obiettivo' : 'Step 3: Choose your goal'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { id: 'perdita_peso', titleIt: 'Deficit Calorico 🔥', titleEn: 'Caloric Deficit 🔥', descIt: 'Dimagrimento sano, definizione muscolare.', descEn: 'Healthy weight loss, muscle definition.' },
                        { id: 'mantenimento', titleIt: 'Mantenimento Biologico ⚖️', titleEn: 'Biological Maintenance ⚖️', descIt: 'Mantenimento del peso, miglioramento della vitalità.', descEn: 'Maintain weight, improve vitality.' },
                        { id: 'ipertrofia', titleIt: 'Surplus Calorico 🧱', titleEn: 'Caloric Surplus 🧱', descIt: 'Crescita e ricostruzione muscolare.', descEn: 'Muscle growth and body rebuilding.' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCalcGoal(item.id as any)}
                          style={{
                            background: calcGoal === item.id ? 'rgba(34, 211, 238, 0.08)' : 'rgba(255,255,255,0.02)',
                            border: calcGoal === item.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                            borderRadius: '14px', padding: '16px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                            alignItems: 'flex-start', gap: '4px', width: '100%', transition: 'all 0.2s', textAlign: 'left'
                          }}
                        >
                          <span style={{ fontSize: '14px', fontWeight: '800', color: calcGoal === item.id ? '#22d3ee' : '#fff' }}>
                            {lang === 'it' ? item.titleIt : item.titleEn}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {lang === 'it' ? item.descIt : item.descEn}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setCalcStep(2)}
                        style={{
                          flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                          background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: '700'
                        }}
                      >
                        {lang === 'it' ? 'Indietro' : 'Back'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcStep(4)}
                        style={{
                          flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                          background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)',
                          color: '#020617', cursor: 'pointer', fontWeight: '800'
                        }}
                      >
                        {lang === 'it' ? 'Calcola Target' : 'Calculate'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: RISULTATI NEON & FORM 2 */}
                {calcStep === 4 && (
                  <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {(() => {
                      const res = calcolaBmrETdeeLocal(
                        parseFloat(calcPeso) || 70,
                        parseFloat(calcAltezza) || 175,
                        parseFloat(calcEta) || 28,
                        calcSesso,
                        calcAttivita,
                        calcGoal
                      );
                      
                      const totalMacrosKcal = (res.carboidratiGrams * 4) + (res.proteineGrams * 4) + (res.grassiGrams * 9);
                      const carbPct = Math.round(((res.carboidratiGrams * 4) / totalMacrosKcal) * 100);
                      const protPct = Math.round(((res.proteineGrams * 4) / totalMacrosKcal) * 100);
                      const fatPct = 100 - carbPct - protPct;

                      return (
                        <>
                          <h3 style={{ fontSize: '18px', fontWeight: '900', textAlign: 'center', color: '#fff', marginBottom: '4px' }}>
                            🎉 {lang === 'it' ? `I tuoi target proposti, ${calcNome}!` : `Your proposed targets, ${calcNome}!`}
                          </h3>

                          {/* BMR and TDEE row */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div className="glass" style={{ padding: '12px', textAlign: 'center', borderRadius: '12px' }}>
                              <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                BMR (Metabolismo Basale)
                              </span>
                              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                                {res.bmr} <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>kcal</span>
                              </div>
                            </div>
                            <div className="glass" style={{ padding: '12px', textAlign: 'center', borderRadius: '12px' }}>
                              <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                TDEE (Consumo Totale)
                              </span>
                              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                                {res.tdee} <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>kcal</span>
                              </div>
                            </div>
                          </div>

                          {/* Calorie Card */}
                          <div className="glass" style={{ 
                            padding: '24px 20px', 
                            textAlign: 'center', 
                            borderRadius: '16px', 
                            border: '1px solid rgba(34, 211, 238, 0.4)',
                            background: 'rgba(34, 211, 238, 0.03)',
                            boxShadow: 'inset 0 0 15px rgba(34, 211, 238, 0.05)'
                          }}>
                            <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              ⚡ {lang === 'it' ? 'FABBISOGNO GIORNALIERO PROPOSTO' : 'DAILY PROPOSED CALORIC BUDGET'}
                            </span>
                            <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', fontFamily: 'var(--font-title)', margin: '6px 0', textShadow: '0 0 15px rgba(34, 211, 238, 0.3)' }}>
                              {res.kcalTarget} <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-cyan)' }}>kcal/giorno</span>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              {calcGoal === 'perdita_peso' && (lang === 'it' ? 'Deficit calorico calcolato per un dimagrimento duraturo' : 'Calculated calorie deficit for long-term fat loss')}
                              {calcGoal === 'mantenimento' && (lang === 'it' ? 'Calorie calcolate per mantenere il peso' : 'Calories calculated to maintain body weight')}
                              {calcGoal === 'ipertrofia' && (lang === 'it' ? 'Surplus calorico impostato per favorire la massa magra' : 'Calorie surplus set to favor lean muscle gain')}
                            </span>
                          </div>

                          {/* Macronutrients Cards */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                              <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '800' }}>🍞 CARBOIDRATI</span>
                              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{res.carboidratiGrams}g</div>
                              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{carbPct}% ({res.carboidratiGrams * 4} kcal)</span>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                              <span style={{ fontSize: '10px', color: 'var(--accent-teal)', fontWeight: '800' }}>🍗 PROTEINE</span>
                              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{res.proteineGrams}g</div>
                              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{protPct}% ({res.proteineGrams * 4} kcal)</span>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                              <span style={{ fontSize: '10px', color: 'var(--accent-rose)', fontWeight: '800' }}>🥑 GRASSI</span>
                              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{res.grassiGrams}g</div>
                              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{fatPct}% ({res.grassiGrams * 9} kcal)</span>
                            </div>
                          </div>

                          {/* Colorful macro proportion bar */}
                          <div style={{ width: '100%', height: '8px', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginTop: '-8px' }}>
                            <div style={{ width: `${carbPct}%`, background: 'var(--accent-cyan)' }} />
                            <div style={{ width: `${protPct}%`, background: 'var(--accent-teal)' }} />
                            <div style={{ width: `${fatPct}%`, background: 'var(--accent-rose)' }} />
                          </div>

                          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />

                          {/* FORM 2: Trial Calculator Signup Form */}
                          {!calcSuccess ? (
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!calcEmail) return;
                                setCalcLoading(true);
                                setTimeout(() => {
                                  setCalcLoading(false);
                                  setCalcSuccess(true);
                                }, 1200);
                              }}
                              style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}
                            >
                              <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#fff', textAlign: 'center' }}>
                                💾 {lang === 'it' ? 'Salva i tuoi Target & Attiva Prova Premium' : 'Save your Targets & Activate Premium Trial'}
                              </h4>
                              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
                                {lang === 'it' 
                                  ? 'Invia questi target alla tua email e attiva subito la prova gratuita di 7 giorni per sbloccare l\'app.'
                                  : 'Send these targets to your email and start your 7-day free trial immediately to unlock the app.'}
                              </p>
                              
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                                <input 
                                  type="email" 
                                  required 
                                  value={calcEmail}
                                  onChange={(e) => setCalcEmail(e.target.value)}
                                  placeholder={lang === 'it' ? 'Inserisci la tua email...' : 'Enter your email...'}
                                  style={{ flex: '1 1 200px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none', fontSize: '13px', fontFamily: 'inherit' }}
                                />
                                <button 
                                  type="submit" 
                                  disabled={calcLoading}
                                  className="btn glow-btn"
                                  style={{
                                    flex: '1 0 auto', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', fontSize: '12.5px',
                                    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)',
                                    color: '#020617', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                  }}
                                >
                                  {calcLoading ? <RefreshCw size={13} className="animate-spin" /> : <span>{lang === 'it' ? 'Ricevi Target & Prova Gratis' : 'Get Targets & Start Trial'}</span>}
                                </button>
                              </div>
                              <span style={{ fontSize: '11.5px', color: 'var(--accent-cyan)', fontWeight: '700', textShadow: '0 0 6px rgba(34, 211, 238, 0.3)', textAlign: 'center', marginTop: '4px' }}>
                                ⚠️ {lang === 'it' 
                                  ? 'Dopo 7 giorni verrà richiesto il pagamento per continuare a usare l\'app. Nessuna carta richiesta.' 
                                  : 'After 7 days, payment will be requested to continue using the app. No card required.'}
                              </span>
                            </form>
                          ) : (
                            <div 
                              className="glass" 
                              style={{ 
                                padding: '20px', 
                                borderRadius: '14px', 
                                borderColor: 'var(--accent-teal)', 
                                background: 'rgba(20, 184, 166, 0.05)',
                                textAlign: 'center',
                                animation: 'fadeInUp 0.3s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-teal)', fontWeight: '800', fontSize: '14px', marginBottom: '4px' }}>
                                <ShieldCheck size={16} />
                                <span>{lang === 'it' ? 'PROVA ATTIVATA CON SUCCESSO!' : 'TRIAL ACTIVATED SUCCESSFULLY!'}</span>
                              </div>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                {lang === 'it'
                                  ? `I tuoi target ed il link per scaricare l'app sono stati inviati a ${calcEmail}. Controlla la posta!`
                                  : `Your targets and app download link have been sent to ${calcEmail}. Check your inbox!`}
                              </p>
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '6px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setCalcStep(1);
                                setCalcSuccess(false);
                              }}
                              style={{
                                padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)',
                                background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '700', fontSize: '11px'
                              }}
                            >
                              🔄 {lang === 'it' ? 'Ripeti Calcolo' : 'Recalculate'}
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

              </div>
            </div>
          </section>

          {/* SCREENSHOTS SELECTOR */}
          <section id="screenshots" style={{ padding: '80px 24px', background: 'rgba(255, 255, 255, 0.005)', borderTop: '1px solid rgba(255,255,255,0.015)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-title)' }}>
                  {currentT.secScreensTitle}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '550px', margin: '8px auto 0 auto' }}>
                  {currentT.secScreensSub}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <div className="glass" style={{ display: 'flex', padding: '3px', borderRadius: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setDeviceTab('desktop')}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '9px',
                      border: 'none',
                      background: deviceTab === 'desktop' ? 'var(--cyan-glow)' : 'transparent',
                      color: deviceTab === 'desktop' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {currentT.tabDesktop}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setDeviceTab('mobile')}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '9px',
                      border: 'none',
                      background: deviceTab === 'mobile' ? 'var(--cyan-glow)' : 'transparent',
                      color: deviceTab === 'mobile' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {currentT.tabMobile}
                  </button>
                </div>
              </div>

              <div style={{ minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {deviceTab === 'desktop' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '14px' }}>
                    <div className="laptop-mockup animate-fade-up">
                      <div className="laptop-screen" style={{ position: 'relative' }}>
                        <img src={desktopScreens[activeDesktopIdx].src} alt="Desktop screen" />
                        <button 
                          type="button" 
                          onClick={handlePrevDesktop} 
                          style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#fff'
                          }}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button 
                          type="button" 
                          onClick={handleNextDesktop} 
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#fff'
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="laptop-base" />
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {lang === 'it' ? desktopScreens[activeDesktopIdx].titleIt : desktopScreens[activeDesktopIdx].titleEn}
                    </div>
                  </div>
                )}

                {deviceTab === 'mobile' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '14px' }}>
                    <div className="phone-mockup animate-fade-up" style={{ position: 'relative' }}>
                      <img src={mobileScreens[activeMobileIdx].src} alt="Mobile screen" className="phone-screen" />
                      <button 
                        type="button" 
                        onClick={handlePrevMobile} 
                        style={{
                          position: 'absolute',
                          left: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(15, 23, 42, 0.7)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#fff',
                          zIndex: 11
                        }}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button 
                        type="button" 
                        onClick={handleNextMobile} 
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(15, 23, 42, 0.7)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#fff',
                          zIndex: 11
                        }}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {lang === 'it' ? mobileScreens[activeMobileIdx].titleIt : mobileScreens[activeMobileIdx].titleEn}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section id="pricing" style={{ padding: '80px 24px', position: 'relative' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-title)' }}>
                  {currentT.secPricingTitle}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '550px', margin: '8px auto 0 auto' }}>
                  {currentT.secPricingSub}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px', alignItems: 'stretch', maxWidth: '1200px', margin: '0 auto' }}>
                
                {/* Piano Prova Gratis (7 Giorni) */}
                <div className="glass pricing-card" style={{ padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '20px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.5px' }}>
                      {currentT.planTrialName}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', minHeight: '36px', lineHeight: '1.4' }}>
                      {currentT.planTrialDesc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--font-title)' }}>
                    <span style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)' }}>0.00€</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>/ 7 {lang === 'it' ? 'giorni' : 'days'}</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--accent-cyan)', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                    ⚠️ {currentT.trialWarn}
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', fontSize: '12px', flex: 1 }}>
                    {[
                      currentT.featureUnlimitedProfiles,
                      currentT.featureFullDiagnostics,
                      currentT.featureAllAccess,
                      currentT.featureNoAds
                    ].map((f, i) => (
                      <li key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Check size={13} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    type="button" 
                    onClick={() => {
                      setModalPlan('trial');
                      setIsModalOpen(true);
                      setModalSuccess(false);
                      setModalEmail('');
                      setModalNome('');
                    }}
                    className="btn btn-secondary glow-btn" 
                    style={{ borderRadius: '10px', padding: '12px', fontWeight: '800', background: 'rgba(34, 211, 238, 0.05)', borderColor: 'rgba(34, 211, 238, 0.3)', color: 'var(--accent-cyan)', textAlign: 'center', fontSize: '12px', cursor: 'pointer' }}
                  >
                    {currentT.btnStartTrial}
                  </button>
                </div>

                {/* Piano Mensile */}
                <div className="glass pricing-card" style={{ padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
                      {currentT.planMonthlyName}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', minHeight: '36px', lineHeight: '1.4' }}>
                      {currentT.planMonthlyDesc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--font-title)' }}>
                    <span style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)' }}>9.99€</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>/ {lang === 'it' ? 'mese' : 'month'}</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--accent-teal)', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                    {currentT.trialNotice}
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', fontSize: '12px', flex: 1 }}>
                    {[
                      currentT.featureUnlimitedProfiles,
                      currentT.featureFullDiagnostics,
                      currentT.featureAllAccess,
                      currentT.featureCloudSync,
                      currentT.featureNoAds
                    ].map((f, i) => (
                      <li key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Check size={13} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    type="button" 
                    onClick={() => {
                      setModalPlan('monthly');
                      setIsModalOpen(true);
                      setModalSuccess(false);
                      setModalEmail('');
                      setModalNome('');
                    }}
                    className="btn btn-secondary" 
                    style={{ borderRadius: '10px', padding: '12px', fontWeight: '700', background: 'rgba(255, 255, 255, 0.02)', borderColor: 'var(--border-color)', textAlign: 'center', fontSize: '12px', cursor: 'pointer' }}
                  >
                    {currentT.checkoutBtn}
                  </button>
                </div>

                {/* Piano Annuale (BEST VALUE) */}
                <div className="glass pricing-card popular" style={{ padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-teal)', letterSpacing: '0.5px' }}>
                      {currentT.planYearlyName}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', minHeight: '36px', lineHeight: '1.4' }}>
                      {currentT.planYearlyDesc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--font-title)' }}>
                    <span style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)' }}>59.99€</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>/ {lang === 'it' ? 'anno' : 'year'}</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--accent-cyan)', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                    {currentT.trialNotice} (Risparmi 50%)
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', fontSize: '12px', flex: 1 }}>
                    {[
                      currentT.featureUnlimitedProfiles,
                      currentT.featureFullDiagnostics,
                      currentT.featureAllAccess,
                      currentT.featureCloudSync,
                      currentT.featureExportDoc,
                      currentT.featureNoAds
                    ].map((f, i) => (
                      <li key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Check size={13} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-primary)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    type="button" 
                    onClick={() => {
                      setModalPlan('yearly');
                      setIsModalOpen(true);
                      setModalSuccess(false);
                      setModalEmail('');
                      setModalNome('');
                    }}
                    className="btn btn-primary glow-btn" 
                    style={{ borderRadius: '10px', padding: '12px', fontWeight: '800', background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))', color: '#020617', boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)', textAlign: 'center', fontSize: '12px', cursor: 'pointer', border: 'none' }}
                  >
                    {currentT.checkoutBtn}
                  </button>
                </div>

                {/* Piano Lifetime */}
                <div className="glass pricing-card" style={{ padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '0.5px' }}>
                      {currentT.planLifetimeName}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', minHeight: '36px', lineHeight: '1.4' }}>
                      {currentT.planLifetimeDesc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--font-title)' }}>
                    <span style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)' }}>359.99€</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '4px' }}>/ {lang === 'it' ? 'una tantum' : 'one-time'}</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--accent-gold)', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                    {currentT.lifetimeNotice}
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', fontSize: '12px', flex: 1 }}>
                    {[
                      currentT.featureUnlimitedProfiles,
                      currentT.featureFullDiagnostics,
                      currentT.featureAllAccess,
                      currentT.featureCloudSync,
                      currentT.featureExportDoc,
                      currentT.featureNoAds
                    ].map((f, i) => (
                      <li key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Check size={13} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    type="button" 
                    onClick={() => {
                      setModalPlan('lifetime');
                      setIsModalOpen(true);
                      setModalSuccess(false);
                      setModalEmail('');
                      setModalNome('');
                    }}
                    className="btn btn-secondary" 
                    style={{ borderRadius: '10px', padding: '12px', fontWeight: '700', background: 'rgba(255, 255, 255, 0.02)', borderColor: 'var(--border-color)', textAlign: 'center', fontSize: '12px', cursor: 'pointer' }}
                  >
                    {currentT.checkoutBtn}
                  </button>
                </div>

              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 30px', justifyContent: 'center', alignItems: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} style={{ color: 'var(--accent-teal)' }} />
                  <span>{currentT.paymentGuaranteed}</span>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section id="faq" style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.015)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-title)' }}>
                  {currentT.secFaqTitle}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px auto 0 auto' }}>
                  {currentT.secFaqSub}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {faqItems.map((item) => {
                  const isOpen = openFaqId === item.id;
                  return (
                    <div 
                      key={item.id} 
                      className="glass" 
                      style={{ 
                        borderRadius: '14px', 
                        overflow: 'hidden', 
                        borderColor: isOpen ? 'var(--accent-cyan)' : 'var(--border-color)',
                        boxShadow: isOpen ? '0 0 20px rgba(34, 211, 238, 0.05)' : 'none'
                      }}
                    >
                      <button 
                        type="button" 
                        onClick={() => toggleFaq(item.id)}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          padding: '20px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          color: isOpen ? 'var(--accent-cyan)' : 'var(--text-primary)',
                          fontWeight: '700',
                          fontSize: '15px',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <HelpCircle size={16} style={{ color: isOpen ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                          {lang === 'it' ? item.questionIt : item.questionEn}
                        </span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      
                      {isOpen && (
                        <div style={{ 
                          padding: '0 24px 20px 24px', 
                          color: 'var(--text-secondary)', 
                          fontSize: '13.5px', 
                          lineHeight: '1.6',
                          borderTop: '1px solid rgba(255,255,255,0.02)'
                        }}>
                          <div style={{ paddingTop: '16px' }}>
                            {lang === 'it' ? item.answerIt : item.answerEn}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* PRE-FOOTER CTA SECTION (FORM 4) */}
          <section id="footer-cta" style={{ padding: '60px 24px 80px 24px', position: 'relative' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
              <div className="glass" style={{ 
                padding: '50px 40px', 
                borderRadius: '24px', 
                textAlign: 'center', 
                background: 'linear-gradient(180deg, rgba(8, 47, 73, 0.2) 0%, rgba(9, 13, 22, 0.6) 100%)', 
                border: '1px solid rgba(34, 211, 238, 0.25)', 
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(34, 211, 238, 0.05)',
                position: 'relative', 
                overflow: 'hidden' 
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '250px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
                  pointerEvents: 'none'
                }} />

                <h3 style={{ fontSize: '26px', fontWeight: '900', fontFamily: 'var(--font-title)', color: '#fff', marginBottom: '12px' }}>
                  {lang === 'it' ? 'Inizia a Progettare il tuo Corpo Oggi' : 'Start Designing Your Body Today'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', maxWidth: '550px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
                  {lang === 'it' 
                    ? 'Attiva la tua prova gratuita di 7 giorni e sblocca la suite scientifica locale di MyDietPlan Pro. Nessuna carta di credito richiesta.'
                    : 'Activate your 7-day free trial and unlock MyDietPlan Pro\'s local scientific suite. No credit card required.'}
                </p>

                {!footerSuccess ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!footerEmail) return;
                      setFooterLoading(true);
                      setTimeout(() => {
                        setFooterLoading(false);
                        setFooterSuccess(true);
                      }, 1200);
                    }}
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '12px', 
                      width: '100%', 
                      maxWidth: '520px',
                      margin: '0 auto'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '8px', 
                      width: '100%', 
                      background: 'rgba(15, 23, 42, 0.6)', 
                      padding: '6px', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.08)', 
                      boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)' 
                    }}>
                      <input 
                        type="email" 
                        required 
                        placeholder={lang === 'it' ? 'Inserisci la tua email...' : 'Enter your email...'} 
                        value={footerEmail}
                        onChange={(e) => setFooterEmail(e.target.value)}
                        style={{ 
                          flex: '1 1 240px', 
                          background: 'transparent', 
                          border: 'none', 
                          outline: 'none', 
                          color: '#fff', 
                          padding: '12px 16px', 
                          fontSize: '14px',
                          fontFamily: 'inherit'
                        }} 
                      />
                      <button 
                        type="submit" 
                        disabled={footerLoading}
                        className="btn glow-btn" 
                        style={{ 
                          padding: '12px 24px', 
                          borderRadius: '12px', 
                          fontSize: '13px', 
                          fontWeight: '800', 
                          background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)', 
                          color: '#020617', 
                          border: 'none', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          flex: '1 0 auto',
                          minWidth: '160px'
                        }}
                      >
                        {footerLoading ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <>
                            <Zap size={14} fill="#020617" />
                            <span>{lang === 'it' ? 'Inizia Prova Gratis' : 'Start Free Trial'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '700', textShadow: '0 0 6px rgba(34, 211, 238, 0.3)', textAlign: 'center' }}>
                      ⚠️ {lang === 'it' 
                        ? 'Dopo 7 giorni verrà richiesto il pagamento per continuare a usare l\'app. Nessuna carta richiesta.' 
                        : 'After 7 days, payment will be requested to continue using the app. No card required.'}
                    </span>
                  </form>
                ) : (
                  <div 
                    className="glass" 
                    style={{ 
                      padding: '24px 30px', 
                      borderRadius: '16px', 
                      borderColor: 'var(--accent-teal)', 
                      background: 'rgba(20, 184, 166, 0.05)', 
                      boxShadow: '0 0 25px rgba(20, 184, 166, 0.15)',
                      maxWidth: '520px',
                      margin: '0 auto',
                      width: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--accent-teal)', marginBottom: '8px' }}>
                      <ShieldCheck size={20} />
                      <span style={{ fontWeight: '800', fontSize: '15px' }}>
                        {lang === 'it' ? 'PROVA ATTIVATA CON SUCCESSO!' : 'TRIAL ACTIVATED SUCCESSFULLY!'}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0 }}>
                      {lang === 'it' 
                        ? `Grazie! Il link di installazione è stato inviato a ${footerEmail}.`
                        : `Thank you! The setup link has been sent to ${footerEmail}.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        /* DETAIL TOUR SUBPAGE */
        <div className="animate-fade-up" style={{ padding: '40px 24px 80px 24px', flex: 1 }}>
          <div className="container">
            {/* Header di Sezione */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {currentT.tourHeaderTag}
                </span>
                <h2 style={{ fontSize: 'calc(24px + 1vw)', fontWeight: '900', fontFamily: 'var(--font-title)', lineHeight: '1.2' }}>
                  {currentPage === 'diet' && (lang === 'it' ? '🍎 Diet Architect & Equalizzatore Kcal' : '🍎 Diet Architect & Kcal Equalizer')}
                  {currentPage === 'workout' && (lang === 'it' ? '🏋️ Workout Planner & Timer MET' : '🏋️ Workout Planner & MET Timer')}
                  {currentPage === 'body' && (lang === 'it' ? '📊 Composizione Corporea e Calibro' : '📊 Body Composition & Skinfold Caliper')}
                  {currentPage === 'wellness' && (lang === 'it' ? '🛌 Bio-Tracker & Sleep Log' : '🛌 Bio-Tracker & Sleep Log')}
                  {currentPage === 'mindfulness' && (lang === 'it' ? '🌬️ Spazio Mindfulness e Calma' : '🌬️ Mindfulness & Guided Breathing')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', maxWidth: '650px', margin: 0 }}>
                  {currentT.tourSub}
                </p>
              </div>
              
              <button 
                type="button" 
                onClick={() => setCurrentPage('home')}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'var(--text-primary)',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ChevronLeft size={14} />
                <span>{currentT.backToFeatures}</span>
              </button>
            </div>

            {/* TOUR INTERATTIVO GRID */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'stretch' }}>
              
              {/* Colonna Sinistra: I passi del tour */}
              <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {currentT.tourInstructions}
                </span>

                {activeSteps.map((step, idx) => {
                  const isActive = activeStepIdx === idx;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setActiveStepIdx(idx)}
                      className="glass"
                      style={{
                        padding: '18px 20px',
                        cursor: 'pointer',
                        borderRadius: '14px',
                        borderColor: isActive ? 'var(--accent-cyan)' : 'var(--border-color)',
                        background: isActive ? 'rgba(34, 211, 238, 0.04)' : 'var(--card-bg)',
                        boxShadow: isActive ? '0 0 15px rgba(34, 211, 238, 0.06), var(--shadow-lg)' : 'var(--shadow-lg)',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <h4 style={{ 
                        fontSize: '14.5px', 
                        fontWeight: '800', 
                        color: isActive ? 'var(--accent-cyan)' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: isActive ? '8px' : '0'
                      }}>
                        <span>{lang === 'it' ? step.titleIt : step.titleEn}</span>
                        {isActive && <Sparkles size={13} style={{ color: 'var(--accent-cyan)' }} />}
                      </h4>
                      {isActive && (
                        <p style={{ 
                          color: 'var(--text-secondary)', 
                          fontSize: '12.5px', 
                          lineHeight: '1.6', 
                          margin: 0,
                          animation: 'fadeInUp 0.3s ease'
                        }}>
                          {lang === 'it' ? step.descIt : step.descEn}
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Controlli Prec / Succ */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button 
                    type="button"
                    disabled={activeStepIdx === 0}
                    onClick={() => setActiveStepIdx((prev) => Math.max(0, prev - 1))}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.01)',
                      color: activeStepIdx === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
                      cursor: activeStepIdx === 0 ? 'not-allowed' : 'pointer',
                      fontWeight: '700',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <ChevronLeft size={14} />
                    <span>{currentT.tourPrev}</span>
                  </button>
                  <button 
                    type="button"
                    disabled={activeStepIdx === activeSteps.length - 1}
                    onClick={() => setActiveStepIdx((prev) => Math.min(activeSteps.length - 1, prev + 1))}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.01)',
                      color: activeStepIdx === activeSteps.length - 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
                      cursor: activeStepIdx === activeSteps.length - 1 ? 'not-allowed' : 'pointer',
                      fontWeight: '700',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{currentT.tourNext}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Colonna Destra: I mockup fisici con lo screenshot attivo */}
              <div style={{ flex: '1.2 1 450px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
                {currentStep && (
                  <div className="glass" style={{ padding: '30px', position: 'relative' }}>
                    
                    {/* Badge di Certificazione Tecnologica */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', fontSize: '11px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-teal)' }}>
                        <ShieldCheck size={14} />
                        <span>LOCAL-FIRST ENCRYPTED</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}>
                        <RefreshCw size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
                        <span>SUPABASE SYNC READY</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)' }}>
                        <Lock size={12} />
                        <span>100% OFFLINE PRIVACY</span>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '30px', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      
                      {/* Render Laptop Mockup se disponibile */}
                      {currentStep.laptopSrc && (
                        <div style={{ flex: '1 1 380px', maxWidth: '480px' }}>
                          <div className="laptop-mockup">
                            <div className="laptop-screen">
                              <img src={currentStep.laptopSrc} alt={`${lang === 'it' ? currentStep.titleIt : currentStep.titleEn} Desktop`} />
                            </div>
                            <div className="laptop-base" />
                          </div>
                          <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '800', letterSpacing: '0.5px' }}>
                            💻 DESKTOP INTERFACE
                          </div>
                        </div>
                      )}

                      {/* Render Phone Mockup se disponibile */}
                      {currentStep.phoneSrc && (
                        <div style={{ flex: '0 1 180px' }}>
                          <div className="phone-mockup" style={{ width: '190px', height: '380px', borderRadius: '28px', border: '7px solid #1e293b' }}>
                            <img src={currentStep.phoneSrc} alt={`${lang === 'it' ? currentStep.titleIt : currentStep.titleEn} Mobile`} className="phone-screen" />
                          </div>
                          <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '800', letterSpacing: '0.5px' }}>
                            📱 SMARTPHONE VIEW
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Didascalia screenshot attivo */}
                    <div style={{ 
                      marginTop: '24px', 
                      background: 'rgba(255,255,255,0.01)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '10px', 
                      padding: '12px 16px',
                      fontSize: '12px',
                      color: 'var(--accent-cyan)',
                      textAlign: 'center',
                      fontWeight: '700'
                    }}>
                      <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>ACTIVE SCREEN:</span>
                      {lang === 'it' ? currentStep.titleIt.slice(3) : currentStep.titleEn.slice(3)}
                    </div>

                  </div>
                )}
              </div>

            </div>

            {/* SEZIONE INFERIORE DI RITORNO / PROMO (Mostrata in fondo a tutte le sottopagine) */}
            <div className="glass" style={{ 
              marginTop: '40px', 
              padding: '40px 30px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '16px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '22px', fontWeight: '900', fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
                {lang === 'it' ? 'Pronto a progettare il tuo corpo scientificamente?' : 'Ready to scientifically engineer your body?'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', maxWidth: '550px', margin: 0, lineHeight: '1.6' }}>
                {lang === 'it'
                  ? 'Sblocca il potenziale completo di MyDietPlan Pro. Inizia la tua prova gratuita di 7 giorni o sblocca la licenza Premium a vita.'
                  : 'Unlock the complete biological power of MyDietPlan Pro. Start your 7-day free trial or claim your lifetime Premium access.'}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setCurrentPage('home')}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                    padding: '12px 24px',
                    borderRadius: '11px',
                    color: 'var(--text-primary)',
                    fontWeight: '700',
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  {currentT.backToFeatures}
                </button>
                <a 
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('home');
                    setTimeout(() => {
                      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="btn btn-primary glow-btn"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)',
                    color: '#020617',
                    padding: '12px 24px',
                    borderRadius: '11px',
                    fontWeight: '800',
                    fontSize: '12.5px',
                    boxShadow: '0 4px 15px rgba(34, 211, 238, 0.25)',
                    textAlign: 'center'
                  }}
                >
                  {lang === 'it' ? 'Vedi Abbonamenti e Prezzi' : 'View Subscriptions & Pricing'}
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ 
        marginTop: 'auto', 
        padding: '30px 24px', 
        textAlign: 'center', 
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(2, 6, 23, 0.7)'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
              MyDietPlan <span style={{ color: 'var(--accent-cyan)' }}>Pro</span>
            </span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span style={{ fontSize: '12px', color: 'var(--accent-teal)', fontWeight: '700' }}>
              LOCAL-FIRST & SECURE
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '11.5px', margin: 0 }}>
            {currentT.footerText}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} style={{ color: 'var(--accent-teal)' }} />
              Merchant of Record: Lemon Squeezy
            </span>
          </div>
        </div>
      </footer>

      {/* CHECKOUT MODAL (FORM 3) */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px',
          animation: 'fadeIn 0.25s ease forwards'
        }}>
          <div className="glass animate-fade-up" style={{
            width: '100%',
            maxWidth: '480px',
            background: '#090d16',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(34, 211, 238, 0.15)',
            position: 'relative'
          }}>
            {/* Close button */}
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <X size={16} />
            </button>

            {!modalSuccess ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!modalEmail || !modalNome) return;
                  setModalLoading(true);
                  setTimeout(() => {
                    setModalLoading(false);
                    setModalSuccess(true);
                  }, 1200);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Lemon Squeezy Checkout
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>
                    {lang === 'it' ? 'Attivazione Account Premium' : 'Premium Account Activation'}
                  </h3>
                  <div className="glass" style={{ display: 'inline-flex', padding: '6px 16px', borderRadius: '10px', marginTop: '8px', border: '1px solid rgba(34, 211, 238, 0.15)', background: 'rgba(34, 211, 238, 0.02)' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff' }}>
                      {modalPlan === 'trial' && (lang === 'it' ? '7 Giorni Prova Gratis — 0.00€' : '7-Day Free Trial — 0.00€')}
                      {modalPlan === 'monthly' && (lang === 'it' ? 'Premium Mensile — Prova 7 Giorni gratis (poi 9.99€/mese)' : 'Premium Monthly — 7 Days Trial free (then 9.99€/mo)')}
                      {modalPlan === 'yearly' && (lang === 'it' ? 'Premium Annuale — Prova 7 Giorni gratis (poi 59.99€/anno)' : 'Premium Yearly — 7 Days Trial free (then 59.99€/yr)')}
                      {modalPlan === 'lifetime' && (lang === 'it' ? 'Premium Lifetime — Pagamento Unico 359.99€' : 'Premium Lifetime — One-time 359.99€')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    {lang === 'it' ? 'Il tuo Nome' : 'Your Name'}
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder={lang === 'it' ? 'es. Daniele' : 'e.g. Daniele'}
                    value={modalNome}
                    onChange={(e) => setModalNome(e.target.value)}
                    style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    {lang === 'it' ? 'Indirizzo Email' : 'Email Address'}
                  </label>
                  <input 
                    type="email" 
                    required 
                    placeholder={lang === 'it' ? 'la-tua-email@esempio.com' : 'your-email@example.com'}
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px 14px', color: '#fff', outline: 'none', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                {/* Clear Warning */}
                {modalPlan !== 'lifetime' ? (
                  <div style={{ display: 'flex', gap: '8px', background: 'rgba(34, 211, 238, 0.04)', border: '1.5px dashed rgba(34, 211, 238, 0.3)', padding: '12px 14px', borderRadius: '12px', fontSize: '11px', color: 'var(--accent-cyan)', lineHeight: '1.5' }}>
                    <span>⚠️</span>
                    <span>
                      {lang === 'it' 
                        ? 'Dopo i 7 giorni di prova gratuita verrà richiesto il pagamento dell\'abbonamento scelto per continuare a usare l\'app. Puoi annullare in qualsiasi momento.' 
                        : 'After the 7-day free trial, payment will be requested for the chosen plan to continue using the app. You can cancel at any time.'}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', background: 'rgba(251, 191, 36, 0.04)', border: '1.5px dashed rgba(251, 191, 36, 0.3)', padding: '12px 14px', borderRadius: '12px', fontSize: '11px', color: 'var(--accent-gold)', lineHeight: '1.5' }}>
                    <span>💎</span>
                    <span>
                      {lang === 'it' 
                        ? 'Nessun abbonamento periodico. Pagamento unico con accesso Premium illimitato per sempre.' 
                        : 'No recurring subscription. One-time payment with unlimited Premium access forever.'}
                    </span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={modalLoading}
                  className="btn glow-btn"
                  style={{
                    padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)',
                    color: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px'
                  }}
                >
                  {modalLoading ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>
                        {modalPlan === 'trial' && (lang === 'it' ? 'Attiva Prova Gratis 7 Giorni' : 'Activate 7-Day Free Trial')}
                        {modalPlan !== 'trial' && (lang === 'it' ? 'Inizia con Prova Gratuita' : 'Start with Free Trial')}
                      </span>
                    </>
                  )}
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
                  <Lock size={10} />
                  <span>Merchant of Record: Lemon Squeezy (Secure 256-bit SSL)</span>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: 'rgba(20, 184, 166, 0.1)', 
                  border: '2px solid var(--accent-teal)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--accent-teal)',
                  margin: '0 auto'
                }}>
                  <ShieldCheck size={32} />
                </div>

                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#fff' }}>
                    {lang === 'it' ? 'Grazie per la fiducia!' : 'Thank you for your trust!'}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                    {lang === 'it' 
                      ? `Il tuo account per ${modalPlan === 'trial' ? 'la Prova Gratis' : 'il piano Premium'} è pronto! Abbiamo inviato le istruzioni ed il link di installazione a ${modalEmail}.`
                      : `Your account for the ${modalPlan === 'trial' ? 'Free Trial' : 'Premium plan'} is ready! We have sent instructions and the setup link to ${modalEmail}.`}
                  </p>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />

                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '12px', borderRadius: '10px', fontSize: '12.5px', fontWeight: '800', cursor: 'pointer' }}
                >
                  {lang === 'it' ? 'Chiudi Finestra' : 'Close Window'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
