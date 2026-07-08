<template>
  <aside class="gorda-sidenav sidenav navbar navbar-vertical bg-light navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3" :class="{'gorda-sidenav--rail': railCollapsed}" id="sidenav-main">
   <div class="sidenav-header">
     <router-link class="navbar-brand m-0" tag="a" :to="{name: 'profile'}">
       <img :src="user.photoUrl || photoUrl" class="navbar-brand-img d-inline-block align-top border-radius-lg " alt="main_logo">
       <span class="font-weight-bold gorda-sidenav__brand-name">{{ user.name }}</span>
     </router-link>
     <button class="gorda-sidenav__rail-toggle" type="button"
             :title="railCollapsed ? $t('sidenav.expand') : $t('sidenav.collapse')"
             :aria-label="railCollapsed ? $t('sidenav.expand') : $t('sidenav.collapse')"
             @click="toggle">
       <em :class="railCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></em>
     </button>
    </div>
    <hr class="horizontal bg-dark dark mt-0">
    <div class="collapse navbar-collapse w-auto" id="sidenav-collapse-main">
      <ul class="navbar-nav flex-grow-1">
        <li class="nav-item">
          <router-link :to="{ name: 'dashboard'}" tag="a" :class="$router.currentRoute.value.path.includes('/dashboard/main') ? 'nav-link active': 'nav-link'"
                       :title="railCollapsed ? $t('routes.dashboard') : undefined">
            <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
              <em class="fas fa-gauge-high"></em>
            </div>
            <span class="nav-link-text ms-1">{{ $t('routes.dashboard') }}</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'users'}" tag="a"
                       :class="$router.currentRoute.value.path.includes('/dashboard/users/') ? 'nav-link active': 'nav-link'"
                       :title="railCollapsed ? $t('routes.users') : undefined"
                       v-if="isAdmin">
            <div
                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
              <em class="fas fa-users"></em>
            </div>
            <span class="nav-link-text ms-1">{{ $t('routes.users') }}</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'drivers'}" tag="a"
                       :class="$router.currentRoute.value.path.includes('/dashboard/drivers/') ? 'nav-link active': 'nav-link'"
                       :title="railCollapsed ? $t('routes.drivers') : undefined">
            <div
                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
              <em class="fa-solid fa-car-side"></em>
            </div>
            <span class="nav-link-text ms-1">{{ $t('routes.drivers') }}</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'vehicles'}" tag="a"
                       :class="$router.currentRoute.value.path.includes('/dashboard/vehicles/') ? 'nav-link active': 'nav-link'"
                       :title="railCollapsed ? $t('routes.vehicles') : undefined">
            <div
                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
              <em class="fa-solid fa-car"></em>
            </div>
            <span class="nav-link-text ms-1">{{ $t('routes.vehicles') }}</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'places'}" tag="a"
                       :class="$router.currentRoute.value.path.includes('/dashboard/places/') ? 'nav-link active': 'nav-link'"
                       :title="railCollapsed ? $t('routes.places') : undefined">
            <div
                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
              <em class="fas fa-location-dot"></em>
            </div>
            <span class="nav-link-text ms-1">{{ $t('routes.places') }}</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'wpClients'}" tag="a"
                       :class="$router.currentRoute.value.path.includes('/dashboard/wp-clients/') ?
                       'nav-link active': 'nav-link'"
                       :title="railCollapsed ? (connectionState ? $t('common.chatBot.connected') : $t('common.chatBot.disconnected')) : undefined">
            <div
                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
              <em class="fa-brands fa-whatsapp"></em>
            </div>
            <span class="nav-link-text ms-1 position-relative">{{ connectionState ? $t('common.chatBot.connected') : $t('common.chatBot.disconnected')}}

            <span v-if="connectionState" class="position-absolute p-2 ms-2 bg-success border border-light rounded-circle"></span>
            <span  v-else class="position-absolute p-2 ms-2 bg-danger border border-light rounded-circle"></span>
            </span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'metrics'}" tag="a"
                       :class="$router.currentRoute.value.path.includes('/dashboard/metrics/') ? 'nav-link active': 'nav-link'"
                       :title="railCollapsed ? $t('routes.metrics') : undefined"
                       v-if="isAdmin">
            <div
                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
              <em class="fa-solid fa-chart-pie"></em>
            </div>
            <span class="nav-link-text ms-1">{{ $t('routes.metrics') }}</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'billing'}" tag="a"
                       :class="$router.currentRoute.value.path.includes('/dashboard/billing') ? 'nav-link active': 'nav-link'"
                       :title="railCollapsed ? 'Billing' : undefined"
                       v-if="isSuperAdmin">
            <div
                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
              <em class="fa-solid fa-file-invoice-dollar"></em>
            </div>
            <span class="nav-link-text ms-1">Billing</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'settings'}" tag="a"
                       :class="$router.currentRoute.value.path.includes('/dashboard/settings/') ? 'nav-link active': 'nav-link'"
                       :title="railCollapsed ? $t('routes.settings') : undefined">
            <div
                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
              <em class="fa-solid fa-screwdriver-wrench"></em>
            </div>
            <span class="nav-link-text ms-1">{{ $t('routes.settings') }}</span>
          </router-link>
        </li>
        <li class="nav-item flex-grow-1" aria-hidden="true"></li>
        <li class="nav-item">
          <a class="nav-link" @click="signOut" href="" id="signOut" :title="railCollapsed ? $t('users.logOut') : undefined">
            <div
                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
              <em class="fas fa-sign-out-alt"></em>
            </div>
            <span class="nav-link-text ms-1">{{ $t('users.logOut') }}</span>
          </a>
        </li>
      </ul>
      <div class="gorda-sidenav__version text-bold text-center">{{ 'version ' + version }}</div>
  </div>
</aside>
</template>
<script setup lang="ts">
import AuthService from '@/services/AuthService'
import {version} from '../../package.json'
import User from '@/models/User'
import WhatsAppClient from "@/services/gordaApi/WhatsAppClient";
import {onMounted, onUnmounted, ref, Ref} from 'vue'
import {ClientObserver} from '@/services/gordaApi/ClientObserver'
import {useStorage} from '@/services/stores/Storage'
import {storeToRefs} from 'pinia'
import {useWpClientsStore} from "@/services/stores/WpClientStore";
import {useSidenavStore} from '@/services/stores/SidenavStore'

let user: Ref<User> = ref(new User())
let isAdmin: Ref<boolean> = ref(false)
let isSuperAdmin: Ref<boolean> = ref(false)
let connectionState: Ref<boolean> = ref(false)
let socket: WhatsAppClient
let observer: ClientObserver
const storage = useStorage()
const {photoUrl} = storeToRefs(storage)
const {getDefault} = useWpClientsStore()
const sidenavStore = useSidenavStore()
const {railCollapsed} = storeToRefs(sidenavStore)
const {toggle} = sidenavStore

function signOut(): void {
  AuthService.logOut()
}

const onUpdate = (socket: WhatsAppClient): void => {
  connectionState.value = socket.isConnected()
}

onMounted(async () => {
  user.value = AuthService.getCurrentUser()
  isAdmin.value = user.value.isAdmin()
  isSuperAdmin.value = user.value.isSuperAdmin()
  if (!user.value.photoUrl) {
    await storage.getDefaultPhotoUrl()
  }
  if (getDefault()) {
    socket = WhatsAppClient.getInstance(getDefault())
    observer = new ClientObserver(onUpdate)
    socket.attach(observer)
  }
})

onUnmounted(() => {
  if (socket) socket.detach(observer)
})
</script>



