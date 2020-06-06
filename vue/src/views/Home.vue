<template>
  <div>
    <b-container fluid v-if="user">
      <ProblemGrid
        title="Avoimet vikatapaukset"
        :status="0"
      />
      <ProblemGrid
        title="Viimeksi ratkaistut vikatapaukset"
        :status="1"
        :showAddButton="false"
      />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseVue from './BaseVue.vue';
import ProblemGrid from '../components/ProblemGrid.vue';
import { ProblemTable, ProblemStatus } from '../tables/problem';

@Component({
  components: {
    ProblemGrid
  }
})
export default class Home extends BaseVue {
  mounted() {
    const token = localStorage.getItem('token');

    if (token) {
      this.$store.dispatch('login', token);
    }

    if (!this.user) {
      this.$router.push('login');      
    }
  }
}
</script>
