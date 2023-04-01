<template>
  <q-card
    id="scrollId"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '1100px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("New gallery")) }}</span>
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
              v-model="gallery.status"
              val="active"
              :label="$t('active')"
            />
            <q-radio
              v-model="gallery.status"
              val="inactive"
              :label="$t('inactive')"
            />
          </div>
        </div>
        <div class="q-mx-sm row" v-for="lang in languages" :key="lang.id">
          <div class="col-12 col-md-6 q-pr-md">
            <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
            <q-input
              v-model="gallery.translations_name[lang.id]"
              :label="$t(Utils.getKey('title'))"
              dense
              autogrow
              type="textarea"
              maxlength="499"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
              outlined
            />
          </div>
          <div class="col-12 col-md-6 q-pr-md">
            <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
            <q-input
              v-model="gallery.translations_description[lang.id]"
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
          <div class="col-12 col-md-12 q-pr-md">
            <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
            <q-input
              v-model="gallery.translation_video_url[lang.id]"
              :label="$t(Utils.getKey('video_url'))"
              dense
              autogrow
              maxlength="499"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('field is required')), (val) => Utils.urlValidation(val) || $t(Utils.getKey('invalid_url'))]"
              outlined
            />
          </div>
        </div>
        <!-- <div>
          <q-toggle
            class="pl-0"
            v-model="isVideo"
            size="lg"
            :label="isVideo ? $t('video') : $t('image')"
            icon="mdi-movie"
          ></q-toggle>
        </div> -->
        <div class="q-mx-sm row">
          <div v-for="lang in languages" :key="lang.id" class="col-4 pr-3">
            <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
            <q-separator />

            <div v-if="!isVideo" class="q-mt-lg">
              <label
                class="pa-2 border"
                :class="!imageRequired ? 'border' : 'border_red'"
              >
                <i class="fa fa-image"></i> {{ $t("image") }}
                <input
                  class="mt-2"
                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                  type="file"
                  id="file-input"
                  style="display: none"
                  @change="uploadChange"
                  max="10"
                  :name="lang?.id"
                />
              </label>
              <p v-if="imageRequired" class="red mt-3">
                {{ $t("image_is_required") }}
              </p>
              <div v-show="cropper[lang.id]" class="page">
                <div class="box-2">
                  <div
                    style="height: 250px; width: 250px"
                    :class="'result' + [lang?.id]"
                  ></div>
                </div>
              </div>
              <p class="red q-mt-sm" v-if="imageValidatonMsg[lang.id]">
                {{ $t(Utils.getKey(imageValidatonMsg[lang.id])) }}
              </p>
            </div>
            <div v-else class="mb-3 q-mt-lg">
              <label
                class="pa-2 border"
                :class="!imageRequired ? 'border' : 'border_red'"
              >
                <i class="fa fa-film"></i> {{ $t("video") }}
                <input
                  class="mt-2"
                  style="display: none"
                  accept=".mp4"
                  type="file"
                  id="video_member"
                  @change="uploadChangeVideo"
                  max="10"
                  :name="lang?.id"
                />
              </label>
              <div></div>
              <video controls width="250" v-if="video_url[lang.id]">
                <source :src="video_url[lang.id]" type="video/mp4" />
              </video>
              <p class="red q-mt-sm" v-if="fileTooBig[lang.id]">
                {{ $t(Utils.getKey(fileTooBig[lang.id])) }}
              </p>
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section v-if="isUploaded && Object.keys(videos).length > 0">
      <q-linear-progress size="22px" :value="progress / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="green" :label="progress + '%'" />
        </div>
      </q-linear-progress>
      <div>
        <!-- {{ progress }} -->
      </div>
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
import useWinnerGallery from "../../composables/useWinnerGallery";
import Utils from "../../helpers/Utils";
import "../../css/crop.css";
import "../../js/croper";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";

const form = ref(null);
const { t } = useI18n();
const props = defineProps({ data: Object, languages: Array });
const emit = defineEmits(["onClose", "onAdded"]);

const $q = useQuasar();
const { saving, add, getUsing, progress } = useWinnerGallery();

const languages = ref(props.languages);
const gallery = ref({
  translations_name: {},
  translations_description: {},
  translation_video_url: {},
  position: "",
  status: "active",
  type: "",
});
const banner_isusing = ref(false);
const isLoading = ref(false);
const isUploaded = ref(false);

const images = ref([]);
const images_url = ref({});
const cropper = ref({});
const imageRequired = ref(false);

const video_url = ref({});
const videos = ref({});
const fileTooBig = ref({});
const imageValidatonMsg = ref({});
const isVideo = ref(false);

const uploadChange = (e) => {
  let imgName = e.target.name;
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
  () => gallery.value.name,
  () => {
    console.log(gallery.value.name);
    gallery.value.slug = gallery.value.name
      .toLocaleLowerCase()
      .replace(/ /g, "-");
  }
);

async function onSubmit() {
  try {
    console.log("gallery", gallery.value);
    let validation = await form.value.validate();
    if (!validation) {
      document
        .getElementById("scrollId")
        .scroll({ top: 0, left: 0, behavior: "smooth" });
      return;
    }
    const FormData = require("form-data");
    const fomrData = new FormData();

    // function asyncFunction (item, cb) {
    //     if (cropper.value[item.id] != undefined) {
    //       cropper.value[item.id].getCroppedCanvas().toBlob(async (blob) => {
    //           fomrData.append(`files[${item.id}]`, blob);
    //           console.log(blob);
    //           cb();
    //       });
    //     } else {
    //       cb();
    //     }
    // }

    // let awatBlob = languages.value.reduce((promiseChain, item) => {
    //     return promiseChain.then(() => new Promise((resolve) => {
    //       asyncFunction(item, resolve);
    //     }));
    // }, Promise.resolve());
    // wait finish blob image
    // awatBlob.then( async () =>  {
    languages.value.forEach((lg, index) => {
      if (isVideo.value) {
        if (videos.value[lg.id] != undefined) {
          fomrData.append(`videos[${lg.id}]`, videos.value[lg.id]);
        }
      } else {
        if (cropper.value[lg.id] != undefined) {
          fomrData.append(`images[${lg.id}]`, cropper.value[lg.id]);
        }
      }

      // for name column
      if (gallery.value.translations_name[lg.id] != "") {
        fomrData.append(`translation_name[${index}][language_id]`, lg.id);
        fomrData.append(`translation_name[${index}][field_name]`, "title");
        fomrData.append(
          `translation_name[${index}][translation]`,
          gallery.value.translations_name[lg.id]
        );
      }
          // for name column
      if (gallery.value.translation_video_url[lg.id] != "") {
        fomrData.append(`translation_video_url[${index}][language_id]`, lg.id);
        fomrData.append(`translation_video_url[${index}][field_name]`, "video_url");
        fomrData.append(
          `translation_video_url[${index}][translation]`,
          gallery.value.translation_video_url[lg.id]
        );
      }

      // for description
      if (gallery.value.translations_description[lg.id] != "") {
        fomrData.append(`translation_desc[${index}][language_id]`, lg.id);
        fomrData.append(
          `translation_desc[${index}][field_name]`,
          "description"
        );
        fomrData.append(
          `translation_desc[${index}][translation]`,
          gallery.value.translations_description[lg.id]
        );
      }
    });
    fomrData.append("status", gallery.value.status);
    fomrData.append("_method", "post");
    isLoading.value = true;
    isUploaded.value = true;
    await add(fomrData);
    isUploaded.value = false;
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("add successfully")),
    });
    isLoading.value = false;
    emit("onAdded");
    emit("onClose");
  } catch (err) {
    $q.notify({
      position: "top",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
    isLoading.value = false;
    document
      .getElementById("scrollId")
      .scroll({ top: 0, left: 0, behavior: "smooth" });
  }
}
onMounted(async () => {
  languages.value.forEach((lg) => {
    gallery.value.translations_name[lg.id] = "";
    gallery.value.translations_description[lg.id] = "";
    video_url.value[lg.id] = "";
  });
});
</script>
