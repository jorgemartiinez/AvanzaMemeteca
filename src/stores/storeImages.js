import { defineStore, acceptHMRUpdate } from 'pinia';
// toastr
import { useToastr } from '@/use/useToastr';
// uui
import { uuid } from 'vue3-uuid';
// firebase
import { ref as firebaseRef, uploadBytes, list, listAll, getDownloadURL, getMetadata, deleteObject } from 'firebase/storage';
import { storage, db } from '@/js/firebase';
import { useStoreAuth } from './storeAuth';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';

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

let getAllImagesSnapshot = null;

let limit = 10;

export const useStoreImages = defineStore({
  id: 'images',
  state: () => ({
    images: [],
    userImages: [],
    loading: false
  }),
  actions: {
    async getAll() {
      if(this.images.length > 0) return;
      this.loading = true;
      try {
        getAllImagesSnapshot = onSnapshot(query(collection(db, 'images'), orderBy('date', 'desc')), (querySnapshot) => {
          console.log("🚀 ~ file: storeImages.js ~ line 53 ~ getAllImagesSnapshot=onSnapshot ~ querySnapshot", querySnapshot)
          let images = [];
          querySnapshot.forEach((doc) => {
            images.push({ id: doc.id, ...doc.data() });
          });
          this.images = images;
        });
      } catch (error) {
        console.error('error at getAll()', error);
        toastr.error();
      }
      setTimeout(() => (this.loading = false), 800);
    },
    async getUserImages() {
      if(this.getUserImages.length > 0) return;
      const storeAuth = useStoreAuth();
      this.loading = true;
      let images = [];
      try {
        // no snapshot here for the moment
        const querySnapshot = await getDocs(query(collection(db, 'images'), orderBy('date', 'desc'), where('userId', '==', storeAuth.user.id)));

        querySnapshot.forEach((doc) => {
          images.push({ id: doc.id, ...doc.data() });
        });
      } catch (error) {
        console.error('error at getUserImages()', error);
        toastr.error();
      }
      this.userImages = images;
      setTimeout(() => (this.loading = false), 800);
    },
    async delete(image) {
      // Create a reference to the file to delete
      const deleteRef = firebaseRef(storage, image.path);

      Promise.all([deleteObject(deleteRef), deleteDoc(doc(db, 'images', image.id))])
        .then((res) => {
          // the user images are not in the snapshot
          this.userImages = this.images.filter((img) => img.id !== image.id);
          toastr.success();
        })
        .catch((error) => {
          console.error(error);
          toastr.error();
        });
    },
    async upload(imageParams) {
      this.loading = true;

      const storeAuth = useStoreAuth();
      const userId = storeAuth.user.id;

      const filename = uuid.v4();

      // url to the user folder/name (id)
      const newImagePath = `${userId}/${filename}`;

      const storageRef = firebaseRef(storage, newImagePath);

      const metadata = {
        customMetadata: {
          title: imageParams.title,
          userId: userId
        }
      };

      try {
        // image storage upload
        const snapshot = await uploadBytes(storageRef, imageParams.file, metadata);

        // obtain the download url for store en database
        const childStorageRef = firebaseRef(storage, snapshot.ref.fullPath);
        const downloadUrl = await getDownloadURL(childStorageRef);

        // save the image data on firestore
        let newImageDoc = {
          title: imageParams.title,
          userId: userId,
          userEmail: storeAuth.user.email,
          downloadUrl: downloadUrl,
          date: new Date().getTime(),
          path: newImagePath
        }
        const docRef = await addDoc(collection(db, 'images'), newImageDoc);

        this.userImages.push(newImageDoc)

        toastr.success();
      } catch (err) {
        console.error(err);
        toastr.error();
      }
      setTimeout(() => (this.loading = false), 300);
    },
    clear() {
      this.images = [];
      this.userImages = [];
      if(getAllImagesSnapshot) getAllImagesSnapshot()
    }
  }
});

// make sure to pass the right store definition,
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreImages, import.meta.hot));
}
