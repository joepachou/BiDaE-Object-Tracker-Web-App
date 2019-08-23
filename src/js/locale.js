import tw from '../locale/zw-TW';
import en from '../locale/en-US';
import React from 'react'
import LocaleContext from './context/LocaleContext'
import config from './config';

const supportedLocale = {
    tw: {
        name:'中文',
        lang: 'tw',
        abbr: 'zh-tw',
        texts: tw,
    },
    en: {
        name:'English',
        lang: 'en',
        abbr: 'en-US',
        texts: en,
    }
}


class Locale extends React.Component {
    state = {
        lang: config.locale.defaultLocale,
        texts: supportedLocale[config.locale.defaultLocale].texts,
    }

    changeTexts = (lang) => {
        return supportedLocale[lang].texts;
    }

    toggleLang = () => {
        const langArray = Object.keys(supportedLocale)
        const nextLang = langArray.filter(item => item !== this.state.lang).pop()
        return {
            nextLang,
            nextLangName: supportedLocale[nextLang].name
        }
    }

    changeLocale = (e) => {
        const nextLang = this.toggleLang().nextLang
        this.setState({
            lang: nextLang,
            texts: this.changeTexts(nextLang)
        })

    }
    
    render() {
        const localeProviderValue = {
            ...this.state,
            changeLocale: this.changeLocale,
            toggleLang: this.toggleLang,
        };
        return (
            <LocaleContext.Provider value={localeProviderValue}>
                {this.props.children}
            </LocaleContext.Provider>
        )
    }

}

export default Locale;


