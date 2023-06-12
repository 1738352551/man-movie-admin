<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="queryForm" ref="queryForm" >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input placeholder="请输入用户名" v-model="queryForm.username" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="Email">
              <a-input placeholder="请输入Email" v-model="queryForm.email"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="昵称">
              <a-input placeholder="请输入昵称" v-model="queryForm.nickname"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="性别">
                <a-select v-model="queryForm.gender" value="男" placeholder="请选择性别" default-value="0">
                  <a-select-option value="0">男</a-select-option>
                  <a-select-option value="1">女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="登录状态">
                <a-select v-model="queryForm.loginStatus" value="在线" placeholder="请选择登录状态" default-value="0">
                  <a-select-option value="0">在线</a-select-option>
                  <a-select-option value="1">离线</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="用户状态">
                <a-select v-model="queryForm.status" value="正常" placeholder="请选择用户状态" default-value="0">
                  <a-select-option value="1" >正常</a-select-option>
                  <a-select-option value="0">禁止</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" @click="handleAdd">新增</a-button>
      <a-button type="warning" :disabled="selectedEdit" @click="handleUpdate">修改</a-button>
      <a-button type="danger" :disabled="selectedDelete" @click="removeUserByIds">删除</a-button>
    </div>

    <div class="ant-table-body" style="margin-top: 20px">
      <a-table
        rowKey="id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :pagination="false"
        :data-source="userData">
        <a slot="username" slot-scope="text">{{ text }}</a>
        <span slot="gender" slot-scope="text">
          {{ text ? '女' : '男' }}
        </span>
        <span slot="avatar" slot-scope="avatar">
          <a-avatar :size="64" :src="avatar"/>
        </span>
        <span slot="loginStatus" slot-scope="loginStatus">
          <a-tag v-if="loginStatus" color="green">在线</a-tag>
          <a-tag v-if="!loginStatus" color="red">离线</a-tag>
        </span>
        <span slot="status" slot-scope="status">
          <a-tag v-if="status" color="green">正常</a-tag>
          <a-tag v-if="!status" color="red">禁止</a-tag>
        </span>
        <span style="display: flex;flex-flow: row;gap: 5px;" slot="action" slot-scope="text, record">
          <a-button type="primary" @click="handleUpdate(record)">编辑</a-button>
          <a-button type="primary">分配角色</a-button>
          <a-button type="danger" @click="removeUser(record)">删除</a-button>
        </span>
      </a-table>
      <a-pagination style="margin-top: 10px" v-model="queryForm.current" :size="queryForm.pageSize.toString()" @change="getData" :total="total" />
    </div>
    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="600"
    >
      <a-form-model :model="form" ref="form" :rules="rules">
        <a-row :gutter="48">
          <a-col :md="form.id===null ? 8:12" :sm="24">
            <a-form-model-item prop="username" label="用户名">
              <a-input
                placeholder="请输入用户名"
                v-model="form.username"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="form.id===null?8:12" :sm="24">
            <a-form-model-item label="昵称" prop="nickname">
              <a-input placeholder="请输入昵称" v-model="form.nickname" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24" v-if="form.id===null">
            <a-form-model-item label="密码" prop="password">
              <a-input
                placeholder="请输入密码"
                v-model="form.password"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="邮箱" prop="emial">
              <a-input placeholder="请输入邮箱" v-model="form.email" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="性别" prop="gender">
              <a-select placeholder="请选择用户性别" v-model="form.gender" :default-value="'0'">
                <a-select-option value="0">男</a-select-option>
                <a-select-option value="1">女</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="用户状态" prop="status">
              <a-select placeholder="请选择用户状态" v-model="form.status" :default-value="'0'">
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">禁止</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="8" :sm="16">
            <a-form-model-item label="头像" prop="avatar">
              <a-upload
                name="file"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :action="uploadActionUrl"
                :before-upload="beforeUploadAvatar"
                :headers="headers"
                @change="handleChangeAvatar"
              >
                <img v-if="form.avatar" :src="form.avatar" alt="avatar" style="width: 150px;height: 150px;"/>
                <div v-else>
                  <a-icon :type="avatarLoading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="16">
            <a-form-model-item label="角色" prop="roles">
              <a-select mode="tags" size="large" style="width: 100%" placeholder="请选择一种角色" v-model="form.roles" >
                <a-select-option v-for="role in allRoleListData" :key="role.id.toString()" :value="role.id.toString()">
                  {{ role.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { addUser, updateUser, listPage, getUserById, deleteUser, getUserAsRole } from '@/api/auth/user/user'
import { getRoleList } from '@/api/auth/role/role'
import md5 from 'md5'

export default {
  name: 'User',
  data () {
    return {
      headers: {
        token: this.$store.getters.token
      },
      uploadActionUrl: process.env.VUE_APP_API_BASE_URL + '/file/upload',
      avatarLoading: false,
      avatarImageUrl: '',
      modalTitle: '',
      modalVisible: false,
      confirmLoading: false,
      selectedEdit: true,
      selectedDelete: true,
      advanced: false,
      selectedRowKeys: [],
      userData: [],
      allRoleListData: [],
      ids: [],
      total: 0,
      columns: [
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username',
          width: 150
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname',
          width: 50
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          width: 180
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          width: 30,
          scopedSlots: { customRender: 'gender' }
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          key: 'avatar',
          width: 32,
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '登陆状态',
          dataIndex: 'loginStatus',
          key: 'loginStatus',
          width: 30,
          scopedSlots: { customRender: 'loginStatus' }
        },
        {
          title: '上次登录时间',
          dataIndex: 'lastLoginDate',
          key: 'lastLoginDate',
          width: 100
        },
        {
          title: '上次登录ip',
          dataIndex: 'lastLoginIp',
          key: 'lastLoginIp',
          width: 100
        },
        {
          title: '用户状态',
          dataIndex: 'status',
          key: 'status',
          width: 30,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryForm: {
        username: '',
        nickname: '',
        gender: null,
        loginStatus: null,
        status: null,
        current: 1,
        pageSize: 10
      },
      // 添加/修改的form表单
      form: {
        // 用户id
        id: null,
        // 用户名
        username: '',
        // 昵称
        nickname: '',
        // 性别
        gender: '0',
        // 用户状态
        status: '0',
        // 邮箱
        email: '',
        // 密码
        password: '',
        avatar: null,
        roles: []
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'form' })
  },
  watch: {
    selectedRowKeys (newVal) {
      this.selectedEdit = newVal.length !== 1
      this.selectedDelete = !(newVal.length > 0)
    }
  },
  methods: {
    removeUserByIds () {
      const that = this
      deleteUser(this.selectedRowKeys).then(
        res => {
          if (res.code === 200) {
            that.onSelectChange([])
            this.$message.success('删除用户成功!')
            this.getData()
          }
        }
      )
    },
    removeUser (record) {
      deleteUser([record.id]).then(
        res => {
          if (res.code === 200) {
            this.getData()
            this.$message.success('删除用户成功!')
          }
        })
    },
    handleSearch (e) {
      e.preventDefault()
      this.getData()
    },
    reset () {
      this.queryForm = {
        username: '',
        nickname: '',
        gender: null,
        loginStatus: null,
        status: null
      }
      this.getData()
    },
    resetForm () {
      this.form = {
        // 用户id
        id: null,
        // 用户名
        username: '',
        // 昵称
        nickname: '',
        // 性别
        gender: '0',
        // 登录状态
        loginStatus: null,
        // 用户状态
        status: '0',
        // 邮箱
        email: '',
        avatar: '',
        // 密码
        password: '',
        roles: []
      }
      // this.$refs.form.resetFields()
    },
    getData () {
      listPage(this.queryForm).then(
        res => {
          this.userData = res.data.list.map(r => {
            r.key = r.id
            return r
          })
          this.total = res.data.total
        }
      )
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.password = md5(this.form.password)
          if (this.form.id === null) {
            addUser(this.form).then(
              res => {
                if (res.code === 200) {
                  this.resetForm()
                  this.$message.success('添加用户成功!')
                  this.getData()
                }
              }
            )
          } else {
            updateUser(this.form).then(
              res => {
                if (res.code === 200) {
                  this.resetForm()
                  this.$message.success('修改用户成功!')
                  this.getData()
                }
              }
            )
          }
        }
      })
    },
    handleCancel () {
      this.resetForm()
      this.modalVisible = false
    },
    handleAdd () {
      this.resetForm()
      getRoleList().then(
        res => {
          this.allRoleListData = res.data
          this.modalTitle = '添加用户'
          this.modalVisible = true
        }
      )
    },
    handleUpdate (record) {
      this.resetForm()
      this.form.id = record.id || this.selectedRowKeys
      getUserById(this.form.id).then(
        res => {
          this.form.username = res.data.username
          this.form.nickname = res.data.nickname
          this.form.gender = res.data.gender.toString()
          this.form.status = res.data.status.toString()
          this.form.email = res.data.email
          this.form.avatar = res.data.avatar
          this.form.roles = res.data.roles
          getRoleList().then(
            res => {
              this.allRoleListData = res.data
              getUserAsRole(this.form.id).then(
                res => {
                  this.form.roles = res.data.map(value => value.toString())
                }
              )
            }
          )
          this.modalTitle = '修改用户'
          this.modalVisible = true
        }
      )
    },
    beforeUploadAvatar (file) {
      this.avatarLoading = true
    },
    handleChangeAvatar (info) {
      const everyUploaded = info.fileList.every(current => current.percent === 100)
      if (everyUploaded) {
        this.avatarLoading = false
        this.form.avatar = info.file.response.data.fileUrl
      }
    }
  }
}
</script>
<style scoped lang='less'>

</style>
