import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pt from "../locales/pt.json"
import en from "../locales/en.json"
import jp from "../locales/jp.json"

i18n.use(initReactI18next).init(
    {
        lng:"pt", // idioma padrão
        fallbackLng:"en",
        resources:{
            pt:{translation:pt},
            en:{translation:en},
            jp:{translation:jp}
        },
        interpolation:{
            escapeValue:false
        }
    }
)
export default i18n