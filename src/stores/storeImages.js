import { defineStore, acceptHMRUpdate } from 'pinia';
// toastr
import { useToastr } from '@/use/useToastr';
// uui
import { uuid } from 'vue3-uuid';
// firebase
import { ref as firebaseRef, uploadBytes, list, listAll, getDownloadURL, getMetadata, deleteObject } from 'firebase/storage';
import { storage } from '@/js/firebase';
import { useStoreAuth } from './storeAuth';

const rootRef = firebaseRef(storage, '/');
const toastr = useToastr();

const getChildImages = async (childRefs) => {
  let imagesStorage = [];

  for (const childRef of childRefs.items) {
    console.log('🚀 ~ file: storeImages.js ~ line 18 ~ getChildImages ~ childRef', childRef);
    const fullPath = childRef.fullPath;
    const childStorageRef = firebaseRef(storage, childRef.fullPath);
    const downloadUrl = await getDownloadURL(childStorageRef);
    const metadata = await getMetadata(childStorageRef);

    const imageData = {
      url: downloadUrl,
      path: fullPath,
      title: metadata.customMetadata.title ?? metadata.name,
      userId: metadata.customMetadata.userId ?? metadata.userId
    };
    imagesStorage.push(imageData);
  }

  return imagesStorage;
};

export const useStoreImages = defineStore({
  id: 'images',
  state: () => ({
    images: [],
    userImages: [],
    loading: false
  }),
  actions: {
    async getAll() {
      // TODO solución para no cargar siempre storage
      // if (this.images.length > 0) return;
      let imagesStorage = [];
      this.loading = true;

      try {
        const res = await listAll(rootRef);
        console.log("🚀 ~ file: storeImages.js ~ line 52 ~ getAll ~ res", res)

        for (const folderRef of res.prefixes) {
          const childRefs = await listAll(firebaseRef(storage, `/${folderRef.fullPath}`));
          const childImages = await getChildImages(childRefs);
          console.log('🚀 ~ file: storeImages.js ~ line 55 ~ res.prefixes.forEach ~ childImages', childImages);
          imagesStorage = imagesStorage.concat(childImages);
          console.log('🚀 ~ file: storeImages.js ~ line 57 ~ res.prefixes.forEach ~ imagesStorage', imagesStorage);
        }
      } catch (err) {
        console.error(err);
        toastr.error();
      }

      console.log('🚀 ~ file: storeImages.js ~ line 63 ~ res.prefixes.forEach ~ imagesStorage', imagesStorage);
      this.images = imagesStorage;
      setTimeout(() => (this.loading = false), 800);
    },
    async getUserImages() {
      const storeAuth = useStoreAuth();
      const userId = storeAuth.user.id;

      const userImagesRef = firebaseRef(storage, `/${userId}`);

      try {
        const childRefs = await listAll(userImagesRef);
        this.userImages = await getChildImages(childRefs);
      } catch (err) {
        console.error(err);
        toastr.error();
      }
      setTimeout(() => (this.loading = false), 800);
    },
    async delete(imagePath) {
      // Create a reference to the file to delete
      const deleteRef = firebaseRef(storage, imagePath);

      // Delete the file
      await deleteObject(deleteRef)
        .then((res) => {
          console.log('res', res);
          // File deleted successfully
          toastr.success();
        })
        .catch((error) => {
          console.error(error);
          toastr.error();
          // Uh-oh, an error occurred!
        });
    },
    async upload(imageParams) {
      this.loading = true;

      const storeAuth = useStoreAuth();

      const userId = storeAuth.user.id;

      const storageRef = firebaseRef(storage, `${userId}/${uuid.v4()}`);
      const metadata = {
        customMetadata: {
          title: imageParams.title,
          userId: userId
        }
      };

      try {
        const snapshot = await uploadBytes(storageRef, imageParams.file, metadata);
        toastr.success();
      } catch (err) {
        console.error(err);
        toastr.error();
      }
      setTimeout(() => (this.loading = false), 300);
    },
    clear() {
      this.images = [];
    }
  }
});

// make sure to pass the right store definition,
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreImages, import.meta.hot));
}
