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
            debounce="300"
            v-model="filters.search"
            :placeholder="$t(Utils.getKey('Search'))"
            style="width: 300px"
          />
          <q-select
            v-model="filters.category_id"
            style="width: 250px"
            :options="categoryOption"
            outlined
            dense
            emit-value
            map-options
            class="q-ml-md"
            option-value="id"
            option-label="name"
            :label="$t(Utils.getKey('Category'))"
            clearable
          />

          <q-select
            v-model="filters.sub_category_id"
            :options="subCategoryOption"
            outlined
            dense
            emit-value
            style="width: 250px"
            map-options
            option-value="id"
            :label="$t(Utils.getKey('Sub category'))"
            option-label="name"
            clearable
            class="q-ml-md input_white"
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
            v-if="Utils.hasPermissions(['SubCategory: Create SubCategory'])"
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
        <template v-slot:body-cell-sl="props">
          <q-td>
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <template v-slot:body-cell-sub_categoriesName="props">
          <q-td>
            {{ props.row?.translates[locale]?.name || "" }}
          </q-td>
        </template>
        <template v-slot:body-cell-description="props">
          <q-td>
            {{ props.row?.translates[locale]?.description || "" }}
          </q-td>
        </template>
        <template v-slot:body-cell-categoryName="props">
          <q-td>
            {{ props.row?.category?.translates[locale]?.name || "" }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td class="text-center">
            <q-chip
              size="sm"
              :label="
                $t(Utils.getKey(props.row.status.toUpperCase())).toUpperCase()
              "
              :color="getStatusColor(props)"
              :class="'text-white'"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td class="text-center">
            <q-btn
              v-if="
                Utils.hasPermissions(['SubCategory: Edit/Update SubCategory'])
              "
              class="q-mr-sm"
              size="xs"
              rounded
              padding="5px"
              color="primary"
              icon="fas fa-pen"
              @click="onEditClick(props.row)"
            >
              <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
            </q-btn>

            <!-- <q-btn v-if="Utils.hasPermissions(['SubCategory: Delete SubCategory'])" class="q-mr-sm" size="xs" rounded
              padding="5px" color="negative" icon="fas fa-trash" @click="onDeleteClick(props.row)">
              <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
            </q-btn> -->
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <Loading :loading="loading" />
  </q-card>

  <q-dialog v-model="showAdd" position="top" persistent>
    <add-sub-category
      :languages="languages"
      :categoryOption="categoryOption"
      @onClose="showAdd = false"
      @onAdded="onRefresh"
    />
  </q-dialog>

  <q-dialog v-model="showEdit" position="top" persistent>
    <edit-sub-category
      :categoryOption="categoryOption"
      :languages="languages"
      :data="selectedSubCategory"
      @onClose="showEdit = false"
      @onUpdated="onRefresh"
    />
  </q-dialog>

  <q-dialog v-model="showConfirm" persistent>
    <confirm
      @confirm="onDelete"
      @cancel="showConfirm = false"
      message="Are you sure you want to delete this Category"
      :button-label="$t(Utils.getKey('Delete'))"
    />
  </q-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, watch, inject } from "vue";
import useTable from "../../composables/useTable";
import useSubCategory from "../../composables/useSubCategory";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";

import AddButton from "../../components/Buttons/AddButton.vue";
import AddSubCategory from "../../components/SubCategory/Add.vue";
import EditSubCategory from "../../components/SubCategory/Edit.vue";
import Confirm from "../../components/Shared/Confirm.vue";

import useLanguage from "src/composables/useLanguage";
import useCategory from "src/composables/useCategory";
const locale = inject("locale");
const { all } = useLanguage();
const category = useCategory();
const { loading, columns, items, trash, paginate, getByCategoryId } =
  useSubCategory();
const {
  showAdd,
  showEdit,
  selected,
  showConfirm,
  pagination,
  onDelete,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);
const languages = ref([]);
const selectedSubCategory = ref();
const filters = reactive({
  search: "",
});
const subCategoryOption = ref([]);
const categoryOption = ref([]);

getData();
async function getData() {
  try {
    const response = await all();
    const getCategory = await category.all();
    languages.value = response.data;
    categoryOption.value = getCategory.data.map((pro)=>{
      return {
        id: pro.id,
        name: pro?.translates[locale.value]?.name,
      }
    });
  } catch (error) {}
}

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "name",
    },
    filter: undefined,
  });
});

const getSubCategory = async () => {
  let getSub = await getByCategoryId(filters.category_id);
  subCategoryOption.value = getSub.data.map((pro)=>{
      return {
        id: pro.id,
        name: pro?.translates[locale.value]?.name,
      }
    });
};

watch(
  () => locale.value,
  () => {
    getData();
  }
);

watch(
  () => filters.category_id,
  () => {
    getSubCategory();
    filters.sub_category_id = "";
  }
);

const onEditClick = (row) => {
  showEdit.value = true;
  selectedSubCategory.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [row];
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

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};
</script>
