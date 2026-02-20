import { ChatGPTService } from './ChatGPTService';

export class TranslationService {
  static {
    // Check if OpenAI API key is available
    if (process.env.OPENAI_API_KEY) {
      console.log('✅ ChatGPT translation service initialized');
    } else {
      console.log('ℹ️ No OpenAI API key found, using mock translations');
    }
  }

  static async translate(
    text: string, 
    sourceLang: string = 'it', 
    targetLang: string = 'en'
  ): Promise<string> {
    try {
      // Use ChatGPT for translation
      if (process.env.OPENAI_API_KEY) {
        const translation = await ChatGPTService.translate(text, sourceLang, targetLang);
        return translation;
      }

      // Fallback to mock translations if no API key
      return this.getMockTranslation(text);
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to mock translation on error
      return this.getMockTranslation(text);
    }
  }

  static async translateBatch(
    texts: string[], 
    sourceLang: string = 'it', 
    targetLang: string = 'en'
  ): Promise<string[]> {
    try {
      // Use ChatGPT for batch translation
      if (process.env.OPENAI_API_KEY) {
        // Translate each text individually (ChatGPT doesn't have native batch support)
        const translations = await Promise.all(
          texts.map(text => ChatGPTService.translate(text, sourceLang, targetLang))
        );
        return translations;
      }

      // Fallback to mock translations
      return texts.map(text => this.getMockTranslation(text));
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts.map(text => this.getMockTranslation(text));
    }
  }

  static async detectLanguage(text: string): Promise<string> {
    try {
      // Simple language detection based on common patterns
      // (ChatGPT doesn't have a dedicated language detection endpoint)
      if (/[àèéìíîòóùú]/.test(text)) {
        return 'it'; // Italian
      }
      if (/[ñ]/.test(text)) {
        return 'es'; // Spanish
      }
      if (/[äöüß]/.test(text)) {
        return 'de'; // German
      }
      if (/[ç]/.test(text)) {
        return 'fr'; // French
      }
      
      return 'en'; // Default to English
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }

  private static getMockTranslation(text: string): string {
    const translations: Record<string, string> = {
      // Common Italian phrases
      'Ciao, come stai?': 'Hello, how are you?',
      'Sono molto felice di vederti oggi.': 'I am very happy to see you today.',
      'Parliamo di cibo italiano.': "Let's talk about Italian food.",
      'Mi piace molto la pasta.': 'I really like pasta.',
      'La pizza è deliziosa.': 'The pizza is delicious.',
      'Dove vai domani?': 'Where are you going tomorrow?',
      'Vado al cinema con i miei amici.': "I'm going to the cinema with my friends.",
      'Buongiorno!': 'Good morning!',
      'Buonasera!': 'Good evening!',
      'Grazie mille!': 'Thank you very much!',
      'Prego!': "You're welcome!",
      'Come ti chiami?': 'What is your name?',
      'Mi chiamo...': 'My name is...',
      'Piacere di conoscerti!': 'Nice to meet you!',
      'Arrivederci!': 'Goodbye!',
      'Come va?': 'How is it going?',
      'Molto bene, grazie.': 'Very well, thank you.',
      'Non c\'è di che.': "Don't mention it.",
      'Scusi, non ho capito.': 'Sorry, I didn\'t understand.',
      'Può ripetere, per favore?': 'Can you repeat, please?',
      'Parla più lentamente.': 'Speak more slowly.',
      'Che ora è?': 'What time is it?',
      'Sono le tre.': 'It\'s three o\'clock.',
      'Dove si trova la stazione?': 'Where is the station?',
      'È vicino al centro.': 'It\'s near the center.',
      'Quanto costa?': 'How much does it cost?',
      'È troppo caro.': 'It\'s too expensive.',
      'Posso avere lo sconto?': 'Can I have a discount?',
      'Accettate carte di credito?': 'Do you accept credit cards?',
      'Vorrei prenotare un tavolo.': 'I would like to book a table.',
      'Per due persone.': 'For two people.',
      'Il menu, per favore.': 'The menu, please.',
      'Cosa mi consiglia?': 'What do you recommend?',
      'Sono vegetariano.': 'I am vegetarian.',
      'Ho un\'allergia alle noci.': 'I have a nut allergy.',
      'L\'acqua, per favore.': 'Water, please.',
      'Il conto, per favore.': 'The bill, please.',
      'È tutto incluso?': 'Is everything included?',
      'Posso pagare separatamente?': 'Can I pay separately?',
      'Buon appetito!': 'Enjoy your meal!',
      'Era delizioso!': 'It was delicious!',
      'Il servizio è stato ottimo.': 'The service was excellent.',
      'Tornerò sicuramente.': 'I will definitely come back.',
      'Grazie per la bella serata.': 'Thank you for the lovely evening.'
    };

    // Check for exact match first
    if (translations[text]) {
      return translations[text];
    }

    // Check for partial matches
    for (const [italian, english] of Object.entries(translations)) {
      if (text.toLowerCase().includes(italian.toLowerCase()) || 
          italian.toLowerCase().includes(text.toLowerCase())) {
        return english;
      }
    }

    // If no translation found, return a placeholder
    return `[Translation needed for: ${text}]`;
  }

  static getSupportedLanguages(): string[] {
    return [
      'it', // Italian
      'en', // English
      'es', // Spanish
      'fr', // French
      'de', // German
      'pt', // Portuguese
      'ru', // Russian
      'ja', // Japanese
      'ko', // Korean
      'zh', // Chinese
      'ar', // Arabic
      'hi', // Hindi
      'nl', // Dutch
      'sv', // Swedish
      'no', // Norwegian
      'da', // Danish
      'fi', // Finnish
      'pl', // Polish
      'tr', // Turkish
      'th', // Thai
      'vi', // Vietnamese
      'id', // Indonesian
      'ms', // Malay
      'tl', // Filipino
      'he', // Hebrew
      'uk', // Ukrainian
      'cs', // Czech
      'hu', // Hungarian
      'ro', // Romanian
      'bg', // Bulgarian
      'hr', // Croatian
      'sk', // Slovak
      'sl', // Slovenian
      'et', // Estonian
      'lv', // Latvian
      'lt', // Lithuanian
      'el', // Greek
      'is', // Icelandic
      'ga', // Irish
      'mt', // Maltese
      'cy', // Welsh
      'eu', // Basque
      'ca', // Catalan
      'gl', // Galician
      'af', // Afrikaans
      'sw', // Swahili
      'am', // Amharic
      'az', // Azerbaijani
      'be', // Belarusian
      'bn', // Bengali
      'bs', // Bosnian
      'ceb', // Cebuano
      'co', // Corsican
      'eo', // Esperanto
      'fa', // Persian
      'gu', // Gujarati
      'ha', // Hausa
      'haw', // Hawaiian
      'iw', // Hebrew
      'jv', // Javanese
      'ka', // Georgian
      'kk', // Kazakh
      'km', // Khmer
      'kn', // Kannada
      'ku', // Kurdish
      'ky', // Kyrgyz
      'lo', // Lao
      'lb', // Luxembourgish
      'mk', // Macedonian
      'mg', // Malagasy
      'ml', // Malayalam
      'mn', // Mongolian
      'mr', // Marathi
      'my', // Myanmar
      'ne', // Nepali
      'ny', // Chichewa
      'ps', // Pashto
      'pa', // Punjabi
      'si', // Sinhala
      'sm', // Samoan
      'sn', // Shona
      'so', // Somali
      'su', // Sundanese
      'tg', // Tajik
      'ta', // Tamil
      'te', // Telugu
      'uz', // Uzbek
      'xh', // Xhosa
      'yi', // Yiddish
      'yo', // Yoruba
      'zu'  // Zulu
    ];
  }
}
