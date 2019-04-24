import tw from './zw-tw';
import en from './en';

const locale = {
    changeLang: function(lang) {
        return supportedLocale[lang].textPackage;
    }
    
}

export const supportedLocale = {
    tw: {
        name:'中文(zh-TW)',
        abbr: 'tw',
        textPackage: tw,
    },
    en: {
        name:'English(en-US)',
        abbr: 'en',
        textPackage: en,
    }
}

export default locale;


