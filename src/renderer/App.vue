<template>
  <div id="app">
    <div class="columns">
      <div class="column is-one-fifth">
        <sidebar/>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Sidebar from './components/Sidebar'

  export default {
    name: 'mercury',
    components: {
      Sidebar
    }
  }
</script>
