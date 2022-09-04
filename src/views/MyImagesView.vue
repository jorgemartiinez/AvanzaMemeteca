<script setup>
import CardImages from '../components/Image/CardImages.vue';
</script>

<template>
  <h2 class="title is-size-4 has-text-centered">My uploaded memes</h2>
  <CardImages get-method="user"  />
</template>
