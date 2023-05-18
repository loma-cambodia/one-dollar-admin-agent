<template>
  <q-page>
    <q-card
      class="card_container pa-3"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
    >
      <Loading :loading="isLoading" />
      <div>
        <q-card-section class="q-col-gutter-md">
          <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 stat-card q-mb-lg">
              <q-bar dark class="chart-qbar q-py-lg">
                <span class="text-body1">{{
                  $t(Utils.getKey("Statistic"))
                }}</span>
                <!-- <div class="text-center">{{
                  $t(Utils.getKey("Statistic"))
                }}</div> -->
              </q-bar>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today new direct member")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.direct_member || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today new team member")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.team_member || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today direct member bet amount")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.direct_member_bet_amount || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today team member bet amount")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.total_member_bet_amount || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today direct member W/L")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.get_direct_memberWL || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12 stat-card">
              <q-card flat bordered class="amount_card">
                <p class="text-body1 font_20 py-3 text-center">
                  {{ $t(Utils.getKey("Today team member W/L")) }}
                </p>
                <q-card-section class="pt-0">
                  <div class="row pa-2 green">
                    <div class="border col-6 flex-1 px-2 r_4">
                      <div class="d-flex mt-1">
                        <p class="text-bold font_18 ml-1">
                          {{ getTotalCount?.get_team_memberWL || "0" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
        <!-- <q-card-section class="row q-col-gutter-md q-pt-none q-px-md">
          <recent-transaction />
        </q-card-section> -->
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import Utils from "src/helpers/Utils";
import useStats from "../composables/useStats";
import Loading from "src/components/Shared/Loading.vue";
import { useI18n } from "vue-i18n";
import useDeals from "../composables/useDeals";

const { getCount } = useDeals();
const { t, locale } = useI18n();
const stats = useStats();
const getTotalCount = ref([]);

const isLoading = ref(false);

getTodatCount();

async function getTodatCount() {
  try {
    const response = await stats.getTodatCount();
    getTotalCount.value = response.data;
  } catch (e) {}
}

// provide(THEME_KEY, "light");
</script>
<style scoped>
.mt_16 {
  margin-top: 16px;
}
@media only screen and (max-width: 912px) {
  .p_small {
    padding: 16px !important;
  }
  .mt_16 {
    margin-top: 0px;
  }
}
.amount_card {
  min-height: 142px;
}
.card_style {
  box-shadow: none;
  height: 400px;
  background: #fff;
  padding: 12px;
}
.card_style_small {
  box-shadow: none;
  height: 146px;
  background: #fff;
  padding: 12px;
}
.card_container {
  margin: 0px;
  margin-left: 0px;
  margin-top: 20px;
  box-shadow: none;
  min-height: 85vh;
  background: #f5efeb;
}
.active_num {
  font-weight: bold;
  position: absolute;
  font-size: 20px;
  z-index: 98;
}

@media screen and (max-width: 912px) {
  .card_style_small {
    box-shadow: none;
    height: auto;
    background: #fff;
    padding: 12px;
  }
  .d_flex_between {
    justify-content: space-around;
  }
}
</style>
