import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faCrown,
  faSlidersH,
  faCalendar,
  faEuroSign,
  faDollarSign,
  faUniversity,
  faCreditCard,
  faBuilding,
  faFlag,
  faTag,
  faCircle,
  faCheckCircle,
  faTimes,
  faCheck,
  faAdjust,
  faBalanceScale,
  faFilter,
  faSync,
  faChevronUp,
  faChevronDown,
  faChartArea,
  faChartLine,
  faChartPie,
  faChartBar,
  faRecycle,
  faThList,
  faTachometerAlt,
  faRetweet,
  faRocket,
  faPencilAlt,
  faPlusCircle,
  faExclamationCircle,
  faCogs,
  faBookmark,
  faHeart,
  faSave,
  faLanguage,
  faCalendarMinus,
  faCalendarPlus,
  faSortNumericUp,
  faSortNumericDown,
  faSortAlphaDown,
  faSortAlphaUp,
  faTrash,
  faLink,
  faPercent,
  faHashtag,
  faMoneyBill,
  faLiraSign,
  faPoundSign,
  faRubleSign,
  faRupeeSign,
  faYenSign
} from '@fortawesome/free-solid-svg-icons'
import { faCircle as faCircleO } from '@fortawesome/free-regular-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'

library.add(
  faCrown, faSlidersH, faCalendar, faEuroSign, faDollarSign, faUniversity, faCreditCard, faBuilding, faFlag, faTag,
  faCircle, faCircleO, faCheckCircle, faTimes, faCheck, faAdjust, faBalanceScale, faFilter, faSync, faChevronUp,
  faChevronDown, faChartArea, faChartLine, faChartPie, faChartBar, faRecycle, faThList, faTachometerAlt, faRetweet,
  faRocket, faPencilAlt, faPlusCircle, faExclamationCircle, faCogs, faBookmark, faHeart, faSave, faLanguage,
  faCalendarMinus, faCalendarPlus, faSortNumericUp, faSortNumericDown, faSortAlphaDown, faSortAlphaUp, faTrash, faLink,
  faPercent, faHashtag, faMoneyBill, faBitcoin, faLiraSign, faPoundSign, faRubleSign, faRupeeSign, faYenSign
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
