<template>
  <div id = "editor">
    <logo v-if = "!(progress === 'none')" :text = 'progress'></logo>
    <div v-if = "!(progress === 'none')" class = "window"></div>
    <div class = "submit">
      <v-icon v-if = "edited" @click = "errorCheck" size = "70px" color = "var(--guru-color)">cloud_upload</v-icon>
      <v-icon v-else size = "70px" color = "var(--guru-color)">cloud_done</v-icon>
    </div>
    <div class = "topl">
      <v-icon @click = "back" size = "70px" color = "var(--guru-color)">first_page</v-icon>
    </div>
    <input ref = "title" :key = "'page_title'" type = "text" />
    <prism-editor key = "myeditor" v-model = "input" language = "html"></prism-editor>
    <div :ref = "'asset_ref_' + i" class = "files" v-for = "(asset, i) in assets" :key = "'a '+i">
      <v-icon size = "50px" :key = "'k '+i" color = "#FFFFFF">add_photo_alternate</v-icon>
      {{assetFiles[i]?(assetFiles[i].target.files[0].name):('Please upload ' + asset)}}
      <input @input = "uploadFile(i, $event)" type = "file" />
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';


  export default {

    name: 'editor',
    props:{
      page: {
        default: function(){
          return {
            content: '',
            title: '',
            assets: '',
          }
        }
      },
      indx:{
        default: 0
      }
    },
    data: () => ({
      page_title: '',
      input: '',
      assets: [],
      assetFiles: {},
      progress: 'none',
      linkedAssets: ''
    }),
    computed: {
      edited(){
        return !((this.input == this.page.content)&&(this.title == this.page.title)&&(this.linkedAssets == this.page.assets))
      }
    },
    methods: {
      set_title(e){
        console.log(e)
      },
      back(){
        if(this.edited){
          if(confirm("All edits will be lost, are you sure")){
            this.$emit("back")
          }
        }else{
          this.$emit("back")
        }
      },
      uploadFile(i, e){
        this.$refs['asset_ref_'+i][0].style.setProperty('background', '#30bb2b')
        this.assetFiles[i] = e;
        this.$forceUpdate();
        console.log(this.assetFiles);
      },
      errorCheck(){
        // if(true){
          if(confirm('u sure bro')){
            if(this.assetFiles.length > 0){
              this.upload(0);
            }else{
              firebase.database().ref('cms/pages/'+this.indx).set({
                content: this.input,
                assets: this.linkedAssets,
                title: this.$refs.title.value,
              });
              this.$emit("back");
            }
          }
        // }else{
        //   alert("You haven't uploaded all assets");
        // }
      },
      upload(i){
        var file = this.assetFiles[i].target.files[0]
        var upload = firebase.storage().ref().child('cms/assets'+file.name).put(file);
        upload.on('state_changed', (snapshot) => {
          this.progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100/this.assets.length)+'`';
          console.log(this.progress)
        }, (error) => {alert(error)}, () => {
          upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.input.replace(this.assets[i], downloadURL)
            this.linkedAssets += downloadURL;
            console.log('File available at', downloadURL);
          });
          if(i == this.assets.length - 1){
            firebase.database().ref('cms/pages/'+this.indx).set({
              content: this.input,
              assets: this.linkedAssets,
              title: this.page_title,
            });
            this.progress = 'none';
            alert('Upload Complete');
            this.$emit("back")
          }else{
            this.upload(i+1);
          }
        })
      }
    },
    watch: {
      page: function(a){
        this.input = a.content;
        this.linkedAssets = a.assets;
        this.page_title = a.title;
        this.$refs.title.value = a.title;
      },
      input: function(a){
        if(a.indexOf('<body>') != -1){
          if(confirm('Can I strip this of fluf?')){
            let styles = (/< *style *>((.|\n)*)< *\/ *style>/g).exec(a);
            if(styles&&styles.length > 1){
              styles = styles[1];
              if((/< *\/ *style>((.|\n)*)< *style *>/g).test(styles)){
                alert('multiple styles declared')
                return
              }else{
                styles = '<style type = "text/css">' + styles.replace(/^\n/, '') +'</style>'
              }
            }else{
              styles = ''
            }
            styles = styles.replace(/body{(.|\n)[^}]+}/, '');
            let body = (/< *body *>((.|\n)*)< *\/ *body>/g).exec(a);
            if(body&&body.length>1){
              body = body[1].replace()
              if((/< *\/ *body>((.|\n)*)< *body *>/g).test(styles)){
                alert('multiple bodys declared')
                return
              }
            }else{
              alert('No body')
              return
            }
            this.input = body.replace(/^(( {4}|\n))/gm, '') +'\n' +styles.replace(/^(( {2}|\n))/gm, '')
            this.assets =[];
            this.input.replace(/src *= *"(.*)"/gm, (x, y) => {
              if((this.linkedAssets.indexOf(y) == -1)&&(y.indexOf('https://firebasestorage.googleapis.com/v0/b/guru-admin.appspot.com') == -1)){
                this.assets.push(y)
              }
            })
          }
        }
      }
    },
    created(){
      this.input = this.page.content;
      this.linkedAssets = this.page.assets;
      this.page_title = this.page.title;
    },
    mounted(){
      this.$refs.title.value = this.page.title;
    }
  }
</script>
<style>
#my-editor{
  width: 100%;
  height: 60vw;
  background: #FEF9E4;
  font-family: 'Courier New';
  font-size: 20px;
}
table{
  width: 100%;
}
tr, td{
  height: 100%;
}
#editor{
  margin: 50px;
}
input[type = "text"]{
  background: grey;
  font: 40px 'Guru';
  padding: 10px 20px;
  color: var(--cream);
  width: 100%;
  margin-bottom: 20px;
  background: var(--guru-color);
  border-radius: 50px;
}
input[type = "text"]:focus{
  outline: none;
  box-shadow: 2px 2px 5px var(--guru-color)
}
.files{
  font-family: 'Courier New';
  font-size: 20px;
  line-height: 50px;
  padding: 10px 20px;
  background: #e47f7f;
  margin: 10px 0;
  border-radius: 0;
  color: white;
  position: relative;
  border-radius: 30px;
  cursor:pointer;
}
input[type = "file"]{
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  cursor: pointer;
}
.submit{
  margin: auto;
  text-align: center;
  padding: 20px 0;
}
.window{
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  z-index: 20;
  background: black;
  opacity: 0.7;
  backdrop-filter: blur(20px);
  webkit-backdrop-filter: blur(25px);
  left: 0;
}
.topl{
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
}
</style>
