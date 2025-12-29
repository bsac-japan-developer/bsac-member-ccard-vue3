<template>
  <div>
    <ul v-if="type === 1" class="rule-list">
      <li>画像サイズはタテ200px、ヨコ150px、10KB程度</li>
      <li>画像ファイルの拡張子はjpg</li>
      <li>申請者本人のみが正面を向いて撮影したもの</li>
      <li>画像の中心に申請者本人の顔が大きく配置されたもの</li>
      <li>胸から上の画像で、他人が映り込んでいないもの</li>
      <li>輪郭が露出しているもの（帽子やサングラスは外してください）</li>
      <li>6カ月以内に撮影されたもの</li>
    </ul>
    <ul v-if="type === 2" class="rule-list">
      <li>申請者本人のみが正面を向いて撮影したもの</li>
      <li>画像の中心に申請者本人の顔が大きく配置されたもの</li>
      <li>胸から上の画像で、他人が映り込んでいないもの</li>
      <li>輪郭が露出しているもの（帽子やサングラスは外してください）</li>
      <li>6カ月以内に撮影されたもの</li>
    </ul>
    <div class="image">
      <img src="../../../www/images/photo_rule.png" style="width: 100%" />
    </div>
  </div>
</template>

<script>
export default {
  created: function () {},
  name: 'PhotoRule',
  props: {
    type: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style scoped>
.image {
  text-align: center;
}

.rule-list {
  padding: 0 0 0 1rem;
  font-size: 0.9rem;
}
</style>
