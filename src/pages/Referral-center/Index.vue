<template>
  <q-page>
    <q-card class="card_container q-pa-lg mt-0" :class="  $q.dark.isActive ? 'bg-dark': 'bg-white' ">
    
      <div class="row">
      <div class="col-2">
      Referral Link
      </div>
      <div class="col-8">
      
      <a :href="link_url" class="" target="_blank" rel="noopener noreferrer" ref="mylink">
      {{ link_name  }}</a>
      <q-btn color="primary" @click="copyUrl" label="Copy" />
      </div>
    </div>
    <br/>
    <div class="row">
      <div class="col-2">
      QR Code
      </div>
      <div class="col-10">
      <img :src="qrcode" :width="100" :height="100"/>
      <q-btn color="primary" label="Download Ad" />
      </div>
    </div>
       
    </q-card>
    
    

  </q-page>
</template>

<script setup>

let a = 'home'
const link_name = ref("www.google.com")
const QRCode = require('qrcode')
import { ref, provide, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";


import Utils from "src/helpers/Utils";
const { t, locale } = useI18n();

const qrcode = ref("")
onMounted(async () => {
  QRCode.toDataURL('I am a pony!', function (err, url) {
    console.log(url)
    qrcode.value = url
  })
});

const copyUrl = () => {
  var Url = link_name.value;
  navigator.clipboard.writeText(Url);

};

</script>
<style scoped>
.mt_16 {
  margin-top: 16px;
}
@media only screen and (max-width: 912px) {
  .p_small {
    padding: 16px !important;
  }
  .mt_16 {
    margin-top: 0px;
  }
}
.amount_card {
  min-height: 142px;
}
.card_style {
  box-shadow: none;
  height: 400px;
  background: #fff;
  padding: 12px;
}
.card_style_small {
  box-shadow: none;
  height: 146px;
  background: #fff;
  padding: 12px;
}
.card_container {
  margin: 0px;
  margin-left: 0px;
  box-shadow: none;
  min-height: 85vh;
  background: #f5efeb;
}
.active_num {
  font-weight: bold;
  position: absolute;
  font-size: 20px;
  z-index: 98;
}

@media screen and (max-width: 912px) {
  .card_style_small {
    box-shadow: none;
    height: auto;
    background: #fff;
    padding: 12px;
  }
  .d_flex_between {
    justify-content: space-around;
  }
}
</style>
