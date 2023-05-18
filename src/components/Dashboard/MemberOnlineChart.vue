<template>
  <div
    class="col-md-12 col-sm-12 col-xs-12 q-mt-md chart-container"
    :style="{ height: '400px' }"
  >
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12 stat-card bg-dark text-white">
        <q-bar dark class="chart-qbar q-py-lg row">
          <div class="col-md-2">
            <span class="">{{ $t(Utils.getKey("Statistic Graph")) }}</span>
          </div>

          <q-select
            v-model="filters.status"
            :options="[
              'New direct member',
              'New team member',
              'Direct member bet amount',
              'Direct Member W/L',
              'Team Member W/L',
            ]"
            outlined
            style="width: 300px"
            dense
            emit-value
            class="q-mr-sm q-mt-sm"
            map-options
            :label="$t('agent_status')"
            :option-label="(name) => $t(Utils.getKey(name))"
          />
          <!-- <div class="col-md-4"> -->
          <el-date-picker
            class="q-mt-xs q-mr-sm input_whiteF"
            color="white"
            v-model="onlineStats.range"
            type="daterange"
            :range-separator="$t(Utils.getKey('To'))"
            :start-placeholder="$t(Utils.getKey('Start date'))"
            :end-placeholder="$t(Utils.getKey('End date'))"
            value-format="YYYY-MM-DD"
          />

          <q-btn
            class="q-mr-sm q-px-sm q-ml-sm capitalize"
            color="primary"
            style="
              margin-left: 10px;
              height: 40px;
              min-width: 125px !important;
              background-color: #28a745 !important;
            "
            @click="onSearch"
            >{{ $t("search") }}</q-btn
          >
          <q-btn
            class="q-mr-sm q-px-sm q-ml-sm capitalize"
            color="warning"
            style="margin-left: 10px; height: 40px; min-width: 125px !important"
            @click="resetFilters"
            >{{ $t("reset") }}</q-btn
          >
          <!-- </div> -->
        </q-bar>
      </div>
    </div>
    <!-- <q-bar dark class="chart-qbar q-py-lg">
      <span class="text-body1">{{ $t(Utils.getKey("Statistic Graph")) }}</span>
      <q-space />
    </q-bar> -->
    <v-chart id="online-chart" :option="onlineStats.option" autoresize />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import moment from "moment";
import Utils from "src/helpers/Utils";
import useStats from "../../composables/useStats";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { locale } = useI18n({ useScope: "global" });
const filters = ref({
  status: "New direct member",
});
use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);
const stats = useStats();
const statsLoading = ref(true);
const defaultDate = [
  moment().startOf("month").format("YYYY-MM-DD"),
  moment().endOf("month").format("YYYY-MM-DD"),
];

const onSearch = () => {
  onRequest({
    pagination: {
      ...pagination.value,
    },
    filter: filters.value,
  });
};

const onlineStats = ref({
  range: defaultDate,
  option: {
    tooltip: {
      trigger: "item",
      formatter: `{b} <br/>${t(Utils.getKey("Statistic Graph"))} : {c}`,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [10, 1, 8, 40, 6, 8, 8, 3],
        type: "line",
        areaStyle: {},
        color: ["#03507e"],
        emphasis: {
          label: {
            show: true,
            fontSize: "16",
            fontWeight: "bold",
          },
        },
      },
    ],
  },
});

getOnlineStats();

watch(
  () => onlineStats.value.range,
  async (newValue, oldValue) => {
    getOnlineStats();
  },
  { deep: true }
);

async function getOnlineStats() {
  try {
    // const response = await stats.getOnlineStats({
    //   dates: (onlineStats.value.range = onlineStats.value.range || defaultDate),
    // });
    // onlineStats.value.option.xAxis.data = response.data.map(
    //   (item) => item.date
    // );
    // onlineStats.value.option.series[0].data = response.data.map(
    //   (item) => item.total
    // );
    // statsLoading.value = false;
  } catch (e) {}
}
</script>
