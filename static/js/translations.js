const TRANSLATIONS = {
  en: {
    appTitle: "AI Clinical Diagnostic Suite",
    appSubtitle: "Simple, Fast & Accessible Healthcare for Everyone",
    langToggle: "हिन्दी में बदलें",
    loginHeading: "Patient Registration",
    loginSub: "Please fill in your basic information before beginning the checkup.",
    lblName: "Full Name *",
    lblAge: "Age (Years) *",
    lblGender: "Gender *",
    lblContact: "Mobile Number / Email *",
    btnRegister: "Start Health Checkup",
    greeting: "Welcome,",
    chooseInstruction: "Tap on the condition or test you would like to inspect today:",
    cityTag: "City",
    modulesTitle: "Select Condition / अंग चुनें",
    sympSub: "Select the response that best describes your feelings:",
    btnRunCheck: "Analyze Health Risk Now",
    imgSub: "Provide a clear photo of the affected area or X-ray:",
    btnUpload: "Select Image File",
    camSub: "Live mobile/webcam snapshot",
    btnScanImg: "Scan & Analyze Visual Biomarkers",
    diagReportTitle: "Health Risk Assessment Result",
    probLabel: "Estimated Risk Probability",
    explTitle: "Clinical Findings & Observations:",
    remTitle: "Safe Everyday Care & Home Remedies:",
    btnDlReport: "Download Diagnostic Report (PDF)",
    docHeading: "Top Specialists & Consultation Slots",
    docSub: "Verified hospital doctors available near your location.",
    btnDlSlip: "Download Appointment Slip & Bill (PDF)",
    aiTitle: "24/7 AI Health Assistant",
    aiStatus: "● Online Instant Help",
    aiWelcome: "Hello! I am your 24/7 Health Assistant. You can ask me any health questions, symptom doubts, or clinic timings in English or Hindi!",
    aiPlaceholder: "Ask a health question...",
    selectSlot: "Select Slot:",
    btnBook: "Book Slot",
    bookingSuccessTitle: "Appointment Confirmed!",
    riskLow: "Low Probability - Manage with Home Care",
    riskHigh: "Elevated Probability - Specialist Consultation Advised"
  },
  hi: {
    appTitle: "एआई डिजिटल स्वास्थ्य एवं जाँच केंद्र",
    appSubtitle: "सरल, तीव्र एवं जन-जन के लिए सुलभ स्वास्थ्य सेवा",
    langToggle: "Switch to English",
    loginHeading: "मरीज का पंजीकरण",
    loginSub: "जाँच शुरू करने से पहले कृपया अपनी सामान्य जानकारी भरें।",
    lblName: "पूरा नाम *",
    lblAge: "उम्र (वर्ष) *",
    lblGender: "लिंग *",
    lblContact: "मोबाइल नंबर या ईमेल *",
    btnRegister: "स्वास्थ्य जाँच शुरू करें",
    greeting: "स्वागत है,",
    chooseInstruction: "जिस बीमारी या अंग की जाँच करनी है, उस पर टैप करें:",
    cityTag: "शहर",
    modulesTitle: "जाँच हेतु बीमारी अथवा अंग चुनें",
    sympSub: "नीचे दिए गए लक्षणों में से अपनी स्थिति चुनें:",
    btnRunCheck: "अभी स्वास्थ्य जोखिम जाँचें",
    imgSub: "प्रभावित अंग अथवा एक्स-रे की साफ फोटो दें:",
    btnUpload: "फोटो फाइल चुनें",
    camSub: "मोबाइल अथवा वेबकैम से लाइव फोटो लें",
    btnScanImg: "फोटो के लक्षणों की जाँच करें",
    diagReportTitle: "स्वास्थ्य जाँच परिणाम सारांश",
    probLabel: "संभावित जोखिम दर",
    explTitle: "जाँच के मुख्य बिंदु एवं निष्कर्ष:",
    remTitle: "घर पर किए जाने वाले सरल घरेलू उपाय व सावधानियां:",
    btnDlReport: "जाँच रिपोर्ट डाउनलोड करें (PDF)",
    docHeading: "नजदीकी विशेषज्ञ डॉक्टर एवं उपलब्ध समय",
    docSub: "आपके शहर के सत्यापित अस्पताल एवं डॉक्टर।",
    btnDlSlip: "डॉक्टर पर्ची व बिल रसीद डाउनलोड करें (PDF)",
    aiTitle: "24 घंटे उपलब्ध एआई डॉक्टर सहायक",
    aiStatus: "● तुरंत ऑनलाइन सहायता उपलब्ध",
    aiWelcome: "नमस्ते! मैं आपका 24/7 स्वास्थ्य सहायक हूँ। आप मुझसे किसी भी बीमारी, लक्षण या डॉक्टर अपॉइंटमेंट के बारे में पूछ सकते हैं।",
    aiPlaceholder: "स्वास्थ्य संबंधी कोई भी सवाल पूछें...",
    selectSlot: "समय चुनें:",
    btnBook: "अपॉइंटमेंट बुक करें",
    bookingSuccessTitle: "अपॉइंटमेंट सफलतापूर्वक दर्ज हुआ!",
    riskLow: "कम जोखिम - सामान्य घरेलू देखभाल करें",
    riskHigh: "अधिक जोखिम - डॉक्टर से परामर्श लेना आवश्यक है"
  }
};

const MODULES_DATA = [
  {
    id: "diabetes",
    icon: "fa-droplet",
    color: "bg-blue-50 text-blue-600",
    specialist: "Endocrinologist",
    titleEn: "Type-2 Diabetes",
    titleHi: "मधुमेह (शुगर)",
    descEn: "Thirst, urination & energy check",
    descHi: "प्यास, पेशाब व थकान की जाँच",
    isVisual: false,
    questionsEn: [
      { q: "Do you experience excessive thirst or dry mouth?", opts: ["Normal thirst", "Frequently thirsty", "Constantly very thirsty"] },
      { q: "Do you wake up multiple times at night to urinate?", opts: ["No", "1-2 times", "3 or more times"] },
      { q: "Do minor cuts or scrapes heal slowly?", opts: ["Normal healing", "Slightly slow", "Takes weeks or months"] },
      { q: "Do you experience extreme fatigue after meals?", opts: ["Feeling fine", "Occasional drowsiness", "Constant severe fatigue"] }
    ],
    questionsHi: [
      { q: "क्या आपको बहुत ज्यादा प्यास लगती है या गला बार-बार सूखता है?", opts: ["सामान्य प्यास", "अक्सर प्यास लगना", "लगातार बहुत तेज प्यास"] },
      { q: "क्या रात में पेशाब के लिए बार-बार उठना पड़ता है?", opts: ["नहीं", "रात में 1 या 2 बार", "3 या उससे अधिक बार"] },
      { q: "क्या छोटी चोट या घाव सूखने में लंबा समय लगता है?", opts: ["सामान्य गति से", "थोड़ा धीरे", "हफ्तों या महीनों तक नहीं सूखता"] },
      { q: "क्या खाना खाने के बाद बहुत अधिक सुस्ती या थकान महसूस होती है?", opts: ["नहीं", "कभी-कभार", "हमेशा बहुत थकान रहती है"] }
    ]
  },
  {
    id: "heart",
    icon: "fa-heart-pulse",
    color: "bg-rose-50 text-rose-600",
    specialist: "Cardiologist",
    titleEn: "Heart & BP Health",
    titleHi: "दिल व रक्तचाप (BP)",
    descEn: "Chest pressure, breath & swelling",
    descHi: "सीने में भारीपन व सांस फूलना",
    isVisual: false,
    questionsEn: [
      { q: "Do you feel tightness, squeezing, or heaviness in chest?", opts: ["Never", "Only on stairs/exertion", "Frequent tightness/pain"] },
      { q: "Do you get out of breath easily when walking?", opts: ["Normal breathing", "Mild shortness of breath", "Severe breathlessness"] },
      { q: "Do your ankles or feet swell up by evening?", opts: ["No swelling", "Slight puffiness", "Noticeable heavy swelling"] },
      { q: "Do you have a prior history of high blood pressure?", opts: ["Normal BP", "Borderline high", "Known high BP / medication"] }
    ],
    questionsHi: [
      { q: "क्या सीने में जकड़न, दबाव या भारीपन महसूस होता है?", opts: ["कभी नहीं", "सीढ़ी चढ़ने या तेज चलने पर", "अक्सर भारीपन व दर्द"] },
      { q: "क्या थोड़ा चलने पर भी सांस फूलने लगती है?", opts: ["सामान्य सांस", "हल्की सांस फूलती है", "अत्यधिक सांस फूलती है"] },
      { q: "क्या शाम को पैरों या टखनों में सूजन आ जाती है?", opts: ["कोई सूजन नहीं", "हल्की सूजन", "साफ दिखने वाली सूजन"] },
      { q: "क्या आपको पूर्व में हाई ब्लड प्रेशर (उच्च रक्तचाप) की शिकायत है?", opts: ["सामान्य रहता है", "कभी-कभार बढ़ता है", "दवा अधीन हाई बीपी"] }
    ]
  },
  {
    id: "parkinsons",
    icon: "fa-hand-dots",
    color: "bg-amber-50 text-amber-600",
    specialist: "Neurologist",
    titleEn: "Parkinson's & Nerves",
    titleHi: "पार्किंसंस / नसों का रोग",
    descEn: "Hand tremors, voice & stiffness",
    descHi: "हाथ में कंपन व शरीर में अकड़न",
    isVisual: false,
    questionsEn: [
      { q: "Do your hands, fingers or chin shake while resting?", opts: ["No tremors", "Occasional mild tremor", "Frequent resting tremor"] },
      { q: "Has your voice become softer, raspy or fading?", opts: ["Clear crisp voice", "Mildly soft", "Very weak / hard to hear"] },
      { q: "Do you feel muscle stiffness when standing up?", opts: ["Free movement", "A bit stiff", "Very slow / difficult to rise"] },
      { q: "Has your handwriting or walking steps become unusually small?", opts: ["Normal", "Slightly smaller", "Significantly small/shuffling"] }
    ],
    questionsHi: [
      { q: "क्या आराम करते समय हाथ, उंगलियों या ठोड़ी में कंपन होता है?", opts: ["कोई कंपन नहीं", "कभी-कभार हल्का कंपन", "नियमित साफ कंपन"] },
      { q: "क्या आपकी आवाज़ धीमी, अस्पष्ट या भारी हो गई है?", opts: ["साफ सामान्य आवाज़", "हल्की धीमी", "बहुत कमजोर / सुनने में कठिन"] },
      { q: "क्या कुर्सी से उठने या चलने में शरीर में भारी अकड़न लगती है?", opts: ["सामान्य चाल", "थोड़ी अकड़न", "उठने-चलने में बहुत परेशानी"] },
      { q: "क्या लिखावट अथवा चलने के कदम असामान्य रूप से छोटे हो गए हैं?", opts: ["सामान्य", "थोड़े छोटे हुए हैं", "काफी छोटे व धीमी चाल"] }
    ]
  },
  {
    id: "kidney",
    icon: "fa-shield-halved",
    color: "bg-teal-50 text-teal-600",
    specialist: "Nephrologist",
    titleEn: "Kidney & Urine",
    titleHi: "गुर्दा व किडनी की सेहत",
    descEn: "Facial puffiness, urine color & foam",
    descHi: "चेहरे पर सूजन व पेशाब में झाग",
    isVisual: false,
    questionsEn: [
      { q: "Do you wake up with puffy eyes or face swelling?", opts: ["No swelling", "Mild puffiness", "Noticeable daily swelling"] },
      { q: "Is your urine foamy, dark red or tea-colored?", opts: ["Normal light yellow", "Slightly cloudy", "Very foamy or dark"] },
      { q: "Has your total daily urine volume dropped significantly?", opts: ["Normal volume", "Slightly less", "Very little urine passed"] },
      { q: "Do you experience a metallic taste in mouth and loss of appetite?", opts: ["Normal appetite", "Mild metallic taste", "No appetite / constant nausea"] }
    ],
    questionsHi: [
      { q: "क्या सुबह उठने पर आंखों के नीचे या चेहरे पर सूजन दिखती है?", opts: ["कोई सूजन नहीं", "हल्का भारीपन", "रोज सुबह साफ सूजन"] },
      { q: "क्या पेशाब में अत्यधिक झाग, लालिमा या गहरा रंग आता है?", opts: ["सामान्य हल्का पीला", "थोड़ा धुंधला", "बहुत ज्यादा झागदार या गहरा"] },
      { q: "क्या पूरे दिन में पेशाब की कुल मात्रा काफी कम हो गई है?", opts: ["सामान्य आता है", "थोड़ा कम हुआ है", "बहुत ही कम पेशाब आता है"] },
      { q: "क्या मुंह का स्वाद कड़वा/धातु जैसा रहता है और भूख बिल्कुल नहीं लगती?", opts: ["अच्छी भूख लगती है", "हल्का कड़वा स्वाद", "भूख खत्म और उल्टी का मन"] }
    ]
  },
  {
    id: "liver",
    icon: "fa-utensils",
    color: "bg-orange-50 text-orange-600",
    specialist: "Gastroenterologist",
    titleEn: "Liver & Digestion",
    titleHi: "लिवर व पाचन तंत्र",
    descEn: "Yellow eyes, belly ache & jaundice",
    descHi: "आंखों में पीलापन व पेट दर्द",
    isVisual: false,
    questionsEn: [
      { q: "Have your eyes or nails developed a yellowish tint?", opts: ["Normal white/pink", "Slight yellow tint", "Deep yellow (Jaundice signs)"] },
      { q: "Do you feel persistent heaviness in right upper belly?", opts: ["No discomfort", "Mild fullness", "Noticeable ache or swelling"] },
      { q: "Do you experience severe unexplained tiredness and nausea?", opts: ["Energetic", "Mild fatigue", "Constant exhaustion & vomiting urge"] },
      { q: "Any regular history of alcohol use or past jaundice/hepatitis?", opts: ["None", "Occasional", "Frequent / long-term history"] }
    ],
    questionsHi: [
      { q: "क्या आंखों या नाखूनों में पीलापन (पीलिया के लक्षण) दिख रहा है?", opts: ["रंग बिल्कुल सामान्य है", "हल्का पीलापन", "साफ गहरा पीलापन"] },
      { q: "क्या पेट के ऊपरी दाहिने हिस्से में लगातार दर्द या भारीपन रहता है?", opts: ["कोई दर्द नहीं", "हल्का भारीपन", "साफ दर्द या पेट की सूजन"] },
      { q: "क्या बिना वजह बहुत ज्यादा कमजोरी और जी मिचलाने की शिकायत है?", opts: ["स्वस्थ अनुभव", "हल्की थकान", "लगातार जी मिचलाना व कमजोरी"] },
      { q: "क्या शराब का सेवन अथवा पहले कभी पीलिया / हेपेटाइटिस का इतिहास रहा है?", opts: ["कभी नहीं", "कभी-कभार", "अक्सर अथवा पुराना इतिहास"] }
    ]
  },
  {
    id: "cancer",
    icon: "fa-ribbon",
    color: "bg-pink-50 text-pink-600",
    specialist: "Oncologist",
    titleEn: "Breast Health / Lump",
    titleHi: "स्तन स्वास्थ्य व गांठ जाँच",
    descEn: "Tissue firmness, dimpling & pain",
    descHi: "कड़ी गांठ, सिकुड़न व खिंचाव",
    isVisual: false,
    questionsEn: [
      { q: "Have you noticed any firm or painless lump in breast or armpit?", opts: ["No lumps found", "Soft movable bump", "Firm / hard fixed lump"] },
      { q: "Is there dimpling or orange-peel skin texture?", opts: ["Smooth normal skin", "Mild redness", "Visible skin dimpling"] },
      { q: "Has there been sudden nipple retraction or fluid discharge?", opts: ["Normal appearance", "Minor soreness", "Inverted nipple or unusual fluid"] },
      { q: "Do you feel persistent localized pain unrelated to monthly cycle?", opts: ["No pain", "Occasional soreness", "Continuous focal pain"] }
    ],
    questionsHi: [
      { q: "क्या स्तन अथवा कांख में कोई सख्त या बिना दर्द वाली गांठ महसूस हुई है?", opts: ["कोई गांठ नहीं है", "नरम गांठ", "सख्त, कड़ी या बढ़ती गांठ"] },
      { q: "क्या त्वचा पर संतरे के छिलके जैसे गड्ढे या सिकुड़न दिखती है?", opts: ["सामान्य चिकनी त्वचा", "हल्की लाली", "साफ गड्ढे अथवा खिंचाव"] },
      { q: "क्या निप्पल अंदर की ओर मुड़ गया है या असामान्य पानी/स्राव आ रहा है?", opts: ["सामान्य स्थिति", "हल्की जलन", "निप्पल अंदर धंसना या पानी आना"] },
      { q: "क्या बिना किसी कारण स्तन में लगातार गहरा खिंचाव या दर्द रहता है?", opts: ["कोई दर्द नहीं", "हल्का सामयिक दर्द", "लगातार बना रहने वाला दर्द"] }
    ]
  },
  {
    id: "stroke",
    icon: "fa-brain",
    color: "bg-purple-50 text-purple-600",
    specialist: "Neurologist",
    titleEn: "Brain & Stroke Warning",
    titleHi: "लकवा / ब्रेन स्ट्रोक",
    descEn: "Face droop, arm weakness & speech",
    descHi: "चेहरा ढलकना, हाथ में कमजोरी",
    isVisual: false,
    questionsEn: [
      { q: "Sudden facial droop or uneven smile when attempting to smile?", opts: ["Symmetric normal smile", "Mild subjective tingling", "Noticeable one-sided droop"] },
      { q: "When raising both arms, does one arm drift downwards?", opts: ["Both arms strong", "One arm slightly weak", "One arm completely falls / numb"] },
      { q: "Sudden slurred speech, confusion, or difficulty speaking?", opts: ["Speech is crisp", "Mild slurring", "Severe slurring or unable to speak"] },
      { q: "Sudden loss of balance, extreme dizziness, or explosive headache?", opts: ["Normal balance", "Mild dizziness", "Severe room-spinning vertigo / intense pain"] }
    ],
    questionsHi: [
      { q: "क्या मुस्कुराने का प्रयास करने पर चेहरे का एक हिस्सा ढलक जाता है?", opts: ["समान मुस्कान", "हल्की सुन्नता", "साफ एक तरफ चेहरा ढलका हुआ"] },
      { q: "दोनों हाथ ऊपर उठाने पर क्या एक हाथ नीचे की तरफ गिर जाता है?", opts: ["दोनों हाथ मजबूत हैं", "एक हाथ थोड़ा कमजोर", "एक हाथ उठ नहीं पा रहा"] },
      { q: "क्या अचानक बोली लड़खड़ाने लगी अथवा शब्द साफ नहीं निकल रहे?", opts: ["आवाज़ साफ है", "हल्की लड़खड़ाहट", "गंभीर लड़खड़ाहट / बोल न पाना"] },
      { q: "क्या अचानक संतुलन बिगड़ा, चक्कर आए या भीषण तेज सिरदर्द हुआ?", opts: ["संतुलन ठीक है", "हल्के चक्कर", "कमरे का घूमना, गिरना या भीषण दर्द"] }
    ]
  },
  {
    id: "skin",
    icon: "fa-allergies",
    color: "bg-emerald-50 text-emerald-600",
    specialist: "Dermatologist",
    titleEn: "Skin Lesion / Rash",
    titleHi: "त्वचा रोग / चकत्ते (फोटो)",
    descEn: "Visual camera check for rashes & allergy",
    descHi: "दाद, खाज, चकत्ते की फोटो जाँच",
    isVisual: true
  },
  {
    id: "eye",
    icon: "fa-eye",
    color: "bg-cyan-50 text-cyan-600",
    specialist: "Ophthalmologist",
    titleEn: "Eye Health / Cataract",
    titleHi: "नेत्र रोग / मोतियाबिंद (फोटो)",
    descEn: "Visual inspection for cloudiness & redness",
    descHi: "आंख की पुतली व लाली की फोटो जाँच",
    isVisual: true
  },
  {
    id: "fracture",
    icon: "fa-bone",
    color: "bg-indigo-50 text-indigo-600",
    specialist: "Orthopedic Specialist",
    titleEn: "Bone Fracture (X-Ray)",
    titleHi: "हड्डी फ्रैक्चर (एक्स-रे फोटो)",
    descEn: "X-ray photo analysis for trauma & cracks",
    descHi: "हड्डी की चोट व एक्स-रे फोटो जाँच",
    isVisual: true
  }
];