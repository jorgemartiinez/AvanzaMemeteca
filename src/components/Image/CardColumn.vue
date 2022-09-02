<script setup>
import { useStoreImages } from '@/stores/storeImages';
import { useStoreAuth } from '../../stores/storeAuth';

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
 * delete image
 */

const deleteImage = (img) => {
  if(window.confirm(`Are you sure that you want to delete the image with the title ${img.title}?`))
  storeImages.delete(img.path);
};
</script>

<template>
  <div :class="columnClass">
    <div class="card">
      <div class="card-image">
        <figure class="image is-3by2">
          <img
            class="card-img-src"
            :src="image.url"
            alt="imgAlt"
          />
        </figure>
        <div class="card-content is-overlay is-clipped">
          <span class="tag is-info">{{ image.title }}</span>
        </div>
      </div>
      <div class="actions">
        <button
          class="button is-danger is-small"
          title="Eliminar imagen"
          @click="deleteImage(image)"
          v-if="storeAuth.user.id == image.userId"
        >
          <span class="icon is-small">
            <i>🗑️</i>
          </span>
        </button>
        <a
          class="button is-info is-small"
          title="Descargar imagen"
          :href="image.url"
          target="_blank"
        >
          <span class="icon is-small">
            <i>⬇️</i>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card-img-src {
  position: relative;
  object-fit: contain !important;
}
.actions {
  position: absolute;
  right: 0;
  bottom: 1%;


  .icon {
    i {
      font-style: normal !important;
    }
  }
}
</style>
