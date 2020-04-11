<script  lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AxiosInstance } from 'axios';
import { RestDatabase } from '../lib/dataset';
import { User } from '../js/user';

@Component
export default class Base extends Vue
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

  protected login(username: string, password: string) {
    this.$store.dispatch('login', { username, password })
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        window.alert('Virheellinen käyttäjätunnus tai salasana');
      });
  }
}
</script>
