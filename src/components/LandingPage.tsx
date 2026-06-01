import { useState } from 'react';
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
  Star 
} from 'lucide-react';

type Language = 'it' | 'en';

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('it');
  const [deviceTab, setDeviceTab] = useState<'mobile' | 'desktop'>('desktop');
  
  // Stati per i caroselli degli screenshot
  const [activeDesktopIdx, setActiveDesktopIdx] = useState(0);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  const desktopScreens = [
    { src: '/screenshots/desktop1.jpg', titleIt: 'Dashboard Principale', titleEn: 'Main Dashboard' },
    { src: '/screenshots/desktop2.jpg', titleIt: 'Grafici Composizione Corporea', titleEn: 'Body Composition Trends' },
    { src: '/screenshots/desktop3.jpg', titleIt: 'Diet Editor & Macrobar', titleEn: 'Diet Editor & Macrobar' },
    { src: '/screenshots/desktop4.jpg', titleIt: 'Workout Planner', titleEn: 'Workout Planner' }
  ];

  const mobileScreens = [
    { src: '/screenshots/mobile1.png', titleIt: 'Paywall & Premium', titleEn: 'Paywall & Premium' },
    { src: '/screenshots/mobile2.png', titleIt: 'Registro Wellness', titleEn: 'Wellness Log' },
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

  // Testi tradotti
  const t = {
    it: {
      metaTitle: 'MyDietPlan Pro - Il tuo corpo, progettato scientificamente',
      navFeatures: 'Funzioni',
      navScreenshots: 'Screenshot',
      navPricing: 'Prezzi',
      btnOpenApp: 'Accedi all\'App',
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
      
      featureUnlimitedProfiles: 'Profili utenti illimitati nello stesso dispositivo',
      featureFullDiagnostics: 'Calcolo scientifico di BMR, TDEE e Fabbisogno',
      featureCloudSync: 'Sincronizzazione Cloud sicura con Supabase',
      featureExportDoc: 'Esportazione PDF/Word professionale delle diete',
      featureAllAccess: 'Accesso completo a Dieta, Allenamento e Pliche',
      featureNoAds: 'Nessuna pubblicità, 100% offline-first',
      
      footerText: '© 2026 MyDietPlan Pro. Progettato con passione per l\'ingegneria del corpo umano.'
    },
    en: {
      metaTitle: 'MyDietPlan Pro - Your body, scientifically engineered',
      navFeatures: 'Features',
      navScreenshots: 'Screenshots',
      navPricing: 'Pricing',
      btnOpenApp: 'Open App',
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
      
      featureUnlimitedProfiles: 'Unlimited user profiles on the same device',
      featureFullDiagnostics: 'Scientific BMR, TDEE, and Target calculations',
      featureCloudSync: 'Secure Cloud Sync with Supabase Database',
      featureExportDoc: 'Professional PDF/Word exports for diet sheets',
      featureAllAccess: 'Full access to Diet, Workouts, and Skinfolds Caliper',
      featureNoAds: 'Zero ads, 100% offline-first privacy',
      
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

        {/* NAVIGATION LINKS */}
        <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: '600' }} className="nav-links">
          <a href="#features" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            {currentT.navFeatures}
          </a>
          <a href="#screenshots" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            {currentT.navScreenshots}
          </a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            {currentT.navPricing}
          </a>
        </nav>

        {/* ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* LANGUAGE PICKER */}
          <button 
            type="button" 
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <Globe size={13} style={{ color: 'var(--accent-cyan)' }} />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* ACTION BUTTON */}
          <a 
            href="https://mydietplan-pro.vercel.app/" // Questo rimanderà direttamente al vero Vercel dell'applicazione!
            className="glass" 
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              borderColor: 'rgba(34, 211, 238, 0.4)',
              background: 'rgba(34, 211, 238, 0.05)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.1)'
            }}
          >
            {currentT.btnOpenApp}
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ padding: '80px 24px 60px 24px', textAlign: 'center', position: 'relative' }}>
        {/* Glow effect background */}
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
          
          {/* Badge */}
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

          {/* Title */}
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

          {/* Subtitle */}
          <p className="animate-fade-up" style={{ 
            fontSize: '16px', 
            color: 'var(--text-secondary)', 
            maxWidth: '650px', 
            lineHeight: '1.7',
            marginTop: '8px'
          }}>
            {currentT.heroSub}
          </p>

          {/* Call to Actions */}
          <div className="animate-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: '16px', width: '100%', maxWidth: '400px' }}>
            <a 
              href="#pricing" 
              className="btn btn-primary glow-btn" 
              style={{ 
                flex: 1, 
                padding: '14px 28px', 
                borderRadius: '14px', 
                fontSize: '14px', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-teal) 100%)',
                color: '#020617',
                boxShadow: '0 4px 20px rgba(34, 211, 238, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Zap size={14} fill="#020617" />
              <span>{currentT.btnStartFree}</span>
            </a>
            <a 
              href="#features" 
              className="btn btn-secondary" 
              style={{ 
                flex: 1, 
                padding: '14px 28px', 
                borderRadius: '14px', 
                fontSize: '14px', 
                fontWeight: '700',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              {currentT.btnLearnMore}
            </a>
          </div>

          {/* Social Proof */}
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

      {/* DETTAGLI DELLE CARATTERISTICHE (FEATURES GRID) */}
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
            <div className="glass feature-card" style={{ padding: '30px' }}>
              <div className="feature-icon-wrapper">
                <Apple size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                {currentT.featDietTitle}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
                {currentT.featDietDesc}
              </p>
            </div>

            {/* Feature 2: Allenamento */}
            <div className="glass feature-card" style={{ padding: '30px' }}>
              <div className="feature-icon-wrapper">
                <Dumbbell size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                {currentT.featWorkoutTitle}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
                {currentT.featWorkoutDesc}
              </p>
            </div>

            {/* Feature 3: Plicometria */}
            <div className="glass feature-card" style={{ padding: '30px' }}>
              <div className="feature-icon-wrapper">
                <Ruler size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                {currentT.featCircTitle}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
                {currentT.featCircDesc}
              </p>
            </div>

            {/* Feature 4: Bio-Tracker */}
            <div className="glass feature-card" style={{ padding: '30px' }}>
              <div className="feature-icon-wrapper">
                <Heart size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                {currentT.featWellnessTitle}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
                {currentT.featWellnessDesc}
              </p>
            </div>

            {/* Feature 5: Mindfulness */}
            <div className="glass feature-card" style={{ padding: '30px' }}>
              <div className="feature-icon-wrapper">
                <Wind size={20} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                {currentT.featMindTitle}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
                {currentT.featMindDesc}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SHOWCASE GALLERIA SCREENSHOT INTERATTIVA */}
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

          {/* SWITCH TAB DEVICE (MOBILE VS DESKTOP) */}
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

          {/* VIEWPORT CONTENUTI SCREENSHOT */}
          <div style={{ minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* DESKTOP SHOWCASE LAPTOP */}
            {deviceTab === 'desktop' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '14px' }}>
                <div className="laptop-mockup animate-fade-up">
                  <div className="laptop-screen" style={{ position: 'relative' }}>
                    <img 
                      src={desktopScreens[activeDesktopIdx].src} 
                      alt="Desktop screen" 
                      style={{ transition: 'opacity 0.2s ease-in-out' }}
                    />
                    
                    {/* Frecce carosello integrate sullo screen */}
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
                {/* Didascalia */}
                <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                  {lang === 'it' ? desktopScreens[activeDesktopIdx].titleIt : desktopScreens[activeDesktopIdx].titleEn}
                </div>
              </div>
            )}

            {/* MOBILE SHOWCASE SMARTPHONE */}
            {deviceTab === 'mobile' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '14px' }}>
                <div className="phone-mockup animate-fade-up" style={{ position: 'relative' }}>
                  <img 
                    src={mobileScreens[activeMobileIdx].src} 
                    alt="Mobile screen" 
                    className="phone-screen"
                    style={{ transition: 'opacity 0.2s ease' }}
                  />

                  {/* Frecce carosello integrate sullo screen */}
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
                {/* Didascalia */}
                <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                  {lang === 'it' ? mobileScreens[activeMobileIdx].titleIt : mobileScreens[activeMobileIdx].titleEn}
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* PRICING E PREVENTIVO DI CHECKOUT LEMON SQUEEZY */}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'stretch', maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Piano Mensile */}
            <div className="glass pricing-card" style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  {currentT.planMonthlyName}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', minHeight: '36px' }}>
                  {currentT.planMonthlyDesc}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--font-title)' }}>
                <span style={{ fontSize: '40px', fontWeight: '900', color: 'var(--text-primary)' }}>9.99€</span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '4px' }}>/ {lang === 'it' ? 'mese' : 'month'}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                {currentT.trialNotice}
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', fontSize: '13px', flex: 1 }}>
                {[
                  currentT.featureUnlimitedProfiles,
                  currentT.featureFullDiagnostics,
                  currentT.featureAllAccess,
                  currentT.featureCloudSync,
                  currentT.featureNoAds
                ].map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <a 
                href="https://mydietplan-pro.vercel.app/" // Rimanda alla Web App per sbloccare l'abbonamento con Lemon Squeezy!
                className="btn btn-secondary" 
                style={{ 
                  borderRadius: '12px', 
                  padding: '12px', 
                  fontWeight: '700',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {currentT.checkoutBtn}
              </a>
            </div>

            {/* Piano Annuale (BEST VALUE) */}
            <div className="glass pricing-card popular" style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-teal)' }}>
                  {currentT.planYearlyName}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', minHeight: '36px' }}>
                  {currentT.planYearlyDesc}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--font-title)' }}>
                <span style={{ fontSize: '40px', fontWeight: '900', color: 'var(--text-primary)' }}>59.99€</span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '4px' }}>/ {lang === 'it' ? 'anno' : 'year'}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                {currentT.trialNotice} (Risparmi 50%)
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', fontSize: '13px', flex: 1 }}>
                {[
                  currentT.featureUnlimitedProfiles,
                  currentT.featureFullDiagnostics,
                  currentT.featureAllAccess,
                  currentT.featureCloudSync,
                  currentT.featureExportDoc,
                  currentT.featureNoAds
                ].map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-primary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <a 
                href="https://mydietplan-pro.vercel.app/" 
                className="btn btn-primary glow-btn" 
                style={{ 
                  borderRadius: '12px', 
                  padding: '14px', 
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-cyan))',
                  color: '#020617',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)'
                }}
              >
                {currentT.checkoutBtn}
              </a>
            </div>

            {/* Piano Lifetime */}
            <div className="glass pricing-card" style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                  {currentT.planLifetimeName}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', minHeight: '36px' }}>
                  {currentT.planLifetimeDesc}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--font-title)' }}>
                <span style={{ fontSize: '40px', fontWeight: '900', color: 'var(--text-primary)' }}>99.99€</span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '4px' }}>/ {lang === 'it' ? 'una tantum' : 'one-time'}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                {currentT.lifetimeNotice}
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', fontSize: '13px', flex: 1 }}>
                {[
                  currentT.featureUnlimitedProfiles,
                  currentT.featureFullDiagnostics,
                  currentT.featureAllAccess,
                  currentT.featureCloudSync,
                  currentT.featureExportDoc,
                  currentT.featureNoAds
                ].map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Check size={14} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <a 
                href="https://mydietplan-pro.vercel.app/" 
                className="btn btn-secondary" 
                style={{ 
                  borderRadius: '12px', 
                  padding: '12px', 
                  fontWeight: '700',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {currentT.checkoutBtn}
              </a>
            </div>

          </div>

          {/* Secure details footer */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 30px', justifyContent: 'center', alignItems: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={15} style={{ color: 'var(--accent-teal)' }} />
              <span>{currentT.paymentGuaranteed}</span>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', padding: '30px 24px', textAlign: 'center', background: 'rgba(2, 6, 23, 0.8)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
            <svg width="24" height="24" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.6))' }}>
              <circle cx="50" cy="50" r="46" fill="radial-gradient(circle at 50% 50%, #082f49 0%, #020617 100%)" stroke="var(--accent-cyan)" strokeWidth="3" />
              <circle cx="50" cy="54" r="12" fill="radial-gradient(circle, #ffffff 0%, #06b6d4 100%)" />
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'var(--font-title)', letterSpacing: '0.5px' }}>
              MyDietPlan <span style={{ color: 'var(--accent-cyan)' }}>Pro</span>
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.5' }}>
            {currentT.footerText}
          </p>
        </div>
      </footer>

    </div>
  );
}
