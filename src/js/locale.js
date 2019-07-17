import tw from '../locale/zw-TW';
import en from '../locale/en-US';

const locale = {
    changeLocale: function(lang) {
        return supportedLocale[lang].textPackage;
    }
    
}

export const supportedLocale = {
    tw: {
        name:'中文',
        abbr: 'tw',
        textPackage: tw,
    },
    en: {
        name:'English',
        abbr: 'en',
        textPackage: en,
    }
}

export default locale;


