<script  lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AxiosInstance } from 'axios';
import { RestDatabase } from '../lib/dataset';
import { User } from '../js/user';

@Component
export default class BaseVue extends Vue
{
  protected get user(): User {
    return this.$store.state.user;
  }

  protected get database(): RestDatabase {
    return this.$store.state.database;
  }

  protected get axios(): AxiosInstance {
    return this.database.axios;
  }
}
</script>
