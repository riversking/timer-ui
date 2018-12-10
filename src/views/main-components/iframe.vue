<template>
  <Card class="iframe-card">
    <Spin size="large" fix v-if="loading"></Spin>
    <iframe v-if="$route.query.src" :src="$route.query.src" class="iframe" ref="iframe"></iframe>
    <iframe v-else :src="target" class="iframe" ref="iframe"></iframe>
  </Card>
</template>

<script>
  export default {
    name: "Iframe",
    data() {
      return {
        loading: true
      }
    },
    created() {
    },
    mounted() {
      this.load()
    },
    props: [
      'target'
    ],
    watch: {
      $route: function() {
        this.load();
      }
    },
    components: {
    },
    methods: {
      // 加载浏览器窗口变化自适应
      resize() {
        window.onresize = () => {
          this.iframeInit()
        };
      },
      // 加载组件
      load() {
        this.resize()
        this.$route.query.src = this.$route.query.src
          ? this.$route.query.src.replace("$", "#")
          : ""
        this.iframeInit()
      },
      //iframe窗口初始化
      iframeInit() {
        const iframe = this.$refs.iframe
        if (!iframe) {
          return
        }
        const clientHeight = document.documentElement.clientHeight - 130
        iframe.style.height = `${clientHeight}px`
        if (iframe.attachEvent) {
          iframe.attachEvent('onload', () => {
            this.loading = false
          })
        } else {
          iframe.onload = () => {
            this.loading = false
          }
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .iframe {
    width: 100%;
    height: 100%;
    border: 0;
    overflow: hidden;
    box-sizing: border-box;
  }
</style>
