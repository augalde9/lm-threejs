<template>
  <v-app>

    <v-main>
      <AppBar/>
      <FloatingNavigation/>
      <Main3DCanvas/>
    </v-main>


  </v-app>
</template>

<script>
import AppBar from './components/AppBar';
import FloatingNavigation from './components/FloatingNavigation';
import Main3DCanvas from './components/Main3DCanvas';

export default {
  name: 'App',

  components: {
    AppBar,
    FloatingNavigation,
    Main3DCanvas,
  },

  data: () => ({
    //
  }),
};
</script>
