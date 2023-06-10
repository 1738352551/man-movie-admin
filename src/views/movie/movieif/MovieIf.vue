<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form-model
        :model="queryForm"
        ref="queryFormRef"
        layout="inline"
      >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="接口名" prop="name">
              <a-input v-model="queryForm.name" placeholder="请输入接口名字" clearable />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="接口地址" prop="name">
              <a-input v-model="queryForm.url" placeholder="请输入接口名字" clearable />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="handleQuery">查询</a-button>
            <a-button type="primary" @click="handleReset" style="margin-left: 10px">重置</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator" style="margin-top: 20px;">
      <a-button type="primary" @click="handleAdd">新增</a-button>
      <a-button type="warning" @click="handleEdit" :disabled="selectedMovieIfEdit">编辑</a-button>
      <a-button type="danger" @click="handleDelete" :disabled="selectedMovieIfDelete">删除</a-button>
    </div>

    <div class="ant-table-body" style="margin-top: 20px">
      <a-table
        :columns="movieIfColumns"
        :data-source="movieIfList"
        rowKey="id"
        :pagination="false"
        :row-selection="{ selectedRowKeys: movieIfIds, onChange: onSelectChange }"
      >
        <span slot="action" slot-scope="text, record">
          <a-button type="primary" @click="handleEdit(record)">编辑</a-button>
          <a-button @click="handleDelete(record)" style="margin-left: 10px">删除</a-button>
        </span>
      </a-table>
      <a-pagination style="margin-top: 10px" v-model="queryForm.current" :size="queryForm.pageSize.toString()" @change="getList" :total="total" />
    </div>
    <a-modal
      :title="modalTitle"
      :visible.sync="modalVisible"
      @ok="handleAddMovieIfOk"
      @cancel="handleAddMovieIfCancel"
    >
      <a-form-model
        :model="movieIfForm"
        ref="movieIfFormRef"
      >
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="接口名" prop="name">
              <a-input v-model="movieIfForm.name" placeholder="请输入接口名字" clearable />
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="接口地址" prop="name">
              <a-input v-model="movieIfForm.url" placeholder="请输入接口地址" clearable />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

    </a-modal>
  </div>
</template>

<script>
import { addMovieIf, delMovieIf, getMovieIf, listMovieIf, updateMovieIf } from '@/api/movie/movieif'

export default {
  name: 'Index',
  data () {
    return {
      movieIfIds: [],
      modalTitle: '',
      modalVisible: false,
      selectedMovieIfEdit: true,
      selectedMovieIfDelete: true,
      movieIfList: [],
      total: 0,
      queryForm: {
        current: 1,
        pageSize: 10,
        name: null,
        url: null
      },
      movieIfColumns: [
        {
          title: '接口名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '接口地址',
          dataIndex: 'url',
          key: 'url'
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      movieIfForm: {
        id: null,
        name: null,
        url: null
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      listMovieIf(this.queryForm).then(
        res => {
          this.movieIfList = res.data.list
          this.total = res.data.total
        }
      )
    },
    handleQuery () {
      this.getList()
    },
    handleReset () {
      this.$refs.queryFormRef.resetFields()
    },
    handleAdd () {
      this.movieIfForm = {
        id: null,
        name: null,
        url: null
      }
      this.modalTitle = '新增接口'
      this.modalVisible = true
    },
    handleEdit (record) {
      this.movieIfForm.id = record.id || this.movieIfIds[0]
      getMovieIf(this.movieIfForm.id).then(
        res => {
          this.movieIfForm = res.data
          this.modalTitle = '编辑接口'
          this.modalVisible = true
        }
      )
    },
    handleDelete (record) {
      const that = this
      this.movieIfForm.id = record.id || this.movieIfIds[0]
      delMovieIf(this.movieIfForm.id).then(
        res => {
          that.onSelectChange([])
          this.$message.success('删除解析接口成功!')
          this.getList()
        }
      )
    },
    onSelectChange (selectedRowKeys) {
      this.movieIfIds = selectedRowKeys
      this.selectedMovieIfEdit = this.movieIfIds.length !== 1
      this.selectedMovieIfDelete = !(this.movieIfIds.length > 0)
    },
    handleAddMovieIfOk () {
      this.$refs.movieIfFormRef.validate((valid) => {
        if (valid) {
          if (this.movieIfForm.id === null) {
            addMovieIf(this.movieIfForm).then(
              res => {
                if (res.code === 200) {
                  this.$message.success('新增视频解析接口成功!')
                  this.getList()
                  this.modalVisible = false
                }
              }
            )
          } else {
            updateMovieIf(this.movieIfForm).then(
              res => {
                if (res.code === 200) {
                  this.$message.success('编辑视频解析接口成功!')
                  this.getList()
                  this.modalVisible = false
                }
              }
            )
          }
        }
      })
    },
    handleAddMovieIfCancel () {
      this.movieIfForm = {
        id: null,
        name: null,
        url: null
      }
      this.modalVisible = false
    }
  }
}
</script>
<style scoped lang='less'>

</style>
