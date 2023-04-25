export default {
  props: ['url'],
  data () {
    return {
      blobUrl: ''
    }
  },
  created: async function(){
    if(this.url.match('storage.googleapis.com') != null || this.url.match('static.rock.so') != null) this.blobUrl = this.url
    else this.blobUrl = await this.blobFile(this.url);
  },
  methods:{
    blobFile: async (file) => {
      return new Promise(async resolve => {
        await fetch(file).then(res => res.blob())
          .then(blob => {
          resolve(URL.createObjectURL(blob));
        })
      });
    }
  },
  template: `
    <img :src="blobUrl"">
  `
};