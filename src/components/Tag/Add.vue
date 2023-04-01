<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add Tag")) }}</span>
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
    <q-card-section class="q-pt-lg">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="tag.name"
            :label="$t(Utils.getKey('Name'))"
            dense
            outlined
            maxlength="20"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            readonly
            v-model="tag.slug"
            :label="$t(Utils.getKey('Slug'))"
            dense
            outlined
            maxlength="20"
          />
        </div>

        <div class="row">
          <div
            class="col-12 col-md-6 q-pr-md q-mt-md"
            v-for="lang in languages"
            :key="lang.locale_web"
          >
            <label class="text-uppercase">{{ $t(lang.locale_web) }}</label>
            <q-input
              v-model="tag.translation_name[lang.locale_web]"
              :label="$t(Utils.getKey('name'))"
              dense
              autogrow
              type="textarea"
              outlined
            />
          </div>
        </div>
      </div>
      <div class="mt-6">
        <label class="pa-2 border">
          <i class="fa fa-image"></i> {{ $t("choose_image") }}
          <input
            class="mt-2"
            style="display: none"
            accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
            type="file"
            id="file-input"
            @change="uploadChange"
            max="10"
            name="image"
          />
        </label>
      </div>

      <div class="box-2 img-result hide">
        <img class="cropped" :src="images_url" alt="" />
      </div>
      <div class="page">
        <div class="box-2">
          <div class="result"></div>
        </div>
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
        style="color: var(--q-primary) !important"
        class="q-px-md q-ml-md"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import useTag from "src/composables/useTags";
import Utils from "../../helpers/Utils";
import "../../css/crop.css";
import "../../js/croper";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const props = defineProps({ languages: Array });
const $q = useQuasar();
const { saving, add } = useTag();
const tag = ref({
  translation_name: {},
  name: "",
  slug: "",
  status: "active",
});
const images_url = ref("");
const images = ref("");
const cropper = ref("");

const languages = ref(props.languages);

const uploadChange = (e) => {
  let img_w = "500";
  let img_h = "500";
  let result = document.querySelector(".result");
  if (e.target.files.length) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target.result) {
        let img = document.createElement("img");
        img.id = "image";
        img.src = e.target.result;
        result.innerHTML = "";
        result.appendChild(img);
        cropper.value = new Cropper(img);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }
};

watch(
  () => tag.value.name,
  () => {
    console.log(tag.value.name);
    tag.value.slug = tag.value.name.toLocaleLowerCase().replace(/ /g, "-");
  }
);

async function onSubmit() {
  try {
    const FormData = require("form-data");
    if (tag.value.name == "" || tag.value.slug == "") {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("please fill name")),
      });
      return;
    }
    let allFill = false;
    languages.value.forEach((lg, index) => {
      if (tag.value.translation_name[lg.locale_web] == "") {
        allFill = true;
      }
    });

    if (allFill == true) {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("please fill all translation fileld")),
      });
      return;
    }

    if (cropper.value) {
      cropper.value.getCroppedCanvas().toBlob(async (blob) => {
        const fomrData = new FormData();
        let error = false;
        images.value = blob;
        fomrData.append("name", tag.value.name);
        fomrData.append("status", tag.value.status);
        fomrData.append("slug", tag.value.slug);
        fomrData.append("image", images.value);
        languages.value.forEach((lg, index) => {
          if (tag.value.translation_name[lg.locale_web] != "") {
            fomrData.append(`translation_name[${index}][language_id]`, lg.id);
            fomrData.append(`translation_name[${index}][field_name]`, "name");
            fomrData.append(
              `translation_name[${index}][translation]`,
              tag.value.translation_name[lg.locale_web]
            );
          }
        });

        await add(fomrData);
        emit("onAdded");
        $q.notify({
          position: "top-right",
          type: "positive",
          icon: "fas fa-check",
          message: t(Utils.getKey("created successfully")),
        });
      });
    } else {
      const fomrData = new FormData();
      let error = false;
      // images.value = '';
      fomrData.append("name", tag.value.name);
      fomrData.append("status", tag.value.status);
      fomrData.append("slug", tag.value.slug);
      // fomrData.append("image", images.value);
      languages.value.forEach((lg, index) => {
        if (tag.value.translation_name[lg.locale_web] != "") {
          fomrData.append(`translation_name[${index}][language_id]`, lg.id);
          fomrData.append(`translation_name[${index}][field_name]`, "name");
          fomrData.append(
            `translation_name[${index}][translation]`,
            tag.value.translation_name[lg.locale_web]
          );
        } else {
          $q.notify({
            position: "top-right",
            type: "negative",
            icon: "fas fa-exclamation-triangle",
            message: t(Utils.getKey("Translation required for " + lg.name)),
          });
          error = true;
        }
      });
      if (!error) {
        await add(fomrData);
        emit("onAdded");
        $q.notify({
          position: "top-right",
          type: "positive",
          icon: "fas fa-check",
          message: t(Utils.getKey("created successfully")),
        });
      }
    }
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
}

onMounted(() => {
  languages.value.forEach((lg) => {
    tag.value.translation_name[lg.locale_web] = "";
  });
});
</script>


