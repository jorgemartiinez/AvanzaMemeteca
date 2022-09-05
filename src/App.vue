<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from './components/Layout/NavBar.vue';

import { useStoreAuth } from './stores/storeAuth';

/*
   store
*/

const storeAuth = useStoreAuth();

/*
  mounted
*/

onMounted(() => {
  storeAuth.init();
});
</script>

<template>
  <NavBar />

  <main class="container is-max-desktop px-2 py-4">
    <RouterView />
    <a class="link mt-6" @click="$router.back" v-if="$route.name !== 'login'" >⬅️ Go Back</a>
  </main>
</template>

<style>
@import 'bulma\css\bulma.min.css';
</style>
