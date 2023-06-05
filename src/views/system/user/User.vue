<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input placeholder="请输入用户名" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="Email">
              <a-input placeholder="请输入Email" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="昵称">
              <a-input placeholder="请输入昵称" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="性别">
                <a-select value="男" placeholder="请选择性别" default-value="0">
                  <a-select-option value="0">男</a-select-option>
                  <a-select-option value="1">女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="登录状态">
                <a-select value="在线" placeholder="请选择登录状态" default-value="0">
                  <a-select-option value="0">在线</a-select-option>
                  <a-select-option value="1">离线</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="用户状态">
                <a-select value="正常" placeholder="请选择用户状态" default-value="0">
                  <a-select-option value="0" >正常</a-select-option>
                  <a-select-option value="1">禁止</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
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
      <a-button type="primary">新增</a-button>
      <a-button type="warning">修改</a-button>
      <a-button type="danger">删除</a-button>
    </div>

    <div class="ant-table-body" style="margin-top: 20px">
      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="userData">
        <a slot="username" slot-scope="text">{{ text }}</a>
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
        <span style="display: flex;flex-flow: row;gap: 5px;" slot="action" slot-scope="">
          <a-button type="primary">编辑</a-button>
          <a-button type="primary">分配角色</a-button>
          <a-button type="danger" >删除</a-button>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'User',
  data () {
    return {
      advanced: false,
      selectedRowKeys: [],
      userData: [
        {
          key: 1,
          username: '177777',
          nickname: '陈慢慢',
          gender: '男',
          email: 'kenaa@example.com',
          avatar: 'https://avatars.githubusercontent.com/u/32236403?v=4',
          loginStatus: true,
          lastLoginDate: '2018-08-08 10:00:00',
          lastLoginIp: '192.168.127.12',
          status: 1
        }
      ],
      columns: [
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username',
          width: 50
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname',
          width: 50
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          width: 30
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
      ]
    }
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
<style scoped lang='less'>

</style>
