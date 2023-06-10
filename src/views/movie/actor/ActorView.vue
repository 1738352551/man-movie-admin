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
            <a-form-model-item label="演员姓名" prop="name">
              <a-input v-model="queryForm.name" placeholder="请输入演员名字" clearable />
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
      <a-button type="warning" @click="handleEdit" :disabled="selectedActorEdit">编辑</a-button>
      <a-button type="danger" @click="handleDelete" :disabled="selectedActorDelete">删除</a-button>
    </div>
    <div class="ant-table-body" style="margin-top: 20px">
      <a-table
        :columns="actorColumns"
        :data-source="actorData"
        rowKey="id"
        :pagination="false"
        :row-selection="{ selectedRowKeys: actorIds, onChange: onSelectChange }"
      >
        <span slot="action" slot-scope="text, record">
          <a-button type="primary" @click="handleEdit(record)">编辑</a-button>
          <a-button @click="handleDelete(record)" style="margin-left: 10px">删除</a-button>
        </span>
      </a-table>
      <a-pagination style="margin-top: 10px" v-model="queryForm.current" :size="queryForm.pageSize.toString()" @change="getList" :total="total" />
    </div>
    <a-modal
      :title="actorModalTitle"
      :visible.sync="actorModalVisible"
      @ok="handleActorModalOk"
      @cancel="handleActorModalCancel"
    >
      <a-form-model
        :model="actorForm"
        ref="actorFormRef"
        :rules="actorFormRules"
      >
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-model-item label="演员姓名" prop="name">
              <a-input v-model="actorForm.name" placeholder="请输入演员名字" clearable />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-model-item label="演员照片" prop="photoUrl">
              <a-upload
                name="actorPhoto"
                list-type="picture-card"
                class="actorPhoto-uploader"
                :show-upload-list="false"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :before-upload="beforeUpload"
                v-model="actorForm.photoUrl"
                @change="handleChange"
              >
                <img v-if="actorForm.photoUrl" :src="actorForm.photoUrl" alt="actorPhoto" />
                <div v-else>
                  <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { addActor, delActor, getActor, listActorByPage, updateActor } from '@/api/movie/movieactor'

export default {
  name: 'ActorView',
  data () {
    return {
      uploadLoading: false,
      actorModalTitle: '',
      actorModalVisible: false,
      actorIds: [],
      total: 0,
      queryForm: {
        current: 1,
        pageSize: 10,
        name: ''
      },
      actorData: [],
      selectedActorEdit: true,
      selectedActorDelete: true,
      actorColumns: [
        {
          title: '名字',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '演员照片',
          key: 'photoUrl',
          dataIndex: 'photoUrl'
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      actorForm: {
        id: null,
        name: '',
        photoUrl: ''
      },
      actorFormRules: {
        name: [
          { required: true, message: '请输入演员名字', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  beforeCreate () {
    this.queryForm = this.$form.createForm(this, { name: 'queryForm' })
    this.actorForm = this.$form.createForm(this, { name: 'actorForm' })
  },
  methods: {
    reset () {
      this.actorForm = {
        id: null,
        name: '',
        photoUrl: ''
      }
    },
    getList () {
      listActorByPage(this.queryForm).then(res => {
        if (res.code === 200) {
          this.actorData = res.data.list
          this.total = res.data.total
        }
      })
    },
    handleAdd () {
      this.reset()
      this.actorModalTitle = '新增演员'
      this.actorModalVisible = true
    },
    handleEdit (record) {
      this.reset()
      this.actorForm.id = record.id || this.actorIds[0]
      getActor(this.actorForm.id).then(
        res => {
          if (res.code === 200) {
            this.actorForm = res.data
            this.actorModalTitle = '修改演员信息'
            this.actorModalVisible = true
          }
        }
      )
    },
    handleDelete (record) {
      const that = this
      this.actorForm.id = record.id || this.actorIds[0]
      delActor(this.actorForm.id).then(
        res => {
          if (res.code === 200) {
            this.$message.success('删除成功!')
            that.onSelectChange([])
            this.getList()
          }
        }
      )
    },
    handleQuery () {
      this.getList()
    },
    handleReset () {
      this.$refs.queryFormRef.resetFields()
      this.getList()
    },
    onSelectChange (selectedRowKeys) {
      this.actorIds = selectedRowKeys
      this.selectedActorEdit = this.actorIds.length !== 1
      this.selectedActorDelete = !(this.actorIds.length > 0)
    },
    handleActorModalOk () {
      this.$refs.actorFormRef.validate((valid) => {
        if (valid) {
          if (this.actorForm.id === null) {
            addActor(this.actorForm).then(
              res => {
                if (res.code === 200) {
                  this.$message.success('新增成功!')
                  this.getList()
                  this.actorModalVisible = false
                }
              }
            )
          } else {
            updateActor(this.actorForm).then(
              res => {
                if (res.code === 200) {
                  this.$message.success('修改成功!')
                  this.getList()
                  this.actorModalVisible = false
                }
              }
            )
          }
        }
      })
    },
    handleActorModalCancel () {
      this.reset()
      this.actorModalVisible = false
    },
    beforeUpload () {

    },
    handleChange () {

    }
  }
}
</script>
<style scoped lang='less'>
.actorPhoto-uploader > .ant-upload {
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
