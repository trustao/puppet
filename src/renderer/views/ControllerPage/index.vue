<template>
  <div class="page-wrap">
    <div class="web-view">
      <webview ref="webview" nodeintegration style="width: 100%;height: 100%" src="https://b.jclps.com"></webview>
    </div>
    <div class="controller">
        <Controller></Controller>
    </div>
  </div>
</template>

<script>
  import Controller from './Controller'
  export default {
    name: 'controller-page',
    components: {Controller},
    data () {
      return {

      }
    },
    methods: {
      // open (link) {
      //   this.$electron.shell.openExternal(link)
      // }
    },
    mounted() {
      const {webview} = this.$refs
      webview.addEventListener('dom-ready', () => {
        webview.openDevTools()//webview加载完成，可以处理一些事件了
        webview.send('ping') //向webview嵌套的页面响应事件
      })
    }
  }
</script>

<style lang="less" scoped>
  .page-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    .web-view {
      flex: 1;
    }
    .controller {
      width: 500px;
      border-left: 1px solid #42b983;
    }
  }
</style>


