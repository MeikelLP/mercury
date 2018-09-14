<template>
  <section class="hero is-fullheight">
    <div class="hero-head">
      <h2 class="title is-2">Mercury</h2>
      <aside class="menu">
        <p class="menu-label">
          General
        </p>
        <ul class="menu-list">
          <li>
            <router-link to="/accounts">
              <span class="menu-icon">
                <font-awesome-icon icon="users" fixed-width/>
              </span>
              <span>Accounts</span>
            </router-link>
          </li>
          <li>
            <router-link to="/operations">
              <span class="menu-icon">
                <font-awesome-icon icon="database" fixed-width/>
              </span>
              <span>Operations</span>
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard">
              <span class="menu-icon">
                <font-awesome-icon icon="tachometer-alt" fixed-width/>
              </span>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/accountDetails">
              <span class="menu-icon">
                <font-awesome-icon icon="chart-bar" fixed-width/>
              </span>
              <span>Account Details</span>
            </router-link>
          </li>
          <li>
            <router-link to="/recurrings">
              <span class="menu-icon">
                <font-awesome-icon icon="recycle" fixed-width/>
              </span>
              <span>Recurrings</span>
            </router-link>
          </li>
        </ul>
        <p class="menu-label">
          Reports
        </p>
        <ul class="menu-list">
          <li>
            <router-link to="/report/chrono">
              <span class="menu-icon">
                <font-awesome-icon icon="chart-area" fixed-width/>
              </span>
              <span>CHRONO CHART</span>
            </router-link>
          </li>
          <li>
            <router-link to="/report/statistics">
              <span class="menu-icon">
                <font-awesome-icon icon="chart-pie" fixed-width/>
              </span>
              <span>STATS</span>
            </router-link>
          </li>
          <li>
            <router-link to="/report/balance">
              <span class="menu-icon">
                <font-awesome-icon icon="chart-line" fixed-width/>
              </span>
              <span>BALANCE</span>
            </router-link>
          </li>
        </ul>
      </aside>
    </div>
    <div class="hero-foot">
      <aside class="menu">
        <ul class="menu-list">
          <li>
            <router-link to="/settings">
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
  export default {
    name: 'Sidebar'
  }
</script>
