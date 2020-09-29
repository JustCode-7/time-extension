<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Auth } from '../../../shared/message.types';
import Credentials = Auth.Credentials;

@Component({
  data: (): Credentials => ({ username: '', password: '' }),
  computed: {
    loginStatus() {
      return this.$store.getters['auth/getLoginStatus'];
    },
    isLastAttempt() {
      return this.$store.getters['auth/isLastAttempt'];
    },
  },
  methods: {
    login($event: Event) {
      $event.preventDefault();
      this.$store.dispatch('auth/attemptLogin', this.$data);
    },
  },
})
export default class Login extends Vue {
}
</script>


<template>
  <div class='ma2'>

    <h2>IT-Zeit Login</h2>

    <form>
      <div class="mt1">
        <label for="username">Username</label><br/>
        <input type="text" id="username" placeholder="Max Mustermann"
               minlength="3" maxlength="20" required
               v-model.trim="username"
        />
      </div>
      <div class="mt1">
        <label for="password">Password</label><br/>
        <input type="password" id="password"
               minlength="3" maxlength="16" required
               v-model.trim="password"
        />
      </div>
      <div class="mt2 flex justify-end">
        <button type='submit' class="mr1" id="login-btn"
                v-on:click="login">
          LOGIN
        </button>

        <button type='reset' class="ml1" id="reset-btn">
          RESET
        </button>
      </div>
      <p>{{ $data }}</p>

      <p v-if="!loginStatus.isAccountLocked">
        You have {{ loginStatus.remainingAttempts }} remaining attempts.</p>

      <p v-if="!loginStatus.isAccountLocked && !isLastAttempt">
        Watch out. If you fail the next Login, your account will be locked.</p>

      <p v-if="loginStatus.isAccountLocked">
        You did it. Your Account is locked.</p>

    </form>
  </div>
</template>


<style scoped></style>
