<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" :model="queryForm" ref="queryForm">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="菜单名称" prop="title">
              <a-input placeholder="请输入菜单名称" v-model="queryForm.title"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="菜单状态" prop="status">
              <a-select placeholder="请选择菜单状态" v-model="queryForm.status">
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">禁止</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary">查询</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="table-operator" style="margin-top: 20px;">
      <a-button type="primary" @click="handleAdd">新增</a-button>
    </div>
    <div class="ant-table-body" style="margin-top: 20px">
      <a-table
        :columns="columns"
        rowKey="id"
        :data-source="menuData"
        :pagination="false"
      >
        <span style="display: flex;flex-flow: row;gap: 5px;justify-content: center;" slot="action" slot-scope="text, record">
          <a-button type="primary" @click="handleUpdate(record)">编辑</a-button>
          <a-button type="danger" @click="removeMenu(record)" >删除</a-button>
          <a-button type="primary" @click="handleAdd(record)" >新增</a-button>
        </span>
      </a-table>
    </div>

    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form-model
        :model="form"
        ref="form"
        :rules="rules"
      >
        <a-form-model-item label="上级菜单" prop="parentId">
          <a-tree-select
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择上级菜单"
            allow-clear
            :tree-data="menuData"
            :replaceFields="{key:'id', value: 'id'}"
            v-model="form.parentId"
            tree-default-expand-all
          >
            <span slot="title" slot-scope="{ key, value }" style="color: #08c">
              Child Node1 {{ value }}
            </span>
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="菜单类型" prop="type">
          <a-radio-group name="menuType" :default-value="0" v-model="form.type">
            <a-radio :value="0">
              菜单
            </a-radio>
            <a-radio :value="1">
              按钮
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="菜单名称" prop="title">
              <a-input placeholder="请输入菜单名称" v-model="form.title" />
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="显示排序" prop="orderBy">
              <a-input-number placeholder="请输入显示排序" v-model="form.orderBy"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48" v-if="form.type!==1">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="路由地址" prop="path">
              <a-input placeholder="请输入路由地址" v-model="form.path"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="组件路径" prop="component">
              <a-input placeholder="请输入组件路径" v-model="form.component"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="权限字符串" prop="permission">
              <a-input placeholder="请输入权限字符串" v-model="form.permission"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="菜单状态" prop="status" v-if="form.type!==1">
              <a-radio-group name="menuStatus" :default-value="0" v-model="form.status">
                <a-radio :value="0">
                  正常
                </a-radio>
                <a-radio :value="1">
                  禁止
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { addMenu, deleteMenu, getMenu, menuPage, updateMenu } from '@/api/auth/menu/menu'

export default {
  name: 'Menu',
  data () {
    return {
      modalVisible: false,
      modalTitle: '',
      columns: [
        {
          title: '菜单名称',
          key: 'title',
          dataIndex: 'title'
        },
        {
          title: '图标',
          key: 'icon',
          dataIndex: 'icon'
        },
        {
          title: '权限标识',
          key: 'permission',
          dataIndex: 'permission'
        },
        {
          title: '组件地址',
          key: 'component',
          dataIndex: 'component'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      menuData: [],
      queryForm: {
        title: '',
        status: 1
      },
      form: {
        type: 0,
        component: undefined,
        icon: undefined,
        permission: undefined,
        path: undefined,
        parentId: 0,
        orderBy: undefined,
        title: undefined,
        status: undefined
      },
      rules: {
        title: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入路由地址', trigger: 'blur' }
        ],
        orderBy: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'form' })
  },
  methods: {
    getList () {
      menuPage(this.queryForm).then(
        res => {
          if (res.code === 200) {
            this.menuData = res.data
          }
        }
      )
    },
    reset () {
      this.form = {
        type: 0,
        component: undefined,
        icon: undefined,
        permission: undefined,
        path: undefined,
        parentId: 0,
        orderBy: undefined,
        title: undefined,
        status: undefined,
        id: undefined
      }
    },
    handleCancel () {
      this.modalVisible = false
    },
    handleSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id === undefined) {
            addMenu(this.form).then(
              res => {
                if (res.code === 200) {
                  this.$message.success('添加成功!')
                  this.modalVisible = false
                  this.getList()
                } else {
                  this.$message.error(res.msg)
                }
              }
            )
          } else {
            updateMenu(this.form).then(
              res => {
                if (res.code === 200) {
                  this.$message.success('修改成功!')
                  this.modalVisible = false
                  this.getList()
                } else {
                  this.$message.error(res.msg)
                }
              }
            )
          }
        }
      })
    },
    handleAdd (record) {
      this.reset()
      this.form.parentId = record.id
      this.modalTitle = '新增菜单'
      this.modalVisible = true
    },
    handleUpdate (record) {
      this.reset()
      const id = record.id
      getMenu(id).then(
        res => {
          if (res.code === 200) {
            this.form = res.data
            this.modalTitle = '修改菜单'
            this.modalVisible = true
          } else {
            this.$message.error(res.msg)
          }
        }
      )
    },
    removeMenu (record) {
      deleteMenu([record.id]).then(
        res => {
          if (res.code === 200) {
            this.$message.success('删除成功!')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }
      )
    }
  }
}
</script>
<style scoped lang='less'>

</style>
