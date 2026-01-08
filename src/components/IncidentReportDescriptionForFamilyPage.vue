<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">事故報告</navigation-toolbar>
    <div id="content__header">
      <p class="contents-title">事故者（被害者）や<br />ご遺族の対応について</p>
    </div>
    <hr />
    <div id="content__body">
      <ol class="contents">
        <li>
          事故者が重症・危篤で入院された場合は、初回のお見舞いを早期に行う事が大切です。もちろん状況によってはご家族などからお見舞いを断られる場合もありますが、お気持ちをお伝えしておく事はとても大切です。
        </li>
        <li>
          もし事故者がお亡くなりになった場合、葬儀の参列などを通じて、被害者に十分な誠意を示す事が大切です。こちらもお見舞いの時と同様にご家族などから参列を断られる場合もありますが、お気持ちをお伝えしておく事はとても大切です。
        </li>
        <li>
          事故が発生した事について謝罪はしても良いが、事故の原因や、責任の有無については重要な情報となる為、警察や海上保安部など専門機関が調査して結果が出るまでは、もしご家族から質問されても「調査の結果を待っています。」と伝え、自分で判断して他人などにも安易に伝えないようにしましょう。
        </li>
        <li>
          事故者やそのご遺族の意見に安易に同調する事は控えるようにしましょう。勝手に示談交渉や代金の支払いなどは決してしないようにしましょう。
        </li>
        <li>
          事故後の事故者やそのご遺族との電話などの会話のやり取りは、録音されている可能性も考えられる為、会話のやり取りは慎重に行い、決して想像や思い込みで回答しないようにしましょう。分からない場合は「分かりません。」、はっきりと分からないのに回答を求められた場合は「確認してご連絡します。」と答えるようにしましょう。
        </li>
      </ol>
    </div>
    <div id="content__footer"></div>
  </v-ons-page>
</template>

<script>
import { markRaw } from 'vue';
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';

export default {
  components: {
    navigationToolbar,
  },
  computed: {},
  methods: {},
  name: 'IncidentReportDescriptionForFamilyPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';

.contents-title {
  font-size: 1.2rem;
}

.contents {
  padding: 0 1rem 0 2rem;
  text-align: left;
  font-size: 1.1rem;
}

.contents li {
  margin: 0.5rem 0;
}
</style>
