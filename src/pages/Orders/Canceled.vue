<template>
  <q-card
    style="margin-left: 0px; box-shadow: none; min-height: 85vh"
    v-if="!vieDetial"
  >
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
            debounce="300"
            v-model="filters.order_id"
            :placeholder="$t(Utils.getKey('Search Order Id'))"
            style="width: 300px; margin-right: 10px"
          />
          <q-input
            dense
            outlined
            debounce="300"
            v-model="filters.product_name"
            :placeholder="$t(Utils.getKey('Search Product Name'))"
            style="width: 300px"
          />

          <el-date-picker
            class="q-ml-md input_white"
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
        <template v-slot:body-cell-order_id="props">
          <q-td>
            <span @click="viewOrderDetial(props.row)" class="pointer">
              <q-chip size="sm" :label="props.row.order_id" />
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-customer_id="props">
          <q-td>
            <span
              ><b
                >{{ props.row.customer?.first_name }}
                {{ props.row.customer?.last_name }}</b
              ></span
            ><br v-if="props.row.customer?.first_name" />
            <span
              >{{ props.row.customer?.idd }}-{{
                props.row.customer?.phone_number
              }}</span
            >
          </q-td>
        </template>
        <template v-slot:body-cell-deals_count="props">
          <q-td>
            <span class="font_16 blue mr-2">
              {{
                props.row.order_product ? props.row?.product_slot_deals?.length : 0
              }}</span
            >
            <span class="pointer" @click="onsShowOrderNumber(props.row)">
              <q-icon
                name="mdi-eye"
                size="xs"
                class="blue r_50 b_l_blue"
              ></q-icon>
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-order_status="props">
          <q-td class="text-center">
            <q-chip
              text-color="blue"
              size="sm"
              :label="$t(Utils.getKey(getTextOrderStatus(props.row.status)))"
              :class="getStatusColor(props)"
              class="pa-3 blue capitalize"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td class="text-center">
            <q-chip
              :icon="getStatusIcon(props)"
              text-color="blue"
              size="sm"
              :label="$t(Utils.getKey(getStatusText(props)))"
              :class="getStatusColor(props)"
              class="pa-3 blue capitalize"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td class="text-center">
            <q-btn
              v-if="Utils.hasPermissions(['Order: Edit/Update Order'])"
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
              v-if="
                Utils.hasPermissions(['Payment: Create Payment']) &&
                props.row.status == 'reserved'
              "
              class="q-mr-sm"
              size="xs"
              rounded
              padding="5px"
              color="positive"
              icon="fas fa-check"
              @click="onDummyPayment(props.row)"
            >
              <q-tooltip>{{ $t(Utils.getKey("Confirm Payment")) }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <Loading :loading="loading" />
  </q-card>
  <q-card v-else>
    <OrderDetails :data="selectedOrder" @back="vieDetial = false" />
  </q-card>

  <q-dialog v-model="showEdit" position="top" persistent>
    <edit-order
      :data="selectedOrder"
      @onClose="showEdit = false"
      @onUpdated="onRefresh"
    />
  </q-dialog>

  <q-dialog v-model="showPayment" persistent>
    <confirm
      @confirm="onPayment"
      @onUpdated="onRefresh"
      @cancel="showPayment = false"
      message="Are you sure you want to Confirm this payment ?"
      :button-label="$t(Utils.getKey('Payment'))"
    />
  </q-dialog>

  <q-dialog v-model="showOrderNumber" persistent>
    <OrderListID :data="selectedOrder" @onClose="showOrderNumber = false" />
  </q-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import useTable from "../../composables/useTable";
import useOrders from "../../composables/useOrders";
import Utils from "../../helpers/Utils";

import EditOrder from "../../components/Orders/Edit.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import Loading from "src/components/Shared/Loading.vue";
import OrderListID from "./OrderListID";
import OrderDetails from "./OrderDetails.vue";

const { loading, columns, items, trash, paginate, dummyPayment } = useOrders();
const showPayment = ref(false);
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

const showOrderNumber = ref(false);
const selectedOrder = ref();
const local = inject("locale");
const filters = reactive({
  name: "",
  status: "canceled",
});
const vieDetial = ref(false);

const getTextOrderStatus = (s) => {
  if (s === "canceled") {
    return "Cancelled";
  }

  return s

}

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "orders.created_at",
      descending: true,
      status: "canceled",
    },
    filter: undefined,
  });
});

const onsShowOrderNumber = async (row) => {
  showOrderNumber.value = true;
  selectedOrder.value = row;
};

const onPayment = async () => {
  try {
    const res = await dummyPayment(selectedOrder.value.id);
    showPayment.value = false;
    onRefresh();
  } catch (error) {
    showPayment.value = false;
  }
};

const onEditClick = (row) => {
  showEdit.value = true;
  selectedOrder.value = row;
};

const onDummyPayment = (row) => {
  showPayment.value = true;
  selectedOrder.value = row;
};

const viewOrderDetial = (row) => {
  vieDetial.value = true;
  selectedOrder.value = row;
  console.log(row);
};

const getStatusColor = (props) => {
  if (props.row.status === "confirmed") {
    return "b_l_blue blue";
  }
  if (props.row.status === "canceled") {
    return "red b_l_red";
  }
  return "b_l_orange orange";
};
const getStatusIcon = (props) => {
  if (props.row.status === "confirmed") {
    return "mdi-checkbox-marked-circle";
  }
  if (props.row.status === "canceled") {
    return "mdi-close-circle";
  }
  return "mdi-checkbox-marked-circle";
};


const getStatusText = (props) => {
  if (props.row.status === "reserved") {
    return "upaid";
  }

  if (props.row.status === "ramaining") {
    return "partail paid";
  }

  if (props.row.status === "canceled") {
    return "cancelled";
  }

  return "paid";
}
const getStatusColor2 = (props) => {
  if (props.row.status === "reserved") {
    return "b_l_blue blue";
  }
  if (props.row.status === "ramaining") {
    return "b_l_orange orange";
  }

  if (props.row.status === "canceled") {
    return "red b_l_red";
  }
  return "b_l_green green2";
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  // range.value = null;
};
</script>
