// stores/counter.js
import { defineStore, acceptHMRUpdate } from 'pinia';

import { auth } from '@/js/firebase';
import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useStoreImages } from './storeImages';
import { useToastr } from '@/use/useToastr';

const toastr = useToastr();

export const useStoreAuth = defineStore('storeAuth', {
  state: () => {
    return {
      user: {}
    };
  },
  actions: {
    init() {
      const storeImages = useStoreImages();

      onAuthStateChanged(auth, (user) => {
        console.log('auth changed')
        if (user) {
          this.user.id = user.uid;
          this.user.email = user.email;
          this.router.push('/');
        } else {
          this.user = {};
          this.router.push('/login');
          storeImages.clear();
        }
      });
    },

    async loginUser(credentials) {
      try {
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        toastr.success('Welcome to Avanza Memeteca 👋');
      } catch (error) {
        console.error(error.message);
        toastr.error("These credentials don't match any user criteria 😭. Please try again.");
      }
    },
    async logoutUser() {
      try {
        await signOut(auth);
        console.log('signed out')
      } catch (error) {
        console.error(error.message);
        toastr.error('Byeeee 👋');
      }
    }
  }
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAuth, import.meta.hot));
}
