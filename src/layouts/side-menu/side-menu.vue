<template>
  <div class="side-menu-wrapper">
    <slot></slot>

    <Menu
      :theme="$q.dark.isActive ? 'dark' : 'light'"
      width="auto"
      class="sidebar"
      style="height: 100vh; overflow-y: auto"
      :open-names="openMenu"
      :active-name="activeName"
      accordion
    >
      <MenuItem name="/">
        <q-img
          src="~/assets/logo.png"
          :style="{ maxWidth: '97px', margin: 'auto' }"
      /></MenuItem>

      <div v-for="(modul, key, j) in items" :key="j">
        <MenuItem
          v-if="modul.children.length == 0"
          :name="j"
          :to="modul.to.name"
          :key="modul.label"
          class="capitalize"
        >
          <q-icon :name="modul.icon" size="xs" />
          {{ $t(Utils.getKey(modul.label)) }}
        </MenuItem>
        <Submenu :name="modul.label" v-if="modul.children.length > 0">
          <template #title>
            <q-icon :name="modul.icon" size="xs" />
            {{ $t(Utils.getKey(modul.label)) }}
          </template>
          <MenuItem
            :name="modul.label + '-' + index"
            :to="child.to.name"
            v-for="(child, index) in modul.children"
            :key="child.label"
          >
            <q-icon :name="child.icon" size="xs" />
            {{ $t(Utils.getKey(child.label)) }}
          </MenuItem>
        </Submenu>
      </div>
    </Menu>
  </div>
</template>

<script setup>
import { useRoute, useRouter} from "vue-router";
import navItems from "components/Menu/nav-items";
import Utils from "src/helpers/Utils";
import { computed, onMounted, watch, ref} from "vue";

const openMenu = ref(['Shipment'])
const activeName = ref("")
const route = useRoute();
const router = useRouter();
const props = defineProps({ items: Object });

const routePath = computed(() => route.path);
watch(
  () => routePath.value,
  () => {
    for(const key in props.items) {
      // console.log(props.items[key],route.name);
      if(props.items[key].children.length > 0){
        let activeName = props.items[key]?.children?.filter(it => it?.to.name == route.name)
        if(activeName.length > 0){
          console.log(activeName[0].label, "acitve module");
          // openMenu.value = []
          openMenu.value = [activeName[0].label]
          activeName.value= activeName[0].label+'-'+0
          console.log(openMenu.value, 'openMenu.value');
        }
      }
    }
    console.log("tag routePath", routePath.value);
  }
);
onMounted(()=> {
  console.log("tag routePath", routePath.value);
})
</script>
<style scope>
/* Hide scrollbar for Chrome, Safari and Opera */
.sidebar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.sidebar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
