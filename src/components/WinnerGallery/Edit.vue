<template>
  <q-card
    id="scrollId"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '1100px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit gallery")) }}</span>
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

        <q-separator class="q-mb-xs" />
        <div class="row" v-for="lang in languages" :key="lang.locale_web">
          <div class="col-12 col-md-6 q-pr-md">
            <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
            <q-input
              v-model="gallery.translations[lang.locale_web].title"
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
              v-model="gallery.translations[lang.locale_web].description"
              :label="$t(Utils.getKey('content'))"
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
             v-model="gallery.translations[lang.locale_web].video_url"
              :label="$t(Utils.getKey('video_url'))"
              dense
              autogrow
              maxlength="499"
              lazy-rules
              :rules="[
                (val) => !!val || $t(Utils.getKey('field is required')),
                (val) =>
                  Utils.urlValidation(val) || $t(Utils.getKey('invalid_url')),
              ]"
              outlined
            />
          </div>
        </div>
        <!-- <div>
          <q-toggle
            class="pl-0"
            v-model="isVideo"
            disable
            size="lg"
            :label="isVideo ? $t('video') : $t('image')"
            icon="mdi-movie"
          ></q-toggle>
        </div> -->

        <div class="row">
          <div v-for="lang in languages" :key="lang.locale" class="col-4 pr-3">
            <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
            <q-separator />
            <div class="py-3 ml-2 mt-2" v-if="!isVideo">
              <label class="pa-2 border">
                <i class="fa fa-image"></i> {{ $t("choose_image") }}
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
              <div v-if="!cropper[lang.id]" class="box-2 img-result">
                <img
                  style="width: 100%"
                  class="cropped"
                  :src="
                    gallery.image.filter((img) => img.purpose == lang.id)?.[0]
                      ?.path
                  "
                  alt=""
                />
              </div>
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
            <div v-else class="q-mt-md">
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
              <div>
                <video
                  controls
                  width="250"
                  v-if="
                    !video_url[lang.id] &&
                    gallery.video.filter((v) => v.purpose == lang.id)?.[0]?.path
                  "
                >
                  <source
                    :src="
                      gallery.video.filter((v) => v.purpose == lang.id)?.[0]
                        ?.path
                    "
                    type="video/mp4"
                  />
                </video>
                <video controls width="250" v-if="video_url[lang.id]">
                  <source :src="video_url[lang.id]" type="video/mp4" />
                </video>
              </div>

              <p class="red q-mt-lg" v-if="fileTooBig[lang.id]">
                {{ $t(Utils.getKey(fileTooBig[lang.id])) }}
              </p>
            </div>
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
import useWinnerGallery from "../../composables/useWinnerGallery";
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
const { saving, update, getUsing } = useWinnerGallery();

const languages = ref(props.languages);
const gallery = ref({ ...props.data });
console.log(gallery.value);
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
const isVideo = ref(gallery.value.video?.length > 0 ? true : false);
console.log(
  gallery.value.video.length,
  "gallery.value.video",
  isVideo.value,
  "isVideo"
);
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
    //     if (cropper.value[item.locale] != undefined) {
    //       cropper.value[item.locale].getCroppedCanvas().toBlob(async (blob) => {
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
      // console.log(cropper.value[lg.locale_web], "coper");
      if (isVideo.value) {
        if (videos.value[lg.id] != undefined) {
          fomrData.append(`videos[${lg.id}]`, videos.value[lg.id]);
        }
      } else {
        if (cropper.value[lg.id] != undefined) {
          fomrData.append(`images[${lg.id}]`, cropper.value[lg.id]);
        }
      }
      if (gallery.value.translations[lg.locale_web].title != "") {
        fomrData.append(`translation_name[${index}][language_id]`, lg.id);
        fomrData.append(`translation_name[${index}][field_name]`, "title");
        fomrData.append(
          `translation_name[${index}][translation]`,
          gallery.value.translations[lg.locale_web].title
        );
      }
      if (gallery.value.translations[lg.locale_web].video_url != "") {
        fomrData.append(`translation_video_url[${index}][language_id]`, lg.id);
        fomrData.append(`translation_video_url[${index}][field_name]`, "video_url");
        fomrData.append(
          `translation_video_url[${index}][translation]`,
          gallery.value.translations[lg.locale_web].video_url
        );
      }

      if (gallery.value.translations[lg.locale_web].description != "") {
        fomrData.append(`translation_desc[${index}][language_id]`, lg.id);
        fomrData.append(
          `translation_desc[${index}][field_name]`,
          "description"
        );
        fomrData.append(
          `translation_desc[${index}][translation]`,
          gallery.value.translations[lg.locale_web].description
        );
      }
    });
    fomrData.append("status", gallery.value.status);
    isLoading.value = true;
    await update(gallery.value.id, fomrData);
    // setTimeout(() => {
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
    isLoading.value = false;
    emit("onUpdated");
    // }, 1000);
    // })
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
  // isLoading.value = true
  // let checkUsing = await getUsing(gallery.value.id)
  // banner_isusing.value = checkUsing.data.status
  // isLoading.value = false
  // languages.forEach(lng => {
  //   images_url.value = lng.
  // })
});
</script>
