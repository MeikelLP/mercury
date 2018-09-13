<template>
  <div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label for="theme" class="label">{{'SETTINGS.TABS.GENERAL.THEME' | translate}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <span class="select is-fullwidth">
              <select id="theme" name="theme" v-model="settings.theme">
                <option v-for="theme in themes" :key="theme.key" :value="theme.key">{{ configTranslation(theme.name) }}</option>
              </select>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label for="dateFormat" class="label">{{'SETTINGS.TABS.GENERAL.DATEFORMAT' | translate}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input id="dateFormat" type="text" class="input" v-model="settings.dateFormat"
                   :placeholder="'SETTINGS.TABS.GENERAL.SAMPLE_CALENDAR' | translate">
            <small class="is-small">{{'SETTINGS.TABS.GENERAL.TEST' | translate}}: {{ dateFormatTester }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label for="lang" class="label">{{'SETTINGS.TABS.GENERAL.LANGUAGE' | translate}}</label>
      </div>
      <div class="field-body">
        <div class="field has-addons">
          <div class="control">
            <a class="button is-tag is-primary">
              <font-awesome-icon icon="language"/>
            </a>
          </div>
          <div class="control is-expanded">
            <span class="select is-fullwidth">
              <select id="lang" v-model="settings.language">
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="pl">Polish</option>
              </select>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label for="currency" class="label">{{'SETTINGS.TABS.GENERAL.DEFAULT_CURRENCY' | translate}}</label>
      </div>
      <div class="field-body">
        <div class="field has-addons">
          <div class="control">
            <a class="button is-tag is-primary">
              <font-awesome-icon :icon="currencyIcon(settings.defaultCurrency)" fixed-width/>
            </a>
          </div>
          <div class="control is-expanded">
            <span class="select is-fullwidth">
              <select id="currency" v-model="settings.defaultCurrency">
                <option :value="currency.key" v-for="currency in currencies" :key="currency.key">{{configTranslation(currency.name)}}
                </option>
                <option value="money">{{ 'CURRENCIES.OTHER' | translate }}</option>
              </select>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label for="timeSpan" class="label">{{'SETTINGS.TABS.GENERAL.RECURRING' | translate}}</label>
      </div>
      <div class="field-body">
        <div class="field has-addons">
          <div class="control is-expanded">
            <input class="input" type="number" min="1" v-model="settings.defaultOffset">
          </div>
          <div class="control is-expanded select">
            <span class="select is-fullwidth">
              <select id="timeSpan" v-model="settings.defaultTimeSpan">
                <option value="days">{{ (settings.defaultOffset > 1 ? 'TIME_SPAN.PLURAL.':'TIME_SPAN.SINGULAR.')+'days'|
                  translate}}
                </option>
                <option value="weeks">{{ (settings.defaultOffset > 1 ?
                  'TIME_SPAN.PLURAL.':'TIME_SPAN.SINGULAR.')+'weeks'| translate}}
                </option>
                <option value="months">{{ (settings.defaultOffset > 1 ?
                  'TIME_SPAN.PLURAL.':'TIME_SPAN.SINGULAR.')+'months'| translate}}
                </option>
                <option value="quarters">{{ (settings.defaultOffset > 1 ?
                  'TIME_SPAN.PLURAL.':'TIME_SPAN.SINGULAR.')+'quarters'| translate}}
                </option>
                <option value="years">{{ (settings.defaultOffset > 1 ?
                  'TIME_SPAN.PLURAL.':'TIME_SPAN.SINGULAR.')+'years'| translate}}
                </option>
              </select>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import THEMES from '../../../config/themes.json'
import CURRENCIES from '../../../config/currencies.json'
import { currencyIcon } from '../../util/icons'
import { configTranslation } from '../../util/translation'

export default {
  data: function () {
    return {
      settings: this.$root.settings,
      currencies: CURRENCIES,
      themes: THEMES
    }
  },
  computed: {
    dateFormatTester: function () {
      return moment().format(this.settings.dateFormat)
    }
  },
  created: function () {
    moment.locale(this.settings.language)
  },
  methods: {
    currencyIcon (currency) {
      return currencyIcon(currency)
    },
    configTranslation (currency) {
      return configTranslation(currency)
    }
  }
}
</script>
