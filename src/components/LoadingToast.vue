<template>
  <transition name="gorda-lm-fade">
    <div
      v-if="isLoading"
      class="gorda-lm-backdrop"
      role="status"
      aria-live="polite"
      aria-busy="true"
      :aria-label="$t('common.messages.waiting')"
      :style="{ background: backdropBg }"
      style="position: fixed; inset: 0; z-index: 2000; /* intentionally above Bootstrap modal stack (1055) */ backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;"
    >
      <div
        class="gorda-lm-card"
        style="background: var(--surface-card); border-radius: 1.25rem; border: 1px solid var(--border-subtle); box-shadow: var(--shadow-card), 0 24px 70px rgba(20,23,39,.18); width: 360px; max-width: calc(100vw - 2rem); overflow: hidden; font-family: 'Open Sans', sans-serif;"
      >
        <div style="padding: 2.4rem 2rem 1.9rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
          <div style="position: relative; width: 84px; height: 84px; margin-bottom: 1.4rem;">
            <div style="position: absolute; inset: 0; border-radius: 50%; border: 6px solid var(--border-subtle);"></div>
            <div
              class="gorda-lm-ring"
              style="position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 90deg, rgba(203,12,159,0) 8%, #cb0c9f 62%, #ff0080 100%); -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px)); mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px));"
            ></div>
            <div
              class="gorda-lm-core"
              style="position: absolute; top: 50%; left: 50%; width: 18px; height: 18px; margin-top: -9px; margin-left: -9px; border-radius: 50%; background: var(--gradient-primary); box-shadow: 0 4px 12px rgba(203,12,159,.35);"
            ></div>
          </div>

          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-heading); letter-spacing: -0.01em; line-height: 1.2;">
            {{ $t('common.messages.waiting') }}
          </div>
          <div
            v-if="$te('common.messages.waitingSub')"
            style="margin-top: .4rem; font-size: .8rem; font-weight: 400; color: var(--text-muted);"
          >
            {{ $t('common.messages.waitingSub') }}
          </div>
        </div>

        <div style="position: relative; height: 4px; overflow: hidden; background: var(--border-subtle);">
          <div
            class="gorda-lm-seg"
            style="position: absolute; top: 0; bottom: 0; left: 0; width: 28%; border-radius: 4px; background: var(--gradient-primary);"
          ></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useThemeStore} from '@/services/stores/ThemeStore'

defineProps<{ isLoading: boolean }>()

const {isDark} = storeToRefs(useThemeStore())
const backdropBg = computed(() => (isDark.value ? 'rgba(8, 11, 20, .92)' : 'rgba(233, 236, 239, .66)'))
</script>

<style lang="scss" scoped>
@keyframes gordaLmSpin {
  to { transform: rotate(360deg); }
}

@keyframes gordaLmPulse {
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%       { transform: scale(.55); opacity: .55; }
}

@keyframes gordaLmBar {
  0%   { transform: translateX(-110%); }
  100% { transform: translateX(420%); }
}

@keyframes gordaLmIn {
  from { opacity: 0; transform: translateY(8px) scale(.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}

@keyframes gordaLmFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes gordaLmFadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}

.gorda-lm-fade-enter-active {
  animation: gordaLmFadeIn .2s ease both;
}

.gorda-lm-fade-leave-active {
  animation: gordaLmFadeOut .2s ease both;
}

.gorda-lm-card {
  animation: gordaLmIn .28s cubic-bezier(.2,.7,.3,1) both;
}

.gorda-lm-ring {
  animation: gordaLmSpin .85s linear infinite;
}

.gorda-lm-core {
  animation: gordaLmPulse 1.3s ease-in-out infinite;
}

.gorda-lm-seg {
  animation: gordaLmBar 1.25s cubic-bezier(.5,0,.3,1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .gorda-lm-ring,
  .gorda-lm-core,
  .gorda-lm-seg,
  .gorda-lm-card {
    animation: none !important;
  }
}
</style>
