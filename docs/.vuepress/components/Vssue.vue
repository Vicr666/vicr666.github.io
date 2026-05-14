<template>
  <div class="lazy-vssue">
    <ClientOnly>
      <component
        :is="vssueComponent"
        v-if="vssueComponent && vssueOptions"
        :options="vssueOptions"
      />
      <div v-else ref="sentinel" class="lazy-vssue-placeholder">
        <button
          v-if="!isLoading"
          class="lazy-vssue-trigger"
          type="button"
          @click="loadVssue"
        >
          加载评论
        </button>
        <span v-else class="lazy-vssue-status">评论加载中...</span>
        <span v-if="loadError" class="lazy-vssue-status error">{{ loadError }}</span>
      </div>
    </ClientOnly>
  </div>
</template>

<script>
import createVssueOptions from '../config/vssue';

export default {
  name: 'LazyVssue',

  data() {
    return {
      isLoading: false,
      loadError: '',
      observer: null,
      vssueComponent: null,
      vssueOptions: null,
    };
  },

  mounted() {
    this.setupObserver();
  },

  beforeDestroy() {
    this.teardownObserver();
  },

  methods: {
    setupObserver() {
      if (this.vssueComponent || this.isLoading || !this.$refs.sentinel) {
        return;
      }

      if ('IntersectionObserver' in window) {
        this.observer = new window.IntersectionObserver(
          entries => {
            if (entries.some(entry => entry.isIntersecting)) {
              this.loadVssue();
            }
          },
          {
            rootMargin: '300px 0px',
          }
        );

        this.observer.observe(this.$refs.sentinel);
        return;
      }

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => this.loadVssue());
        return;
      }

      window.setTimeout(() => this.loadVssue(), 1000);
    },

    teardownObserver() {
      if (!this.observer) {
        return;
      }

      this.observer.disconnect();
      this.observer = null;
    },

    async loadVssue() {
      if (this.vssueComponent || this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.loadError = '';
      this.teardownObserver();

      try {
        const [vssueModule, apiModule] = await Promise.all([
          import(/* webpackChunkName: "vssue" */ 'vssue'),
          import(/* webpackChunkName: "vssue" */ '@vssue/api-github-v3'),
          import(/* webpackChunkName: "vssue" */ 'vssue/dist/vssue.min.css'),
        ]);

        const component =
          vssueModule.VssueComponent ||
          (vssueModule.default && vssueModule.default.VssueComponent);
        const api = apiModule.default || apiModule;

        if (!component || !api) {
          throw new Error('Vssue load failed.');
        }

        this.vssueComponent = component;
        this.vssueOptions = {
          ...createVssueOptions(this.$lang || 'zh-CN'),
          api,
        };
      } catch (error) {
        this.loadError = '评论加载失败，请稍后重试';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.lazy-vssue-placeholder {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding: 16px 18px;
  border: 1px solid #e6e8eb;
  border-radius: 10px;
  background: #fafbfc;
}

.lazy-vssue-trigger {
  border: 1px solid #1677ff;
  border-radius: 999px;
  background: #1677ff;
  color: #fff;
  padding: 8px 18px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.lazy-vssue-trigger:hover {
  background: #0958d9;
  border-color: #0958d9;
}

.lazy-vssue-status {
  color: #4b5563;
  font-size: 14px;
}

.lazy-vssue-status.error {
  color: #cf1322;
}
</style>
