<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form-model
        :model="queryForm"
        ref="queryFormRef"
        layout="inline"
      >
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="标签名" prop="name">
              <a-input v-model="queryForm.name" placeholder="请输入标签名字" clearable />
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-button type="primary" @click="handleQuery">查询</a-button>
            <a-button type="primary" @click="handleReset" style="margin-left: 10px">重置</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator" style="margin-top: 20px;">
      <a-button type="primary" @click="handleAdd">新增</a-button>
      <a-button type="warning" @click="handleEdit" :disabled="selectedTagEdit">编辑</a-button>
      <a-button type="danger" @click="handleDelete" :disabled="selectedTagDelete">删除</a-button>
    </div>

    <div class="ant-table-body" style="margin-top: 20px">
      <a-table
        :columns="tagColumns"
        :data-source="tagList"
        rowKey="id"
        :pagination="false"
        :row-selection="{ selectedRowKeys: tagIds, onChange: onSelectChange }"
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
      @ok="handleAddTagOk"
      @cancel="handleAddTagCancel"
    >
      <a-form-model
        :model="tagForm"
        ref="tagFormRef"
      >
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-model-item label="标签名" prop="name">
              <a-input v-model="tagForm.name" placeholder="请输入标签名字" clearable />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

    </a-modal>
  </div>
</template>

<script>
import { addTag, deleteTag, getTag, listTags, updateTag } from '@/api/movie/movietag'

export default {
  name: 'Index',
  data () {
    return {
      tagIds: [],
      modalTitle: '',
      modalVisible: false,
      selectedTagEdit: true,
      selectedTagDelete: true,
      tagList: [],
      total: 0,
      queryForm: {
        current: 1,
        pageSize: 10,
        name: null
      },
      tagColumns: [
        {
          title: '标签名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tagForm: {
        id: null,
        name: null
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      listTags(this.queryForm).then(
        res => {
          this.tagList = res.data.list
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
      this.tagForm = {
        id: null,
        name: null
      }
      this.modalTitle = '新增标签'
      this.modalVisible = true
    },
    handleEdit (record) {
      this.tagForm.id = record.id || this.tagIds[0]
      getTag(this.tagForm.id).then(
        res => {
          this.tagForm = res.data
          this.modalTitle = '编辑标签'
          this.modalVisible = true
        }
      )
    },
    handleDelete (record) {
      const that = this
      this.tagForm.id = record.id || this.tagIds[0]
      deleteTag(this.tagForm.id).then(
        res => {
          that.onSelectChange([])
          this.$message.success('删除标签成功!')
          this.getList()
        }
      )
    },
    onSelectChange (selectedRowKeys) {
      this.tagIds = selectedRowKeys
      this.selectedTagEdit = this.tagIds.length !== 1
      this.selectedTagDelete = !(this.tagIds.length > 0)
    },
    handleAddTagOk () {
      this.$refs.tagFormRef.validate((valid) => {
        if (valid) {
          if (this.tagForm.id === null) {
            addTag(this.tagForm).then(
              res => {
                if (res.code === 200) {
                  this.$message.success('新增标签成功!')
                  this.getList()
                  this.modalVisible = false
                }
              }
            )
          } else {
            updateTag(this.tagForm).then(
              res => {
                if (res.code === 200) {
                  this.$message.success('编辑标签成功!')
                  this.getList()
                  this.modalVisible = false
                }
              }
            )
          }
        }
      })
    },
    handleAddTagCancel () {
      this.tagForm = {
        id: null,
        name: null
      }
      this.modalVisible = false
    }
  }
}
</script>
<style scoped lang='less'>

</style>
