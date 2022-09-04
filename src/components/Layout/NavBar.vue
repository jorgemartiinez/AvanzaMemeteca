<script setup>
/*
  imports
*/
import { ref } from 'vue';

import { onClickOutside } from '@vueuse/core';
import { useStoreAuth } from '../../stores/storeAuth';

/*
  store auth
*/

const storeAuth = useStoreAuth();

/*
  mobile nav
*/

const showMobileNav = ref(false);

/*
 click outside to close
*/

const navbarMenuRef = ref(null);
const navbarBurgerRef = ref(null);

onClickOutside(navbarMenuRef, (event) => (showMobileNav.value = false), {
  ignore: [navbarBurgerRef]
});

/*
  logout
*/

const logout = () => {
  showMobileNav.value = false;
  storeAuth.logoutUser();
};
</script>

<template>
  <nav
    class="navbar is-info"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="container is-max-desktop">
      <div class="navbar-brand px-2">
        <div class="navbar-item is-size-4 is-family-monospace" style="cursor: pointer;" @click="$router.push('/')">
      🐧 AVANZA MEMETECA
        </div>
        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': showMobileNav }"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click.prevent="showMobileNav = !showMobileNav"
          ref="navbarBurgerRef"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        class="navbar-menu"
        :class="{ 'is-active': showMobileNav }"
        ref="navbarMenuRef"
      >
        <div class="navbar-start"></div>
        <div
          class="navbar-end"
          v-if="storeAuth.user.id"
        >
          <RouterLink
            @click="showMobileNav = false"
            to="/"
            class="navbar-item"
            active-class="is-active"
          >
            🤙 Memingos
          </RouterLink>

          <RouterLink
            @click="showMobileNav = false"
            to="/upload"
            class="navbar-item"
            active-class="is-active"
          >
            ⬆️ Upload
          </RouterLink>

          <RouterLink
            @click="showMobileNav = false"
            to="/myImages"
            class="navbar-item"
            active-class="is-active"
          >
            🖼️ My Images
          </RouterLink>

          <button
            class="button is-small is-danger mt-2 ml-3"
            @click="logout"
            v-if="storeAuth.user.id"
            title="Logout"
          >
            🧑 {{ storeAuth.user.email }} 👋 Log out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.navbar {
  width: 100vw;
}

@media (max-width: 1023px) {
  .navbar-menu {
    position: absolute;
    left: 0;
    width: 100%;
  }
}
</style>
