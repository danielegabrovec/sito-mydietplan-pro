export interface TourStep {
  titleIt: string;
  titleEn: string;
  descIt: string;
  descEn: string;
  laptopSrc: string;
  phoneSrc: string | null;
}

export interface FAQItem {
  id: number;
  questionIt: string;
  questionEn: string;
  answerIt: string;
  answerEn: string;
}

export const dietSteps: TourStep[] = [
  {
    titleIt: "1. Onboarding e Fabbisogno Calorico",
    titleEn: "1. Onboarding & Caloric Assessment",
    descIt: "Prima di iniziare, il Wizard di configurazione calcola scientificamente il tuo Metabolismo Basale (BMR) e il Fabbisogno Giornaliero (TDEE) usando la formula di Mifflin-St Jeor. Puoi impostare il tuo obiettivo (Definizione, Mantenimento, Massa) e personalizzare i deficit energetici.",
    descEn: "Before starting, the setup Wizard scientifically computes your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation. You can easily specify your goal (Cut, Recomp, Bulk) and customize calorie deficits.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101442.jpg",
    phoneSrc: "/screenshots/mobile1.png"
  },
  {
    titleIt: "2. La Struttura dei Pasti e la Macrobar",
    titleEn: "2. Meal Structure & The Macrobar",
    descIt: "All'interno del Diet Editor trovi la spettacolare 'Macrobar' neon. Questa si aggiorna istantaneamente in millisecondi ad ogni modifica alimentare, indicandoti i grammi precisi assunti e rimanenti di Carboidrati, Proteine e Grassi rispetto ai tuoi target biologici.",
    descEn: "Inside the Diet Editor is our signature neon 'Macrobar'. It updates in milliseconds with every diet modification, logging your exact consumed and remaining grams of Carbs, Proteins, and Fats against your biological targets.",
    laptopSrc: "/screenshots/desktop3.jpg",
    phoneSrc: "/screenshots/mobile4.png"
  },
  {
    titleIt: "3. Database Alimenti e Ricerca Rapida",
    titleEn: "3. Food Database & Rapid Search",
    descIt: "Cerca cibi nel database nutrizionale locale o inserisci alimenti personalizzati. Puoi salvare pasti preferiti e copiare l'intera struttura nutrizionale da una giornata all'altra in un solo click, garantendo velocità offline-first a prova di rallentamenti.",
    descEn: "Search for foods in the local nutritional database or add custom foods. You can save favorite meals and clone entire daily menus in a single click, enjoying offline-first speed with zero network delays.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101512.jpg",
    phoneSrc: "/screenshots/mobile4.png"
  },
  {
    titleIt: "4. Scelta Multipla ed Equalizzazione Kcal",
    titleEn: "4. Multi-Choice Meals & Kcal Equalizer",
    descIt: "La punta di diamante dell'app! Definisci portate a scelta multipla nello stesso pasto (es. Pranzo Option 1: Riso e pollo; Option 2: Patate e merluzzo). Cliccando su 'Bilancia', l'app riscala all'istante le grammature delle opzioni secondarie per pareggiare le calorie dell'Opzione 1.",
    descEn: "Our flagship feature! Define multi-choice alternative options inside the exact same meal (e.g. Lunch Option 1: Rice & chicken; Option 2: Potatoes & cod). Press 'Balance' and the app instantly scales second option weights to match Option 1 calories.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101531.jpg",
    phoneSrc: "/screenshots/mobile4.png"
  },
  {
    titleIt: "5. Esportazione Professionale in PDF e Word",
    titleEn: "5. PDF & Word Professional Exports",
    descIt: "Genera file PDF pronti per la stampa, puliti e formattati con rigore grafico, ideali da tenere sul frigo o da condividere. Oppure esporta piani in file Microsoft Word (.docx) completamente modificabili per stili esterni e ritocchi nutrizionali personalizzati.",
    descEn: "Generate print-ready PDFs formatted with extreme graphic care, ideal for the fridge or sharing with clients. Or export plans as fully editable Microsoft Word (.docx) files for further external custom styles and custom edits.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101609.jpg",
    phoneSrc: "/screenshots/mobile4.png"
  }
];

export const workoutSteps: TourStep[] = [
  {
    titleIt: "1. Suddivisione Split e Giorni di Scheda",
    titleEn: "1. Workout Splits & Training Days",
    descIt: "Progetta la tua programmazione in split flessibili (es. Push/Pull/Legs o Split A/B/C). Puoi creare infinite schede per differenziare i periodi di forza da quelli di ipertrofia e inserire note generali per ciascun giorno.",
    descEn: "Design your weekly program in flexible splits (e.g. Push/Pull/Legs or Day A/B/C). Create infinite workout routines to separate hypertrophy phases from strength blocks and specify general daily notes.",
    laptopSrc: "/screenshots/desktop4.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  },
  {
    titleIt: "2. Configurazione Set, Ripetizioni e Carichi",
    titleEn: "2. Set, Reps, and Load Customization",
    descIt: "Per ogni esercizio, definisci il numero di serie, le ripetizioni target, i carichi in chilogrammi, le note esecutive (es. dropset, RPE 9) ed il tempo esatto di riposo. Modifica l'ordine degli esercizi col drag-and-drop.",
    descEn: "For each exercise, specify your series count, target repetitions, weight in kilograms, custom execution notes (e.g. dropset, RPE 9) and exact rest duration. Easily reorder your movements with modern drag-and-drop.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101800.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  },
  {
    titleIt: "3. Dispendio Energetico con Algoritmo MET",
    titleEn: "3. Energy Expenditure via MET Algorithm",
    descIt: "Calcola il costo calorico reale del tuo allenamento in base ai valori scientifici MET (Equivalent Metabolic of Task). L'app stima l'energia bruciata analizzando la durata effettiva della sessione e il tuo peso, salvando il log nella Dashboard.",
    descEn: "Compute the real caloric cost of your workouts using scientific MET (Metabolic Equivalent of Task) values. The app estimates burned calories by processing training time against your weight, storing the log in your Dashboard.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101853.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  },
  {
    titleIt: "4. Calcolo dei Massimali e 1 Rep Max (1RM)",
    titleEn: "4. Strength Calculator & 1 Rep Max (1RM)",
    descIt: "Inserisci le tue alzate più pesanti per stimare la tua 1 Rep Max (1RM) su Squat, Panca, Stacco ed altri esercizi primari. L'app implementa formule certificate come Epley e Brzycki per delineare lo storico di forza.",
    descEn: "Log your heaviest lifts to automatically evaluate your theoretical 1 Rep Max (1RM) on Squat, Bench, Deadlift, and other main movements. The app runs certified formulas like Epley and Brzycki to track strength history.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101909.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  },
  {
    titleIt: "5. Trend storici del Volume di Allenamento",
    titleEn: "5. Training Volume Trends & Reports",
    descIt: "Visualizza i grafici neon del volume totale di allenamento (Serie x Ripetizioni x Carico) e dell'intensità media accumulata nel tempo. Un'analisi visiva essenziale per implementare scientificamente il sovraccarico progressivo.",
    descEn: "Inspect neon interactive charts detailing total training volume (Sets x Reps x Weight) and average intensity accumulated over time. A vital visual diagnostic to mathematically enforce progressive overload.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101932.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  }
];

export const bodySteps: TourStep[] = [
  {
    titleIt: "1. Protocollo Plicometrico a 3 e 7 Punti",
    titleEn: "1. 3-Point & 7-Point Caliper Protocols",
    descIt: "Il gold-standard per stimare il grasso corporeo a casa. Registra lo spessore adiposo in millimetri (mm) usando le formule Jackson-Pollock. L'app adatta le misurazioni in base al sesso (uomo: petto, addome, coscia; donna: tricipite, sovrailiaca, coscia).",
    descEn: "The gold-standard for body fat estimation at home. Log skinfold thickness in millimeters (mm) using Jackson-Pollock equations. The app adapts points by gender (male: chest, abdomen, thigh; female: triceps, suprailiac, thigh).",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101714.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  },
  {
    titleIt: "2. Mappa Circonferenze ed Asimmetrie",
    titleEn: "2. Circumference Mapping & Bilaterals",
    descIt: "Inserisci le misure di collo, spalle, vita, fianchi ed arti bilaterali. L'app evidenzia all'istante eventuali asimmetrie muscolari confrontando braccia e gambe destre/sinistre, calcolando anche il WHR (indici vita-fianchi) per valutazioni cardiovascolari.",
    descEn: "Enter measurements for neck, shoulders, waist, hips, and bilateral limbs. The app highlights muscle imbalances by comparing right vs left arms and legs, calculating WHR (Waist-to-Hip ratio) for cardiovascular health markers.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101626.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  },
  {
    titleIt: "3. Massa Magra, Massa Grassa e Donut Chart",
    titleEn: "3. Lean Mass, Fat Mass, & Donut Chart",
    descIt: "Attraverso il calcolo della densità corporea, l'app scorpora il tuo peso in chilogrammi esatti di Massa Magra (muscolo, ossa, acqua) e Massa Grassa (adiposo). I dati vengono sintetizzati in un magnifico grafico a ciambella interattivo neon.",
    descEn: "Through body density equations, the app splits your total weight into exact kilograms of Lean Mass (muscle, bone, water) and Fat Mass (adipose). The results are synthesized in a stunning interactive neon donut chart.",
    laptopSrc: "/screenshots/desktop2.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  },
  {
    titleIt: "4. Trend Storici delle Pliche in Millimetri",
    titleEn: "4. Historic Skinfolds Trends in Millimeters",
    descIt: "Niente più approssimazioni. Visualizza grafici lineari storici dedicati ad ogni singola plica (es. addominale, tricipitale) misurata rigorosamente in millimetri (mm). Scopri con esattezza scientifica dove stai effettivamente perdendo adipe.",
    descEn: "No more guesswork. View dedicated historic line charts for every single measured skinfold (e.g. abdominal, triceps) calibrated in millimeters (mm). Discover with mathematical certainty where you are dropping body fat.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 101641.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  }
];

export const wellnessSteps: TourStep[] = [
  {
    titleIt: "1. Registro Sonno e Monitoraggio HRV",
    titleEn: "1. Sleep Logger & HRV Recovery Metrics",
    descIt: "Traccia la durata del riposo notturno e valuta la qualità del sonno con stelle. Registra la variabilità della frequenza cardiaca (HRV) e i battiti a riposo (RHR), indicatori d'atleta ideali per diagnosticare lo stress sistemico del sistema nervoso autonomo.",
    descEn: "Track nocturnal rest duration and evaluate sleep quality using star ratings. Log heart rate variability (HRV) and resting heart rate (RHR), ideal athletic biomarkers to diagnose systemic stress on the autonomic nervous system.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 102013.jpg",
    phoneSrc: "/screenshots/mobile3.png"
  },
  {
    titleIt: "2. Parametri Fisiologici e Vitali Completi",
    titleEn: "2. Complete Physiological & Vital Biomarkers",
    descIt: "Compila quotidianamente i tuoi bio-log inserendo pressione arteriosa (sistolica e diastolica), livelli di ossigeno nel sangue (SpO2), glicemia a digiuno e temperatura basale per prevenire stanchezza cronica o sovrallenamento sportivo.",
    descEn: "Log daily vital stats including blood pressure (systolic and diastolic), blood oxygen levels (SpO2), fasting blood glucose, and basal body temperature to proactively detect chronic fatigue or athletic overtraining.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 102030.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  },
  {
    titleIt: "3. Attività Quotidiana, Contapassi ed Idratazione",
    titleEn: "3. Daily Activity, Steps Tracker, & Hydration",
    descIt: "Traccia l'acqua consumata in millilitri (ml) e visualizza l'avvicinamento al target idrico quotidiano. Registra i passi per tenere d'occhio la NEAT (attività non da esercizio) e visualizzala nei widget dinamici della Dashboard principale.",
    descEn: "Track water consumption in milliliters (ml) and visualize your progress against your hydration target. Log daily steps to monitor NEAT (non-exercise activity) and view it in our main Dashboard widget indicators.",
    laptopSrc: "/screenshots/desktop1.jpg",
    phoneSrc: "/screenshots/mobile2.png"
  }
];

export const mindfulnessSteps: TourStep[] = [
  {
    titleIt: "1. Sessioni di Respirazione Guidate",
    titleEn: "1. Paced Breathing Sessions",
    descIt: "Sincronizza il battito cardiaco e abbassa il cortisolo con sessioni di respirazione guidate da un pacer visivo. Scegli tra tecniche terapeutiche come il Box Breathing (4-4-4-4), la respirazione calmante 4-7-8, o il ritmo Ujjayi yogico.",
    descEn: "Synchronize cardiac rhythm and reduce cortisol levels using guided breathing sessions with our signature pacer ring. Choose from therapeutic methods like Box Breathing (4-4-4-4), 4-7-8 calming breath, or yogic Ujjayi.",
    laptopSrc: "/screenshots/desktop_extra/Immagine 2026-06-01 102056.jpg",
    phoneSrc: "/screenshots/mobile3.png"
  },
  {
    titleIt: "2. Registro Meditazione e Diario dell'Umore",
    titleEn: "2. Meditation Log & Mood Diary",
    descIt: "Al termine della sessione, registra i minuti trascorsi in mindfulness e associa un'emoji per descrivere il tuo livello di umore. L'app elabora i dati storici per correlare lo stress mentale al recupero fisico globale dell'organismo.",
    descEn: "Upon completing a session, log the minutes spent in mindfulness and save a daily mood emoji. The app processes historical data to correlate mental stress with total physical and biological recovery.",
    laptopSrc: "/screenshots/desktop1.jpg",
    phoneSrc: "/screenshots/mobile3.png"
  }
];

export const faqItems: FAQItem[] = [
  {
    id: 1,
    questionIt: "I miei dati personali e biometrici sono sicuri ed offline?",
    questionEn: "Are my personal and biometric data secure and offline?",
    answerIt: "Sì, assolutamente. MyDietPlan Pro è un'applicazione 'local-first'. Tutti i dati inseriti (diete, schede, pliche, parametri vitali e sonno) rimangono crittografati sul tuo dispositivo locale. Nessun server centrale traccia o vende le tue informazioni corporee.",
    answerEn: "Yes, absolutely. MyDietPlan Pro is built with a local-first architecture. All your entries (diets, workouts, skinfolds, vitals, and sleep) are stored encrypted on your local device. No central servers track or sell your biometric data."
  },
  {
    id: 2,
    questionIt: "Come funziona la sincronizzazione cloud opzionale con Supabase?",
    questionEn: "How does the optional cloud synchronization with Supabase work?",
    answerIt: "Se desideri accedere ai tuoi dati da più dispositivi (es. desktop in ufficio e smartphone in palestra), puoi attivare la Sincronizzazione Cloud sicura. L'app caricherà i dati crittografati sul tuo database privato Supabase personale, garantendo la tua totale sovranità sul cloud.",
    answerEn: "If you want to access your data from multiple devices (e.g. desktop at home and mobile at the gym), you can enable secure Cloud Sync. The app uploads encrypted records to your personal private Supabase database, securing complete digital sovereignty."
  },
  {
    id: 3,
    questionIt: "L'equalizzazione delle calorie è supportata per qualunque alimento?",
    questionEn: "Is calorie equalization supported for any food item?",
    answerIt: "Sì! L'algoritmo calcola dinamicamente le calorie per grammo dell'Opzione 1 (l'alimento principale del pasto) e, impostando un alimento differente come Opzione 2, riscala istantaneamente la grammatura di quest'ultimo per far sì che Carboidrati e Kilocalorie totali combacino perfettamente.",
    answerEn: "Yes! The engine dynamically processes calories-per-gram for Option 1 (your primary meal item) and, upon selecting a different food as Option 2, rescales its gram weight instantly to perfectly align total Carb and Kilocalorie values."
  },
  {
    id: 4,
    questionIt: "Il calcolo delle pliche con calibro richiede attrezzatura professionale?",
    questionEn: "Does caliper skinfold tracking require professional equipment?",
    answerIt: "No, è sufficiente un normale plicometro economico (acquistabile online per pochi euro). L'app implementa le formule a 3 pliche e a 7 pliche di Jackson-Pollock che convertono i millimetri (mm) rilevati in percentuale di massa grassa, senza bisogno di costose bilance bioimpedenziometriche spesso imprecise.",
    answerEn: "No, a simple budget skinfold caliper (available online for a few dollars) is perfect. The app embeds the gold-standard 3-point and 7-point Jackson-Pollock formulas to translate millimeters (mm) into precise body fat percentages, bypassing expensive and inaccurate impedance scales."
  },
  {
    id: 5,
    questionIt: "Cosa comprende la licenza Premium Lifetime?",
    questionEn: "What is included in the Premium Lifetime license?",
    answerIt: "La licenza Lifetime comprende l'accesso a tempo illimitato a tutte le funzionalità dell'app. Un unico acquisto una tantum con Lemon Squeezy (nessun abbonamento mensile forzato), comprensivo di tutti i futuri aggiornamenti gratuiti, profili illimitati per la famiglia ed esportazioni PDF/Word illimitate.",
    answerEn: "The Lifetime license grants permanent access to all current and future features of the app. A single, one-time secure payment processed by Lemon Squeezy (no monthly fees or forced recurring payments) with lifetime updates, family profiles, and infinite exports."
  }
];
