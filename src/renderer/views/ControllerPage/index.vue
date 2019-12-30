<template>
  <div class="page-wrap">
    <div class="web-view">
      <webview ref="webview" :preload="preload" downloadU nodeintegration nodeIntegrationInSubFrames disablewebsecurity
               style="width: 100%;height: 100%" :src="webUrl"></webview>
    </div>
    <div class="controller">
      <Controller></Controller>
    </div>
  </div>
</template>

<script>
  import Controller from './Controller'
  import {readFile} from '../../../utils/readFile';
  import {ipcRenderer} from 'electron'
  import XLSX from 'xlsx'

  export default {
    name: 'controller-page',
    components: {Controller},
    data () {
      return {
        // webUrl: 'https://b.jclps.com',
        webUrl: 'http://localhost:9900',
        preload: 'file://' + __static + '/expand/connect.js'
      }
    },
    methods: {
      // open (link) {
      //   this.$electron.shell.openExternal(link)
      // }
      downloadEvent () {
        ipcRenderer.on('main-download', (ev, msg) => {
          const {webview} = this.$refs
          if (msg.status === 'processing') {
            webview.send('msg', 'processing: >>>' + msg.name)
            webview.send('msg', 'processing: >>>' + msg.path)
            return
          }
          webview.send('msg', 'success: >>>' + msg.name)
          console.log(msg)
          const data = XLSX.readFile(msg.path)
          console.log(data)
          var wc = this.$refs.webview.getWebContents();
          try {
            wc.debugger.attach("1.1");
          } catch (err) {
            console.error("Debugger attach failed : ", err);
          };
          wc.debugger.sendCommand("DOM.getDocument", {}, function (err, res) {
            wc.debugger.sendCommand("DOM.querySelector", {
              nodeId: res.root.nodeId,
              selector: "#file"  // CSS selector of input[type=file] element
            }, function (err, res) {
              wc.debugger.sendCommand("DOM.setFileInputFiles", {
                nodeId: res.nodeId,
                files: [msg.path]  // Actual list of paths
              }, function (err, res) {
                wc.debugger.detach();
                webview.send('upload-file', msg)
              });
            });
          })


        })
      }
    },
    mounted () {
      this.downloadEvent()
      const {webview} = this.$refs
      webview.addEventListener('dom-ready', () => {
        // webview.openDevTools()//webview加载完成，可以处理一些事件了
        // const data = readFile('expand/connect.js')
        // webview.executeJavaScript(data)
        const j = readFile('expand/actions.js')
        webview.executeJavaScript(j)
        webview.send('msg', 'hello webview') //向webview嵌套的页面响应事件


      })

      webview.addEventListener('crashed', err => {
        console.log(err)
      })
      // wv -- WebView


        // webview.addEventListener('did-finish-load', () => {
      //   webview.getWebContents().session.on('will-download', (event, item, webContents) => {
      //     // Set the save path, making Electron not to prompt a save dialog.
      //     console.log(event, item.getURL())
      //     event.preventDefault()
      //
      //     // item.setSavePath('file://' + __static + '/' + item.getFilename())
      //     //
      //     // item.on('updated', (event, state) => {
      //     //   if (state === 'interrupted') {
      //     //     console.log('Download is interrupted but can be resumed')
      //     //   } else if (state === 'progressing') {
      //     //     console.log(`Received bytes: ${item.getReceivedBytes()}`)
      //     //   }
      //     // })
      //     // item.once('done', (event, state) => {
      //     //   if (state === 'completed') {
      //     //     console.log('Download successfully')
      //     //   } else {
      //     //     console.log(`Download failed: ${state}`)
      //     //   }
      //     // })
      //   })
      // })

      webview.addEventListener('new-window', async (e) => {
        const protocol = require('url').parse(e.url).protocol
        if (protocol === 'http:' || protocol === 'https:') {
          // await shell.openExternal(e.url)
          console.log(e.url)
        }
      })


      window.$sendMsg = (msg) => {
        webview.send('msg', msg)
      }

      webview.addEventListener('ipc-message', (event) => { //ipc-message监听，被webview加载页面传来的信息

        console.log(event.channel)

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
      width: 100px;
      border-left: 1px solid #42b983;
    }
  }
</style>


