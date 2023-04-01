

<template>
    <q-breadcrumbs class="text-grey" active-color="primary">
      <template v-slot:separator>
        <q-icon
          size="1.8em"
          color="primary"
        ></q-icon>
      </template>

      <q-breadcrumbs-el v-for="itm in items" :key="itm.id" :label="itm.id == 1 ? $t(Utils.getKey(itm.name)): itm.name" :icon="itm.icon" class="pointer" @click="callBack(itm)"></q-breadcrumbs-el>
    </q-breadcrumbs>
</template>


<script setup>
  import { ref } from "vue";
  import Utils from "../../helpers/Utils";
  const props = defineProps({
    items: {
      type: Object
    }
  })
  const emit = defineEmits(['callback'])

  const callBack = (itm) => {
     emit('callback', itm)
  }

</script>
