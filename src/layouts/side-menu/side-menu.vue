<template>
  <div class="side-menu-wrapper">
    <slot></slot>

    <Menu
      active-name="1-2"
      :theme="$q.dark.isActive ? 'dark' : 'light'"
      width="auto"
      style="height: 100vh"
      :open-names="['1']"
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
          {{ $t(Utils.getKey(modul.label))  }}
        </MenuItem>
        <Submenu :name="j" v-if="modul.children.length > 0">
          <template #title>
            <q-icon :name="modul.icon" size="xs" />
            {{  $t(Utils.getKey(modul.label)) }}
          </template>
          <MenuItem
            :name="j + '-' + index"
            :to="child.to.name"
            v-for="(child, index) in modul.children"
            :key="child.label"
          >
            <q-icon :name="child.icon" size="xs" />
            {{  $t(Utils.getKey(child.label)) }}
          </MenuItem>
        </Submenu>
      </div>
    </Menu>
  </div>
</template>

<script setup>
import navItems from "components/Menu/nav-items";
import Utils from "src/helpers/Utils";
const props = defineProps({ items: Object });
console.log("props:", props.items);
</script>
<style scope></style>
