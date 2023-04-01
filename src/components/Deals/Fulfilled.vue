<template>
  <q-card flat style="min-height: 80vh;">
    <q-btn class="mt-1" @click="emit('onClose')" flat icon="mdi-backburger">
      {{ $t("back") }}
    </q-btn>
    <q-separator class="mb-2" />
    <q-card-section class="q-px-md pt-0">
      <div class="row">
        <div class="col-12 col-md-12 q-pr-md">
          <h2 class="mb-1">
            {{ deal.products.translations[locale].name }}
          </h2>
          <div class="d-flex">
            <q-chip style="margin-left: -2px" class="ml-0 white" color="primary">{{ deal.deal_id }}</q-chip>
            <p class="mt-2 ml-2">
              {{ $t("product_sku") }}: {{ deal.products.sku }}
            </p>
          </div>
          <div>
            <div class="row">
              <div class="col-12 col-sm-6 col-md-2 pr-4">
                <q-card flat bordered class="pa-4 mt-6 d_flex_center">
                  <div>
                    <p class="font_24 text-bold mb-0 text-center">
                      {{ deal.deal_price }}{{ c_code }}
                    </p>
                    <span class="text-bold">{{ $t("deal_price") }}</span>
                  </div>
                </q-card>
              </div>
              <div class="col-12 col-sm-6 col-md-2">
                <q-card flat bordered class="pa-4 mt-6 d_flex_center">
                  <div>
                    <div class="d-flex">
                      <img src="../../assets/chai_green.png" style="height: 40px" />
                      <div class="ml-2">
                        <p class="font_24 text-bold mb-0">
                          {{ deal?.slots.booked_slots || 0 }}
                        </p>
                        <span class="text-bold">{{ $t("booked_slots") }}</span>
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>
              <div class="col-12 col-sm-6 col-md-2">
                <q-card flat bordered class="pa-4 mt-6 d_flex_center">
                  <div class="d-flex">
                    <img src="../../assets/mdi_chair-rolling.png" style="height: 44px" />
                    <div class="ml-2">
                      <p class="font_24 text-bold mb-0">
                        {{
                          deal?.slots.total_slots -
                            deal?.slots.booked_slots
                        }}
                      </p>
                      <span class="text-bold">{{ $t("slots_left") }}</span>
                    </div>
                  </div>
                </q-card>
              </div>
              <div class="col-12 col-sm-6 col-sm-4 col-md-2">
                <q-card flat bordered class="pa-4 mt-6 d_flex_center">
                  <div class="d-flex">
                    <img src="../../assets/chair_blue.png" style="height: 40px" />
                    <div class="ml-2">
                      <p class="font_24 text-bold mb-0">
                        {{ deal?.slots.total_slots }}
                      </p>
                      <span class="text-bold">{{ $t("total_slots") }}</span>
                    </div>
                  </div>
                </q-card>
              </div>
              <div class="col-12 q-pl-xs-0  col-sm-6  col-md-4 pl-4">
                <q-card flat bordered class="pa-4 mt-6 d_flex_between">
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
                        {{
                          moment(deal.created_at)
                                                .add(deal.time_period, "hours")
                            .format( "YYYY-MM-DD | h:mm:ss a")
                        }}
                      </p>
                      <p class="text-bold text-right">
                        {{ $t("expect_end_date_time") }}
                      </p>
                    </div>
                  </div>
                </q-card>
              </div>
              <!-- row 2 -->
              <div class="col-12 col-sm-6 col-md-2 pr-2">
                <q-card flat bordered class="pa-4 bg-winner mt-6">
                  <div class="d-flex">
                    <div class="ml-2">
                      <p class="font_24 mb-0">{{ deal.customer?.length || 0 }}</p>
                      <span class="text-bold">{{ $t("total_users") }}</span>
                    </div>
                  </div>
                </q-card>
              </div>
              <div class="col-12 col-sm-6 col-md-2 px-2">
                <q-card flat bordered class="pa-4 mt-6 orange">
                  <div class="d-flex">
                    <div class="ml-2">
                      <p class="font_24 mb-0">{{ usersData.customer || 0 }}</p>
                      <span class="text-bold">{{ $t("real_user") }}</span>
                    </div>
                  </div>
                </q-card>
              </div>
              <div class="col-12 col-sm-6 col-md-2 pl-2">
                <q-card color="#2b7eeb" flat bordered class="pa-4 mt-6 blue">
                  <div class="d-flex">
                    <div class="ml-2">
                      <p class="font_24 mb-0">
                        {{ usersData.system || 0 }}
                      </p>
                      <span class="text-bold">{{ $t("bot_count") }}</span>
                    </div>
                  </div>
                </q-card>
              </div>
              <!-- row 3 -->
              <div class="col-12 col-sm-6 col-md-6 pr-2">
                <q-card flat class="pa-4 mt-2 d_flex_between">
                  <div class="flex-1">
                    <p class="text-bold ml-3">
                      {{ $t("declare_winner_from") }}
                    </p>
                    <div class="">
                      <div class="q-gutter-sm">
                        <q-radio v-model="deal.winner_option" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                          val="auto" :label="$t('Any')" @click="filterCustomer('auto')" />
                        <q-radio v-model="deal.winner_option" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                          val="1" :label="$t('Customer')" @click="filterCustomer('customer')" />
                        <q-radio v-model="deal.winner_option" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                          val="2" :label="$t('Bot')" @click="filterCustomer('bot')" />
                      </div>
                    </div>
                  </div>
                  <div class="flex-1 b_left pl-6">
                    <p class="text-bold ml-3">
                      {{ $t("method_of_declaration") }}
                    </p>
                    <div class="">
                      <div class="q-gutter-sm">
                        <q-radio v-model="deal.declar_method" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                          @click="getWinner" val="0" :label="$t('system_generated')" />
                        <q-radio @click="clearWinnerSelection" v-model="deal.declar_method" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                          val="1" :label="$t('manual')" />
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>


            <div v-if="deal.declar_method == 0 && deal.winner_option != 5 && loadWinner == false" >
              <p class="text-bold font_22 mt-2">{{ $t(Utils.getKey("predicted user")) }}</p>
              <div>
                <div class="row mt-2">
                  <div class="col-4 col-sm-4 col-md-4">
                    <q-card flat bordered class="pa-3 bg-winner mr-2">
                      <div class="d-flex">
                        <span class="round_system">{{ user.system == 1 ? 'B' : 'R' }}</span>

                        <div class="ml-1 d_flex_between flex-1" id="customer">
                          <p class="font_14 mb-0 d_flex_column">
                            <span>
                              {{ $t(Utils.getKey("member_id")) }}
                            </span>
                            <span class="text-bold">
                              {{
                                user.member_ID ?? "Not Set"
                              }}
                            </span>
                          </p>
                          <p class="font_14mb-0 d_flex_column">
                            <span>
                              {{ $t(Utils.getKey("no_of_slots")) }}
                            </span>
                            <span class="text-bold">
                              {{ user.no_of_slots ?? 0 }}
                            </span>
                          </p>
                          <p class="font_14mb-0 d_flex_column">
                            <span>
                              {{ $t(Utils.getKey("winner slot")) }}
                            </span>
                            <span class="text-bold">
                              {{ user.booking_id }}
                            </span>
                          </p>
                        </div>
                      </div>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>



            <!-- user section -->
            <div v-if="deal.declar_method == 1">
              <p class="text-bold font_22 mt-2">{{ $t(Utils.getKey("select user")) }}</p>
              <div>
                <div class="row mt-2">
                  <div class="col-4 col-sm-3 col-md-2" v-for="cus in customers" :key="cus.id">
                    <q-card flat bordered :class="deal.user_selected == cus.id ? 'pa-3 bg-winner d-flex mr-2' : 'pa-3 d-flex mr-2'">
                      <div>
                        <div class="d-flex">
                          <q-radio v-model="deal.user_selected" checked-icon="task_alt"
                            unchecked-icon="panorama_fish_eye" :val="cus.id" @click="selectCustomer(cus.id, cus.system)" label="" />

                          <div class="ml-1">
                            <p class="font_14 text-bold mb-0">
                              {{ $t("member_id") }}:
                              {{
                                cus.member_ID ?? "Not Set"
                              }}
                            </p>
                            <div class="d_flex_between">
                              <span class="">{{ $t("no_of_slots") }}: {{ cus.no_of_slots }}</span>
                            <span class="round">{{ cus.system ? "B" : "R" }}</span>
                            </div>

                          </div>
                        </div>
                      </div>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
            <!-- submit -->
            <div class="mt-4">
              <q-card style="background: rgb(255 221 206); display: block" flat bordered class="pa-3 orange d-flex">
                <div class="row">
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="d-flex">
                      <div class="ml-1">
                        <p class="font_14 text-bold mb-0">
                          {{ $t("by_selecting_one_user_from_above") }}
                        </p>
                        <span class="text-uppercase">{{ profitAmountData > 0 ? $t("you_willbe_in_the_profit_of") :
                        $t("you_willbe_in_the_lost_of") }}
                          <span :class="
                          profitAmountData > 0 ? 'green font_18 text-bold' : 'red font_18 text-bold'
                          ">{{ profitAmountData || 0
}}{{ c_code }}</span></span>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-8 b_left pl-4">
                    <div class="d-flex">
                      <div class="d-flex flex-1">
                        <div class="ml-1">
                          <p class="font_16 black text-bold mb-0">
                            {{ $t("product_actual_cost") }}
                          </p>
                          <span class="black font_22 mt-3 text-bold">{{
                            getCost()
                          }}</span>
                        </div>
                        <div class="ml-3 mt-3" style="font-size: 32px"></div>
                        <div class="ml-3">
                          <p class="font_16 black text-bold mb-0">
                            {{ $t("money_receive_from_deal") }}
                          </p>
                          <span class="black font_22 mt-3 text-bold">{{
                            getRevuneu() || 0
                          }}</span>
                        </div>
                        <div class="ml-3 mt-3" style="font-size: 32px"></div>
                        <div class="ml-3">
                          <p class="font_16 black text-bold mb-0">
                            {{ profitAmountData < 0 ? $t("loss") : $t("profit") }} </p>
                              <span class="font_22 mt-3 text-bold" :class="
                              profitAmountData < 0 ? 'red' : 'green'
                              ">{{ profitAmountData }}{{ c_code }}</span>
                        </div>
                      </div>
                      <q-btn @click="onSubmit" :disable="saving" style="height: 40px; background: #f36a31" flat
                        class="floa-right white mt-2 mr-1">{{ $t("confirm_the_selection") }}</q-btn>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>
      </div>

      <Loading :loading="saving" />
    </q-card-section>

    <q-dialog v-model="showConfirm" persistent>
      <confirm @confirm="onDeal" @cancel="onCancelDeal" message="Do you want to continue the deal ?"
        :button-label="$t(Utils.getKey('Yes'))" />
    </q-dialog>

  </q-card>
</template>

<script setup>
import { ref, onMounted, inject, computed, watch } from "vue";
import { useQuasar } from "quasar";
import useDeals from "src/composables/useDeals";
import moment from "moment";
import Utils from "../../helpers/Utils";
import Loading from "../Shared/Loading.vue"
import Confirm from "../../components/Shared/Confirm2.vue";

import { useI18n } from "vue-i18n";
import { use } from "echarts/core";
const { saving, winnerSelect, generateDeal, getPredicted } = useDeals();
const locale = inject("locale");
const currency_id = inject("currency_id");
const $q = useQuasar();

const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded", 'onUpdated']);
const props = defineProps({
  data: Object,
});
const c_code = ref('$')
const deal = ref({
  ...props.data,
  winner_option: "5",
  declar_method: "2",
  user_selected: "",
  customer_ids: [],
});


const profitAmountData = ref(0)
const selectedCustomer = ref(0)


const timeCoundown = ref("00:00:00");
const extendTime = ref(0);
const isBoot = ref(false);
const showConfirm = ref(false);

const loadWinner = ref(false)

const customers = ref(deal.value.customer);

const user = ref({
  id: "",
  member_ID: "",
  no_of_slots: "",
  slot_deal_id: "",
  booking_id: "",
  system: 1
});


const clearWinnerSelection = () =>{
  selectedCustomer.value = 0
  profitAmountData.value = 0
}

const getWinner = async () => {
  try {
    loadWinner.value = true
    if (
      deal.value.winner_option == "5"
    ) {
      $q.notify({
        position: "top",
        type: "warning",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Need to select Winning Option")),
      });
      loadWinner.value = false
      return;
    }
    if (deal.value.declar_method == "") {
      $q.notify({
        position: "top",
        type: "warning",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Please to select winning methods")),
      });
      loadWinner.value = false
      return;
    }
    let winningOption = ""
    if (deal.value.winner_option != "auto") {
      winningOption = deal.value.winner_option
    }
    const data = {
      deal_id: deal.value.id,
      winner_option: winningOption
    };
    const res = await getPredicted(data);
    if (res) {
      user.value.id = res?.data?.customer?.id
      user.value.member_ID = res?.data?.customer?.member_ID
      user.value.no_of_slots = res?.data?.customer?.no_of_slots
      user.value.booking_id = res?.data?.customer?.booking_id
      user.value.slot_deal_id = res?.data?.id
      user.value.system = res?.data?.customer?.system
      selectedCustomer.value = res?.data?.customer?.system
    }

    getProfit(deal.value)

    loadWinner.value = false

    /* emit("onUpdated");
    emit("onClose"); */
    /* $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("created successfully")),
    }); */
  } catch (err) {
    loadWinner.value = false
    user.value = {
      id: "",
      member_ID: "",
      no_of_slots: "",
    };
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
}

const selectCustomer = (id, isBotCustomer) => {
  deal.value.customer_ids = []
  deal.value.customer_ids.push(id)
  selectedCustomer.value = isBotCustomer
  getProfit(deal.value)
}

const filterCustomer = (customer) => {
  selectedCustomer.value = 0
  profitAmountData.value = 0
  if (deal.value.declar_method == 0) {
    getWinner()
    return false
  }
  deal.value.user_selected = ""
  let dt = []
  let dm = deal.value.declar_method
  if (customer == 'auto') {
    dt = deal.value?.customer;
  }
  if (customer == 'customer') {
    dt = deal.value?.customer.filter((obj) => {
      if (obj.system == 0) {
        dt.push(obj)
        return obj;
      }
    });
  } else if (customer == 'bot') {
    dt = deal.value?.customer.filter((obj) => {
      if (obj.system == 1) {
        dt.push(obj)
        return obj;
      }
    });
  }
  customers.value = dt
}


async function onSubmit() {
  try {
    if (
      deal.value.winner_option == "5"
    ) {
      $q.notify({
        position: "top",
        type: "warning",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Need to select Winning Option")),
      });
      return;
    }
    if (deal.value.declar_method == "2") {
      $q.notify({
        position: "top",
        type: "warning",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Please to select winning methods")),
      });
      return;
    }


    if (deal.value.declar_method == 1 && deal.value.winner_option == "5") {
      $q.notify({
        position: "top",
        type: "warning",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Need to select Winning Option")),
      });
      return;
    }

    if(deal.value.winner_option != "auto" && deal.value.customer_ids.length == 0 && deal.value.declar_method == 1){
      $q.notify({
        position: "top",
        type: "warning",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Need to select Customer or Bot")),
      });
      return;
    }

    if (deal.value.declar_method == 1) {
      deal.value.user_selected = user?.value?.id
    }


    if (deal.value.winner_option == "auto")
    deal.value.winner_option = "";

    let amount = getProfit(deal.value);

    const data = {
      deal_id: deal.value.id,
      winner_option: deal.value.winner_option,
      customer_ids: deal.value.customer_ids,

      actual_cost: getCost(),
      received_amount: getRevuneu() || 0,
      result_type: amount > 0 ?'Profit': 'Loss',
      profit_loss_amount: amount,

    };
    const res = await winnerSelect(data);
    if (res) {
      showConfirm.value = true
    }

    /* emit("onUpdated");
    emit("onClose"); */
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("created successfully")),
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

const onCancelDeal = async () => {
  try {
    const data = {
      'deal_id': deal.value.id,
      'status': 'inactive'
    }
    const res = await generateDeal(data);
    showConfirm.value = false
    emit("onUpdated");
    emit("onClose");
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
  showConfirm.value = false
}

const onDeal = async () => {
  try {
    const data = {
      'deal_id': deal.value.id,
      'status': 'active'
    }
    const res = await generateDeal(data);
    emit("onUpdated");
    emit("onClose");
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }

}

const getRevuneu = () => {
  return deal.value.slot_cus_count * deal.value.slot_price;
};
const getCost = () => {
  if (deal.value.products.prices.length > 0) {
    return deal.value.products.prices[0].price;
  }
  return 0;
};
const getProfit = (deals) => {
  let customer_amount = deals.slot_cus_count * deals?.slot_price ?? 1;
  let purchase_price = deals.products?.prices[0]?.price;
  let profitAmount = (customer_amount - purchase_price)
  if(deal.value.winner_option == 2){
    profitAmount = customer_amount
  }

  if(selectedCustomer.value == 1){
    profitAmount = customer_amount
  }

  profitAmountData.value = profitAmount

  return profitAmount;
};

const usersData = deal.value.customer?.reduce(function (obj, v) {
  obj.system = obj.system || 0
  obj.customer = obj.customer || 0
  if (v.system == 1)
    obj.system = obj.system + 1
  else
    obj.customer = obj.customer + 1
  return obj;
}, {})


</script>
<style scoped>
@media only screen and (max-width: 913px) {
  .d_flex_between {
    display: block !important;
  }

  .q-px-md {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

  .b_left {
    border-top: 1px solid #f36a31 !important;
    margin-top: 12px;
    padding-bottom: 12px;
    border-left: none !important;

  }

  .text-right {
    text-align: left !important;
    margin-top: 10px;
  }

  .pl-4 {
    padding-left: 0px;
  }
}
</style>

