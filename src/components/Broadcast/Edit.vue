<template>
  <q-card
    id="scrollId"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '1100px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit")) }}</span>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        @click="emit('onClose')"
        :disable="saving"
      >
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section class="q-pt-lg pb-0">
      <q-form ref="form">
        <div class="row">
          <div class="col-12 col-md-12 q-pr-md">
            <q-radio
              v-model="broadcast.status"
              val="active"
              :label="$t('active')"
            />
            <q-radio
              v-model="broadcast.status"
              val="inactive"
              :label="$t('inactive')"
            />
          </div>
        </div>

        <q-separator class="q-mb-xs" />
        <div class="row" v-for="lang in languages" :key="lang.locale_web">
          <div class="col-12 col-md-6 q-pr-md">
            <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
            <q-input
              v-model="broadcast.translations[lang.locale_web].title"
              :label="$t(Utils.getKey('title'))"
              dense
              autogrow
              maxlength="499"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
              type="textarea"
              outlined
            />
          </div>
          <div class="col-12 col-md-6 q-pr-md">
            <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
            <q-input
              v-model="broadcast.translations[lang.locale_web].description"
              :label="$t(Utils.getKey('description'))"
              dense
              autogrow
              maxlength="499"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
              type="textarea"
              outlined
            />
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn
        flat
        color="negative"
        class="q-px-md"
        @click="emit('onClose')"
        :disable="saving"
        >{{ $t(Utils.getKey("Cancel")) }}</q-btn
      >
      <q-btn
        color="accent"
        class="q-px-md q-ml-md"
        @click="onSubmit"
        style="color: var(--q-primary) !important"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
    <Loading :loading="isLoading" />
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import userBroadcast from "../../composables/userBroadcast";
import Utils from "../../helpers/Utils";
import "../../css/crop.css";
import "../../js/croper";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";
import { values } from "lodash-es";

const { t } = useI18n();
const props = defineProps({ data: Object, languages: Array });
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, update, getUsing } = userBroadcast();

const languages = ref(props.languages);
const broadcast = ref({ ...props.data });
console.log(broadcast.value);
const banner_isusing = ref(false);
const isLoading = ref(false);

const images = ref([]);
const images_url = ref({});
const cropper = ref({});
const form = ref(null);
const imageRequired = ref(false);
const imageValidatonMsg = ref({});
const video_url = ref({});
const videos = ref({});
const fileTooBig = ref({});
const uploadChange = (e) => {
  let imgName = e.target.name;
  console.log("e", e.target.files[0]);
  imageValidatonMsg.value[imgName] = "";
  let allowExtn = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/bmp",
    "image/tif",
  ];
  if (!allowExtn.includes(e.target.files[0].type)) {
    imageValidatonMsg.value[imgName] = "File is not a image";
    console.log("imageValidatonMsg", imageValidatonMsg.value);

    return;
  }
  let result = document.querySelector(".result" + imgName);
  if (e.target.files.length) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target.result) {
        let img = document.createElement("img");
        img.id = "image";
        img.src = e.target.result;
        images_url.value[imgName] = img.src;
        result.innerHTML = "";
        result.appendChild(img);
        // cropper.value[imgName] = new Cropper(img);
      }
    };
    cropper.value[imgName] = e.target.files[0];
    console.log("e", images_url.value);
    reader.readAsDataURL(e.target.files[0]);
  }
};

const uploadChangeVideo = (e) => {
  let videoID = e.target.name;
  video_url.value[videoID] = "";
  fileTooBig.value[videoID] = "";
  let allowExtn = [
    "video/mp4",
    "video/mov",
    "video/wmv",
    "video/wmv",
    "video/webm",
    "video/mkv",
  ];
  if (!allowExtn.includes(e.target.files[0].type)) {
    fileTooBig.value[videoID] = "File is not a video";
    return;
  }
  // 10000000 = 1OMB
  if (e.target.files[0].size > 10000000 * 10) {
    fileTooBig.value[videoID] = "Too large only below 100MB";
    return;
  } else {
    imageRequired.value = false;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      video_url.value[videoID] = reader.result;
      // console.log(video_url.value);
    };
    console.log(video_url.value);
    videos.value[videoID] = e.target.files[0];
  }
};

watch(
  () => broadcast.value.name,
  () => {
    console.log(broadcast.value.name);
    broadcast.value.slug = broadcast.value.name
      .toLocaleLowerCase()
      .replace(/ /g, "-");
  }
);

async function onSubmit() {
  try {
    let validation = await form.value.validate();
    if (!validation) {
      document
        .getElementById("scrollId")
        .scroll({ top: 0, left: 0, behavior: "smooth" });
      return;
    }

    const FormData = require("form-data");
    const fomrData = new FormData();

    languages.value.forEach((lg, index) => {

      if (broadcast.value.translations[lg.locale_web].title != "") {
        fomrData.append(`translation_name[${index}][language_id]`, lg.id);
        fomrData.append(`translation_name[${index}][field_name]`, "title");
        fomrData.append( `translation_name[${index}][translation]`,broadcast.value.translations[lg.locale_web].title);
      }

      if (broadcast.value.translations[lg.locale_web].description != "") {
        fomrData.append(`translation_desc[${index}][language_id]`, lg.id);
        fomrData.append(`translation_desc[${index}][field_name]`,"description");
        fomrData.append(`translation_desc[${index}][translation]`, broadcast.value.translations[lg.locale_web].description);
      }

    });
    fomrData.append("status", broadcast.value.status);
    isLoading.value = true;
    await update(broadcast.value.id, fomrData);
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
    isLoading.value = false;
    emit("onUpdated");
    isLoading.value = false;

  } catch (err) {
    $q.notify({
      position: "top",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
    document
      .getElementById("scrollId")
      .scroll({ top: 0, left: 0, behavior: "smooth" });
  }
}
onMounted(async () => {

});
</script>
