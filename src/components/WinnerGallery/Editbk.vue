<template>
  <q-card
    id="cardScrolling"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '800px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{
        $t(Utils.getKey("Edit Customer Service"))
      }}</span>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        @click="emit('onClose')"
        :disable="saving"
      >
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section class="q-pt-lg pb-0">
      <q-form ref="refForm">
        <div class="row">
          <div class="col-12 col-md-12 q-px-md">
            <q-input
              v-model="customerSevice.service"
              :label="$t(Utils.getKey('service'))"
              dense
              :oninput="(evt) => Utils.validationNumberAndCaracter(evt)"
              outlined
              maxlength="50"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
            />
          </div>
          <div class="col-12 col-md-12 q-px-md">
            <q-input
              v-model="customerSevice.account"
              :label="$t(Utils.getKey('account'))"
              dense
              outlined
              :oninput="(evt) => Utils.validationNumberAndCaracter(evt)"
              maxlength="500"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
            />
          </div>
        </div>
        <q-toggle
          class="pl-0"
          v-model="isVideo"
          size="lg"
          icon="mdi-movie"
        ></q-toggle>
        <div class="mt-3 row ml-3">
          <div class="col-6 col-sm-4">
            <div v-if="!isVideo">
              <label
                class="pa-2 border"
                :class="!imageRequired ? 'border' : 'border_red'"
              >
                <i class="fa fa-image"></i> {{ $t("image") }}
                <input
                  class="mt-2"
                  style="display: none"
                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                  type="file"
                  id="file-input"
                  @change="uploadChange"

                  name="image"
                />
              </label>
              <p v-if="imageRequired" class="red mt-3">
                {{ $t("image_is_required") }}
              </p>
              <div>
                <img style="height: 220px" class="mt-3" :src="images_url" />
              </div>
            </div>
            <div v-else class="mb-3">
              <label
                class="pa-2 border"
                :class="!imageRequired ? 'border' : 'border_red'"
              >
                <i class="fa fa-film"></i> {{ $t("video") }}
                <input
                  class="mt-2"
                  style="display: none"
                  accept=".mp4"
                  type="file"
                  id="video_member"
                  @change="uploadChangeVideo"
                  max="10"
                  name="image"
                />
              </label>
              <video controls width="350" v-if="video_url">
                <source :src="video_url" type="video/mp4" />
              </video>
              <p class="red" v-if="fileTooBig">{{$t(Utils.getKey(fileTooBig))}}</p>
            </div>
          </div>
        </div>

        <div>
          <q-radio
            v-model="customerSevice.status"
            :val="1"
            :label="$t('active')"
          />
          <q-radio
            v-model="customerSevice.status"
            :val="0"
            :label="$t('inactive')"
          />
        </div>
      </q-form>
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn
        flat
        color="negative"
        class="q-px-md"
        @click="emit('onClose')"
        :disable="saving"
        >{{ $t(Utils.getKey("Cancel")) }}</q-btn
      >
      <q-btn
        color="accent"
        class="q-px-md q-ml-md"
        @click="onSubmit"
        style="color: var(--q-primary) !important"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
    <Loading :loading="isLoading" />
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import useCustomerService from "../../composables/useCustomerService";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";
import Utils from "../../helpers/Utils";

const form = ref(null);
const { t } = useI18n();
const props = defineProps({ data: Object, languages: Array });
const emit = defineEmits(["onClose", "onAdded"]);

const $q = useQuasar();
const { saving, add } = useCustomerService();
const customerSevice = ref({
  service: "",
  account: "",
  status: 1,
});
const isLoading = ref(false);
const imageRequired = ref(false);
const images_url = ref("");
const images = ref("");
const video_url = ref("");
const video = ref("");
const fileTooBig = ref("");
const isVideo = ref(false);

watch(
  () => isVideo.value,
  () => {
    if (!isVideo.value) {
      video_url.value = "";
      video.value = "";
    } else {
      images.value = "";
      images_url.value = "";
    }
  }
);
const uploadChange = (e) => {
  imageRequired.value = false;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target.result) {
      images_url.value = e.target.result;
    }
  };
  images.value = e.target.files[0];

  reader.readAsDataURL(e.target.files[0]);
};

const uploadChangeH5 = (e) => {
  appDisplayRequired.value = false;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target.result) {
      images_url_h5.value = e.target.result;
    }
  };
  app_display.value = e.target.files[0];

  reader.readAsDataURL(e.target.files[0]);
};

const uploadChangeVideo = (e) => {
  fileTooBig.value = ""
  video_url.value = ""
  console.log(e.target.files[0]);
  if(e.target.files[0].type != "video/mp4") {
    fileTooBig.value = "File is not a video";
  }
  if (e.target.files[0].size > 10000000) {
    fileTooBig.value = "Too large only 10MB";
  } else {
    imageRequired.value = false;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      video_url.value = reader.result;
      // console.log(video_url.value);
    };
    video.value = e.target.files[0];
  }
};

async function onSubmit() {
  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    if (icon.value == "") {
      iconRequired.value = true;
      return;
    }
    if (app_display.value == "") {
      appDisplayRequired.value = true;
      return;
    }

    const FormData = require("form-data");
    const fomrData = new FormData();
    for (const key in customerSevice.value) {
      fomrData.append(key, customerSevice.value[key]);
    }
    fomrData.append("icon", icon.value);
    fomrData.append("app_display", app_display.value);
    await add(fomrData);
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
    isLoading.value = false;
    emit("onAdded");
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
onMounted(async () => {});
</script>
