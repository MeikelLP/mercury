<template>
  <section class="hero is-fullheight">
    <div class="hero-head">
      <aside class="menu">
        <ul class="menu-list">
          <li>
            <router-link to="/home" class="has-text-centered">
              <span class="title is-2">Mercury</span>
            </router-link>
          </li>
        </ul>
        <div v-for="group in Object.keys(routes)" :key="group">
          <p class="menu-label has-text-right">
            {{ group | configTranslate }}
          </p>
          <ul class="menu-list">
            <li v-for="route in routes[group]" :key="route.path">
              <router-link :to="route.path" :class="{'is-active': $route.path === route.path, 'is-disabled': route.meta.requiresAccount && !hasAccounts}" class="has-text-right">
                <span>{{ route.name | configTranslate }}</span>
                <span class="menu-icon">
                  <font-awesome-icon :icon="route.meta.icon" fixed-width/>
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
    <div class="hero-foot">
      <aside class="menu">
        <ul class="menu-list">
          <li>
            <router-link to="/settings" :class="{'is-active': $route.path === '/settings'}">
              <span class="menu-icon">
                <font-awesome-icon icon="cogs" fixed-width/>
              </span>
              <span>SETTINGS</span>
            </router-link>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<script>
  import ROUTES from '../router/routes'
  import { groupBy } from '../../util/common'

  const relevantRoutes = ROUTES.filter(r => r.hasOwnProperty('meta') && r.meta.hasOwnProperty('requiresAccount'))

  export default {
    name: 'Sidebar',
    data() {
      return {
        routes: groupBy(relevantRoutes, r => r.meta.group)
      }
    },
    computed: {
      hasAccounts () {
        return this.$store.getters.accounts.length > 0
      }
    }
  }
</script>
