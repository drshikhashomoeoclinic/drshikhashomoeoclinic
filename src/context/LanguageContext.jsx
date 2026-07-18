import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {},
  bn: {
    Doctor: 'ডাক্তার',
    'How We Help': 'কীভাবে সাহায্য করি',
    'Patient Stories': 'রোগীর অভিজ্ঞতা',
    Gallery: 'গ্যালারি',
    'Health Tips': 'স্বাস্থ্য পরামর্শ',
    Contact: 'যোগাযোগ',
    Call: 'কল',
    Book: 'বুক',
    'Book Appointment': 'অ্যাপয়েন্টমেন্ট বুক করুন',
    'Book a Visit': 'ভিজিট বুক করুন',
    'Get Directions': 'দিকনির্দেশ দেখুন',
    'Meet Your Doctor': 'আপনার ডাক্তারকে জানুন',
    'Read Doctor Profile': 'ডাক্তারের প্রোফাইল দেখুন',
    DoctorLabel: 'ডাক্তার',
    Qualification: 'যোগ্যতা',
    Experience: 'অভিজ্ঞতা',
    Patients: 'রোগী',
    'Patient Journey': 'রোগীর যাত্রা',
    'From health confusion to clear consultation.': 'স্বাস্থ্য নিয়ে বিভ্রান্তি থেকে পরিষ্কার পরামর্শে।',
    'Patients should not feel lost before booking. The website now guides them step by step, from symptom selection to appointment and follow-up.': 'বুকিংয়ের আগে রোগীর যেন বিভ্রান্তি না থাকে। এই ওয়েবসাইট লক্ষণ বাছাই থেকে অ্যাপয়েন্টমেন্ট ও ফলো-আপ পর্যন্ত ধাপে ধাপে গাইড করে।',
    'Confusing symptoms': 'লক্ষণ নিয়ে বিভ্রান্তি',
    'Many patients are unsure whether recurring acidity, hair fall, allergy, headache, or hormonal symptoms need a consultation.': 'অনেক রোগী বুঝতে পারেন না বারবার অ্যাসিডিটি, চুল পড়া, অ্যালার্জি, মাথাব্যথা বা হরমোনজনিত সমস্যায় পরামর্শ দরকার কি না।',
    'No clear next step': 'পরবর্তী ধাপ পরিষ্কার নয়',
    'Patients often do not know what details to share, which reports to bring, or how follow-up will work.': 'রোগীরা অনেক সময় জানেন না কী তথ্য দেবেন, কোন রিপোর্ট আনবেন বা ফলো-আপ কীভাবে হবে।',
    'Delayed care': 'চিকিৎসায় দেরি',
    'Small concerns become stressful when there is no simple way to ask, book, and get guided properly.': 'জিজ্ঞাসা, বুকিং ও সঠিক গাইডেন্সের সহজ উপায় না থাকলে ছোট সমস্যাও চাপের হয়ে যায়।',
    'Share your concern': 'আপনার সমস্যা জানান',
    'Tell us your main symptom, duration, and preferred appointment time.': 'আপনার প্রধান লক্ষণ, কতদিন ধরে হচ্ছে এবং পছন্দের সময় জানান।',
    'Doctor understands your case': 'ডাক্তার আপনার কেস বুঝবেন',
    'Your symptoms, history, triggers, and reports are reviewed carefully.': 'আপনার লক্ষণ, ইতিহাস, ট্রিগার এবং রিপোর্ট মনোযোগ দিয়ে দেখা হবে।',
    'Get personalised care': 'ব্যক্তিগত যত্ন নিন',
    'You receive guidance based on your individual case and follow-up needs.': 'আপনার কেস এবং ফলো-আপ প্রয়োজন অনুযায়ী গাইডেন্স পাবেন।',
    'Continue follow-up': 'ফলো-আপ চালিয়ে যান',
    'The clinic helps you stay clear about next steps after consultation.': 'পরামর্শের পরে পরবর্তী ধাপ পরিষ্কার রাখতে ক্লিনিক সাহায্য করবে।',
    'Years Experience': 'বছরের অভিজ্ঞতা',
    'Happy Patients': 'সন্তুষ্ট রোগী',
    'Qualified Doctor': 'যোগ্য ডাক্তার',
    'Local Clinic': 'স্থানীয় ক্লিনিক',
    'How do I book an appointment?': 'আমি কীভাবে অ্যাপয়েন্টমেন্ট বুক করব?',
    'Tap Book Appointment, call the clinic, or send a WhatsApp message. The clinic will confirm your visit.': 'Book Appointment চাপুন, ক্লিনিকে কল করুন বা WhatsApp মেসেজ পাঠান। ক্লিনিক আপনার ভিজিট নিশ্চিত করবে।',
    'What should I share before consultation?': 'পরামর্শের আগে কী জানাব?',
    'Share your main complaint, age, mobile number, preferred date, and any important medical history.': 'আপনার প্রধান সমস্যা, বয়স, মোবাইল নম্বর, পছন্দের তারিখ এবং গুরুত্বপূর্ণ মেডিক্যাল ইতিহাস জানান।',
    'Where is the clinic located?': 'ক্লিনিক কোথায়?',
    'Can I read patient reviews?': 'আমি কি রোগীর রিভিউ পড়তে পারি?',
    'Yes. You can see patient experiences here and open the official Google review page from the Reviews section.': 'হ্যাঁ। এখানে রোগীর অভিজ্ঞতা দেখতে পারবেন এবং Reviews সেকশন থেকে Google review পেজ খুলতে পারবেন।',
    'Need Help?': 'সাহায্য দরকার?',
    'Call Clinic': 'ক্লিনিকে কল করুন',
    'View More Photos': 'আরও ছবি দেখুন',
    'See All Health Concerns': 'সব স্বাস্থ্য সমস্যা দেখুন',
    Questions: 'প্রশ্ন',
    'Before you book': 'বুক করার আগে',
    'Simple answers for patients visiting or booking for the first time.': 'প্রথমবার ভিজিট বা বুকিং করা রোগীদের জন্য সহজ উত্তর।',
    Appointment: 'অ্যাপয়েন্টমেন্ট',
    'Book your consultation': 'আপনার পরামর্শ বুক করুন',
    'Fill the details once. The clinic will call or WhatsApp you to confirm the final appointment time.': 'একবার তথ্য পূরণ করুন। চূড়ান্ত সময় নিশ্চিত করতে ক্লিনিক কল বা WhatsApp করবে।',
    'Choose your main health concern': 'আপনার প্রধান স্বাস্থ্য সমস্যা বেছে নিন',
    'Tap one option to fill the complaint box faster. You can edit it anytime.': 'দ্রুত complaint box পূরণ করতে একটি অপশন চাপুন। পরে যেকোনো সময় পরিবর্তন করতে পারবেন।',
    'Patient Full Name': 'রোগীর পূর্ণ নাম',
    'Mobile / WhatsApp Number': 'মোবাইল / WhatsApp নম্বর',
    Email: 'ইমেল',
    optional: 'ঐচ্ছিক',
    Age: 'বয়স',
    Gender: 'লিঙ্গ',
    'Select gender': 'লিঙ্গ নির্বাচন করুন',
    Female: 'মহিলা',
    Male: 'পুরুষ',
    Other: 'অন্যান্য',
    'Preferred Date': 'পছন্দের তারিখ',
    'Preferred Time Slot': 'পছন্দের সময়',
    'Select time slot': 'সময় নির্বাচন করুন',
    Address: 'ঠিকানা',
    'Main Health Problem': 'প্রধান স্বাস্থ্য সমস্যা',
    'Additional Notes': 'অতিরিক্ত তথ্য',
    'Request Appointment': 'অ্যাপয়েন্টমেন্ট অনুরোধ করুন',
    Saving: 'সেভ হচ্ছে...',
    'WhatsApp Booking': 'WhatsApp বুকিং',
    'What happens next?': 'এরপর কী হবে?',
    '1. Clinic will review your request.': '১. ক্লিনিক আপনার অনুরোধ দেখবে।',
    '2. You will receive confirmation by call or WhatsApp.': '২. কল বা WhatsApp-এ confirmation পাবেন।',
    '3. Bring any old reports or prescriptions if available.': '৩. পুরোনো রিপোর্ট বা প্রেসক্রিপশন থাকলে সঙ্গে আনুন।',
    'Message on WhatsApp': 'WhatsApp-এ মেসেজ করুন'
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('clinic-language') || 'en');

  useEffect(() => {
    localStorage.setItem('clinic-language', language);
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en';
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage((current) => (current === 'bn' ? 'en' : 'bn')),
    t: (key) => translations[language]?.[key] || key
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
