<template>
  <q-page>
    <q-card
      style="margin-top: 20px;margin-left: 0px;box-shadow: none;min-height: 85vh;">
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
              class="q-ml-md input_white"
              dense
              outlined
              debounce="300"
              v-model="filters.order_booking_id"
              :placeholder="$t(Utils.getKey('Search Slot Id'))"
              style="width: 200px"
            />

            <q-input
              class="q-ml-sm input_white"
              dense
              outlined
              debounce="300"
              v-model="filters.deal_id"
              :placeholder="$t(Utils.getKey('Search deal Id'))"
              style="width: 200px"
            />
            <!-- <q-input

            class="q-ml-md input_white"
              dense
              outlined
              debounce="300"
              v-model="filters.status"
              :placeholder="$t(Utils.getKey('Search status'))"
              style="width: 300px"

            /> -->
            <q-select v-model="filters.status" :options="statusOptions" outlined dense emit-value
              :style="$q.platform.is.mobile ? 'width:100%' : 'width:220px'" map-options option-value="id"
              :label="$t(Utils.getKey('Status'))" :option-label="it => $t(Utils.getKey(it.name))" clearable class="pa-2" />

            <el-date-picker
              class=""
              v-model="filters.dates"
              type="daterange"
              value-format="YYYY-MM-DD"
              :start-placeholder="$t(Utils.getKey('Start Date'))"
              :end-placeholder="$t(Utils.getKey('End Date'))"
            >
            </el-date-picker>
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

          <template v-slot:body-cell-product-name="props">
            <q-td>
              <span
                >{{$t(Utils.getKey("Deal Id"))}}:
                <b>{{
                  props.row?.deal?.deal_id ?? "Not Available"
                }}</b></span
              ><br />
              <span
                >{{$t(Utils.getKey("Product Name"))}}:
                <b>{{ props.row?.product?.translations[local]?.name.length > 50
                    ? props.row?.product?.translations[local]?.name.substring(
                        0,
                        50
                      ) + "..."
                    : props.row?.product?.translations[local]?.name

                }}</b></span
              >
            </q-td>
          </template>

          <template v-slot:body-cell-customer-name="props">
            <q-td>
              <span
                >{{$t(Utils.getKey("Name"))}}:
                <b
                  >{{ props.row.customer?.first_name }}
                  {{ props.row.customer?.last_name }}</b
                ></span
              ><br />
              <span
                >{{$t(Utils.getKey("Contact Number"))}}:
                <b
                  >{{ props.row.customer?.idd }}-{{
                    props.row.customer?.phone_number
                  }}</b
                ></span
              >
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
                v-if="props.row.status === 'claimed' "
                size="xs"
                rounded
                padding="5px"
                color="positive"
                icon="mdi-ferry"
                @click="createShipping(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Create Shipping")) }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <Loading :loading="loading" />
    </q-card>

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete this Language"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>
    <q-dialog v-model="showCreateShiping" persistent>
      <add
        :data="selected"
        @onClose="showCreateShiping = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import useTable from "../../composables/useTable";
import usePrizeClaim from "../../composables/usePrizeClaim";
import Utils from "../../helpers/Utils";

import add from "../../components/Shipping/Add.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import Loading from "src/components/Shared/Loading.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { loading, columns, items, trash, paginate } = usePrizeClaim();
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

const selectedCurrency = ref();
const filters = reactive({
  name: "",
});
// ['pending','claimed','canceled','completed','shipping']
const statusOptions = ref([
  {
  id: 'pending',
  name: 'Pending',
},
{
  id: 'claimed',
  name: 'Claimed',
},
// {
//   id: 'canceled',
//   name: 'Cancelled',
// },
// {
//   id: 'completed',
//   name: 'Completed',
// },
// {
//   id: 'shipping',
//   name: 'Shipping',
// },
])

const showCreateShiping = ref(false);

const local = inject("locale");

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
  selectedCurrency.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [row];
};

const createShipping = (row) => {
  showCreateShiping.value = true;
  selected.value = row;
};

const getStatusColor = (props) => {
  if (props.row.status === "pending") {
    return "warning";
  }

  if (props.row.status === "shipping") {
    return "info";
  }

  if (props.row.status === "claimed" || props.row.status === "completed") {
    return "positive";
  }



  return "negative";
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  // range.value = null;
};
</script>
