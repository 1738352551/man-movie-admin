<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import { axios } from '@/utils/request'

export default {
  data () {
    return {
    }
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  },
  created () {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0NDc5NDQxMjk2ZDk0ODZlODBmOTRiMzEyNjhlNDI1NSIsInN1YiI6IjEiLCJpc3MiOiJjaGVubWFubWFuIiwiaWF0IjoxNjg1ODUzMzIyLCJleHAiOjE2ODU4NTY5MjJ9.ZirQIHZ2gqXpJBlyVwnCVvZ22FRnnVSwRq1Jx--YS4Y'
    axios.get('/tag/getTag?id=1', { headers: { token } }).then(
      res => {
        console.log(res)
      }
    )
  }
}
</script>
