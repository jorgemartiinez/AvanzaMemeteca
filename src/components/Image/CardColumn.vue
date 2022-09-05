<script setup>
import { useStoreImages } from '@/stores/storeImages';
import { useStoreAuth } from '../../stores/storeAuth';
import { useElementHover } from '@vueuse/core'
import { ref } from 'vue';

/**
 * props
 */
const props = defineProps({
  image: {
    type: Object,
    required: true
  },
  columnClass: {
    type: String,
    default: 'column is-one-quarter-desktop is-half-tablet'
  }
});

/**
 * images store
 */

const storeImages = useStoreImages();

/**
 * auth store
 */

const storeAuth = useStoreAuth();


/**
 * hover
 */

 const cardImage = ref(null);
 const isHovered = useElementHover(cardImage)


/**
 * delete image
 */

const deleteImage = (img) => {
  if (window.confirm(`Are you sure that you want to delete the image with the title ${img.title}?`)) storeImages.delete(img);
};

/**
 * redirect image
 */

const redirectToImage = (img) => {
  window.open(img.downloadUrl, '_blank');
};
</script>

<template>
  <div :class="columnClass">
    <div class="card">
      <div
        class="card-image"
        ref="cardImage"
        :title="`${image.title}`"
        @click="redirectToImage(image)"
        style="cursor: pointer"
      >
        <figure class="image is-3by2">
          <img
            class="card-img-src"
            :src="image.downloadUrl"
            alt="imgAlt"
          />
        </figure>
        <div class="card-content is-overlay is-clipped">
          <span class="tag is-info">{{ image.title }}</span>
        </div>
      </div>

      <footer class="card-footer is-flex is-flex-direction-column">
        <div v-show="isHovered">
          <p class="is-fullwidth title is-6 p-2 has-background-success is-size-7">@uploaded by: {{ image.userEmail }}</p>
        </div>

        <div class="is-flex is-fullwidth">
          <a
            class="card-footer-item has-background-danger button"
            title="Delete image"
            @click="deleteImage(image)"
            v-if="storeAuth.user.id == image.userId"
            >🗑️</a
          >
          <a
            class="card-footer-item has-background-info button"
            title="Download image"
            :href="image.downloadUrl"
            target="_blank"
            >⬇️</a
          >
        </div>
      </footer>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card-img-src {
  position: relative;
  object-fit: contain !important;
}

.card-footer {
  .card-footer-item {
    padding: 0.3rem !important;
  }
}
</style>
