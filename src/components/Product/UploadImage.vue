<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '900px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit Product")) }}</span>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        @click="onCloseClick"
        :disable="saving"
      >
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <div class="row">
        <div class="col-12 col-md-12 q-pr-md">
          <!-- <q-file dense outlined v-model="images" @rejected="uploadChange(e)" multiple>
              <template v-slot:prepend>
                <q-icon name="attach_file"></q-icon>
              </template>
            </q-file> -->
          <label class="pa-2 border">
            <i class="fa fa-image"></i> {{ $t("choose_image") }}
            <input
              style="display:none;"
              accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
              type="file"
              @change="uploadChange"
              max="10"
              name="file[]"
              multiple
            />
          </label>
        </div>
      </div>
      <!-- old -->
      <div v-if="!isUploaded" class="row mt-3">
        <div
          v-for="(img, index) in products.image"
          :key="index"
          class="col-6 col-md-3 mt-4 q-pr-xs"
        >
          <div class="card_img">
            <img :src="img.path" style="width: 100%; height: 200px" />
            <q-icon
              @click="onDelete(img)"
              class="d_icon"
              color="red"
              size="xs"
              name="delete"
            />
          </div>
        </div>
      </div>
      <!-- new -->
      <div v-if="!isUploaded" class="row mt-3">
        <div
          v-for="(im, index) in images_url"
          :key="index"
          class="col-12 col-md-3 q-pr-xs"
        >
          <div class="card_img">
            <img :src="im" style="width: 100%; height: 200px" />
          </div>
        </div>
      </div>
      <div v-else>
        <q-linear-progress
          stripe
          rounded
          size="20px"
          :value="progress"
          color="warning"
          class="q-mt-sm"
        ></q-linear-progress>
      </div>
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn
        flat
        color="negative"
        class="q-px-md"
        @click="onCloseClick"
        :disable="saving"
        >{{ $t(Utils.getKey("Cancel")) }}</q-btn
      >
      <q-btn
        color="primary"
        class="q-px-md q-ml-md"
        @click="onUpload"
        :disable="saving"
        >{{ $t(Utils.getKey("upload")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted, inject, computed } from "vue";
import { useQuasar } from "quasar";
import useProduct from "src/composables/useProduct";
import useSubCategory from "src/composables/useSubCategory";
import Loading from "src/components/Shared/Loading.vue";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";

const props = defineProps({ data: Object });
const currency_id = inject("currency_id");
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);

const images = ref([]);
const images_url = ref([]);
const products = ref({
  ...props.data,
});
const isDelete = ref(false);
const $q = useQuasar();
const { progress, saving, uploadImages, deleteImages } = useProduct();
const isUploaded = ref(false);
// function
const uploadChange = (e) => {
  images_url.value = [];
  for (var i = 0; i < e.target.files.length; i++) {
    let imageFile = e.target.files[i];
    images.value.push(e.target.files[i]);
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.addEventListener("load", () => {
      images_url.value.push(reader.result);
    });
  }
  console.log(images_url);
};

const onUpload = async () => {
  if (images.value.length == 0) {
    $q.notify({
      position: "top",
      type: "warning",
      icon: "fas fa-check",
      message: t(Utils.getKey("select images")),
    });
    return;
  }
  isUploaded.value = true;
  const FormData = require("form-data");
  const data = new FormData();
  images.value.forEach((file, index) => {
    data.append(`files[${index}]`, file);
  });
  await uploadImages(products.value.id, data);
  emit("onAdded");
  emit("onClose");
};

const onDelete = async (item) => {
  await deleteImages(item.id);
  products.value.image = products.value.image.filter((m) => m.id != item.id);
  isDelete.value = true;
};
const onCloseClick = () => {
  if (isDelete.value) {
    emit("onAdded");
  }
  emit("onClose");
};
onMounted(() => {});
</script>

<style>
.d_icon {
  cursor: pointer;
  top: 1px;
  z-index: 1000;
  font-size: 22px;
  position: absolute;
  left: 1px;
  background: gray;
  padding: 8px;
}
.card_img {
  position: relative;
  box-shadow: 0px 3px 5px 8px rgb(0 0 0 / 15%);
  margin: 10px;
}
</style>
