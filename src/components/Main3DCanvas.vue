<template>
  <canvas fill-height id="main-scene">
  </canvas>
</template> 

<script>
  import {mapMutations, mapActions} from 'vuex'

  export default {
    name: 'Main3DCanvas',
    data: () => ({

    }),
    methods: {
      ...mapMutations(['resize', 'onPointerMove', 'onPointerDown']),
      ...mapActions(['init', 'animate'])
    },
    mounted () {
      this.init({
        width: window.innerWidth,
        height: window.innerHeight,
        // el: this.$el
      }).then(() => {
        this.animate()
        window.addEventListener("resize", () => {
          this.resize({
            width: window.innerWidth,
            height: window.innerHeight,
          })
        }, true)
        window.addEventListener("pointermove", this.onPointerMove, false)
        window.addEventListener("pointerdown", this.onPointerDown, false)
      })
    },
  }
</script>
