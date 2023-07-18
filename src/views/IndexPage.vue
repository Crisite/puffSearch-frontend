<template>
  <div class="index-page">
    <a-input-search
      v-model:value="searchText"
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
    <mydivider />
    <a-tabs v-model:activeKey="activeKey" @change="onTableChange">
      <a-tab-pane key="post" tab="文章">
        <PostList :post-list="postList" />
      </a-tab-pane>
      <a-tab-pane key="picture" tab="图片">
        <PictureList :picture-list="pictureList" />
      </a-tab-pane>
      <a-tab-pane key="user" tab="用户">
        <UserList :user-list="userList" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import UserList from "@/components/UserList.vue";
import PostList from "@/components/PostList.vue";
import PictureList from "@/components/PictureList.vue";
import mydivider from "@/components/MyDivider.vue";
import { useRoute, useRouter } from "vue-router";
import myAxios from "@/plugins/myAxios";
import { message } from "ant-design-vue";

const router = useRouter();
const route = useRoute();
const activeKey = route.params.category;
const initSearchParams = {
  text: "",
  type: activeKey,
  pageNum: 1,
  pageSize: 10,
};
const searchParams = ref(initSearchParams);
const searchText = ref(route.query.text || "");
const postList = ref([]);
const userList = ref([]);
const pictureList = ref([]);

/*
 * 加载聚合数据
 * @param params
 */
const loadAllData = (params: any) => {
  const query = {
    ...params,
    searchText: params.text,
  };
  console.error(params);
  myAxios.post("search/all", query).then((res: any) => {
    postList.value = res.postList;
    pictureList.value = res.pictureList;
    userList.value = res.userList;
    console.error(pictureList.value);
  });
};
/**
 * 加载单类数据
 */
const loadData = (params: any) => {
  const { type } = params;
  if (!type) {
    message.error("类别为空");
    return;
  }
  const query = {
    ...params,
    searchText: params.text,
  };
  myAxios.post("search/all", query).then((res: any) => {
    if (type === "post") {
      postList.value = res.dataList;
    } else if (type === "picture") {
      pictureList.value = res.dataList;
    } else if (type === "user") {
      userList.value = res.dataList;
    }
  });
};

// 首次请求
// loadData(initSearchParams);

// 当路由跳转时监听到searchParams的值修改
// searchParams修改后触发
watchEffect(() => {
  searchParams.value = {
    ...initSearchParams,
    text: route.query.text,
    type: route.params.category,
  } as any;
  loadData(searchParams.value);
});

// 1. 点击搜索的时候触发路由跳转
const onSearch = (value: string) => {
  router.push({
    query: {
      ...searchParams.value,
      text: value,
    },
  });
};

const onTableChange = (key: string) => {
  router.push({
    path: `/${key}`,
    query: searchParams.value,
  });
};
</script>
