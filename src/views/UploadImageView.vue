<script setup>
/**
 * imports
 */
import { inject, reactive, ref } from 'vue';

import { computed } from '@vue/reactivity';
import ProgressBar from '../components/Shared/ProgressBar.vue';
import { useStoreImages } from '@/stores/storeImages';

/*
 image store
*/

const storeImages = useStoreImages();

/*
 image upload
*/

const image = reactive({
  file: null,
  title: ''
});

const onSubmit = async (e) => {
  if (image.file) {
    await storeImages.upload(image);
    image.file = null;
    image.title = '';
  }
};

/*
 preview image data
*/

const previewImageData = (ev) => {
  const file = ev.target.files[0];
  image.file = file;
};


/**
 * button condition
 */
const isButtonDisabled = computed(() => storeImages.loading || !image.title || !image.file);


</script>

<template>
  <div class="upload">
    <h2 class="title is-size-4 has-text-centered">Upload a memingo</h2>
    <ProgressBar v-if="storeImages.loading" />
    <form
      @submit.prevent="onSubmit"
      class="is-flex is-flex-direction-column is-justify-content-center"
    >
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="A title for your masterpiece"
            maxlength="120"
            v-model="image.title"
            required
          />
        </div>
      </div>

      <div class="file has-name is-boxed is-centered mb-4 is-fullwidth">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            name="resume"
            accept="image/*"
            id="imageInput"
            @change="previewImageData"
            required
          />
          <span class="file-cta has-text-centered">
            <span class="file-icon">
              <i>📁</i>
            </span>
            <span class="file-label"> Choose a file… </span>
          </span>
          <span class="file-name"> {{ image.file ? image.file.name : 'No image selected' }}</span>
        </label>
      </div>
      <button
        class="button is-info is-rounded is-align-self-center"
        type="submit"
        :disabled="isButtonDisabled"
        :title="isButtonDisabled ? 'Please fill the form before submit it!' : 'Upload'"
      >
        Upload
      </button>
    </form>
  </div>
</template>
<style lang="scss" scoped></style>
