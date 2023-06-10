<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://www.github.com/1738352551" target="_blank">Github</a>
      <a href="https://www.github.com/1738352551/" target="_blank">@ChenManMan</a>
    </template>
    <template v-slot:copyright>
      <a href="https://github.com/1738352551" target="_blank">ChenManMan</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
