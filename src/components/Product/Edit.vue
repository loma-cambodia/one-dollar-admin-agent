<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '1000px',
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
        @click="emit('onClose')"
        :disable="saving"
      >
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <div class="row">
        <div class="col-12 col-md-5 q-pr-md">
          <label>{{ $t(Utils.getKey("product name")) }}</label>
          <q-input
            :autofocus="true"
            v-model="products.name"
            dense
            outlined
            maxlength="100"
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <div class="col-12 col-md-5 q-pl-md">
          <label>{{ $t(Utils.getKey("product slug")) }}</label>
          <q-input
            :autofocus="true"
            v-model="products.slug"
            dense
            readonly
            outlined
            maxlength="200"
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
        <div class="col-12 col-md-2 q-pl-md">
          <label>{{ $t(Utils.getKey("quantity")) }}</label>
          <q-input
            v-model="products.quantity"
            dense
            type="number"
            outlined
            :oninput="numberValidation"
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) => validationPrice(val) || $t('positive_number'),
            ]"
          />
        </div>
      </div>
      <div class="row q-mt-xs">
        <div class="col-12 col-md-4 q-pr-md">
          <label>{{ $t(Utils.getKey("product category")) }}</label>
          <q-select
            v-model="products.category_id"
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
        <div class="col-12 col-md-4 q-pl-md">
          <label>{{ $t(Utils.getKey("product sub category")) }}</label>
          <q-select
            v-model="products.sub_category_id"
            :options="subCategoryOption"
            outlined
            dense
            emit-value
            map-options
            option-value="id"
            option-label="name"
            clearable
            use-input
            @filter="filterSubCategory"
          />
        </div>
        <div class="col-12 col-md-4 q-pl-md">
          <label>{{ $t(Utils.getKey("sku")) }}</label>
          <q-input
            v-model="products.sku"
            dense
            outlined
            maxlength="200"
            lazy-rules
            :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
          />
        </div>
      </div>
      <p class="text-bold mb-0 mt-3">{{ $t(Utils.getKey("Product Price")) }}</p>
      <q-separator />
      <div style="padding: 12px; background: #f5efeb" class="row q-mt-xs">
        <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("Price")) }}</label>
          <q-input
            v-model="products.price"
            type="number"
            dense
            outlined
            :oninput="numberValidation"
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) => validationPrice(val) || $t('positive_number'),
              (val) =>
                saleBigerThanPrice(val) ||
                $t(Utils.getKey('sale price must be greater than price')),
            ]"
          />
        </div>
        <div class="col-12 col-md-6 q-px-md">
          <label>{{ $t(Utils.getKey("sale price")) }}</label>
          <q-input
            type="number"
            v-model="products.sale_price"
            dense
            outlined
            :oninput="numberValidation"
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) => validationPrice(val) || $t('positive_number'),
              (val) =>
                saleBigerThanPrice(val) ||
                $t(Utils.getKey('sale price must be greater than price')),
            ]"
          />
        </div>
        <!-- <div class="col-12 col-md-4 q-pl-md">
          <label>{{$t(Utils.getKey('purcahse price'))}}</label>
          <q-input
            type="number"
            v-model="products.purchase_price"
            dense
            outlined
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required'))
            ]"
          />
        </div> -->
      </div>
      <p class="text-bold mb-0 mt-3">
        {{ $t(Utils.getKey("Product Tag Promotion")) }}
      </p>
      <q-separator />
      <div style="padding: 12px; background: #f5efeb" class="row q-mt-xs">
        <div class="col-12 col-md-6 q-pr-md">
          <label>{{ $t(Utils.getKey("product tags")) }}</label>
          <q-select
            v-model="products.tags"
            :options="tagsOptions"
            outlined
            dense
            emit-value
            map-options
            use-chips
            multiple
            option-value="id"
            option-label="name"
          />
        </div>
        <div class="col-12 col-md-6 q-pl-md">
          <label>{{ $t(Utils.getKey("Promotion")) }}</label>
          <q-select
            v-model="products.promotions"
            :options="promotionOptions"
            outlined
            dense
            emit-value
            map-options
            use-chips
            multiple
            option-value="id"
            option-label="name"
          />
        </div>
      </div>

      <p class="text-bold mb-0 mt-3">
        {{ $t(Utils.getKey("Product name translations")) }}
      </p>
      <q-separator class="q-mb-xs" />
      <!-- <div class="row q-mt-xs">
        <div class="col-12 col-md-6 q-pr-md q-mt-md" v-for="lang in languages" :key="lang.locale">
          <label class="text-uppercase">{{lang.locale}}</label>
          <q-input
            v-model="products.name_tran[lang.id]"
            dense
            autogrow
            type="textarea"
            outlined
          />
        </div>
      </div> -->
      <div class="mt-3">
        <q-tabs
          v-model="tab2"
          dense
          class="text-grey"
          active-color="white"
          indicator-color="primary"
          align="left"
        >
          <q-tab
            v-for="lang in languages"
            :key="lang.locale_web"
            :name="lang.locale_web"
            :label="$t(lang.locale)"
          ></q-tab>
        </q-tabs>
        <div class="mt-1" v-for="lang in languages" :key="lang.locale">
          <div v-show="tab2 == lang.locale_web">
            <q-input
              v-model="products.name_tran[lang.id]"
              dense
              autogrow
              type="textarea"
              outlined
            />
          </div>
        </div>
      </div>
      <p class="text-bold mb-0 mt-3">
        {{ $t(Utils.getKey("Product description")) }}
      </p>
      <q-separator class="q-mb-xs" />
      <div class="row q-mt-xs">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="white"
          indicator-color="primary"
          align="left"
        >
          <q-tab
            v-for="lang in languages"
            :key="lang.locale_web"
            :name="lang.locale_web"
            :label="$t(lang.locale)"
          ></q-tab>
        </q-tabs>
        <!-- <q-tab-panels  animated> -->
        <div
          v-for="lang in languages"
          style="width: 100%"
          :name="lang.locale"
          :key="lang.locale"
        >
          <div v-show="tab == lang.locale_web" style="min-height: 200px">
            <q-editor
              v-model="products.description[lang.id]"
              :dense="$q.screen.lt.md"
              :toolbar="[
                [
                  'bold',
                  'italic',
                  'strike',
                  'underline',
                  'subscript',
                  'superscript',
                ],
                ['token', 'hr', 'link', 'custom_btn'],
                ['print', 'fullscreen'],
                [
                  {
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify'],
                  },
                  {
                    label: $t('formatting'),
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                  },
                  {
                    label: $t('font_size'),
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'size-1',
                      'size-2',
                      'size-3',
                      'size-4',
                      'size-5',
                      'size-6',
                      'size-7',
                    ],
                  },
                  {
                    label: $t('font_style'),
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'default_font',
                      'arial',
                      'arial_black',
                      'comic_sans',
                      'courier_new',
                      'impact',
                      'lucida_grande',
                      'times_new_roman',
                      'verdana',
                    ],
                  },
                  'removeFormat',
                ],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                ['undo', 'redo'],
                ['viewsource'],
              ]"
              :fonts="{
                arial: 'Arial',
                arial_black: 'Arial Black',
                comic_sans: 'Comic Sans MS',
                courier_new: 'Courier New',
                impact: 'Impact',
                lucida_grande: 'Lucida Grande',
                times_new_roman: 'Times New Roman',
                verdana: 'Verdana',
              }"
            ></q-editor>
          </div>
        </div>
        <!-- </q-tab-panels> -->
      </div>
      <!-- <div class="row q-mt-xs">
        <div class="col-12 col-md-6 q-pr-md q-mt-md" v-for="lang in languages" :key="lang.locale">
          <label class="text-uppercase">{{lang.locale}}</label>
          <q-input
            v-model="products.description[lang.id]"
            dense
            autogrow
            type="textarea"
            outlined
          />
        </div>
      </div> -->
      <Loading :loading="isLoading" />
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
        color="primary"
        class="q-px-md q-ml-md"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted, inject } from "vue";
import { useQuasar } from "quasar";
import useProduct from "src/composables/useProduct";
import useSubCategory from "src/composables/useSubCategory";
import Loading from "src/components/Shared/Loading.vue";

import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";

const tab2 = ref("en");
const tab = ref("en");
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
const promotionOptions = ref(props.promotionOptions);
const languages = ref(props.languages);

let tempSubCategoryOptions = [];
const subCategoryOption = ref([]);
const locale = inject("locale");
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

const numberValidation = (event) => {
  if (event.target.value > 4) {
    event.target.value = event.target.value.slice(0, 5);
  } else {
    event.target.value = event.target.value.replace("-", "");
  }
};

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
const validationPrice = (val) => {
  if (val > 0) {
    return true;
  }
  return false;
};
const saleBigerThanPrice = (val) => {
  if (
    parseFloat(products.value.price) >= parseFloat(products.value.sale_price)
  ) {
    return false;
  }
  return true;
};

async function onSubmit() {
  // try {

  let languageTran = [];
  // languages.value.forEach(lg => {
  //   if(products.value.description[lg.id] != '' && products.value.description[lg.id] != undefined){
  //     let objLang
  //     if(props.data.translations[lg.locale]) {
  //        objLang = {
  //         id: props.data.translations[lg.locale] ?  props.data.translations[lg.locale].desc_id : '',
  //         language_id: lg.id,
  //         field_name: 'description',
  //         value: products.value.description[lg.id]
  //       }
  //     } else {
  //        objLang = {
  //         language_id: lg.id,
  //         field_name: 'description',
  //         value: products.value.description[lg.id]
  //       }
  //     }

  //     languageTran.push(objLang)
  //   }
  //   if(products.value.name_tran[lg.id] != '' && products.value.description[lg.id] != undefined){
  //     let objLang2
  //     if(props.data.translations[lg.locale]) {
  //        objLang2 = {
  //         id: props.data.translations[lg.locale] ?  props.data.translations[lg.locale].id : '',
  //         language_id: lg.id,
  //         field_name: 'name',
  //         value: products.value.name_tran[lg.id]
  //       }
  //     } else {
  //        objLang2 = {
  //         language_id: lg.id,
  //         field_name: 'name',
  //         value: products.value.name_tran[lg.id]
  //       }
  //     }
  //     languageTran.push(objLang2)
  //   }
  //   console.log(products.value.name_tran[lg.id])
  // });

  languages.value.forEach((lg) => {
    let objLang = {
      language_id: lg.id,
      field_name: "description",
      value: products.value.description[lg.id],
    };
    let objLang2 = {
      language_id: lg.id,
      field_name: "name",
      value: products.value.name_tran[lg.id],
    };
    languageTran.push(objLang);
    languageTran.push(objLang2);
  });
  products.value.translation = languageTran;
  // console.log(products.value.translation);
  // validation

  if (
    products.value.name == "" ||
    products.value.price == "" ||
    products.value.sale_price == "" ||
    products.value.category_id == ""
  ) {
    $q.notify({
      position: "top",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t("Field is required"),
    });
    return;
  }
  if (
    parseFloat(products.value.sale_price) <= parseFloat(products.value.price)
  ) {
    $q.notify({
      position: "top",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey("sale price must be greater than price")),
    });
    return;
  }
  if (parseFloat(products.value.price) < 0) {
    $q.notify({
      position: "top",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey("price must be positive number")),
    });
    return;
  }
  if (parseFloat(products.value.quantity) <= 0) {
    $q.notify({
      position: "top",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey("quantity must be biger than zero")),
    });
    return;
  }

  let allFill = false;
  products.value.translation.forEach((tran) => {
    if (tran.value == "" || tran.value == undefined) {
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

  products.value.purchase_price = products.value.price;
  let response = await update(products.value.id, products.value);
  emit("onAdded");
  $q.notify({
    position: "top-right",
    type: "positive",
    icon: "fas fa-check",
    message: t(Utils.getKey("updated successfully")),
  });
  if (response.data.status == false) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-check",
      message: t(Utils.getKey(response.data?.messages[0])),
    });
  }
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
    products.value.name_tran[lg.id] =
      props.data.translations[lg.locale_web]?.name;
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
