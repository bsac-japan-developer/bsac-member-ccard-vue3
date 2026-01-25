<template>
  <v-ons-page>
    <navigation-toolbar :back-label="'戻る'">写真選択</navigation-toolbar>
    <div id="content__header"></div>
    <div id="content__body">
      <div>
        <div v-if="isPC">
          <button @click="triggerFileInput" class="button">写真を選択する</button>
          <input
            id="fileInput"
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="selectImageWithPC"
            style="display: none"
          />
        </div>
        <div v-if="!isPC">
          <v-ons-button v-if="!isPC" @click="selectImageWithSP" class="button">
            写真を選択
          </v-ons-button>
        </div>
        <div v-if="imageSrc" class="image-container">
          <div class="image-wrapper">
            <img v-if="isPC" :src="imageSrc" ref="image" class="selected_image" />
            <img
              v-if="!isPC"
              :src="`data:image/jpeg;base64, ${imageSrc}`"
              ref="image"
              class="selected_image"
            />
          </div>
          <div
            class="crop-box"
            :style="cropBoxStyle"
            @mousedown="startDragging"
            @mousemove="dragCrop"
            @mouseup="stopDragging"
            @touchstart="startDragging"
            @touchmove="dragCrop"
            @touchend="stopDragging"
          ></div>
          <div
            class="crop-face-circle"
            :style="cropCircleStyle"
            @mousedown="startDragging"
            @mousemove="dragCrop"
            @mouseup="stopDragging"
            @touchstart="startDragging"
            @touchmove="dragCrop"
            @touchend="stopDragging"
          ></div>
        </div>
        <div v-if="imageSrc">
          <p class="note--center" style="margin: 0 2%">
            青枠の中央に顔が位置するように調整してください<br />
            スライドバーで青枠の大きさを変更できます
          </p>
          <v-ons-list>
            <v-ons-list-item>
              <v-ons-row>
                <v-ons-col width="40px" style="text-align: center; line-height: 31px">
                  −
                </v-ons-col>
                <v-ons-col>
                  <v-ons-range
                    v-model="scale"
                    style="width: 100%"
                    @input="resizeCrop()"
                  ></v-ons-range>
                </v-ons-col>
                <v-ons-col width="40px" style="text-align: center; line-height: 31px">
                  ＋
                </v-ons-col>
              </v-ons-row>
            </v-ons-list-item>
          </v-ons-list>
          <button @click="cropImage" class="button">選択範囲の画像を抜き出す</button>
        </div>
        <canvas ref="canvas" style="display: none"></canvas>
        <div v-if="croppedImageSrc">
          <img :src="croppedImageSrc" />
        </div>
      </div>
    </div>
    <div id="content__footer">
      <div v-if="croppedImageSrc">
        <div class="photo-rule-wrapper">
          <p class="note" style="margin: 0; color: red; font-weight: bold">
            こちらの内容に沿わない画像の申請に関して、受付が出来ない場合があるのでご注意ください
          </p>
          <photo-rule :type="2"></photo-rule>
        </div>
        <p class="note--center" style="margin: 5% 2% 2% 2%">
          問題なければ、決定するボタンを押して下さい
        </p>
        <button @click="decidePhoto" class="button">決定する</button>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import navigationToolbar from '@/components/parts/NavigationToolbar.vue';
import photoRule from '@/components/parts/PhotoRule.vue';

export default {
  components: {
    navigationToolbar,
    photoRule,
  },
  computed: {
    isPC: function () {
      return !this.$ons.platform.isIOS() && !this.$ons.platform.isAndroid();
    },
    cropBoxStyle: function () {
      return {
        left: `${this.cropX}px`,
        top: `${this.cropY}px`,
        width: `${this.cropWidth}px`,
        height: `${this.cropHeight}px`,
      };
    },
    cropCircleStyle: function () {
      return {
        left: `${this.cropX + (this.cropWidth - this.cropWidth * 0.8) / 2}px`,
        top: `${this.cropY + this.cropHeight * 0.05}px`,
        width: `${this.cropWidth * 0.8}px`,
        height: `${this.cropHeight * 0.75}px`,
      };
    },
    cropScale: function () {
      // scaleの1〜100を画像の倍率0〜5に変換する
      return Math.round(0.05 * this.scale * 10) / 10;
    },
  },
  created: function () {},
  data() {
    return {
      imageSrc: null,
      croppedImageSrc: null,
      imageWidth: 150, // 固定値
      imageHeight: 200, // 固定値
      cropWidth: 150,
      cropHeight: 200,
      cropX: 0,
      cropY: 0,
      isDragging: false,
      scale: 20,
    };
  },
  methods: {
    /**
     * 画像を切り取る
     */
    cropImage: function () {
      try {
        const image = this.$refs.image;
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');
        canvas.width = this.cropWidth;
        canvas.height = this.cropHeight;

        const scale = image.naturalWidth / image.width;
        const sx = this.cropX * scale;
        const sy = this.cropY * scale;
        const sw = this.cropWidth * scale;
        const sh = this.cropHeight * scale;

        ctx.drawImage(image, sx, sy, sw, sh, 0, 0, this.cropWidth, this.cropHeight);

        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = this.imageWidth;
        resizedCanvas.height = this.imageHeight;
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCtx.drawImage(
          canvas,
          0,
          0,
          this.cropWidth,
          this.cropHeight,
          0,
          0,
          this.imageWidth,
          this.imageHeight
        );

        this.croppedImageSrc = resizedCanvas.toDataURL('image/jpeg');
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/cropImage] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      }
    },
    /**
     * 抜き出し範囲をリサイズする
     */
    resizeCrop: function () {
      const image = this.$refs.image;
      if (!image) return;

      const cropWidth = this.imageWidth * this.cropScale;
      const cropHeight = this.imageHeight * this.cropScale;

      if (cropWidth > image.clientWidth || cropHeight > image.clientHeight) return;

      this.cropWidth = cropWidth;
      this.cropHeight = cropHeight;
      this.cropX = Math.min(this.cropX, image.clientWidth - this.cropWidth);
      this.cropY = Math.min(this.cropY, image.clientHeight - this.cropHeight);

      // console.log(
      //   `scale ${this.scale} cropPoint ${this.cropX}:${this.cropY} cropSize ${this.cropWidth}:${this.cropHeight} clientSize ${image.clientWidth}:${image.clientHeight} imageSize ${this.imageWidth}:${this.imageHeight}`
      // );
    },
    /**
     * 写真を決定する
     */
    decidePhoto: function () {
      this.$store.commit('ccardApplication/setIdPhoto', this.croppedImageSrc);
      this.$emit('pop-page-navigation');
    },
    /**
     * 青い枠を画像中央に配置
     */
    centerCropBox: function () {
      const image = this.$refs.image;
      if (image) {
        const imageWidth = image.clientWidth;
        const imageHeight = image.clientHeight;

        this.cropX = (imageWidth - this.cropWidth) / 2;
        this.cropY = (imageHeight - this.cropHeight) / 2;
      }
    },
    /**
     *
     * @param event
     */
    dragCrop: function (event) {
      if (this.isDragging) {
        const touchEvent = event.type.startsWith('touch');

        if (touchEvent) event.preventDefault(); // スクロール防止

        const currentX = touchEvent ? event.touches[0].clientX : event.clientX;
        const currentY = touchEvent ? event.touches[0].clientY : event.clientY;

        const deltaX = currentX - this.startX;
        const deltaY = currentY - this.startY;

        this.cropX = Math.max(0, this.cropX + deltaX);
        this.cropY = Math.max(0, this.cropY + deltaY);

        // 枠が画像範囲を超えないように制限
        const image = this.$refs.image;
        if (!image) return;

        const maxX = image.clientWidth - this.cropWidth;
        const maxY = image.clientHeight - this.cropHeight;

        this.cropX = Math.min(this.cropX, maxX);
        this.cropY = Math.min(this.cropY, maxY);

        this.startX = currentX > 0 ? currentX : 0;
        this.startY = currentY > 0 ? currentY : 0;
      }
    },
    /**
     * 写真を選択する (PC)
     * @param event
     */
    selectImageWithPC: function (event) {
      try {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imageSrc = e.target.result;
            this.croppedImageSrc = null;

            // 画像が読み込まれた後に中央配置
            this.$nextTick(() => {
              this.centerCropBox();
            });
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/selectImageWithPC] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      }
    },
    /**
     * 写真を選択する (SP)
     */
    selectImageWithSP: function () {
      try {
        if (!navigator.camera) {
          alert('Cordovaのカメラプラグインが利用できません。');
          return;
        }

        navigator.camera.getPicture(
          (imageURI) => {
            this.imageSrc = imageURI;
            this.croppedImageSrc = null;

            // 画像が読み込まれた後に中央配置
            this.$nextTick(() => {
              this.centerCropBox();
            });
          },
          (error) => {
            alert('画像の選択に失敗しました: ' + error);
          },
          {
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.DATA_URL,
          }
        );
      } catch (error) {
        this.$logger.error(`[${this.$options.name}/selectImageWithSP] ${error}`);
        this.$ons.notification.alert({ title: 'エラー', message: error.message });
      }
    },
    /**
     *
     * @param event
     */
    startDragging: function (event) {
      this.isDragging = true;
      const touchEvent = event.type.startsWith('touch');
      this.startX = touchEvent ? event.touches[0].clientX : event.clientX;
      this.startY = touchEvent ? event.touches[0].clientY : event.clientY;
    },
    /**
     *
     */
    stopDragging: function () {
      this.isDragging = false;
    },
    /**
     * ファイル選択したことにする
     */
    triggerFileInput: function () {
      this.$refs.fileInput.click();
    },
  },
  mounted: function () {
    if (this.isPC) {
      this.triggerFileInput();
    } else {
      this.selectImageWithSP();
    }

    // 初期表示時に青い枠を中央に配置
    this.$nextTick(() => {
      this.centerCropBox();
    });
  },
  name: 'PhotoSelectionPage',
};
</script>

<style scoped>
@import '../stylesheets/base.css';
@import '../stylesheets/form.css';

.crop-box {
  position: absolute;
  border: 2px dashed #0000ff;
  pointer-events: auto; /* マウスイベントを有効化 */
  /* background-color: rgba(255, 255, 255, 0); */
  cursor: move;
}

.crop-face-circle {
  position: absolute;
  border: 2px solid #0000ff;
  pointer-events: auto; /* マウスイベントを有効化 */
  background-color: rgba(0, 0, 255, 0.2);
  cursor: move;
  border-radius: 50%;
}

.crop-slidebar {
  width: 80%;
}

.file-button {
  margin: 4% 0 4% 0;
  display: inline-block;
  padding: 8px 0;
  background-color: #1c76ff;
  color: #fff;
  border: none;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  font-size: 17px;
  width: 90%;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.photo-rule-wrapper {
  width: 85%;
  margin: 2% auto;
  padding: 2%;
  font-size: 0.8rem;
  background-color: white;
  text-align: left;
}

.selected_image {
  max-width: 100%;
  min-width: 150px;
  min-height: 200px;
  transform-origin: center;
}
</style>
