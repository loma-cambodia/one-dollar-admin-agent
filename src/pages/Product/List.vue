<template>
  <q-card style="margin-left: 0px; box-shadow: none; min-height: 85vh">
    <q-card-section>
      <q-table
        flat
        color="primary"
        :loading="loading"
        :rows="items"
        row-key="id"
        :columns="columns"
        v-model:pagination="pagination"
        :filter="filters"
        @request="onRequest"
        :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
        binary-state-sort
        :rows-per-page-label="$t(Utils.getKey('Records per page'))"
      >
        <template v-slot:top>
          <q-input
            dense
            outlined
            debounce="250"
            class="pa-2"
            v-model="filters.search"
            :label="$t(Utils.getKey('Search name'))"
            :style="$q.platform.is.mobile ? 'width:100%' : 'width:250px'"
          />
          <!-- <el-date-picker
            class="pa-2 msl-2"
            v-model="filters.dates"
            type="daterange"
            :style="$q.platform.is.mobile ? 'width:100%' : 'width:250px'"
            value-format="YYYY-MM-DD"
            :start-placeholder="$t(Utils.getKey('Start Date'))"
            :end-placeholder="$t(Utils.getKey('End Date'))"
          >
          </el-date-picker> -->
          <q-select
            v-model="filters.category_id"
            :style="$q.platform.is.mobile ? 'width:100%' : 'width:250px'"
            :options="categoryOption"
            outlined
            dense
            emit-value
            map-options
            class="pa-2"
            option-value="id"
            option-label="name"
            :label="$t(Utils.getKey('Category'))"
            clearable
            @filter="filterCategory"
          />

          <q-select
            v-model="filters.sub_category_id"
            :options="subCategoryOption"
            outlined
            dense
            emit-value
            :style="$q.platform.is.mobile ? 'width:100%' : 'width:250px'"
            class="pa-2"
            map-options
            option-value="id"
            :label="$t(Utils.getKey('Sub category'))"
            option-label="name"
            clearable
            @filter="filterSubCategory"
          />
          <q-select
            v-model="filters.promotion_id"
            :options="promotionOptions"
            outlined
            dense
            emit-value
            :style="$q.platform.is.mobile ? 'width:100%' : 'width:250px'"
            map-options
            option-value="id"
            :label="$t(Utils.getKey('Promotion'))"
            option-label="name"
            clearable
            class="pa-2"
          />
          <q-select
            v-model="filters.status"
            :options="['active', 'inactive']"
            outlined
            dense
            emit-value
            :style="$q.platform.is.mobile ? 'width:100%' : 'width:250px'"
            map-options
            :label="$t('status')"
            :option-label="(name) => $t(Utils.getKey(name))"
            clearable
            class="pa-2"
          />
          <q-btn
            class="q-mr-sm q-mt-xs"
            dense
            color="primary"
            icon="mdi-filter-remove-outline"
            rounded
            style="margin-left: 10px"
            @click="resetFilters"
          />
          <q-space />
          <add-button
            v-if="Utils.hasPermissions(['Product: Create Product'])"
            :disable="loading"
            @click="showAdd = true"
            tooltip-text="Add"
            color="primary"
          />
        </template>

        <!-- header column -->
        <template v-slot:header-cell="props">
          <q-th :props="props">
            {{
              props.col.label === "#"
                ? props.col.label
                : $t(Utils.getKey(props.col.label))
            }}
          </q-th>
        </template>
        <!-- no data -->
        <template v-slot:no-data>
          <q-icon
            style="margin-right: 5px"
            class="fas fa-exclamation-triangle"
          />
          {{ $t(Utils.getKey("No matching records found")) }}
        </template>
        <!-- <template v-slot:body-cell-status="props">
          <q-td class="text-center">
            <span class="pointer" @click="onDisableConfirm(props.row)">
              <q-chip
                :label="$t(Utils.getKey(props.row.status))?.toUpperCase()"
                :color="getStatusColor(props)"
                size="sm"
                :class="
                  props.row.status !== 'active' ? 'text-white' : 'text-white'
                "
              />
            </span>
          </q-td>
        </template> -->
        <template v-slot:body-cell-status="props">
          <q-td class="text-center">
            <div>
              <q-toggle
                ref="toggleRef"
                :modelValue="getValueStatus(props.row.status)"
                checked-icon="check"
                color="green"
                :label="
                  getValueStatus(props.row.status) == 0
                    ? $t(Utils.getKey('off'))
                    : $t(Utils.getKey('on'))
                "
                unchecked-icon="clear"
                :true-value="1"
                :false-value="0"
                size="50px"
                @update:model-value="onDisableConfirm(props.row)"
              />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-sl="props">
          <q-td>
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td>
            {{
              props.row?.translations[locale]?.name?.length > 30
                ? props.row?.translations[locale]?.name?.substring(0, 30) +
                  "..."
                : props.row?.translations[locale]?.name
            }}
          </q-td>
        </template>
        <template v-slot:body-cell-description="props">
          <q-td>
            {{
              props.row?.translations[locale]?.description?.length > 30
                ? props.row?.translations[locale]?.description?.substring(0, 30)
                : props.row?.translations[locale]?.description
            }}
          </q-td>
        </template>
        <template v-slot:body-cell-category="props">
          <q-td>
            {{ props.row?.category?.translates[locale]?.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-sku="props">
          <q-td class="text-left">
            <span class="pointer" @click="onView(props.row)">
              <q-chip :label="props.row.sku" size="sm" />
            </span>
          </q-td>
        </template>
        <!-- promotion -->
        <template v-slot:body-cell-promotion="props">
          <q-td class="text-center">
            <div
              style="font-size: 12px"
              v-html="onShowPromotion(props.row)"
            ></div>
          </q-td>
        </template>

        <!-- deals -->
        <template v-slot:body-cell-deal_setting="props">
          <q-td class="text-right">
            <div v-html="onShowDealsConfiguration(props.row)"></div>
          </q-td>
        </template>

        <!-- deals -->
        <template v-slot:body-cell-deal="props">
          <q-td class="text-right">
            <div v-html="onShowDeals(props.row)"></div>
          </q-td>
        </template>
        <!-- price -->
        <template v-slot:body-cell-price="props">
          <q-td class="text-right">
            <div v-html="onShowPrice(props.row)"></div>
          </q-td>
        </template>
        <!-- action -->
        <template v-slot:body-cell-actions="props">
          <q-td class="text-center">
            <q-btn-dropdown
              flat
              size="sm"
              text-color="#000"
              style="font-weight"
              color="secondary"
              :label="$t('actions')"
            >
              <q-list>
                <q-item
                  v-if="Utils.hasPermissions(['Product: Edit/Update Product'])"
                  @click="onEditClick(props.row)"
                  clickable
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-btn
                      class="q-mr-sm"
                      rounded
                      padding="5px"
                      color="primary"
                    >
                      <q-icon size="xs" name="edit" />
                    </q-btn>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ $t(Utils.getKey("Edit")) }}</q-item-label>
                    <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
                  </q-item-section>
                </q-item>
                <q-item
                  v-if="Utils.hasPermissions(['Product: Edit/Update Product'])"
                  @click="onSetings(props.row)"
                  clickable
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-btn
                      class="q-mr-sm"
                      size="xs"
                      rounded
                      padding="5px"
                      color="primary"
                    >
                      <q-icon size="xs" name="settings" />
                    </q-btn>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{
                      $t(Utils.getKey("Setting"))
                    }}</q-item-label>
                    <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
                  </q-item-section>
                </q-item>

                <q-item @click="onView(props.row)" clickable v-close-popup>
                  <q-item-section avatar>
                    <q-btn
                      class="q-mr-sm"
                      size="xs"
                      rounded
                      padding="5px"
                      color="primary"
                    >
                      <q-icon size="xs" name="mdi-eye" />
                    </q-btn>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ $t(Utils.getKey("View")) }}</q-item-label>
                    <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
                  </q-item-section>
                </q-item>

                <q-item
                  v-if="Utils.hasPermissions(['Product: Edit/Update Product'])"
                  @click="onUploadClick(props.row)"
                  clickable
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-btn
                      class="q-mr-sm"
                      size="xs"
                      rounded
                      padding="5px"
                      color="primary"
                    >
                      <q-icon size="xs" name="image" />
                    </q-btn>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{
                      $t(Utils.getKey("Add Images"))
                    }}</q-item-label>
                    <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
                  </q-item-section>
                </q-item>

                <q-item
                  v-if="Utils.hasPermissions(['Product: Delete Product'])"
                  @click="onDeleteClick(props.row)"
                  clickable
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-btn
                      class="q-mr-sm"
                      size="xs"
                      rounded
                      padding="5px"
                      color="primary"
                    >
                      <q-icon size="xs" name="fas fa-trash" />
                    </q-btn>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{
                      $t(Utils.getKey("delete"))
                    }}</q-item-label>
                    <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <Loading :loading="loading" />
  </q-card>
  <q-dialog v-model="showAdd" position="top" persistent>
    <add
      :categoryOption="categoryOption"
      :tagsOptions="tagsOptions"
      :promotionOptions="promotionOptions"
      :languages="languages"
      @onClose="showAdd = false"
      @onAdded="onRefresh"
    />
  </q-dialog>

  <q-dialog v-model="showEdit" position="top" persistent>
    <edit
      :categoryOption="categoryOption"
      :tagsOptions="tagsOptions"
      :promotionOptions="promotionOptions"
      :languages="languages"
      :data="editData"
      @onClose="showEdit = false"
      @onAdded="onRefresh"
    />
  </q-dialog>

  <q-dialog v-model="showImage" position="top" persistent>
    <uploadimage
      @onAdded="onRefresh"
      :data="editData"
      @onClose="showImage = false"
    />
  </q-dialog>

  <q-dialog v-model="showSetting" position="top" persistent>
    <settings
      @onAdded="onRefresh"
      :data="editData"
      @onClose="showSetting = false"
    />
  </q-dialog>

  <q-dialog v-model="showConfirm" persistent>
    <confirm
      @confirm="onDisable"
      @cancel="showConfirm = false"
      :message="
        editData.status == 'active'
          ? Utils.getKey('disable_product')
          : Utils.getKey('active_product')
      "
      :button-label="
        editData.status == 'active'
          ? $t(Utils.getKey('disable'))
          : $t(Utils.getKey('active'))
      "
    />
  </q-dialog>

  <q-dialog v-model="showDelete" persistent>
    <confirm
      @confirm="onDelete"
      @cancel="showDelete = false"
      :message="Utils.getKey('delete product')"
      :button-label="$t(Utils.getKey('Delete'))"
    />
  </q-dialog>

  <q-dialog v-model="showOnView" persistent>
    <ViewProduct
      :categoryOption="categoryOption"
      :tagsOptions="tagsOptions"
      :promotionOptions="promotionOptions"
      :languages="languages"
      :data="editData"
      @onClose="showOnView = false"
    />
  </q-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, inject, watch } from "vue";
import moment from "moment";
import useTable from "../../composables/useTable";
import useProduct from "../../composables/useProduct";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
import Confirm from "src/components/Shared/Confirm.vue";
import AddButton from "../../components/Buttons/AddButton.vue";
import Add from "src/components/Product/Add.vue";
import Edit from "src/components/Product/Edit.vue";
import ViewProduct from "src/components/Product/ViewProduct.vue";
import { useQuasar } from "quasar";
import uploadimage from "src/components/Product/UploadImage.vue";
import settings from "src/components/Product/Settings.vue";
// use=
import useCategory from "src/composables/useCategory";
import usePromotion from "src/composables/usePromotion";
import useTags from "src/composables/useTags";
import useLanguage from "src/composables/useLanguage";
import useSubCategory from "src/composables/useSubCategory";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const $q = useQuasar();
const currency_id = inject("currency_id");
const locale = inject("locale");
const { loading, columns, items, trash, paginate, prodSatus } = useProduct();
const {
  showAdd,
  showEdit,
  selected,
  showConfirm,
  pagination,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);

const selectedCurrency = ref();
const showAddLanguage = ref(false);
const filters = reactive({
  search: "",
  category_id: "",
});

const showImage = ref(false);
const showSetting = ref(false);
const showDelete = ref(false);
const showOnView = ref(false);
const category = useCategory();
const { all } = useLanguage();
const tages = useTags();
const promotions = usePromotion();
const subCategory = useSubCategory();

let tempSubCategoryOptions = [];
const subCategoryOption = ref([]);

let tempCategoryOption = [];
const categoryOption = ref([]);
const tagsOptions = ref([]);
const promotionOptions = ref([]);
const languages = ref([]);
const editData = ref([]);
const defaultDate = [
  moment().startOf("month").format("YYYY-MM-DD"),
  moment().endOf("month").format("YYYY-MM-DD"),
];
const dateSearch = ref(defaultDate);
Promise.all([getLanuge()]);
getData();

async function getLanuge() {
  const response = await all();
  languages.value = response.data;
}

const getValueStatus = (statusData) => {
  if (statusData == "active") {
    return 1;
  }
  return 0;
};

async function getData() {
  try {
    loading.value = true;
    const getCategory = await category.all();
    const getTags = await tages.all();
    const getPromotion = await promotions.all();

    categoryOption.value = tempCategoryOption = getCategory.data.map((pro) => {
      return {
        id: pro.id,
        name: pro?.translates[locale.value]?.name,
      };
    });
    tagsOptions.value = getTags.data.map((pro) => {
      return {
        id: pro.id,
        name: pro?.translates[locale.value]?.name,
      };
    });
    promotionOptions.value = getPromotion.data.map((pro) => {
      return {
        id: pro.id,
        name: pro?.translates[locale.value]?.name,
      };
    });
    loading.value = false;
  } catch (error) {}
}

watch(
  () => locale.value,
  () => {
    getData();
    getSubCategory();
  }
);

const onToggleClick = (val) => {
  showDisbleGauth.value = true;
  selectedUser.value = val;
  console.log("selct=", selectedUser);
};
const getStatusColor = (props) => {
  if (props.row.status === "active") {
    return "positive";
  }

  if (props.row.status === "inactive") {
    return "negative";
  }

  return "gray";
};
const onShowPrice = (row) => {
  if (row.prices) {
    let getPrice = row.prices.filter((p) => p.currency_id == currency_id);
    if (getPrice.length > 0) {
      return `${t(
        Utils.getKey("Price")
      )}: <span class="text-bold amount">${Utils.formatCurrency(
        getPrice[0].price
      )}</span> <br/>
              ${t(
                Utils.getKey("Sale Price")
              )}:  <span class="text-bold amount">${Utils.formatCurrency(
        getPrice[0].sale_price
      )}`;
    }
  }
  return "";
};
const onShowDeals = (row) => {
  if (row.deal) {
    return `${t(Utils.getKey("time  period"))}: <span class="text-bold">${
      row.deal.time_period
    }h</span> <br/>
            ${t(
              Utils.getKey("slot price")
            )}:  <span class="text-bold amount">${Utils.formatCurrency(
      row.deal.slot_price
    )}</span> <br/>
            ${t(
              Utils.getKey("deal Price")
            )}: <span class="text-bold amount">${Utils.formatCurrency(
      row.deal.deal_price
    )}</span>
            `;
  }
  return "";
};

const onShowDealsConfiguration = (row) => {
  if (row.deal) {
    return `${t(Utils.getKey("time  period"))}: <span class="text-bold">${
      row.deal_configuration?.time_period || ""
    }h</span> <br/>
            ${t(
              Utils.getKey("slot price")
            )}:  <span class="text-bold amount">${Utils.formatCurrency(
      row.deal_configuration?.slot_price || ""
    )}</span> <br/>
            ${t(
              Utils.getKey("deal Price")
            )}: <span class="text-bold amount">${Utils.formatCurrency(
      row.deal_configuration?.deal_price || ""
    )}</span>
            `;
  }
  return "";
};

const onShowPromotion = (row) => {
  if (row.promotion) {
    let it = "";
    row.promotion.forEach((pro, index) => {
      if (row.promotion.length == index + 1) {
        it = it + pro?.translates[locale.value]?.name;
      } else {
        it = it + pro?.translates[locale.value]?.name + "<br>";
      }
    });
    return it;
  }
  return "";
};
const filterCategory = (val, update) => {
  categoryOption.value = Utils.filterDropdownOptions(
    tempCategoryOption,
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
const getSubCategory = async () => {
  let getSub = await subCategory.getByCategoryId(filters.category_id);
  subCategoryOption.value = tempSubCategoryOptions = getSub.data.map((pro) => {
    return {
      id: pro.id,
      name: pro?.translates[locale.value]?.name,
    };
  });
};
watch(
  () => filters.category_id,
  () => {
    getSubCategory();
    filters.sub_category_id = "";
  }
);

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "created_at",
    },
    filter: undefined,
  });
});

const onEditClick = (row) => {
  showEdit.value = true;
  editData.value = row;
};

const onUploadClick = (row) => {
  showImage.value = true;
  editData.value = row;
};

const onSetings = (row) => {
  showSetting.value = true;
  editData.value = row;
};
const onView = (row) => {
  showOnView.value = true;
  editData.value = row;
};
const onDisable = async () => {
  try {
    let status = {
      status: editData.value.status == "active" ? "inactive" : "active",
    };
    let resp = await prodSatus(editData.value.id, status);
    console.log(resp);
    if (resp.data.status == false) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(resp.data.messages[0]),
      });
    } else {
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("updated successfully")),
      });
      onRefresh();
    }
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
};
const onDelete = async () => {
  try {
    let response = await trash(editData.value.id, editData.value);
    console.log(response.data.status);
    if (response.data.status) {
      onRefresh();
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("deleted successfully")),
      });
    } else {
           $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-check",
        message: t(Utils.getKey("Product already active in deal cannot delete")),
      });
    }

    showDelete.value = false;
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
};
const onDisableConfirm = (row) => {
  showConfirm.value = true;
  editData.value = row;
};

const onDeleteClick = (row) => {
  showDelete.value = true;
  // selected.value = [row];
  editData.value = row;
};
const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  // range.value = null;
};
</script>
<style scoped></style>
