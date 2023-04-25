import personalizacoes from "../components/Dashboard/Personalizacoes.js";

export default {
  props:[],
  data () {
    return {
      ready: false,
      isLoading: false,
      path: ''
    }
  },
  components:{
    "personalizacoes": personalizacoes,
  },
  created: async function(){
    if(window.location.pathname.split('/').length != 1) this.path = window.location.pathname.split('/')[1]
  },
  mounted: async function(){
    $(document).ready(() => {
      setTimeout(() => {
        this.ready = true;
      }, 500);
    });
  },
  filters: {
    
  },
  methods: {
    loadingComplete: function(){
      console.log('Opa');
      this.isLoading = true;
    }
  },
  template: `
    <div id="root" v-if="ready">
      <personalizacoes :path="path" :loading="isLoading" v-on:loading="loadingComplete"></personalizacoes>
    </div>
  `,
}