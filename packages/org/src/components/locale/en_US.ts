import { Locale } from ".";
import AppSelect from "../app-select/locale/en_US";

const localeValues: Locale = {
  locale: 'en-us',
  global: {
    query: 'query',
    reset: 'reset',
  },
  OrgInput: {
    placeholder: 'click to search',
    title: "organizational search",
  },
  OrgModal: {
    name: 'organizational name',
    code: 'organizational code',
    domain: 'organizational domain',
    owner: 'administrative account',
    desc: 'organizational description',
  },
  AppSelect
}

export default localeValues
