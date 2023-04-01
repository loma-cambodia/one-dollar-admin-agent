<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit Promotion")) }}</span>
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
            v-model="promotion.name"
            :label="$t(Utils.getKey('Name'))"
            dense
            outlined
            maxlength="20"
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="promotion.slug"
            :label="$t(Utils.getKey('Slug'))"
            dense
            outlined
            maxlength="20"
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <div class="row">
          <div
            class="col-12 col-md-6 q-pr-md q-mt-md"
            v-for="lang in languages"
            :key="lang.locale_web"
          >
            <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
            <q-input
              v-model="promotion.translates[lang.locale_web].name"
              :label="$t(Utils.getKey('name'))"
              dense
              autogrow
              type="textarea"
              outlined
              required
            />
          </div>
        </div>
      </div>
      <div class="mt-6">
        <label class="pa-2 border">
          <i class="fa fa-image"></i> {{ $t("choose_image") }}
          <input
            class="mt-2"
            accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
            type="file"
            style="display:none;"
            id="file-input"
            @change="uploadChange"
            max="10"
            name="image"
          />
        </label>
      </div>
      <div v-if="cropper == ''" class="box-2 img-result">
        <img class="cropped" :src="images_url" alt="" />
      </div>
      <div class="page">
        <div class="box-2">
          <div class="result"></div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="row">
        <div class="col-12 col-md-12 q-pr-md">
          <q-radio v-model="promotion.status" val="active" label="Active" />
          <q-radio v-model="promotion.status" val="inactive" label="Inactive" />
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
        class="q-px-md q-ml-md"
        style="color: var(--q-primary) !important"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import usePromotion from "src/composables/usePromotion";
import Utils from "../../helpers/Utils";
import "../../css/crop.css";
import "../../js/croper";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object, languages: Array });
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, update } = usePromotion();
const promotion = ref({ ...props.data });

const languages = ref(props.languages);

console.log(languages);

const images_url = ref(promotion.value?.image?.path);
const cropper = ref("");
const images = ref("");
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
  () => promotion.value.name,
  () => {
    console.log(promotion.value.name);
    promotion.value.slug = promotion.value.name
      .toLocaleLowerCase()
      .replace(/ /g, "-");
  }
);

async function onSubmit() {
  const FormData = require("form-data");
  const fomrData = new FormData();
  if (promotion.value.name == "" || promotion.value.slug == "") {
    $q.notify({
      position: "top",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey("please fill name and slug")),
    });
    return;
  }
  let allFill = false;
  languages.value.forEach((lg, index) => {
    if (promotion.value.translates[lg.locale_web].name == "") {
      allFill = true;
    }
  });

  console.log("allFill        ", promotion.value.translates);

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
      images.value = blob;
      fomrData.append("name", promotion.value.name);
      fomrData.append("status", promotion.value.status);
      fomrData.append("slug", promotion.value.slug);
      fomrData.append("image", images.value);
      fomrData.append("id", promotion.value.id);
      fomrData.append("_method", "PATCH");
      languages.value.forEach((lg, index) => {
        if (promotion.value.translates[lg.locale_web].name != "") {
          fomrData.append(`translation_name[${index}][language_id]`, lg.id);
          fomrData.append(`translation_name[${index}][field_name]`, "name");
          fomrData.append(
            `translation_name[${index}][translation]`,
            promotion.value.translates[lg.locale_web].name
          );
        }
      });
      await update(promotion.value.id, fomrData);
      emit("onUpdated");
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("updated successfully")),
      });
    });
  } else {
    fomrData.append("name", promotion.value.name);
    fomrData.append("status", promotion.value.status);
    fomrData.append("slug", promotion.value.slug);
    fomrData.append("id", promotion.value.id);
    fomrData.append("_method", "PATCH");
    languages.value.forEach((lg, index) => {
      if (promotion.value.translates[lg.locale_web].name != "") {
        fomrData.append(`translation_name[${index}][language_id]`, lg.id);
        fomrData.append(`translation_name[${index}][field_name]`, "name");
        fomrData.append(
          `translation_name[${index}][translation]`,
          promotion.value.translates[lg.locale_web].name
        );
      }
    });
    await update(promotion.value.id, fomrData);
    emit("onUpdated");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
  }
}
</script>


