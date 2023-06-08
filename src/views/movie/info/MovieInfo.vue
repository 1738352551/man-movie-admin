<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form-model :model="queryForm" ref="queryForm">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="影视名" prop="name">
              <a-input v-model="queryForm.name" placeholder="请输入影视名"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="影视类型" prop="type">
              <a-select v-model="queryForm.type" placeholder="请选择影视类型">
                <a-select-option value="1">电视剧</a-select-option>
                <a-select-option value="2">电影</a-select-option>
                <a-select-option value="3">动漫</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="handleQuery">查询</a-button>
            <a-button style="margin-left: 8px;" @click="handleReset">重置</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator" style="margin-top: 20px;">
      <a-button type="primary" @click="handleAdd">新增</a-button>
      <a-button type="primary" @click="handleEdit">编辑</a-button>
      <a-button type="primary" @click="handleDelete">删除</a-button>
    </div>

    <div class="ant-table-body" style="margin-top: 20px">
      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        rowKey="id"
        :pagination="false"
        :data-source.sync="movieInfoData"
        :expandedRowKeys="expandedRowKeys"
        @expand="getInnerData"
      >
        <span slot="bannerUrl" slot-scope="bannerUrl">
          <img style="width: 150px;height: 100px" :src="bannerUrl" />
        </span>
        <span style="display: flex;flex-flow: row;gap: 5px;justify-content: center;" slot="action" slot-scope="text, record">
          <a-button type="primary" @click="handleEdit(record)">编辑</a-button>
          <a-button type="danger" @click="handleDelete(record)" >删除</a-button>
        </span>
        <a-table
          slot="expandedRowRender"
          :columns="innerEpisodesColumns"
          :data-source.sync="episodesData"
          rowKey="id"
          @expandedRowsChange="innerExpandedRowsChange"
          :pagination="false"
        >
          <a slot="movieUrl" slot-scope="movieUrl" :href="movieUrl" target="_blank">{{ movieUrl }}</a>
        </a-table>
      </a-table>
      <a-pagination style="margin-top: 10px" v-model="queryForm.current" :size="queryForm.pageSize.toString()" @change="getList" :total="total" />
    </div>
    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form-model
        v-if="actionType === 'info'"
        :model="movieInfoForm"
        ref="movieInfoRef"
      >
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="影视名" prop="name">
              <a-input v-model="movieInfoForm.name" placeholder="请输入影视名"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="影视类型" prop="type">
              <a-select v-model="movieInfoForm.type" @change="typeChange" placeholder="请选择影视类型" default-value="1">
                <a-select-option value="1">电视剧</a-select-option>
                <a-select-option value="2">电影</a-select-option>
                <a-select-option value="3">动漫</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="影视封面" prop="bannerUrl">
              <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                v-model="movieInfoForm.bannerUrl"
                :show-upload-list="false"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-model-item label="影视简介" prop="introduction">
              <a-textarea v-model="movieInfoForm.introduction" placeholder="请输入影视简介"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48" v-if="movieInfoForm.type!=='2'">
          <a-col :md="24" :sm="24">
            <div class="table-operator">
              <a-button type="primary">新增</a-button>
              <a-button type="primary">编辑</a-button>
              <a-button type="primary">删除</a-button>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="48" v-if="movieInfoForm.type!=='2'">
          <a-col :md="24" :sm="24">
            <a-table
              :columns="episodesColumns"
              :data-source.sync="movieInfoForm.episodesList"
              rowKey="id"
            >
            </a-table>
          </a-col>
        </a-row>
      </a-form-model>

      <a-form-model
        v-if="actionType === 'episodes'"
        :model="movieInfoForm"
        ref="movieInfoRef"
      >

      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import TagSelectOption from '@/components/TagSelect/TagSelectOption'
import { movieInfoListPage } from '@/api/movie/movieinfo'
import { episodesListForMovie } from '@/api/movie/episodes'

export default {
  name: 'Index',
  components: { TagSelectOption },
  data () {
    return {
      imageUrl: '',
      loading: false,
      actionType: 'info',
      selectedRowKeys: [],
      total: 0,
      queryForm: {
        name: undefined,
        type: undefined,
        current: 1,
        pageSize: 10
      },
      innerEpisodesColumns: [
        {
          title: '剧集标题',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '剧集地址',
          dataIndex: 'movieUrl',
          key: 'movieUrl',
          scopedSlots: { customRender: 'movieUrl' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      episodesColumns: [
        {
          title: '剧集标题',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '剧集地址',
          dataIndex: 'movieUrl',
          key: 'movieUrl',
          scopedSlots: { customRender: 'movieUrl' }
        }
      ],
      columns: [
        {
          title: '影视名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '影视介绍',
          dataIndex: 'introduction',
          key: 'introduction'
        },
        {
          title: '影视类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: '视频来源',
          dataIndex: 'videoSource',
          key: 'videoSource'
        },
        {
          title: '封面',
          dataIndex: 'bannerUrl',
          key: 'bannerUrl',
          scopedSlots: { customRender: 'bannerUrl' }
        },
        {
          title: '评分',
          dataIndex: 'score',
          key: 'score'
        },
        {
          title: '已看人数',
          dataIndex: 'viewNum',
          key: 'viewNum'
        },
        {
          title: '操作',
          dataIndex: 'cation',
          key: 'cation',
          scopedSlots: { customRender: 'action' }
        }
      ],
      movieInfoData: [],
      episodesData: [],
      modalTitle: '',
      modalVisible: false,
      expandedRowKeys: [],
      movieInfoForm: {
        name: undefined,
        type: 1,
        introduction: undefined,
        bannerUrl: undefined,
        episodesList: []
      }
    }
  },
  beforeCreate () {
    this.queryForm = this.$form.createForm(this, { name: 'queryForm' })
    // this.queryForm = this.$form.createForm(this, { name: 'queryForm' })
  },
  created () {
    this.getList()
  },
  methods: {
    typeChange (newVal) {
      console.log(this.movieInfoForm)
    },
    getInnerData (expanded, record) {
      if (this.expandedRowKeys.length > 0) { // 进这个判断说明当前已经有展开的了
        // 返回某个指定的字符串值在字符串中首次出现的位置，下标为0
        const index = this.expandedRowKeys.indexOf(record.id)
        if (index > -1) { // 如果出现则截取这个id,1d到1相当于0，针对重复点击一个
          this.expandedRowKeys.splice(index, 1)
        } else {
          // 如果没出现则截取所有id,添加点击id，0到1，针对已经有一个展开，点另一个会进入判断
          this.expandedRowKeys.splice(0, this.expandedRowKeys.length)
          this.expandedRowKeys.push(record.id)
        }
      } else {
        // 数组长度小于0，说明都没展开，第一次点击，id添加到数组，数组有谁的id谁就展开
        this.expandedRowKeys.push(record.id)
      }
      episodesListForMovie(record.id).then(
        res => {
          if (res.code === 200) {
            this.episodesData = res.data
            console.log(record)
          }
        }
      )
    },
    getList () {
      movieInfoListPage(this.queryForm).then(
        res => {
          if (res.code === 200) {
            this.total = res.data.total
            this.movieInfoData = res.data.list
            console.log(this.movieInfoData)
          }
        }
      )
    },
    handleAdd () {
      this.modalTitle = '添加影视'
      this.modalVisible = true
    },
    handleEdit (record) {

    },
    handleDelete (record) {

    },
    handleQuery () {

    },
    handleReset () {
      // this.queryForm = {
      //   name
      // }
      this.$refs.queryForm.resetFields()
    },
    handleSubmit () {

    },
    handleCancel () {

    },
    onSelectChange () {

    },
    innerExpandedRowsChange (expandedRows) {

    }
  }
}
</script>
<style scoped lang='less'>
a{
  text-decoration: none;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
