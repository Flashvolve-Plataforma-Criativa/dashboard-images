export default {
  props: ["loading", "path"],
  data () {
    return {
      ready: true,
      header_search: '',
      search_date_start: 0,
      search_date_end: 0,
      text_search_date: 'Pesquise por data de criação...',
      campaign: [],
      selected_campaign: 'Todas as campanhas',
      allPersonalizacoes: [],
      personalizacoes: [],
      filterPersonalizacoes: [],
      uniqueUsers: [],
      uniqueUsersCount: 0,
      page: 1,
      logo: '',
      empresa: '',
      downloadImages: [],
      showGototop: false
    }
  },
  components:{},
  created: async function(){
    
    $(document).ready(async () => { 
    
      try{
        const { data } = await this.$root.instanceAxios.get(`https://api.flashvolve.io/api:bNuZeanP/personalizacao_empresa?empresa=${this.path.toUpperCase()}`).catch(err => console.log(err))

        this.allPersonalizacoes = data;
        this.uniqueUsers = (await this.$root.instanceAxios.get(`https://api.flashvolve.io/api:YQ1N4O0o/clientes?empresa=${this.path.toUpperCase()}`).catch(err => console.log(err))).data;
        
        switch(this.path.toUpperCase()){
          case 'TOKIOMARINE':
            this.logo = "https://www.berdineseguros.com.br/wp-content/uploads/2016/08/tokiomarine.jpg";
            this.empresa = 'Tokiomarine';
            break;
        }
        
        window.addEventListener('scroll', this.scrollHandler);

        $('input[name="daterange"]').daterangepicker({
          opens: 'left',
          maxDate: moment(),
          locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Limpar',
            applyLabel: 'Pesquisar',
            customRangeLabel: 'Personalizado'
          },
          ranges: {
            'Hoje': [moment(), moment()],
            'Ontem': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Ultimos 7 dias': [moment().subtract(6, 'days'), moment()],
            'Ultimos 30 dias': [moment().subtract(29, 'days'), moment()],
            'Este mês': [moment().startOf('month'), moment().endOf('month')],
            'Mês passado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          },
          alwaysShowCalendars:true,
          autoUpdateInput: false
        });
        
        this.$emit("loading");
        
        window.addEventListener("scroll", () => {
          if (window.scrollY >= 1000) this.showGototop = true;
          else this.showGototop = false;
        });
        
        this.$root.socket.on(this.path, async (json) => {
          this.allPersonalizacoes.unshift(json);
        });
        
      }catch(error){
        console.log(error);
      }
      
    });
    
  },
  watch:{
    allPersonalizacoes: async function(){
      $(document).ready(() => {
        const optionsCampaign = this.allPersonalizacoes.reduce((campaign, obj) => {
          const nameCampaign = obj.Nome_da_arte;
          if (!campaign.includes(nameCampaign)) {
            campaign.push(nameCampaign);
          }
          return campaign;
        }, []);
        
        this.campaign = optionsCampaign;

        setTimeout(() => {

          $grid.imagesLoaded().progress(() => {
            $grid.masonry({
              itemSelector: 'li',
              horizontalOrder: true,
              percentPosition: true
            });
          });

          this.ready = true;
        }, 500);

      });
    },
    uniqueUsers: async function(){
      
      const uniqueUsers = this.uniqueUsers.filter((user, index, users) => {
        return index === users.findIndex((u) => u.whatsapp === user.whatsapp);
      });
      
      console.log(uniqueUsers);
      
      this.uniqueUsersCount = uniqueUsers.length;
    },
    page: async function(){
      this.personalizacoes = this.filterPersonalizacoes.slice(0, 12 * this.page);
      if(this.personalizacoes.length != 0){
        setTimeout(() => {
          $grid.imagesLoaded().progress(() => {
            $grid.masonry({
              itemSelector: 'li',
              horizontalOrder: true,
              percentPosition: true
            });
          });

          setTimeout(() => {
            window.addEventListener('scroll', this.scrollHandler);
          }, 500);
        }, 100);
      }
    },
    header_search: async function(){
      this.page = 1;
    },
    search_date_start: async function(){
      this.page = 1;
    },
    selected_campaign: async function(){
      this.page = 1;
    }
  },
  computed:{
    personalizacoesFilter: function(){  
      
      let personalizacoesFilter;
      personalizacoesFilter = this.allPersonalizacoes.filter((personalizacao) => {
        return personalizacao.whatsapp.match(this.header_search);
      });
      
      let uniqueUsers = this.uniqueUsers.filter((user, index, users) => {
        return index === users.findIndex((u) => u.whatsapp === user.whatsapp);
      });
      
      if(this.search_date_start != 0 && this.search_date_end != 0){
        personalizacoesFilter = personalizacoesFilter.filter((personalizacao) => {
          return personalizacao.created_at >= this.search_date_start && personalizacao.created_at <= this.search_date_end;
        });
        
        uniqueUsers = uniqueUsers.filter((user) => {
          return user.created_at >= this.search_date_start && user.created_at <= this.search_date_end;
        });        
        
      }
      
      if(this.selected_campaign != 'Todas as campanhas'){
        personalizacoesFilter = personalizacoesFilter.filter((personalizacao) => {
          return personalizacao.Nome_da_arte.match(this.selected_campaign);
        });
        
        uniqueUsers = uniqueUsers.filter((user) => {
          return personalizacoesFilter.some((personalizacao) => personalizacao.whatsapp == user.whatsapp);
        });  
        
      }

      console.log(personalizacoesFilter);
      this.filterPersonalizacoes = personalizacoesFilter;
      this.personalizacoes =  this.filterPersonalizacoes.slice(0, 12 * this.page);
      this.uniqueUsersCount = uniqueUsers.length;
      
      if(this.personalizacoes.length != 0){
        setTimeout(() => {
        
          $grid.imagesLoaded(() => {
            $grid.masonry({
              itemSelector: 'li',
              horizontalOrder: true,
              percentPosition: true
            });
          });

          new AnimOnScroll( document.getElementById( 'grid' ), {
            minDuration : 0.4,
            maxDuration : 0.7,
            viewportFactor : 0.2
          });

          setTimeout(() => {
            window.addEventListener('scroll', this.scrollHandler);
          }, 500);
        }, 100);
      }
      
      
      return this.personalizacoes;
    }
  },
  mounted: async function(){
    $('input[name="daterange"]').on('apply.daterangepicker', (ev, picker) => {
      let startDate = new Date(picker.startDate._d);
      startDate.setHours(0, 0, 0);

      let endDate = new Date(picker.endDate._d);
      endDate.setHours(0, 0, 0);
      
      let startDayText = startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate();
      let startMonthText = startDate.getMonth() + 1 < 10 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1;
      
      let endDayText = endDate.getDate() < 10 ? `0${endDate.getDate()}` : endDate.getDate();
      let endMonthText = endDate.getMonth() + 1 < 10 ? `0${endDate.getMonth() + 1}` : endDate.getMonth() + 1;
      
      this.text_search_date = `${startDayText}/${startMonthText}/${startDate.getFullYear()} - ${endDayText}/${endMonthText}/${endDate.getFullYear()}`;
      this.search_date_start = startDate.getTime();
      this.search_date_end = endDate.getTime();
      
    });
    
    $('input[name="daterange"]').on('cancel.daterangepicker', (ev, picker) => {
      this.search_date_start = 0;
      this.search_date_end = 0;
      this.text_search_date = "Pesquise por data de criação...";
    });
  },
  methods:{
    scrollHandler: async function(){
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 450) {
        window.removeEventListener('scroll', this.scrollHandler);
        this.page += 1;
      }
    },
    addImageDownload: async function(id){
      
      const validationImage = this.downloadImages.filter(item => {
        return item == id;
      });
      
      if(validationImage.length == 0) this.downloadImages.push(id);
      else this.downloadImages.splice(this.downloadImages.indexOf(validationImage[0]), 1);
      
    },
    downloadAllImages: async function(){
      
    },
    downloadSelectedImages: async function(){
      
    },
    gototop: async function(){
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  },
  template: `
    <div id="personalizacoes" v-show="loading">
    
      <div class="header-info">
        <div class="header-info-company">
          <div class="company">
            <div class="logo">
              <img :src="logo">
            </div>
            <div class="info">
              <h3>{{empresa}}</h3>
            </div>
          </div>

          <div class="data-company">
            <div>
              <h3>Usuários</h3>
              <span>{{uniqueUsersCount}}</span>
            </div>
            <div>
              <h3>Personalizações</h3>
              <span>{{filterPersonalizacoes.length}}</span>
            </div>
            <div>
              <h3>Média p/ usuário</h3>
              <span>{{(filterPersonalizacoes.length / uniqueUsersCount) > 0 ? (filterPersonalizacoes.length / uniqueUsersCount).toFixed(2) : 0}}</span>
            </div>
          </div>
        </div>
      </div>
    
      <div class="headers-personalizacoes">
        <div class="filters-header">
          <div class="select-campaign">
            <select name="select" v-model="selected_campaign">
              <option value="Todas as campanhas" selected>Todas as campanhas</option>
              <option v-for="item in campaign" :value="item">{{item}}</option>
            </select>
          </div>
          <div class="search-header">
            <ion-icon name="search"></ion-icon>
            <input type="text" v-model="header_search" placeholder="Pesquise por número ou nome..."> 
          </div>
          <div class="search-time">
            <ion-icon name="calendar"></ion-icon>
            <input type="text" name="daterange" :placeholder="text_search_date"/>
          </div>
        </div>
      </div>
    
      <div class="container-masonry" :ready="ready == true">
        <ul class="grid effect-4" id="grid">
          <li v-for="personalizacao in personalizacoesFilter" :selected="downloadImages.includes(personalizacao.id) == 1 ? true : false">
            <div class="download-select" v-on:click="addImageDownload(personalizacao.id)"><ion-icon :name="downloadImages.includes(personalizacao.id) == 1 ? 'checkbox-outline' : 'square-outline'"></ion-icon></div>
            <div class="download"><ion-icon name="cloud-download-outline"></ion-icon></div>
            <a><img :src="personalizacao.cloudinary"></a>
          </li>
        </ul>
      </div>
      
      
      <div v-if="downloadImages.length > 0" class="download-images-selected">Fazer download das imagens selecionadas {{downloadImages.length}}</div>
      <div v-if="showGototop" class="gototop" v-on:click="gototop"><ion-icon name="arrow-up-outline"></ion-icon></div>
      
    </div>
  `
};