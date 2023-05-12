<template>
  <q-page>
    <q-card
      class="card_container q-pa-lg mt-0"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
    >
      <div class="row">
        <div class="col-2">{{ $t(Utils.getKey("Referral Link")) }}</div>
        <div class="col-8" style="display: flex; flex-direction: column">
          <a
            :href="link_name"
            class=""
            target="_blank"
            style="padding-left: 25px"
            rel="noopener noreferrer"
            ref="mylink"
          >
            {{ link_name }}</a
          ><br />
          <div
            style="
              display: flex;
              margin-top: 10px;
              padding-left: 25px;
              width: 100%;
            "
          >
            <q-btn
              style="width: fit-content"
              color="primary"
              @click="copyUrl"
              :label="t(Utils.getKey('Copy URL'))"
            />
          </div>
        </div>
      </div>
      <br />
      <div class="row">
        <div class="col-2">{{ $t(Utils.getKey("QR Code")) }}</div>
        <div class="col-10" style="display: flex; flex-direction: column">
          <img :src="qrcode" width="250" />
          <div
            style="
              display: flex;
              margin-top: 10px;
              padding-left: 25px;
              width: 100%;
            "
          >
            <q-btn
              style="width: fit-content"
              color="primary"
              @click="downloadQRCode"
              :label="t(Utils.getKey('download qr code'))"
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
const QRCode = require("qrcode");
import { ref, onMounted, inject } from "vue";
const auth = inject("auth");

import { useI18n } from "vue-i18n";

import Utils from "src/helpers/Utils";
const { t, locale } = useI18n();
const link_name = ref("");
const qrcode = ref("");

onMounted(async () => {
  link_name.value =  process.env.API_REFFERAL_URL + auth.state.user.referral_code
  QRCode.toDataURL( process.env.API_REFFERAL_URL + auth.state.user.referral_code, function (err, url) {
    qrcode.value = url;
  });
});
const copyUrl = () => {
  var Url = link_name.value;
  navigator.clipboard.writeText(Url);
};

const downloadQRCode = () => {
  let a = document.createElement("a"); //Create <a>
  a.href = qrcode.value; //Image Base64 Goes here
  a.download = "QRCode.png"; //File name Here
  a.click();
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
