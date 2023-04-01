<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{
        $t(Utils.getKey("Edit Sub Category"))
      }}</span>
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
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
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
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("Category")) }}</label>
          <q-select
            v-model="category.category_id"
            :options="categoryOption"
            outlined
            dense
            emit-value
            map-options
            option-value="id"
            option-label="name"
            clearable
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
            use-input
            @filter="filterCategory"
          />
        </div>
        <!-- <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey('parent sub category')) }}</label>
          <q-select v-model="category.parent_sub_category_id" :options="subCategoryOption" outlined dense emit-value
            map-options use-chips option-value="id" option-label="name" clearable use-input @filter="filterCategory" />
        </div> -->
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row">
        <div class="col-12 col-md-12 q-pr-md">
          <q-radio
            v-model="category.status"
            :disable="category_isusing"
            val="active"
            label="Active"
          />
          <q-radio
            v-model="category.status"
            :disable="category_isusing"
            val="inactive"
            label="Inactive"
          />
        </div>
        <div v-if="category_isusing" class="red">
          {{ $t("sub_category_in_using_cannot_update_status") }}
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <p class="text-bold mb-0 mt-3">
        {{ $t(Utils.getKey("Category name and description translation")) }}
      </p>
      <q-separator class="q-mb-xs" />
      <div class="row" v-for="lang in languages" :key="lang.locale_web">
        <div class="col-12 col-md-6 q-pr-md q-mt-md">
          <label class="text-uppercase">{{ $t(lang?.locale) }}</label>
          <q-input
            v-model="category.translates[lang.locale_web].name"
            :label="$t(Utils.getKey('name'))"
            dense
            autogrow
            type="textarea"
            outlined
          />
        </div>
        <div class="col-12 col-md-6 q-pr-md q-mt-md">
          <label class="text-uppercase">{{ $t(lang.locale) }}</label>
          <q-input
            v-model="category.translates[lang.locale_web].description"
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

      <div v-if="cropper == ''" class="box-2 img-result">
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
import useSubCategory from "src/composables/useSubCategory";
import Utils from "../../helpers/Utils";
const category_isusing = ref(false);
import Loading from "src/components/Shared/Loading.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
  data: Object,
  languages: Array,
  categoryOption: Array,
});
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, update, get, getByCategoryId, getUsingSub } = useSubCategory();

const languages = ref(props.languages);
const category = ref({ ...props.data });
const isLoading = ref(true);

const categoryOption = ref(props.categoryOption);
let tempCategoryOptions = [];
let tempSubCategoryOptions = [];
const subCategoryOption = ref([]);

const images = ref([]);
const images_url = ref(category.value.image?.path);
const cropper = ref("");

const getSubCategory = async () => {
  let getSub = await getByCategoryId(category.value.category_id);
  subCategoryOption.value = tempCategoryOptions = getSub.data;
};

const getParentSubCategory = async () => {
  let getSubCat = await get(category.value.parent_sub_category_id);
  parentSubCategoryOption.value = tempSubCategoryOptions = getSubCat.data;
};

getSubCategory();

watch(
  () => category.value.parent_sub_category_id,
  () => {
    getParentSubCategory();
  }
);

watch(
  () => category.value.category_id,
  () => {
    getSubCategory();
  }
);

watch(
  () => category.value.name,
  () => {
    console.log(category.value.name);
    category.value.slug = category.value.name
      .toLocaleLowerCase()
      .replace(/ /g, "-");
  }
);

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
    let allFill = false;
    if (category.value.name == "") {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("name is required")),
      });
      return;
    }
    languages.value.forEach((lg, index) => {
      if (
        category.value.translates[lg.locale_web].name == "" ||
        category.value.translates[lg.locale_web].description == "" ||
        category.value.translates[lg.locale_web].name == "undefined" ||
        category.value.translates[lg.locale_web].description == "undefined"
      ) {
        allFill = true;
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
    if (cropper.value) {
      cropper.value.getCroppedCanvas().toBlob(async (blob) => {
        images.value = blob;
        fomrData.append("file", images.value);
        fomrData.append("name", category.value.name);
        fomrData.append("_method", "patch");

        languages.value.forEach((lg, index) => {
          if (category.value.translates[lg.locale_web].name != "") {
            fomrData.append(`translation_name[${index}][language_id]`, lg.id);
            fomrData.append(`translation_name[${index}][field_name]`, "name");
            fomrData.append(
              `translation_name[${index}][translation]`,
              category.value.translates[lg.locale_web].name
            );
          }
          if (category.value.translates[lg.locale_web].description != "") {
            if (lg.id == 1) {
              fomrData.append(
                "description",
                category.value.translates[lg.locale_web].description
              );
            }
            fomrData.append(`translation_desc[${index}][language_id]`, lg.id);
            fomrData.append(
              `translation_desc[${index}][field_name]`,
              "description"
            );
            fomrData.append(
              `translation_desc[${index}][translation]`,
              category.value.translates[lg.locale_web].description
            );
          }
        });
        console.log("CATEGORY Value          ", category.value);
        fomrData.append("status", category.value.status);
        fomrData.append("category_id", category.value.category_id);
        fomrData.append(
          "parent_sub_category_id",
          category.value.parent_sub_category_id
        );
        fomrData.append("slug", category.value.slug);

        await update(category.value.id, fomrData);
        emit("onUpdated");
        $q.notify({
          position: "top-right",
          type: "positive",
          icon: "fas fa-check",
          message: t(Utils.getKey("updated successfully")),
        });
      });
    } else {
      fomrData.append("name", category.value.name);
      fomrData.append("_method", "patch");
      languages.value.forEach((lg, index) => {
        if (category.value.translates[lg.locale_web].name != "") {
          fomrData.append(`translation_name[${index}][language_id]`, lg.id);
          fomrData.append(`translation_name[${index}][field_name]`, "name");
          fomrData.append(
            `translation_name[${index}][translation]`,
            category.value.translates[lg.locale_web].name
          );
        }
        if (category.value.translates[lg.locale_web].description != "") {
          if (lg.id == 1) {
            fomrData.append(
              "description",
              category.value.translates[lg.locale_web].description
            );
          }
          fomrData.append(`translation_desc[${index}][language_id]`, lg.id);
          fomrData.append(
            `translation_desc[${index}][field_name]`,
            "description"
          );
          fomrData.append(
            `translation_desc[${index}][translation]`,
            category.value.translates[lg.locale_web].description
          );
        }
      });
      fomrData.append("status", category.value.status);
      fomrData.append("category_id", category.value.category_id);
      fomrData.append(
        "parent_sub_category_id",
        category.value.parent_sub_category_id
      );
      fomrData.append("slug", category.value.slug);

      await update(category.value.id, fomrData);
      emit("onUpdated");
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("updated successfully")),
      });
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

onMounted(async () => {
  isLoading.value = true;
  let checkUsing = await getUsingSub(category.value.id);
  category_isusing.value = checkUsing.data.status;
  isLoading.value = false;
});
</script>


