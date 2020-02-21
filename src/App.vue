<template>
  <div>
    <h1>Guru CMS</h1>
    <v-window v-model = "mode">
      <v-window-item>
        <div class = "page-list-item" v-for = "(page, i) in pages" :key = "'pli_'+i">
          <span :key = "'tite_'+i">{{page.title}}</span>
          <v-icon @click = "deletePage(i)" color = "var(--cream)" size = "40px"  class = "icon" :key = "'id_'+i">
            delete
          </v-icon>
          <v-icon @click = "edit(i)" color = "var(--cream)" size = "40px" class = "icon" :key = "'ie'+i">
            edit
          </v-icon>
          <v-icon @click = "moveup(i)" v-if = "i > 0" color = "var(--cream)" size = "40px" class = "icon" :key = "'iau_'+i">
            arrow_upward
          </v-icon>
          <v-icon @click = "movedown(i)" v-if = "i < pages.length-1" color = "var(--cream)" size = "40px" class = "icon" :key = "'iad_'+i">
            arrow_downward
          </v-icon>
        </div>
        <v-icon @click = "add" size = "70px" color = "var(--guru-color)" class = "icon-plus">add</v-icon>

      </v-window-item>
      <v-window-item>
        <editor :indx = "edit_indx" :page = "edit_page" @back = "mode = 0"></editor>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import editor from './components/editor';
import firebase from 'firebase';

export default {
  name: 'App',

  components: {
    editor,
  },

  data: () => ({
    pages: [],
    mode: 0,
    edit_page: 0,
    edit_indx: 0,
  }),
  methods: {
    deletePage(i){
      if(confirm('Are you sure bro')){
        this.pages.splice(i, 1);
        firebase.database().ref('cms/pages').set(this.pages)
      }
    },
    edit(i){
      console.log('som')
      this.edit_page = this.pages[i];
      this.mode = 1;
      this.edit_indx = i
    },
    movedown(i){
      let temp = this.pages[i+1];
      this.pages[i+1] = this.pages[i];
      this.pages[i] = temp;
      firebase.database().ref('cms/pages').set(this.pages)
    },
    moveup(i){
      let temp = this.pages[i-1];
      this.pages[i-1] = this.pages[i];
      this.pages[i] = temp;
      firebase.database().ref('cms/pages').set(this.pages)
    },
    add(){

      this.edit_page = {
        content: 'add content here',
        title: 'title here',
        assets: ''
      };
      this.edit_indx = this.pages.length;
      this.mode = 1;
    }
  },
  created(){
    firebase.database().ref('cms/pages').on('value', (sc) => {

      this.pages = sc.val();
    })
  }
};
</script>

<style>
:root{
  --guru-color: #ff9b34;
  --cream: #FEF9E4;
}
  h1{
    font-family: 'Guru';
    font-size: 60px;
    padding: 40px;
    text-align: center;
  }
  .page-list-item{
    font: 30px 'Guru';
    line-height: 50px;
    color: var(--cream);
    background: var(--guru-color);
    padding: 10px 30px;
    border-radius: 100px;
    margin: 20px;
  }
  .page-list-item span{
    max-width: calc(100% - 200px);
    display: inline-block;
    overflow: hidden;
  }
  .icon{
    float: right;
    line-height: 50px;
    cursor: pointer;
    padding: 5px;
  }
  .icon-plus{
    float: right;
    padding: 0 40px;
    cursor: pointer;
  }
</style>
