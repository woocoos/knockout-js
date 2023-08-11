import { Locale } from ".";
import AppSelect from "../app-select/locale/en_US";
import AppModal from "../app-modal/locale/en_US";
import OrgSelect from "../org-select/locale/en_US";
import OrgModal from "../org-modal/locale/en_US";
import UserSelect from "../user-select/locale/en_US";
import UserModal from "../user-modal/locale/en_US";

const localeValues: Locale = {
  locale: 'en-us',
  global: {
    query: 'query',
    reset: 'reset',
  },
  OrgSelect,
  OrgModal,
  AppSelect,
  AppModal,
  UserSelect,
  UserModal,
}

export default localeValues
