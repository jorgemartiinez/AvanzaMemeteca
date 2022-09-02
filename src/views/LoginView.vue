<template>
  <div class="auth">
    <div class="tabs is-centered">
      <ul>
        <li class="is-active"><a>Login</a></li>
      </ul>
    </div>

    <div class="card auth-form">
      <div class="card-content">
        <div class="title has-text-centered">Login</div>
        <div class="content">
          <form @submit.prevent="onSubmit">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  v-model="credentials.email"
                  class="input is-info"
                  type="email"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  v-model="credentials.password"
                  class="input is-info"
                  type="password"
                  placeholder="Enter a password"
                />
              </div>
            </div>

            <div class="field is-grouped is-grouped-right">
              <p class="control">
                <button class="button is-primary">Login</button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
    imports
  */

import { computed, reactive } from '@vue/reactivity';
import { ref } from 'vue';
import { useStoreAuth } from '@/stores/storeAuth';

/*
   store
  */

const storeAuth = useStoreAuth();

/*
    credentials
  */

const credentials = reactive({
  email: 'jorgemartiinez19@gmail.com',
  password: import.meta.env.VITE_TRIAL_PASSWORD
});

const onSubmit = () => {
  if (!credentials.email || !credentials.password) alert('Please enter an email and password TONTITO');
  else {
    storeAuth.loginUser(credentials);
  }
};
</script>

<style>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>
