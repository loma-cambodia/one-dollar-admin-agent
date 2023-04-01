<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '1030px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white px-3">
      <span class="text-body2">{{
        $t(Utils.getKey("Prodcut detial view"))
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
    <q-card-section class="q-px-lg">
      <div class="row">
        <div class="col-10 col-md-10 q-pr-md">
          <h2>
            {{ langID.length > 0 ? products.name_tran[langID[0].id] : "" }}
          </h2>
          <p class="text-gray">{{ products.slug }}</p>
          <p class="text-bold">SKU - {{ products.sku }}</p>
        </div>
        <div class="col-2 col-md-2 d-left">
          <div>
            <div class="border pa-2 r_4 text-bold text-center">
              {{ products.quantity }}
            </div>
            <span class="text-bold">{{ $t("quantity") }}</span>
          </div>
        </div>
      </div>
      <div class="row q-mt-xs">
        <div class="col-12 col-md-5 q-pr-md">
          <div class="d-flex">
            <p class="text-bold mt-2 mr-1 mb-1">
              {{ $t("product_category") }}:
            </p>
            <div v-for="cat in categoryOption" :key="cat.id">
              <q-chip
                color="gray"
                text-color="black"
                v-if="cat.id == products.category_id"
              >
                {{ cat.name }}
              </q-chip>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-7 q-pl-md">
          <div class="d-flex">
            <p class="text-bold mt-2 mr-1">{{ $t("product_sub_category") }}:</p>
            <div v-for="cat in subCategoryOption" :key="cat.id">
              <q-chip
                color="gray"
                text-color="black"
                v-if="cat.id == products.sub_category_id"
              >
                {{ cat.name }}
              </q-chip>
            </div>
          </div>
        </div>
      </div>
      <div class="row q-mt-lg mt-8">
        <div class="col-12 col-md-6 q-pr-md">
          <div class="border r_4 relative pa-4">
            <span class="title_border">{{ $t("product_price") }}</span>
            <div class="d-flex justify-between">
              <div>
                <p class="text-bold mb-0 font_22">{{ products.price }}</p>
                <span>{{ $t("price") }}</span>
              </div>
              <!-- <div>
                <p class="text-bold mb-0 font_22">
                  {{ products.purchase_price }}
                </p>
                <span>{{ $t("purchase_price") }}</span>
              </div> -->

              <div class="text-left">
                <p class="text-bold mb-0 font_22">{{ products.sale_price }}</p>
                <span>{{ $t("sale_price") }}</span>
              </div>
            </div>
          </div>

          <div class="border r_4 relative pa-4 mt-8">
            <span class="title_border">{{ $t("product_tage_promotion") }}</span>
            <div class="mt-3">
              <div>
                <p class="text-bold mb-1">{{ $t("product_tags") }}</p>
                <div class="d-flex">
                  <div v-for="cat in tagsOptions" :key="cat.id">
                    <q-chip
                      color="gray"
                      text-color="black"
                      v-if="products.tags.includes(cat.id)"
                    >
                      {{ cat.name }}
                    </q-chip>
                  </div>
                </div>
              </div>
              <div class="mt-4" style="height: 69%">
                <p class="text-bold mb-2">{{ $t("product_promotions") }}</p>
                <div class="d-flex">
                  <div v-for="pro in promotionOptions" :key="pro.id">
                    <q-chip color="gray" text-color="black">
                      {{ pro.translates[locale]?.name }}
                    </q-chip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 q-pl-md">
          <div class="border r_4 relative pa-4" style="min-height: 278px">
            <span class="title_border">{{ $t("product_images") }}</span>
            <div class="row" v-viewer>
              <div
                v-for="(img, index) in products.image"
                :key="index"
                class="col-6 col-md-4 mt-2 q-pr-xs"
              >
                <div class="card_img">
                  <img :src="img.path" style="width: 100%; height: 140px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="border r_4 relative pa-4 mt-8">
          <span class="title_border">{{ $t("product_name") }}</span>
          <div>
            {{ langID.length > 0 ? products.name_tran[langID[0].id] : "" }}
          </div>
        </div>
      </div>
      <div>
        <span class="title_border2">{{ $t("product_description") }}</span>
        <div class="border r_4 relative pa-4 mt-8" style="overflow: scroll">
          <div
            v-html="langID.length > 0 ? products.description[langID[0].id] : ''"
          ></div>
        </div>
      </div>
      <Loading :loading="isLoading" />
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
import { values } from "lodash-es";
const locale = inject("locale");
const currency_id = inject("currency_id");
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const props = defineProps({
  data: Object,
  categoryOption: Array,
  tagsOptions: Array,
  promotionOptions: Array,
  languages: Array,
});

const categoryOption = ref(props.categoryOption);
const tagsOptions = ref(props.tagsOptions);
const promotionOptions = ref(props.data.promotion);
const languages = ref(props.languages);

let tempSubCategoryOptions = [];
const subCategoryOption = ref([]);

const isLoading = ref(false);

const $q = useQuasar();
const { saving, update } = useProduct();
const subCategory = useSubCategory();

const products = ref({
  ...props.data,
  description: {},
  name_tran: {},
  price: "",
  sale_price: "",
  purchase_price: "",
  currency_id: currency_id,
});

const getSubCategory = async () => {
  let getSub = await subCategory.getByCategoryId(products.value.category_id);
  subCategoryOption.value = tempSubCategoryOptions = getSub.data.map((pro) => {
    return {
      id: pro.id,
      name: pro?.translates[locale.value]?.name,
    };
  });
};
watch(
  () => products.value.category_id,
  () => {
    getSubCategory();
    products.value.sub_category_id = "";
  }
);

watch(
  () => products.value.name,
  () => {
    console.log(products.value.name);
    products.value.slug = products.value.name
      .toLocaleLowerCase()
      .replace(/ /g, "-");
  }
);
const langID = computed(() =>
  languages.value.filter((lng) => lng.locale_web == locale.value)
);
// function
const filterCategory = (val, update) => {
  categoryOption.value = Utils.filterDropdownOptions(
    props.categoryOption,
    val,
    update,
    "name"
  );
};
const filterSubCategory = (val, update) => {
  subCategoryOption.value = Utils.filterDropdownOptions(
    tempSubCategoryOptions,
    val,
    update,
    "name"
  );
};

async function onSubmit() {
  // try {

  let languageTran = [];
  languages.value.forEach((lg) => {
    if (
      products.value.description[lg.id] != "" &&
      products.value.description[lg.id] != undefined
    ) {
      let objLang;
      if (props.data.translations[lg.locale_web]) {
        objLang = {
          id: props.data.translations[lg.locale_web]
            ? props.data.translations[lg.locale_web].desc_id
            : "",
          language_id: lg.id,
          field_name: "description",
          value: products.value.description[lg.id],
        };
      } else {
        objLang = {
          language_id: lg.id,
          field_name: "description",
          value: products.value.description[lg.id],
        };
      }

      languageTran.push(objLang);
    }
    if (
      products.value.name_tran[lg.id] != "" &&
      products.value.description[lg.id] != undefined
    ) {
      let objLang2;
      if (props.data.translations[lg.locale_web]) {
        objLang2 = {
          id: props.data.translations[lg.locale_web]
            ? props.data.translations[lg.locale_web].id
            : "",
          language_id: lg.id,
          field_name: "name",
          value: products.value.name_tran[lg.id],
        };
      } else {
        objLang2 = {
          language_id: lg.id,
          field_name: "name",
          value: products.value.name_tran[lg.id],
        };
      }
      languageTran.push(objLang2);
    }
    console.log(products.value.name_tran[lg.id]);
  });

  products.value.translation = languageTran;

  // validation

  if (
    products.value.name == "" ||
    products.value.price == "" ||
    products.value.sale_price == "" ||
    products.value.purchase_price == "" ||
    products.value.category_id == "" ||
    products.value.sub_category_id == ""
  ) {
    $q.notify({
      position: "top",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t("Field is required"),
    });
    return;
  }
  console.log(products.value);
  await update(products.value.id, products.value);
  emit("onAdded");
  $q.notify({
    position: "top-right",
    type: "positive",
    icon: "fas fa-check",
    message: t(Utils.getKey("created successfully")),
  });
  // } catch (err) {
  //   $q.notify({
  //     position: "top-right",
  //     type: "negative",
  //     icon: "fas fa-exclamation-triangle",
  //     message: t(Utils.getKey(err.message.toString())),
  //   });
  // }
}
const updateLanguage = () => {
  props.data.prices?.forEach((p) => {
    if (p.currency_id == currency_id) {
      products.value.price = p.price;
      products.value.sale_price = p.sale_price;
      products.value.purchase_price = p.purchase_price;
    }
  });
  languages.value.forEach((lg) => {
    products.value.description[lg.id] =
      props.data.translations[lg.locale_web]?.description;
    products.value.name_tran[lg.id] = props.data.translations[lg.locale_web]?.name;
  });
  // promotion
  let promo = [];
  props.data.promotion.forEach((p) => {
    promo.push(p.id);
  });
  // tages
  let nTags = [];
  props.data.tags.forEach((t) => {
    nTags.push(t.id);
  });
  products.value.promotions = promo;
  products.value.tags = nTags;
  // name
  products.value.name = props.data.slug;
};

onMounted(() => {
  getSubCategory();
  updateLanguage();
});
</script>


