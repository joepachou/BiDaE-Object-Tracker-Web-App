import tw from '../locale/zw-tw';
import en from '../locale/en';

const locale = {
    changeLocale: function(lang) {
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


