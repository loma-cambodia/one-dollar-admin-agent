<template>
  <q-card flat>
    <q-btn
      class="mt-1"
      @click="emit('onClose', isExtendTime)"
      flat
      icon="mdi-backburger"
    >
      {{ $t("back") }}
    </q-btn>
    <q-separator class="mb-2" />
    <q-card-section class="q-px-md pt-0">
      <q-form ref="pageForm">

        <div class="row">
          <div class="col-12 col-md-8 q-pr-md">
            <h2 class="mb-1">
              {{ deal.products?.translations[locale]?.name }}
            </h2>
            <div class="d-flex mt-4">
              <q-chip
                style="margin-left: -2px"
                class="ml-0 white"
                color="primary"
                >{{ d_id }}</q-chip
              >
              <p class="mt-2 ml-2">
                {{ $t("product_sku") }}: {{ deal.products.sku }}
              </p>
            </div>
            <div>
              <div class="row">
                <div class="col-12 col-sm-6 col-md-3 pr-4">
                  <q-card
                    flat
                    bordered
                    class="pa-4 mt-6 d_flex_center"
                    style="min-height: 102px"
                  >
                    <div>
                      <p class="font_24 text-bold mb-0 text-center">
                        {{ deal.deal_price }}
                      </p>
                      <span class="text-bold">{{ $t("deal_price") }}</span>
                    </div>
                  </q-card>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-card
                    flat
                    bordered
                    class="pa-4 mt-6 d_flex_center"
                    style="min-height: 102px"
                  >
                    <div>
                      <div class="d-flex">
                        <img
                          :alt="$t('booked_slots')"
                          src="../../assets/chai_green.png"
                          style="height: 40px"
                        />
                        <div class="ml-2" style="width: 164px">
                          <p class="font_24 text-bold mb-0">
                            {{ deal?.slots.booked_slots || 0 }}
                          </p>
                          <span class="text-bold">{{ $t("booked_slots") }}</span>
                        </div>
                      </div>
                    </div>
                  </q-card>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-card
                    flat
                    bordered
                    class="pa-4 mt-6 d_flex_center"
                    style="min-height: 102px"
                  >
                    <div class="d-flex">
                      <img
                        :alt="$t('slots_left')"
                        src="../../assets/mdi_chair-rolling.png"
                        style="height: 44px"
                      />
                      <div class="ml-2">
                        <p class="font_24 text-bold mb-0">
                          {{ deal?.slots.total_slots - deal?.slots.booked_slots }}
                        </p>
                        <span class="text-bold">{{ $t("slots_left") }}</span>
                      </div>
                    </div>
                  </q-card>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-card
                    flat
                    bordered
                    class="pa-4 mt-6 d_flex_center"
                    style="min-height: 102px"
                  >
                    <div class="d-flex">
                      <img
                        :alt="$t('total_slots')"
                        src="../../assets/chair_blue.png"
                        style="height: 40px"
                      />
                      <div class="ml-2">
                        <p class="font_24 text-bold mb-0">
                          {{ deal?.slots.total_slots }}
                        </p>
                        <span class="text-bold">{{ $t("total_slots") }}</span>
                      </div>
                    </div>
                  </q-card>
                </div>
                <div class="col-12 col-sm-12 col-md-12">
                  <q-card
                    flat
                    bordered
                    class="pa-4 mt-6 d_flex_between"
                    style="min-height: 102px"
                  >
                    <div class="flex-1">
                      <div class="ml-2">
                        <p class="font_16 mb-0">
                          {{
                            moment(deal.created_at).format(
                              "YYYY-MM-DD | h:mm:ss a"
                            )
                          }}
                        </p>
                        <span class="text-bold">{{ $t("start_date_time") }}</span>
                      </div>
                    </div>
                    <div class="flex-1 b_left">
                      <div class="ml-2">
                        <p class="font_16 mb-0 text-right">
                          {{ dEnd }}
                        </p>
                        <p class="text-bold text-right">
                          {{ $t("expect_end_date_time") }}
                        </p>
                      </div>
                    </div>
                  </q-card>
                </div>

                <!-- for none settlement -->
                <div v-if="deal.status != 'settled'" class="col-12">
                  <div class="row">
                    <!-- row 2 -->
                    <div class="col-12 col-sm-6 col-md-4 pr-2">
                      <q-card
                        flat
                        bordered
                        class="pa-4 orange mt-6 d_flex_center"
                      >
                        <div class="d-flex">
                          <img
                            :alt="$t('time_left')"
                            src="../../assets/clock.png"
                            style="height: 40px"
                          />
                          <div class="ml-2">
                            <p class="font_16 text-bold mb-0">
                              {{ timeCoundown }}
                            </p>
                            <span class="text-bold">{{ $t("time_left") }}</span>
                          </div>
                        </div>
                      </q-card>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 px-2">
                      <q-card flat bordered class="pa-4 mt-6 d_flex_center green">
                        <div class="d-flex">
                          <img
                            :alt="$t('slots')"
                            src="../../assets/grap_up_blue.png"
                            style="height: 40px"
                          />
                          <div class="ml-2">
                            <p class="font_16 text-bold mb-0">
                              {{ currentRate() }} {{ $t("slots") }}/{{ $t("hr") }}
                            </p>
                            <span class="green">{{
                              $t("current_filling_rate")
                            }}</span>
                          </div>
                        </div>
                      </q-card>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 pl-2">
                      <q-card
                        color="#2b7eeb"
                        flat
                        bordered
                        class="pa-4 mt-6 blue d_flex_center"
                      >
                        <div class="d-flex">
                          <img
                            :alt="$t('slots')"
                            src="../../assets/grap_up.png"
                            style="height: 40px"
                          />
                          <div class="ml-2">
                            <p class="font_16 blue text-bold mb-0">
                              {{ expectedRate() }} {{ $t("slots") }}/{{ $t("hr") }}
                            </p>
                            <span class="blue">{{
                              $t("expected_filling_rate")
                            }}</span>
                          </div>
                        </div>
                      </q-card>
                    </div>
                    <!-- row 3 -->
                    <div class="col-12 col-sm-6 col-md-4 pr-2">
                      <q-card flat bordered class="pa-4 mt-6">
                        <div class="d-flex">
                          <div class="ml-2">
                            <p class="font_24 text-bold mb-0">
                              {{ deal.slot_deals_non_cus_count ?? 0 }}
                            </p>
                            <span class="text-bold">{{ $t("bot_counts") }}</span>
                          </div>
                        </div>
                      </q-card>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 px-2" v-if="deal.status === 'expired'">
                      <q-card
                        color="#2b7eeb"
                        flat
                        bordered
                        class="pa-4 mt-6 light_orange d_flex_center"
                      >
                        <div class="d-flex">
                          <img
                            :alt="$t('time_extention')"
                            src="../../assets/clock_plus.png"
                            style="height: 40px"
                          />
                          <div class="ml-1">
                            <p class="font_16 light_orange text-bold mb-0">
                              {{ extentionRequired() }} {{$t('hrs')}}
                            </p>
                            <span class="light_orange">{{
                              $t("time_extention")
                            }}</span>
                          </div>
                        </div>
                      </q-card>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 pl-2">
                      <q-card flat class="mt-6">
                        <div>
                          <p class="text-bold">{{ $t("extend_deal_time") }}</p>
                          <div class="row">
                            <q-input
                              style="width: 150px"
                              ref="inputRef"
                              maxlength="3"
                              v-model="hour"
                              @change="onChange"
                              :placeholder="$t('hours')"
                              :oninput="
                                (evt) => Utils.validationOnlyNumberEvent(evt)
                              "
                              lazy-rules
                              :rules="[
                                (val) =>
                                  Utils.containsOnlyNumbers(val)  ||
                                  $t(Utils.getKey('Allow only decimal numbers')),
                                (val) =>
                                  val >= 2 ||
                                  $t(
                                    Utils.getKey(
                                      'Hours should be bigger than 1 hour'
                                    )
                                  ),
                              ]"
                              dense
                              outlined
                            ></q-input>
                            <q-btn
                              v-if="deal.status != 'settled'"
                              style="height: 40px"
                              @click="onSubmit"
                              color="green"
                              class="blue ml-1"
                              unelevated
                            >
                              <img
                                :alt="$t('expired')"
                                src="../../assets/plus.png"
                                style="height: 20px"
                              />
                            </q-btn>
                          </div>
                        </div>
                      </q-card>
                    </div>
                    <div
                      class="col-12 col-sm-6 col-md-4"
                      v-if="deal.status == 'expired'"
                    >
                      <q-card flat class="mt-1">
                        <div>
                          <q-toggle :disable="bootSetting == 'inactive' ? true : false" v-model="isBoot" size="lg" icon="mdi-robot" />
                          <p class="text-bold">
                            {{ $t("allow_bot_insertion") }}
                          </p>
                        </div>
                        <p v-if="bootSetting == 'inactive'" class="red"> {{ $t(Utils.getKey('Please active the bot on setting before updating'))}}</p>
                      </q-card>
                    </div>
                  </div>
                </div>
                <div v-else class="col-12">
                  <q-card flat bordered class="pa-4 green mt-6 d_flex_between">
                    <div class="d-flex flex-1 black">
                      <div
                        @click="showUserList = !showUserList"
                        v-if="deal.is_bot == 1"
                        class="border pointer is_bot r_50"
                      >
                        <q-icon name="mdi-robot" color="primary" size="md" />
                      </div>
                      <div
                        @click="showUserList = !showUserList"
                        v-else
                        class="border pointer is_bot r_50"
                      >
                        <q-icon name="mdi-account" color="primary" size="md" />
                      </div>
                      <div class="ml-6">
                        <span class="">{{ $t("total_participant") }}</span>
                        <p class="font_20 text-bold mb-0">
                          {{ settleDetail?.customers?.length }}
                        </p>
                      </div>
                    </div>
                    <div class="d-flex flex-1 black">
                      <div>
                        <span class="">{{ $t("winning_member_id") }}</span>
                        <p class="font_20 text-bold mb-0">
                          {{ settleDetail?.order?.customer?.member_ID }}
                        </p>
                      </div>
                    </div>
                    <div class="d-flex flex-1 black">
                      <div class="ml-6">
                        <span class="">{{ $t("no_of_slots") }}</span>
                        <p class="font_20 text-bold mb-0">
                          {{ getTotalWinnerSlots() }}
                        </p>
                      </div>
                    </div>
                    <div class="d-flex flex-1 black">
                      <div>
                        <span class="">{{ $t("winning_slot_id") }}</span>
                        <p class="font_20 text-bold mb-0">
                          {{ settleDetail?.booking_id }}
                        </p>
                      </div>
                    </div>
                  </q-card>
                  <!-- table detai -->
                  <div class="q-py-md" v-if="showUserList">
                    <q-table
                      flat
                      :rows="rows"
                      :columns="columns"
                      row-key="name"
                      :separator="separator"
                    >
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
                      <template v-slot:body-cell-status="props">
                        <q-td class="text-center">
                          <q-chip
                            text-color="blue"
                            size="sm"
                            :label="$t(Utils.getKey(getUserStatus(props)))"
                            :class="getUserStatusColor(props)"
                            class="pa-3 blue capitalize"
                          />
                        </q-td>
                      </template>
                    </q-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="d-left">
              <div class="d-flex">
                <p class="mt-2 mr-2 text-bold">{{ $t("status") }}:</p>
                <q-chip
                  style="margin-left: -2px"
                  class="ml-0 white"
                  color="primary"
                  >{{ $t(deal.status) }}</q-chip
                >
              </div>
            </div>
            <!-- grap -->
            <q-card
              style="
                margin-top: 40px;
                box-shadow: none;
                height: 400px;
                background: #fff;
                padding: 12px;
              "
            >
              <v-chart class="chart" :option="options2" autoresize />
            </q-card>
          </div>
        </div>
      </q-form>

      <Loading :loading="isLoading" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted, inject, computed } from "vue";
import { useQuasar } from "quasar";
import moment from "moment";
import Utils from "../../helpers/Utils";
import useDeals from "src/composables/useDeals";
import usePrizeClaim from "src/composables/usePrizeClaim";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";

// chart
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
const isExtendTime = ref(false);
const columns = [
  {
    name: "member_id",
    required: true,
    label: "member_id",
    align: "left",
    field: (row) => row?.member_ID,
    sortable: true,
  },
  {
    name: "name",
    align: "left",
    label: "name",
    field: (row) =>
      row?.first_name
        ? row?.first_name || "" + " " + row?.last_name || ""
        : row?.idd + row?.phone_number,
    sortable: true,
  },
  // {
  //   name: "order_id",
  //   align: "left",
  //   label: "order_id",
  //   field: (row) => row?.order_id,
  //   sortable: true,
  // },
  {
    name: "no_of_slots",
    align: "left",
    label: "no_of_slots",
    field: (row) => row?.total_slots,
    sortable: true,
  },
  {
    name: "status",
    label: "status",
    field: "status",
    align: "center",
    sortable: true,
  },
];
const rows = ref([]);
const inputRef = ref(null)
const locale = inject("locale");
const currency_id = inject("currency_id");
const { t } = useI18n();
const emit = defineEmits(["onClose", "onUpdated"]);
const props = defineProps({
  data: Object,
});
const $q = useQuasar();

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  BarChart,
]);

const isLoading = ref(false);
const showUserList = ref(false);
const { saving, extendTime, updateIsBoot, checkbot } = useDeals();
const { get } = usePrizeClaim();
const pageForm = ref(null);
watch(locale, (newVal, oldVal) => {
  pageForm.value.resetValidation()
  pageForm.value.validate()
})
const options2 = ref({
  grid: {
    left: 30,
    right: 5,
    top: 30,
    bottom: 30,
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((i) =>
      t(i.toLowerCase())
    ),
  },
  yAxis: {
    type: "value",
  },
  color: ["#F26522", "#21ba45", "#f5efeb", "#31ccec", "#f2c037"],
  series: [
    {
      data: [0, 0, 0, 0, 0, 0, 0],
      type: "line",
      smooth: true,
    },
  ],
});
const deal = ref({
  ...props.data,
});
const d_id = deal.value.deal_id;
const settleDetail = ref({});
const diffHours = ref(0);
const timeCoundown = ref("00:00:00");
const isBoot = ref(deal.value.is_bot ? true : false);
const bootSetting = ref();
const endTimer = ref(deal.value.created_at);
const hour = ref(0);
const dEnd = ref(new Date());
const dEndVlue = ref(new Date());
const timeSlot = ref({
  hours: 0,
  day: 0,
  remaingHours: 0,
});

const onChange = () => {
  if (hour.value < 2) {
    hour.value = 2;
  }
  if (hour.value[0] == "0") {
    hour.value =  hour.value.substring(1)
  }
};

watch(
  () => locale.value,
  () => {
    options2.value.xAxis.data = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ].map((i) => t(i.toLowerCase()));
  }
);
const getEndDate = () => {
  if (deal.value.deal_end_at) {
    dEnd.value = moment(deal.value.deal_end_at).format(
      "YYYY-MM-DD | h:mm:ss a"
    );
    dEndVlue.value = moment(deal.value.deal_end_at);
  } else {
    dEndVlue.value = moment(endTimer.value).add(
      deal.value.time_period,
      "hours"
    );
    dEnd.value = moment(endTimer.value)
      .add(deal.value.time_period, "hours")
      .format("YYYY-MM-DD | h:mm:ss a");
  }
};

// var startDate = new Date('Dec 1, 2020 00:00:00');
const timeInterval = ref("");
const timecoundDown = (clear = null) => {
  if (deal.value.status == "settled" || deal.value.status == "expired") {
    timeCoundown.value = "00:00:00";
    return;
  }

  var endDate = deal.value.deal_end_at
    ? moment(deal.value.deal_end_at)
    : moment(deal.value.created_at).add(deal.value.time_period, "hours");

  if (clear == 1) {
    clearInterval(timeInterval.value);
  }
  timeInterval.value = setInterval(function () {
    // Get today's date and time
    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distance = endDate - now;

    diffHours.value = Math.floor(distance / 3600000);

    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    // console.log(minutes/60);
    diffHours.value += minutes / 60;
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(timeInterval.value);
    }

    // if(days>=0)
    if (days >= 0 && hours >= 0 && minutes >= 0 && seconds >= 0) {
      timeSlot.value.hours = hours;
      timeSlot.value.day = days;
      timeSlot.value.minutes = minutes;
      timeSlot.value.remaingHours = days * 24 + hours + minutes / 60;
      timeCoundown.value = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    } else timeCoundown.value = "00:00:00";
  }, 1000);
};

const expectedRate = () => {
  const today = new Date();
  const total_slots = deal?.value?.slots?.total_slots || 0;
  const booked_slots = deal?.value?.slots?.booked_slots || 0;
  // let end =  moment(deal.value.deal_end_at)
  // let remianHour =  (moment(end) - moment(today)) / 3600000;
  // console.log('remianHour ============== ', remianHour, 'diffHours.value ', diffHours.value)
  let expected = 0;
  if (deal.value.status == "active") {
    if (total_slots > 0) {
      expected = (total_slots - booked_slots) / diffHours.value;
    }
    // console.log("expected ============== ", expected);
  } else {
    if (booked_slots == 0) {
      expected =
        total_slots /
        ((moment(dEndVlue.value) - moment(deal.value.created_at)) / 3600000);
    } else {
      expected =
        (total_slots - booked_slots) /
        ((moment(dEndVlue.value) - moment(deal.value.created_at)) / 3600000);
    }
  }

  return expected.toFixed(2);
};

// Open Deals:

// 1) Time Remaining: Expected Time - Current Time
// 2) Current Filling Rate: Booked Slots/(Current time - Start Time)HRS
// 3) Expected Filling Rate: Remaining Slot/ Remaining Time in HRS
// 4) Time Extension:
//   Slots Left = Slots Left - (Current filling rate * Time left in HRS)
//   Slots Left/Current filling rate)

// Expired:


// If No booking yet:

// 1) Time Remaining: Expected Time - Current Time (min 0)
// 2) Current Filling Rate: 0
// 3) Expected Filling Rate: Total Slots/ (End Time - Start Time)HRS
// 4) Time Extension: (End Time - Start Time)HRS

// If few bookings there:
// 1) Time Remaining: Expected Time - Current Time (min 0)
// 2) Current Filling Rate: Booked Slots/End Time - Start Time)HRS
// 3) Expected Filling Rate: Remaining Slot/End Time - Start Time)HRS.
// 4) Time Extension: Slots Left/Current filling rate)

const currentRate = () => {
  const booked_slots = deal?.value?.slots?.booked_slots || 0;
  const createDate = moment(deal.value.created_at);
  let current = 0;
  let time_period = 0;
  const today = new Date();
  time_period = (moment(today) - moment(deal.value.created_at)) / 3600000;

  if (deal.value.status == "expired") {
    time_period = deal.value.time_period;
    if (booked_slots == 0) {
      current = 0; //0 Current Filling Rate: 0
      time_period = 0;
    } else {
      current =
        booked_slots /
        ((moment(dEndVlue.value) - moment(deal.value.created_at)) / 3600000); //Booked Slots/End Time - Start Time)HRS
    }
  } else {
    if (booked_slots > 0 && time_period > 0) {
      // console.log("in in ");
      current = booked_slots / time_period;
    }
  }
  // console.log("Current Filling Rate", current);
  return Math.abs(current).toFixed(2);
};

const extentionRequired = () => {
  const current = currentRate();
  // console.log('get current from extend', current)
  const total_slots = deal?.value?.slots?.total_slots || 0;
  const booked_slots = deal?.value?.slots?.booked_slots || 0;
  const remaing = total_slots - booked_slots;
  const time_period = deal.value.time_period;
  let ext = 0;

  if (deal.value.status == "active") {
    if (current > 0) {
      ext = (remaing - current * diffHours.value) / current;
    } else {
      ext = 0;
    }

    if (current == 0) {
      const createDate = moment(deal.value.created_at);
      const today = new Date();
      ext = Math.abs((today - createDate) / 1000 / 60 / 60);
    }
    if (booked_slots == 0) {
      ext = 0;
    }
  } else {
    if (booked_slots == 0) {
      ext = (moment(dEndVlue.value) - moment(deal.value.created_at)) / 3600000; // 1h = 60min , 1min = 60000 => 1h = 3600000
      // console.log('booked_slots=expired', ext);
    } else {
      ext = remaing / currentRate();
    }
  }
  if(ext < 0) ext = 0;
  return ext.toFixed(2);
};

const onBootUpdate = async () => {
  try {
    await updateIsBoot(deal.value.id, {
      is_bot: isBoot.value == true ? 1 : 0,
    });
    emit("onUpdated");
    // emit("onClose");
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
watch(
  () => isBoot.value,
  () => {
    onBootUpdate();
  }
);
const onCheckBot = async () => {
  let check_bot = await checkbot();
  bootSetting.value = check_bot.data?.status

};
onCheckBot()


async function onSubmit() {
  try {
    if (hour.value < 2) {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Hours should be bigger than 1 hour")),
      });
      return;
    }
    if (!Utils.containsOnlyNumbers(hour.value)) {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Allow only decimal numbers")),
      });
      return;
    }
    deal.value.deal_id = deal.value.id;
    const tp = deal.value.time_period;
    isExtendTime.value = true;
    deal.value.time_period = hour.value;
    deal.value.hour = hour.value;

    const statusTmp = deal.value.status;

    if (deal.value.status == "active") {
      if (deal.value.deal_end_at)
        deal.value.deal_end_at = moment(deal.value.deal_end_at).add(
          deal.value.time_period,
          "hours"
        );
      deal.value.time_period = parseInt(tp) + parseInt(deal.value.time_period);
      getEndDate();
      /* dEnd.value = moment(deal_end_at).add(
      deal.value.time_period,
      "hours"
    ); */
    } else {
      dEnd.value = moment(new Date())
        .add(deal.value.time_period, "hours")
        .format("YYYY-MM-DD | h:mm:ss a");
      if (deal.value.deal_end_at)
        deal.value.deal_end_at = moment(new Date()).add(
          deal.value.time_period,
          "hours"
        );
      deal.value.time_period = parseInt(tp) + parseInt(deal.value.time_period);
      getEndDate();
    }
    await extendTime({ ...deal.value ,time_period: hour.value });
    hour.value = '';
    deal.value.status = "active";
    inputRef.value.resetValidation()
    expectedRate();
    currentRate();
    extentionRequired();
    timecoundDown(1);
    // if (statusTmp == "expired") {
    //   emit("onClose", isExtendTime);
    // }
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
}
const getPriceClaim = async () => {
  isLoading.value = true;
  let priceClaim = await get(deal.value.id);
  settleDetail.value = priceClaim.data.data;
  if (settleDetail.value) {
    options2.value.xAxis.data = settleDetail.value.graph_data?.days || [];
    options2.value.series[0].data =
      settleDetail.value.graph_data?.slot_counts || [];
    rows.value = settleDetail.value.customers;
    // console.log("rows ============== ", rows.value);
  }
  isLoading.value = false;
};

const getTotalWinnerSlots = () => {
  let total_slot = 0;
  settleDetail?.value?.customers?.filter((c) => {
    if (c.id === settleDetail?.value?.customer_id) {
      total_slot = c.total_slots;
    }
  });
  return total_slot;
};

const getUserStatus = (props) => {
  if (props.row.id === settleDetail?.value?.customer_id) {
    return "winner";
  }

  return "loser";
};

const getUserStatusColor = (props) => {
  if (props.row.id === settleDetail?.value?.customer_id) {
    return "b_l_green green2";
  }
  return "red b_l_red";
};

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  timecoundDown();
  getPriceClaim();
  getEndDate();
});
</script>

<style>
.is_bot {
  width: 47px;
  height: 47px;
  padding: 6px;
  background: #fff4f0;
}
</style>
