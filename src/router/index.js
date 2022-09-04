import { createRouter, createWebHistory } from 'vue-router'
// views
import ImageView from '@/views/ImageView.vue';
import LoginView from '@/views/LoginView.vue';
import UploadImageView from '@/views/UploadImageView.vue';
import MyImagesView from '@/views/MyImagesView.vue';

// stores
import { useStoreAuth } from '@/stores/storeAuth.js';

const routes = [
  {
    path: '/',
    name: 'home',
    component: ImageView
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadImageView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/myImages',
    name: 'myImages',
    component: MyImagesView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from) => {
console.log("🚀 ~ file: index.js ~ line 38 ~ router.beforeEach ~ to", to)

  const storeAuth = useStoreAuth();
  
  console.log(`de user data `, storeAuth.user.id)

  if(!storeAuth.user.id && to.name !== 'login') return { name: 'login' }

  if(storeAuth.user.id && to.name == 'login') return false;
})

export default router
