<template>

  <div class="floating-nav">

    <v-card
      elevation="12"
      width="256"
      class="floating-nav-card"
    >
      <v-navigation-drawer
        floating
        permanent
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Add your object
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list
          dense
          rounded
        >
          <v-list-item
            v-for="item in availableObjects"
            :key="item.name"
            link
            @click="selectCurrentObject(item.name)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>

    <v-card
      elevation="12"
      width="256"
      class="floating-nav-card"
      v-if="selectedObject !== null"
    >
      <v-navigation-drawer
        floating
        permanent
      >

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              {{selectedObject.name}} Controls
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list
          dense
          rounded
        >
          <v-list-item
            v-for="item in selectedObjectNav"
            :key="item.title"
            link
            @click="moveSelectedObject(item.title)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
    
    <v-card
      elevation="12"
      width="256"
      class="floating-nav-card"
      v-if="sceneObjects.length > 1"
    >
      <v-navigation-drawer
        floating
        permanent
        color="red"
      >

        <v-list
          dense
          rounded
        >
          <v-list-item
            link
            @click="deleteAllObjects"
          >
            <v-list-item-icon>
              <v-icon>mdi-delete-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Delete All Objects
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>

  </div>

</template>

<script>
  import {mapActions, mapState} from 'vuex'

  export default {
    name: 'FloatingNavigation',
    data: () => ({
      addObjectNav: [
        { title: 'Add Object', icon: 'mdi-shape-plus' },
        { title: 'Delete All Objects', icon: 'mdi-delete-variant' },
      ],
      selectedObjectNav: [
        { title: 'Move Up', icon: 'mdi-arrow-up-thick' },
        { title: 'Move Down', icon: 'mdi-arrow-down-thick' },
        { title: 'Move Left', icon: 'mdi-arrow-left-thick' },
        { title: 'Move Right', icon: 'mdi-arrow-right-thick' },
        { title: 'Rotate Left 45', icon: 'mdi-rotate-left' },
        { title: 'Rotate Right 45', icon: 'mdi-rotate-right' },
        { title: 'Delete Object', icon: 'mdi-delete' }
      ],
      availableObjects: [
        {
          name: 'Cube',  
          icon: 'mdi-cube-outline'
        },
        {
          name: 'Cone', 
          icon: 'mdi-cone'
        },
        {
          name: 'Cylinder', 
          icon: 'mdi-cylinder'
        },
      ]
    }),
    methods: {
      ...mapActions(['selectCurrentObject', 'initializeGhostObject', 'moveSelectedObject', 'deleteSelectedObject', 'deleteAllObjects'])
    },
    computed: {
      ...mapState(['selectedObject', 'sceneObjects'])
    }
  }
</script>

<style scoped>
.floating-nav {
  position:absolute;
  margin: 30px;
}
.floating-nav-card {
  margin-bottom: 30px;
}
</style>