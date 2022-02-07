<template>

  <v-bottom-navigation
    dark    
  >

    <v-btn>
      <span>Add Object</span>
      <v-icon>mdi-shape-plus</v-icon>
    </v-btn>
    
    <v-btn>
      <span>Move Object</span>
      <v-icon>mdi-arrow-expand-all</v-icon>
    </v-btn>

  </v-bottom-navigation>

</template>

<script>
  export default {
    name: 'BottomNavigation',
    data: () => ({

    })
  }
</script>
