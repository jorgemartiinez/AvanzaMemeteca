<script setup>
/**
 * imports
 */
import CardColumn from '@/components/Image/CardColumn.vue';
import { useStoreImages } from '@/stores/storeImages';
import { onMounted } from 'vue';
import ProgressBar from '@/components/Shared/ProgressBar.vue';
import { computed } from '@vue/reactivity';

/**
 * props
 */

 const props = defineProps({
    getMethod: {
        type: String,
        default: 'all'
    }
 })


/**
   images store
*/

const storeImages = useStoreImages();

const imageArrayStoreRef =  computed( () => (props.getMethod === 'all') ? storeImages.images : storeImages.userImages)

onMounted(() => {
    if(props.getMethod === 'all')
        storeImages.getAll();
    else if(props.getMethod === 'user')
        storeImages.getUserImages()
});
</script>

<template>
  <div class="home">
    <div class="columns is-multiline">
      <ProgressBar v-if="storeImages.loading" />
      <template
        v-for="(image, i) in imageArrayStoreRef"
        :key="i"
      >
        <CardColumn :image="image" />
      </template>
    </div>

    <div v-if="!imageArrayStoreRef.length && !storeImages.loading" class="is-size-4 has-text-centered is-family-monospace py-6">
        No images yet uploaded 👀...
        <a class="link" @click="$router.push('/upload')"> Try uploading one!</a>
      </div>
  </div>
</template>
