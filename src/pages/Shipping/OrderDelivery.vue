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
            v-model="filters.search"
            :label="$t(Utils.getKey('Search slot id')) + ''"
            :style="$q.platform.is.mobile ? 'width:100%' : 'width:250px'"
          />
          <q-input
            dense
            outlined
            debounce="250"
            class="pa-4 pr-2"
            v-model="filters.deal_id"
            :label="$t(Utils.getKey('Search deal id')) + ''"
            :style="$q.platform.is.mobile ? 'width:100%' : 'width:250px'"
          />
          <q-select
            v-model="filters.status"
            :options="statusOptions"
            outlined
            dense
            emit-value
            :style="$q.platform.is.mobile ? 'width:100%' : 'width:250px'"
            map-options
            option-value="Status"
            :label="$t(Utils.getKey('Status'))"
            :option-label="(text) => $t(Utils.getKey(text))"
            clearable
            class="pa-2"
          />

          <el-date-picker
            class="mx-2"
            v-model="filters.dates"
            type="daterange"
            value-format="YYYY-MM-DD"
            :start-placeholder="$t(Utils.getKey('Start Date'))"
            :end-placeholder="$t(Utils.getKey('End Date'))"
          >
          </el-date-picker>
          <!-- <q-select
            v-model="filters.status"
            :options="shipSatatus"
            outlined
            dense
            :label="$t(Utils.getKey('Status'))"
            emit-value
            :style="$q.platform.is.mobile ? 'width:100%' : 'width:250px'"
            map-options
            option-value="id"
            :option-label="(item) => $t(Utils.getKey(item.name))"
            clearable
          /> -->
          <q-btn
            class="q-mr-sm q-mt-xs"
            dense
            color="primary"
            icon="mdi-filter-remove-outline"
            rounded
            style="margin-left: 10px"
            @click="resetFilters"
          />

          <!-- <q-space />
          <add-button
            v-if="Utils.hasPermissions(['Product: Create Product'])"
            :disable="loading"
            @click="showAdd = true"
            tooltip-text="Add"
            color="primary"
          /> -->
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
        <template v-slot:body-cell-customer_id="props">
          <q-td>
            <span
              >{{ $t("name") }}:
              <b
                >{{ props.row.customer?.first_name }}
                {{ props.row.customer?.last_name }}</b
              ></span
            ><br />
            <span
              >{{ $t("contact_number") }}:
              <b
                >{{ props.row.customer?.idd }}-{{
                  props.row.customer?.phone_number
                }}</b
              ></span
            >
            <br />
            <span
              >{{ $t("address") }}:
              <b>
                <!-- {{
                  props.row?.address?.street_address_1
                    ? props.row?.address?.street_address_1 + ", "
                    : ""
                }}
                {{
                  props.row?.address?.street_address_1
                    ? props.row?.address?.street_address_1 + ", "
                    : ""
                }} -->

                {{
                  props.row?.address?.city?.city_name
                    ? props.row?.address?.city?.city_name + ", "
                    : ""
                }}
                {{
                  props.row?.address?.state?.state_name
                    ? props.row?.address?.state?.state_name + ", "
                    : ""
                }}
                {{
                  props.row?.address?.country?.name
                    ? props.row?.address?.country?.name + ", "
                    : ""
                }}
                {{
                  props.row?.address?.pincode ? props.row?.address?.pincode : ""
                }}
              </b></span
            >
            <span>
              <q-icon
                class="ml-2 pointer"
                @click="viewAddress(props.row?.address)"
                name="mdi-card-account-details"
                size="xs"
              />
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-carrier_id="props">
          <q-td>
            <span
              >{{ $t("name") }}:
              <b>{{ props.row.carrier?.name || $t("not_avalilabe") }}</b></span
            ><br />
            <span
              >{{ $t("contact_number") }}:
              <b>{{
                props.row.carrier?.contact_no || $t("not_avalilabe")
              }}</b></span
            ><br />
            <span
              >{{ $t("contact_email") }}:
              <b>{{ props.row.carrier?.email || $t("not_avalilabe") }}</b></span
            >
          </q-td>
        </template>
        <template v-slot:body-cell-tracking_id="props">
          <q-td class="text-center">
            <q-input
              v-model="props.row.tracking_id"
              :oninput="(evt) => Utils.validationSpecailCaracter2(evt)"
              @change="tranckingChange(props.row)"
              type="text"
              dense
              outlined
            />
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td class="text-center">
            <span class="pointer">
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
        </template>
        <!-- action -->
        <template v-slot:body-cell-actions="props">
          <q-td class="text-center">
            <q-btn
              v-if="
                Utils.hasPermissions(['Shipping: Edit/Update Shipping']) &&
                props.row.status != 'Delivered' &&
                props.row.status != 'Cancelled'
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
            <!-- <q-btn
              v-if="Utils.hasPermissions(['Shipping: Delete Shipping']) && props.row.status != 'Delivered' && props.row.status != 'Cancelled'"
              class="q-mr-sm"
              size="xs"
              rounded
              padding="5px"
              color="negative"
              icon="fas fa-trash"
              @click="onDeleteClick(props.row)"
            >
              <q-tooltip>{{ $t(Utils.getKey("Delete")) }}</q-tooltip>
            </q-btn> -->
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <Loading :loading="loading" />
  </q-card>

  <q-dialog v-model="showEdit" position="top" persistent>
    <edit :data="editData" @onClose="showEdit = false" @onUpdated="onRefresh" />
  </q-dialog>

  <q-dialog v-model="showAddress" persistent>
    <adddresses
      :address="address"
      @onClose="showAddress = false"
      @onUpdated="onRefresh"
    />
  </q-dialog>

  <q-dialog v-model="showConfirm" persistent>
    <confirm
      @confirm="onDelete"
      @cancel="showConfirm = false"
      message="Delete shipping?"
      :button-label="$t(Utils.getKey('Delete'))"
    />
  </q-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, inject, watch } from "vue";
import moment from "moment";
import useTable from "../../composables/useTable";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
import Confirm from "src/components/Shared/Confirm.vue";
import AddButton from "../../components/Buttons/AddButton.vue";
import adddresses from "src/components/Shipping/Address.vue";
import useShipping from "../../composables/useShipping";
import { useQuasar } from "quasar";
// edit, add
import edit from "../../components/Shipping/Edit.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const currency_id = inject("currency_id");
const locale = inject("locale");
const $q = useQuasar();

const { loading, columns, items, trash, paginate, update } = useShipping();
const {
  showAdd,
  showEdit,
  selected,
  showConfirm,
  pagination,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);

// ref
const filters = reactive({
  search: "",
  category_id: "",
});
const range = ref(null)
const editData = ref([]);
const address = ref({});
const showAddress = ref(false);
const statusOptions = ref([
  "In Transit",
  "Delivered",
  "Failed",
  "Cancelled",
]);

// end

// ===> start function
const getStatusColor = (props) => {
  if (props.row.status === "Delivered") {
    return "positive";
  }

  if (props.row.status === "Pending") {
    return "warning";
  }

  if (
    props.row.status === "Failed Delivery" ||
    props.row.status === "Cancelled"
  ) {
    return "negative";
  }

  return "primary";
};

const viewAddress = (ads) => {
  address.value = ads;
  showAddress.value = true;
};
const tranckingChange = async (e) => {
  try {
    await update(e.id, e);
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
};
const onEditClick = (row) => {
  showEdit.value = true;
  editData.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  editData.value = row;
};

const onDelete = async () => {
  await trash(editData.value.id);
  onRefresh();
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }
  range.value = null;
};

// ==> end functiong

// vue api section

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "created_at",
    },
    filter: undefined,
  });
});
//end
</script>
<style scoped>
@media only screen and (max-width: 912px) {
  .q-page {
    padding-right: 0px !important;
  }
  .ml-0 {
    margin-right: 0px !important;
  }
}
</style>
