<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" :model="queryForm" ref="queryForm">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="角色名称" prop="name">
              <a-input v-model="queryForm.name" placeholder="请输入菜单名称" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="权限标识" prop="roleKey">
              <a-input v-model="queryForm.roleKey" placeholder="请输入权限标识" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="角色状态" prop="status">
              <a-select v-model="queryForm.status" placeholder="请选择角色状态">
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">禁止</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="handleQuery">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQuery">重置</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="table-operator" style="margin-top: 20px;">
      <a-button type="primary" @click="handleAdd">新增</a-button>
      <a-button type="warning" :disabled="selectedEdit" @click="handleUpdate">修改</a-button>
      <a-button type="danger" :disabled="selectedRemove" @click="removeRole">删除</a-button>
    </div>
    <div class="ant-table-body" style="margin-top: 20px">
      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="roleData"
        rowKey="id"
      >
        <span style="display: flex;flex-flow: row;gap: 5px;" slot="action" slot-scope="text, record">
          <a-button type="primary" @click="handleUpdate(record)">编辑</a-button>
          <a-button type="danger" @click="removeRole(record)">删除</a-button>
        </span>
      </a-table>
    </div>

    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      @ok="handleOk"
      @cancel="handleCancel"
      :rules="rules"
    >
      <a-form-model
        :model="form"
        ref="form"
      >
        <a-form-model-item label="角色名称" prop="name">
          <a-input placeholder="请输入角色名称" v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item label="权限标识" prop="roleKey">
          <a-input placeholder="请输入权限标识" v-model="form.roleKey"/>
        </a-form-model-item>
        <a-form-model-item label="角色顺序" pro="orderBy">
          <a-input-number v-model="form.orderBy" />
        </a-form-model-item>
        <a-form-model-item label="角色状态" prop="status">
          <a-select placeholder="请选择角色状态" v-model="form.status">
            <a-select-option value="1">正常</a-select-option>
            <a-select-option value="2">禁止</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="菜单权限" prop="menus">
          <a-tree
            checkable
            v-model="form.menus"
            :tree-data="treeData"
            :replaceFields="{ title: 'title', children: 'children', key: 'id' }"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { addRole, deleteRole, getRole, getRoleActionableMenus, rolePage, updateRole } from '@/api/auth/role/role'
import { getTreeList } from '@/api/auth/menu/menu'

export default {
  name: 'Role',
  data () {
    return {
      selectedEdit: true,
      selectedRemove: true,
      selectedRowKeys: [],
      modalTitle: '',
      modalVisible: false,
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleKey: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
      },
      columns: [
        {
          title: '角色编号',
          key: 'id',
          dataIndex: 'id'
        },
        {
          title: '角色名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '权限标识',
          key: 'roleKey',
          dataIndex: 'roleKey'
        },
        {
          title: '角色状态',
          key: 'status',
          dataIndex: 'status'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      roleData: [],
      treeData: [],
      queryForm: {
        name: undefined,
        roleKey: undefined,
        status: undefined
      },
      form: {
        id: undefined,
        name: undefined,
        roleKey: undefined,
        status: null,
        orderBy: undefined,
        menus: undefined
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'form' })
    this.queryForm = this.$form.createForm(this, { name: 'queryForm' })
  },
  created () {
    this.getData()
  },
  watch: {
    selectedRowKeys (newVal) {
      this.ids = [...newVal]
      console.log(this.ids)
      this.selectedEdit = newVal.length !== 1
      this.selectedRemove = !(newVal.length > 0)
    }
  },
  methods: {
    getData () {
      rolePage(this.queryForm).then(res => {
        if (res.code === 200) {
          this.roleData = res.data
        }
      })
    },
    reset () {
      this.form = {
        id: undefined,
        name: undefined,
        roleKey: undefined,
        status: '0',
        orderBy: undefined,
        menus: undefined
      }
      // this.$refs.form.resetFields()
    },
    handleQuery () {
      this.getData()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.$refs.queryForm.resetFields()
      this.handleQuery()
    },
    handleUpdate (record) {
      this.reset()
      this.form.id = record.id || this.ids
      getRole(this.form.id).then(res => {
        if (res.code === 200) {
          this.form = {
            id: res.data.id,
            name: res.data.name,
            roleKey: res.data.roleKey,
            status: res.data.status,
            orderBy: res.data.orderBy
          }
          getTreeList().then(res => {
            if (res.code === 200) {
              this.treeData = res.data
              getRoleActionableMenus(this.form.id).then(res => {
                if (res.code === 200) {
                  this.form.menus = res.data
                  this.modalTitle = '修改角色'
                  this.modalVisible = true
                }
              })
            }
          })
        }
      })
    },
    handleAdd () {
      this.reset()
      getTreeList().then(res => {
        if (res.code === 200) {
          this.treeData = res.data
          this.modalTitle = '添加角色'
          this.modalVisible = true
        }
      })
    },
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateRole(this.form).then(res => {
              if (res.code === 200) {
                this.$message.success('修改角色完成!')
                this.getData()
              }
            })
          } else {
            addRole(this.form).then(res => {
              if (res.code === 200) {
                this.$message.success('添加角色完成!')
                this.getData()
              }
            })
          }
        }
      })
    },
    handleCancel () {
      this.reset()
      this.modalVisible = false
    },
    removeRole (record) {
      const ids = record.id || this.ids
      deleteRole(ids).then(res => {
        if (res.code === 200) {
          this.$message.success('删除角色成功!')
          this.getData()
        }
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>
<style scoped lang='less'>

</style>
