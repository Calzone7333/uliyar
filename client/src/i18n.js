import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// The translations
const resources = {
    en: {
        translation: {
            "Contact Us": "Contact Us",
            "Post Jobs": "Post Jobs",
            "Find jobs": "Find jobs",
            "Categories": "Categories",
            "About us": "About us",
            "Resources": "Resources",
            "Login": "Login",
            "Logout": "Logout",
            "Explore Opportunities": "Explore Opportunities",
            "Job Categories": "Job Categories",
            "SECTORS": "SECTORS",
            "We're Here to Help": "We're Here to Help",
            "Get in Touch": "Get in Touch",
            "Phone Support": "Phone Support",
            "Email Us": "Email Us",
            "Office": "Office",
            "Find Your Dream Jobs": "Find Your Dream Jobs",
            "Filter Jobs": "Filter Jobs",
            "Empowering Blue-Collar Professionals": "Empowering Blue-Collar Professionals",
            "Our Mission": "Our Mission",
            "Our Vision": "Our Vision",
            "Ready to Join the Revolution?": "Ready to Join the Revolution?",
            "Find Jobs and": "Find Jobs and",
            "Hire Skilled Workers Across India": "Hire Skilled Workers Across India",
            "I am a worker": "I am a worker",
            "I am an employer": "I am an employer",
            "Features": "Features",
            "Benefits": "Benefits",
            "PROCESS": "PROCESS",
            "FAQ": "FAQ"
        }
    },
    ta: {
        translation: {
            "Contact Us": "தொடர்பு கொள்ள",
            "Post Jobs": "வேலை பதிவு",
            "Find jobs": "வேலை தேடு",
            "Categories": "வகைகள்",
            "About us": "எங்களை பற்றி",
            "Resources": "வளங்கள்",
            "Login": "உள்நுழை",
            "Logout": "வெளியேறு",
            "Explore Opportunities": "வாய்ப்புகளை ஆராயுங்கள்",
            "Job Categories": "வேலை வகைகள்",
            "SECTORS": "துறைகள்",
            "We're Here to Help": "நாங்கள் உதவ காத்திருக்கிறோம்",
            "Get in Touch": "தொடர்பு கொள்ளுங்கள்",
            "Phone Support": "தொலைபேசி உதவி",
            "Email Us": "மின்னஞ்சல் அனுப்புங்கள்",
            "Office": "அலுவலகம்",
            "Find Your Dream Jobs": "உங்கள் கனவு வேலைகளைக் கண்டறியுங்கள்",
            "Filter Jobs": "வேலைகளை வடிகட்டு",
            "Empowering Blue-Collar Professionals": "தொழிலாளர்களை அதிகாரப்படுத்துதல்",
            "Our Mission": "எங்கள் நோக்கம்",
            "Our Vision": "எங்கள் பார்வை",
            "Ready to Join the Revolution?": "புரட்சியில் இணைய தயாரா?",
            "Find Jobs and": "வேலை தேடுங்கள் &",
            "Hire Skilled Workers Across India": "திறமையான தொழிலாளர்களை பணியமர்த்துங்கள்",
            "I am a worker": "நான் ஒரு பணியாளர்",
            "I am an employer": "நான் ஒரு முதலாளி",
            "Features": "அம்சங்கள்",
            "Benefits": "நன்மைகள்",
            "PROCESS": "செயல்முறை",
            "FAQ": "அடிக்கடி கேட்கப்படும் கேள்விகள்"
        }
    },
    hi: {
        translation: {
            "Contact Us": "संपर्क करें",
            "Post Jobs": "नौकरी पोस्ट करें",
            "Find jobs": "नौकरी खोजें",
            "Categories": "श्रेणियाँ",
            "About us": "हमारे बारे में",
            "Resources": "संसाधन",
            "Login": "लॉग इन",
            "Logout": "लॉग आउट",
            "Explore Opportunities": "अवसर खोजें",
            "Job Categories": "नौकरी श्रेणियाँ",
            "SECTORS": "क्षेत्र",
            "We're Here to Help": "हम मदद के लिए यहाँ हैं",
            "Get in Touch": "संपर्क करें",
            "Phone Support": "फ़ोन सहायता",
            "Email Us": "हमें ईमेल करें",
            "Office": "कार्यालय",
            "Find Your Dream Jobs": "अपने सपनों की नौकरियां खोजें",
            "Filter Jobs": "नौकरी फ़िल्टर करें",
            "Empowering Blue-Collar Professionals": "पेशेवरों को सशक्त बनाना",
            "Our Mission": "हमारा मिशन",
            "Our Vision": "हमारा दृष्टिकोण",
            "Ready to Join the Revolution?": "क्या आप क्रांति में शामिल होने के लिए तैयार हैं?",
            "Find Jobs and": "नौकरी खोजें और ",
            "Hire Skilled Workers Across India": "कुशल श्रमिकों को काम पर रखें",
            "I am a worker": "मैं एक कर्मचारी हूँ",
            "I am an employer": "मैं एक नियोक्ता हूँ",
            "Features": "विशेषताएं",
            "Benefits": "लाभ",
            "PROCESS": "प्रक्रिया",
            "FAQ": "सामान्य प्रश्न"
        }
    },
    te: {
        translation: {
            "Contact Us": "సంప్రదించండి",
            "Post Jobs": "ఉద్యోగాలను పోస్ట్ చేయండి",
            "Find jobs": "ఉద్యోగాలను కనుగొనండి",
            "Categories": "వర్గాలు",
            "About us": "మా గురించి",
            "Resources": "వనరులు",
            "Login": "లాగిన్ చేయండి",
            "Logout": "లాగ్అవుట్ చేయండి",
            "Explore Opportunities": "అవకాశాలను అన్వేషించండి",
            "Job Categories": "ఉద్యోగ వర్గాలు",
            "SECTORS": "రంగాలు",
            "We're Here to Help": "మేము సహాయపడటానికి ఇక్కడ ఉన్నాము",
            "Get in Touch": "మమ్మల్ని సంప్రదించండి",
            "Phone Support": "ఫోన్ మద్దతు",
            "Email Us": "మాకు ఇమెయిల్ చేయండి",
            "Office": "కార్యాలయం",
            "Find Your Dream Jobs": "మీ కలల ఉద్యోగాలను కనుగొనండి",
            "Filter Jobs": "ఉద్యోగాలను ఫిల్టర్ చేయండి",
            "Empowering Blue-Collar Professionals": "కార్మికులకు సాధికారత",
            "Our Mission": "మా లక్ష్యం",
            "Our Vision": "మా దృష్టి",
            "Ready to Join the Revolution?": "విప్లవంలో చేరడానికి సిద్ధంగా ఉన్నారా?",
            "Find Jobs and": "ఉద్యోగాలు మరియు",
            "Hire Skilled Workers Across India": "నైపుణ్యం కలిగిన కార్మికులను నియమించుకోండి",
            "I am a worker": "నేను ఒక కార్మికుడిని",
            "I am an employer": "నేను ఒక యజమానిని",
            "Features": "ఫీచర్లు",
            "Benefits": "ప్రయోజనాలు",
            "PROCESS": "ప్రక్రియ",
            "FAQ": "తరచుగా అడిగే ప్రశ్నలు"
        }
    },
    ml: {
        translation: {
            "Contact Us": "ഞങ്ങളെ ബന്ധപ്പെടുക",
            "Post Jobs": "തൊഴിൽ പോസ്റ്റ് ചെയ്യുക",
            "Find jobs": "തൊഴിൽ കണ്ടെത്തുക",
            "Categories": "വിഭാഗങ്ങൾ",
            "About us": "ഞങ്ങളെക്കുറിച്ച്",
            "Resources": "വിഭവങ്ങൾ",
            "Login": "ലോഗിൻ ചെയ്യുക",
            "Logout": "ലോഗൗട്ട് ചെയ്യുക",
            "Explore Opportunities": "അവസരങ്ങൾ പര്യവേക്ഷണം ചെയ്യുക",
            "Job Categories": "തൊഴിൽ വിഭാഗങ്ങൾ",
            "SECTORS": "മേഖലകൾ",
            "We're Here to Help": "സഹായിക്കാൻ ഞങ്ങൾ ഇവിടെയുണ്ട്",
            "Get in Touch": "ബന്ധപ്പെടുക",
            "Phone Support": "ഫോൺ പിന്തുണ",
            "Email Us": "ഇമെയിൽ അയയ്ക്കുക",
            "Office": "ഓഫീസ്",
            "Find Your Dream Jobs": "നിങ്ങളുടെ സ്വപ്ന ജോലികൾ കണ്ടെത്തുക",
            "Filter Jobs": "ജോലികൾ ഫിൽട്ടർ ചെയ്യുക",
            "Empowering Blue-Collar Professionals": "തൊഴിലാളികളെ ശാക്തീകരിക്കുന്നു",
            "Our Mission": "ഞങ്ങളുടെ ദൗത്യം",
            "Our Vision": "ഞങ്ങളുടെ കാഴ്ചപ്പാട്",
            "Ready to Join the Revolution?": "വിപ്ലവത്തിൽ ചേരാൻ തയ്യാറാണോ?",
            "Find Jobs and": "ജോലികൾ &",
            "Hire Skilled Workers Across India": "തൊഴിലാളികളെ നിയമിക്കുക",
            "I am a worker": "ഞാൻ ഒരു തൊഴിലാളിയാണ്",
            "I am an employer": "ഞാൻ ഒരു തൊഴിലുടമയാണ്",
            "Features": "സവിശേഷതകൾ",
            "Benefits": "നേട്ടങ്ങൾ",
            "PROCESS": "പ്രക്രിയ",
            "FAQ": "പതിവുചോദ്യങ്ങൾ"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
