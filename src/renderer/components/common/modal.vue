<template>
  <div class="modal" :class="{'is-active' : active}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="media-left">
          <font-awesome-icon size="lg" :icon="icon"/>
        </div>
        <p class="modal-card-title">{{title}}</p>
        <button class="delete"></button>
      </header>
      <section class="modal-card-body">
        <slot></slot>
      </section>
      <footer class="modal-card-foot">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
  //TODO use buefy modal (close not working ATM)
export default {
  props: ['icon', 'active', 'close', 'width', 'title']
}
</script>
