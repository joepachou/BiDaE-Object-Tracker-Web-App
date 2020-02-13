import tw from '../locale/zh-TW';
import en from '../locale/en-US';
import React from 'react'
import LocaleContext from './context/LocaleContext'
import config from './config';
import { 
    setLocaleID,
    getLocaleID
} from "../js/dataSrc"
import axios from 'axios';
import Cookies from 'js-cookie';

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
        abbr: 'en',
        texts: en,
    }
}

class Locale extends React.Component {

    state = {
        lang:  Cookies.get('locale') ? Cookies.get('locale') : config.locale.defaultLocale,
        texts: Cookies.get('locale') ? supportedLocale[Cookies.get('locale')].texts : supportedLocale[config.locale.defaultLocale].texts,
        abbr:  Cookies.get('locale') ? supportedLocale[Cookies.get('locale')].abbr : supportedLocale[config.locale.defaultLocale].abbr,
    }

    changeTexts = (lang) => {
        return supportedLocale[lang].texts;
    }

    changeAbbr = (lang) => {
        return supportedLocale[lang].abbr;
    }

    toggleLang = () => {
        const langArray = Object.keys(supportedLocale)
        const nextLang = langArray.filter(item => item !== this.state.lang).pop()
        return {
            nextLang,
            nextLangName: supportedLocale[nextLang].name
        }
    }


    changeLocale = (e,auth) => {
        const nextLang = this.toggleLang().nextLang
        axios.post(getLocaleID, {
            lang: nextLang
        })
        .then(resGet => {
                axios.post(setLocaleID, {
                    userID: auth.user.id,
                    lang: resGet.data.rows[0].id
                })
                .then(resSet => {
                    Cookies.set('locale', nextLang)
                })
                .catch(errSet => {
                    console.log(errSet)
                })
        })
        .catch(err => {
            console.log(err)
        })

        this.setState({
            lang: nextLang,
            texts: this.changeTexts(nextLang),
            abbr: this.changeAbbr(nextLang),            
        })

    }
    

    reSetState = () => {
        this.setState({
            lang: Cookies.get('locale'),
            texts: this.changeTexts(Cookies.get('locale')),
            abbr: this.changeAbbr(Cookies.get('locale')),            
        })
    }


    render() {
        const localeProviderValue = {
            ...this.state,
            changeLocale: this.changeLocale,
            toggleLang: this.toggleLang,
            reSetState : this.reSetState,
        };

       
        return (
            <LocaleContext.Provider value={localeProviderValue}>
                {this.props.children}
            </LocaleContext.Provider>
        )
    }

}

export default Locale;


