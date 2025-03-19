<template>
  <Teleport to="body">
    <div
      class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-100"
      v-if="showModal"
      @click="showModal = false"
    >
      <div class="modal-content" @click.stop>
        <h2 class="text-3xl font-bold w-full font-serif pb-4">你才是输入法</h2>
        <div class="max-h-[60vh] overflow-y-auto">
          <p class="py-2">
            玩法：在最下方的输入框中输入一个汉字，下方的提示框中会显示这个汉字在各种输入方案下的编码。
            按下回车键提交，会提示各种输入方案的编码的正确性。
          </p>
          <ul>
            <li class="flex gap-2 items-center">
              <CharSquare class="w-8" char="竹" status="o" />
              表示这个编码在正确答案的相同位置上出现。
            </li>
            <li class="flex gap-2 items-center">
              <CharSquare class="w-8" char="E" status="?" />
              表示这个编码在正确答案中出现过，但位置不同。
            </li>
            <li class="flex gap-2 items-center">
              <CharSquare class="w-8" char="ㄉ" status="x" />
              表示这个编码在正确答案中没有出现过。
            </li>
            <li class="flex gap-2 items-center">
              <CharSquare class="w-8" char="F" status="-" />
              表示这个编码的正确性没有被判定。
            </li>
          </ul>
          <p class="py-2">
            一个汉字有多个编码的情况下，可以点击任意一个编码选择用于猜测，回车后会提交选中的编码。答案一定选用第一个编码。
          </p>
          <p class="py-2">
            由于编码可能是变长的，会在编码尾部追加空格以补足最大长度。空格也会被判定正确性。
          </p>
          <p class="py-2">
            猜不出来的时候可以点击「揭晓」按钮，查看正确答案。点击「刷新」按钮可以以设置重新开始猜测一个随机的字。当不知道猜什么的时候，可以点击「随机」按钮。
          </p>
          <p class="py-2">
            点击表头上的输入方案的名称可以显示各个字母的使用情况。
          </p>
          <p class="py-2">
            小屏用户可以选择只显示部分输入方案，以获得更好的体验。
          </p>

          <p class="py-2 text-gray-500 flex items-end gap-2">
            如果觉得好玩的话给我点个Star吧😭→
            <a
              href="https://github.com/RikaKagurasaka/urime-plus"
              target="_blank"
              class="i-mdi-github text-gray-900 dark:text-gray-50 inline-block text-3xl"
            >
            </a>
          </p>

          <p class="py-2 text-gray-500 flex items-center gap-2">
            <span
              >Author:
              <a href="https://rika.link/about" target="_blank">@Rika</a></span
            >
          </p>

          <h3 class="text-lg font-bold mt-3">更新笔记</h3>
          <ul>
            <li>
              <span class="font-bold">2025-03-19</span>
              <span> 把码首的「難」改成「重」 </span>
            </li>
            <li>
              <span class="font-bold">2025-03-19</span>
              <span> 全部重写！加新功能！ </span>
            </li>
            <li>
              <span class="font-bold">2025-03-16</span>
              <span>
                在使用字符提示中移除了五笔的「Z」键。添加了加载字库时的提示。
              </span>
            </li>
            <li>
              <span class="font-bold">2025-03-16</span>
              <span> 修复了lve的拼音、注音、小鹤错误的问题。 </span>
            </li>
            <li>
              <span class="font-bold">2025-03-16</span>
              <span>
                添加了「随机」功能，不知道第一次猜什么的话就点一下吧。
              </span>
            </li>
            <li>
              <span class="font-bold">2025-03-16</span>
              <span>
                允许用户选择输入方案，现在可以只显示部分输入方案了，为了小屏用户。代码大幅重构，希望不要爆炸，先睡一觉.jpg.
              </span>
            </li>
            <li>
              <span class="font-bold">2025-03-15</span>
              <span>
                把拼音表换成<a
                  href="https://github.com/mozillazg/pinyin-data/blob/master/kMandarin.txt"
                  target="_blank"
                  >kMandarin</a
                >，这下多音字总应该能解决了吧。可能还剩下极少数，到时候手动维护吧。
              </span>
            </li>
            <li>
              <span class="font-bold">2025-03-15</span>
              <span>
                添加了指示剩余可用字符的提示（鼠标悬浮在输入方案名称上以查看）。修复了一些读音。
              </span>
            </li>
            <li>
              <span class="font-bold">2025-03-15</span>
              <span>
                修正了扩B区以后的字符编码问题。修复了小鹤形码的一些错误，小鹤缺失的时候用墨奇音形补足。修正了上次更新导致的部分拼音异常。
              </span>
            </li>
            <li>
              <span class="font-bold">2025-03-15</span>
              <span>
                修改了简化字的解决方案，现在所有的音码应该是完全一致的。修正了「ㄓ」被误注为「ㄓㄧ」的问题。
              </span>
            </li>

            <li>
              <span class="font-bold">2025-03-14</span>
              <span>
                考虑了简化字和正体字的对应，应该能部分解决出现罕见读音的问题。
              </span>
            </li>

            <li>
              <span class="font-bold">2025-03-12</span>
              <span> 最初版本 </span>
            </li>
          </ul>
        </div>

        <button
          @click="showModal = false"
          class="border py-1 block my-2 w-full bg-gray-500 text-white"
        >
          关闭
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  showModal: boolean;
}>();
const emit = defineEmits<{
  (e: "update:showModal", value: boolean): void;
}>();
const showModal = useVModel(props, "showModal", emit);
</script>

<style lang="css" scoped>
.modal-content {
  @apply w-fit mx-auto  h-fit bg-white dark:bg-gray-900 p-8 rounded-md max-w-3xl;
}
</style>
