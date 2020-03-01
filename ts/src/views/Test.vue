<template>
  <div>
    <Sandbox />
    <v-buttons>
      <v-button>OK</v-button>
      <v-button rounded>Peru</v-button>
      <v-button disabled>Ohje</v-button>
    </v-buttons>
    <v-buttons>
      <v-button small>Small</v-button>
      <v-button>Normal</v-button>
      <v-button large>Large</v-button>
    </v-buttons>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Sandbox from '@/components/Sandbox.vue'

@Component({
  components: {
    Sandbox
  }
})
export default class Test extends Vue {
}
</script>
