<template>
  <q-page :class="!store.leftDrawerOpen ? 'ml-5' : '' ">
  <keep-alive>
    <q-card class="pa-3 mt-4"  flat outlined>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="white"
        indicator-color="primary"
        align="left"
      >
        <q-tab name="Lists" :label="$t('products')"></q-tab>
        <q-tab name="Category" :label="$t('category')"></q-tab>
        <q-tab name="Sub Category" :label="$t('sub_category')" ></q-tab>
        <q-tab name="Tags" :label="$t('tages')" ></q-tab>
        <q-tab name="Promotion" :label="$t('promotion')"></q-tab>
      </q-tabs>

      <q-separator></q-separator>
        <KeepAlive>
          <q-tab-panels v-model="tab"  animated>

            <q-tab-panel class="pa-0" name="Lists">
                <List/>
            </q-tab-panel>

            <q-tab-panel class="pa-0" name="Category">
              <Category/>
            </q-tab-panel>

            <q-tab-panel class="pa-0" name="Sub Category">
              <SubCategory />
            </q-tab-panel>
            <q-tab-panel class="pa-0" name="Tags">
              <Tag />
            </q-tab-panel>

            <q-tab-panel class="pa-0" name="Promotion">
              <Promotion />
            </q-tab-panel>
          </q-tab-panels>
      </KeepAlive>
    </q-card>
  </keep-alive>

  </q-page>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import List from './List.vue'
import Category from '../Category/Index.vue'
import SubCategory from '../SubCategory/Index.vue'
import Tag from '../Tag/Index.vue'
import Promotion from '../Promotion/Index.vue'
import Utils from "../../helpers/Utils";
import {store} from '../../store/store'
const tab = ref('Lists')
</script>
