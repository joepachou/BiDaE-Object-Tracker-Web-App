import React from 'react';

const LocaleContext = React.createContext({
    lang: '',
    texts: {},
    changeLocale: () => {},
    toggleLang: () => {},
});

export default LocaleContext;