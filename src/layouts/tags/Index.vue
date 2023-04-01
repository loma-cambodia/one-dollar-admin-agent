<template>
  <div style="height: 32px; with: 100%; padding: 3px;"  :class="$q.dark.isActive ? 'gray-dark': 'gray-light' " >
  <Tag  closable @on-close="handleClose">标签三</Tag>
  <Tag  closable @on-close="handleClose">标签三</Tag>

  <Tag  closable @on-close="handleClose">标签三</Tag>

  </div>
</template>

<script setup>
  const handleClose = () => {

  }
</script>

<style>

</style>
