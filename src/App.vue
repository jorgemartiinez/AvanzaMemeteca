<script setup>
import { RouterView } from 'vue-router';
import NavBar from './components/Layout/NavBar.vue';

</script>

<template>
  <NavBar />

  <main class="container is-max-desktop px-2 py-4 ">
    <RouterView />
  </main>
</template>

<style>
@import 'bulma\css\bulma.min.css';
</style>
