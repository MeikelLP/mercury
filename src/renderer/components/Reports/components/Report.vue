<template lang="html">
  <div>
    <h2 class="title is-2">
      {{title | translate}}
    </h2>
    <section>
      <article class="is-main-pane">
        <div class="columns">
          <div class="column is-two-thirds">
            <canvas id="myChart" height="225%"></canvas>
          </div>
          <div class="column" style="border-left: 1px grey solid">
            <p class="title is-marginless">{{'OPTIONS' | translate}}</p>
            <slot></slot>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  props: ['title', 'color', 'icon']
}
</script>
