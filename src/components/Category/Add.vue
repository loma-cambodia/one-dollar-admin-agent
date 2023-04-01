<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add Category")) }}</span>
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
            v-model="category.name"
            :label="$t(Utils.getKey('Name'))"
            dense
            outlined
            maxlength="20"
            lazy-rules
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <q-input
            :autofocus="true"
            v-model="category.slug"
            :label="$t(Utils.getKey('Slug'))"
            dense
            outlined
            maxlength="20"
          />
        </div>
      </div>
      <p class="text-bold mb-0 mt-3">
        {{ $t(Utils.getKey("Category name and description translation")) }}
      </p>
      <q-separator class="q-mb-xs" />
      <div class="row" v-for="lang in languages" :key="lang.locale_web">
        <div class="col-12 col-md-6 q-pr-md q-mt-md">
          <label class="text-uppercase">{{ $t(lang.locale_web) }}</label>
          <q-input
            v-model="category.translation_name[lang.locale_web]"
            :label="$t(Utils.getKey('name'))"
            dense
            autogrow
            type="textarea"
            outlined
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md q-mt-md">
          <label class="text-uppercase">{{ $t(lang.locale_web) }}</label>
          <q-input
            v-model="category.translation_desc[lang.locale_web]"
            :label="$t(Utils.getKey('description'))"
            dense
            autogrow
            type="textarea"
            outlined
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-lg">
      <label class="pa-2 border">
        <i class="fa fa-image"></i> {{$t('choose_image')}}
        <input
        class="mt-2"
        style="display:none"
        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
        type="file"
        id="file-input"
        @change="uploadChange"
        max="10"
        name="image"
      />
      </label>

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
import { onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import useCategory from "src/composables/useCategory";
import Utils from "../../helpers/Utils";
import "../../css/crop.css";
import "../../js/croper";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const props = defineProps({ languages: Array });

const $q = useQuasar();
const { saving, add , getUsing} = useCategory();

const category = ref({
  translation_name: {},
  translation_desc: {},
  name: "",
  status: "active",
  slug: "",
  description: "",
});
const languages = ref(props.languages);

watch(
  () => category.value.name,
  () => {
    console.log(category.value.name);
    category.value.slug = category.value.name
      .toLocaleLowerCase()
      .replace(/ /g, "-");
  }
);

const images_url = ref("");
const images = ref("");
const cropper = ref("");

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

async function onSubmit() {
  try {
    const FormData = require("form-data");
    const fomrData = new FormData();
    if(category.value.name == ''){
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(
          Utils.getKey("name is required")
        ),
      });
      return;
    }
    let allFill = false;
     languages.value.forEach((lg, index) => {
        if(category.value.translation_name[lg.locale_web] == '' || category.value.translation_desc[lg.locale_web] == ''){
          allFill = true
        }
     });
    if (allFill == true) {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(
          Utils.getKey("please fill all field for name and description")
        ),
      });
      return;
    }
    if(!cropper.value){
         $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(
          Utils.getKey("image is require")
        ),
      });
      return;
    }
    cropper.value.getCroppedCanvas().toBlob(async (blob) => {
      images.value = blob;
      fomrData.append("file", images.value);
      fomrData.append("name", category.value.name);
      languages.value.forEach((lg, index) => {
        if (category.value.translation_name[lg.locale_web] != "") {
          fomrData.append(`translation_name[${index}][language_id]`, lg.id);
          fomrData.append(`translation_name[${index}][field_name]`, "name");
          fomrData.append(
            `translation_name[${index}][translation]`,
            category.value.translation_name[lg.locale_web]
          );
        }
        if (category.value.translation_desc[lg.locale_web] != "") {
          if (lg.id == 1) {
            fomrData.append(
              "description",
              category.value.translation_desc[lg.locale_web]
            );
          }
          fomrData.append(`translation_desc[${index}][language_id]`, lg.id);
          fomrData.append(
            `translation_desc[${index}][field_name]`,
            "description"
          );
          fomrData.append(
            `translation_desc[${index}][translation]`,
            category.value.translation_desc[lg.locale_web]
          );
        }
      });
      fomrData.append("status", category.value.status);
      fomrData.append("slug", category.value.slug);
      await add(fomrData);
      emit("onAdded");
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("created successfully")),
      });
    });
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
    category.value.translation_desc[lg.locale_web] = "";
    category.value.translation_name[lg.locale_web] = "";
  });
});
</script>


