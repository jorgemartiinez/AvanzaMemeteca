<script setup>
/**
 * props
 */
const props = defineProps({
  imgSrc: {
    type: String,
    required: true
  },
  imgAlt: {
    type: String,
    required: true
  },
  imgTitle: {
    type: String
  },
  columnClass: {
    type: String,
    default: 'column is-one-quarter-desktop is-half-tablet'
  }
});
</script>

<template>
  <div :class="columnClass">
    <div class="card">
      <div class="card-image">
        <figure class="image is-3by2">
          <img
            :src="imgSrc"
            alt="imgAlt"
          />
        </figure>
        <div class="card-content is-overlay is-clipped">
          <span class="tag is-info">{{ imgTitle }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
