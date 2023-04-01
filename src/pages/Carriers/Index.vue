<template>
  <q-page>

    <q-card style="margin-top:20px; margin-left:0px; box-shadow: none; min-height:85vh;">
      <q-card-section>
        <q-table
          flat
          class="q-pt-md"
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
             class="mx-1"
              debounce="300"
              v-model="filters.name"
              :placeholder="$t(Utils.getKey('Search name'))"
              style="width: 300px"
            />

            <q-input
              dense
              outlined
              class="mx-1"
              debounce="300"
              v-model="filters.email"
              :placeholder="$t(Utils.getKey('Search Email'))"
              style="width: 300px"
            />

            <q-input
              dense
              outlined
              class="mx-1"
              debounce="300"
              v-model="filters.contact_no"
              :placeholder="$t(Utils.getKey('Search Contact No'))"
              style="width: 300px"
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
              v-if="Utils.hasPermissions(['Carrier: Create Carrier'])"
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
          <template v-slot:body-cell-name="props">
            <q-td class="text-left">
             {{ props.row.name }}
            </q-td>
          </template>

          <template v-slot:body-cell-contact_no="props">
            <q-td class="text-left">
              {{ props.row.contact_no }}
            </q-td>
          </template>

          <template v-slot:body-cell-website="props">
            <q-td class="text-left">
              {{ props.row.website }}
            </q-td>
          </template>

          <template v-slot:body-cell-email="props">
            <q-td class="text-left">
              {{ props.row.email }}
            </q-td>
          </template>

          <template v-slot:body-cell-address="props">
            <q-td class="text-left">
              {{ props.row.address }}
            </q-td>
          </template>

          <template v-slot:body-cell-tracking_url="props">
            <q-td class="text-left">
              {{ props.row.tracking_url }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="Utils.hasPermissions(['Carrier: Edit/Update Carrier'])"
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
              <q-btn
                v-if="Utils.hasPermissions(['Carrier: Delete Carrier'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="negative"
                icon="fas fa-trash"
                @click="onDeleteClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Delete")) }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showAdd" position="top" persistent>
      <add-carrier @onClose="showAdd = false"  @onAdded="onRefresh" />
    </q-dialog>

    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-carrier
      :data="selectedCarriers"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete this Carrier?"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import useTable from "../../composables/useTable";
import useCarriers from "../../composables/useCarriers";
import Utils from "../../helpers/Utils";

import Breadcrumbs from "../../components/Menu/BreadCrumbs.vue";
import AddButton from "../../components/Buttons/AddButton.vue";
import AddCarrier from "../../components/Carriers/Add.vue";
import EditCarrier from "../../components/Carriers/Edit.vue";
import Confirm from "../../components/Shared/Confirm.vue";

const { loading, columns, items, trash, paginate } = useCarriers();
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

const selectedCarriers = ref();
const filters = reactive({
  name: "",
});

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "id",
    },
    filter: undefined,
  });
});

const onEditClick = (row) => {
  showEdit.value = true;
  selectedCarriers.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [row];
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};
</script>
