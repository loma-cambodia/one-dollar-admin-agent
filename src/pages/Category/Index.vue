<template>
  <q-card style="margin-left:0px; box-shadow: none; min-height:85vh;">
    <q-card-section>
      <q-table flat color="primary" :loading="loading" :rows="items" row-key="id" :columns="columns"
        v-model:pagination="pagination" :filter="filters" @request="onRequest"
        :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]" binary-state-sort
        :rows-per-page-label="$t(Utils.getKey('Records per page'))">
        <template v-slot:top>
          <q-input dense outlined debounce="300" v-model="filters.search" :placeholder="$t(Utils.getKey('Search'))"
            style="width: 300px" />
          <q-btn class="q-mr-sm q-mt-xs" dense color="primary" icon="mdi-filter-remove-outline" rounded
            style="margin-left: 10px" @click="resetFilters" />
          <q-space />

          <add-button v-if="Utils.hasPermissions(['Category: Create Category'])" :disable="loading"
            @click="showAdd = true" tooltip-text="Add" color="primary" />
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
          <q-icon style="margin-right: 5px" class="fas fa-exclamation-triangle" />
          {{ $t(Utils.getKey("No matching records found")) }}
        </template>
        <template v-slot:body-cell-sl="props">
          <q-td>
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td>
            {{
               props.row?.translates[locale]?.name
            }}
          </q-td>
        </template>
        <template v-slot:body-cell-description="props">
          <q-td>
            {{
               props.row?.translates[locale]?.description
            }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td  class="text-center">
            <q-chip size="sm" :label="$t(Utils.getKey(props.row.status.toUpperCase())).toUpperCase()" :color="getStatusColor(props)" :class="'text-white'" />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td class="text-center">
            <q-btn v-if="Utils.hasPermissions(['Category: Edit/Update Category'])" class="q-mr-sm" size="xs" rounded
              padding="5px" color="primary" icon="fas fa-pen" @click="onEditClick(props.row)">
              <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
            </q-btn>

            <!-- <q-btn v-if="Utils.hasPermissions(['Category: Delete Category'])" class="q-mr-sm" size="xs" rounded
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
    <add-category :languages="languages" @onClose="showAdd = false" @onAdded="onRefresh" />
  </q-dialog>


  <q-dialog v-model="showEdit" position="top" persistent>
    <edit-category :languages="languages" :data="selectedCategory" @onClose="showEdit = false" @onUpdated="onRefresh" />
  </q-dialog>

  <q-dialog v-model="showConfirm" persistent>
    <confirm @confirm="onDelete" @cancel="showConfirm = false" message="Are you sure you want to delete this Category"
      :button-label="$t(Utils.getKey('Delete'))" />
  </q-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, inject} from "vue";
import useTable from "../../composables/useTable";
import useCategory from "../../composables/useCategory";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";

import AddButton from "../../components/Buttons/AddButton.vue";
import AddCategory from "../../components/Category/Add.vue";
import EditCategory from "../../components/Category/Edit.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import useLanguage from "src/composables/useLanguage";
const locale = inject("locale");
const { all } = useLanguage();
const { loading, columns, items, trash, paginate } = useCategory();
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
const selectedCategory = ref();
const filters = reactive({
  search: "",
});

getData();
async function getData() {
  try {
    const response = await all();
    languages.value = response.data;
  } catch (error) { }
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

const onEditClick = (row) => {
  showEdit.value = true;
  selectedCategory.value = row;
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
