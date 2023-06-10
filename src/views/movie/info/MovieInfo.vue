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
      <a-button type="primary" @click="handleEdit" :disabled="selectedMovieInfoEdit">编辑</a-button>
      <a-button type="primary" @click="handleDelete" :disabled="selectedMovieInfoDelete">删除</a-button>
    </div>

    <div class="ant-table-body" style="margin-top: 20px">
      <a-table
        :row-selection="{ selectedRowKeys: selectedMovieRowKeys, onChange: onSelectChange }"
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
      @ok="handleSubmitMovieInfo"
      @cancel="handleCancelMovieInfo"
      width="600px"
    >
      <a-form-model
        v-if="actionType === 'info'"
        :model="movieInfoForm"
        ref="movieInfoRef"
        :rules="movieInfoFormRules"
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
          <a-col :md="24" :sm="24">
            <a-form-model-item label="影视标签" prop="tagId">
              <a-select @change="tagChanged" mode="tags" style="width: 100%" placeholder="请选择影视相关标签" v-model="movieInfoForm.tagId">
                <a-select-option
                  v-for="tag in tagList"
                  :key="tag.id.toString()"
                  :value="tag.id.toString()"
                >
                  {{ tag.name }}
                </a-select-option>
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
                <img v-if="movieInfoForm.bannerUrl" width="200" height="200" :src="movieInfoForm.bannerUrl" alt="bannerImg" />
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
              <a-button type="primary" @click="handleEpisodesAdd">新增</a-button>
              <a-button type="primary" :disabled="selectedEpisodesEdit" @click="handleEpisodesEdit">编辑</a-button>
              <a-button type="primary" :disabled="selectedEpisodesDelete" @click="handleEpisodesDelete">删除</a-button>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="48" v-if="movieInfoForm.type!=='2'">
          <a-col :md="24" :sm="24">
            <a-table
              :columns="episodesColumns"
              :data-source.sync="this.episodesData"
              rowKey="id"
              size="small"
              :row-selection="{ selectedRowKeys: selectedEpisodesRowKeys, onChange: onSelectEpisodesChange }"
              :pagination="{
                pageSize: 3
              }"
            >
            </a-table>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <div class="table-operator">
              <a-button type="primary" @click="handleActorAdd">新增</a-button>
              <a-button type="primary" v-if="false" :disabled="selectedActorEdit" @click="handleActorEdit">编辑</a-button>
              <a-button type="primary" v-if="false" :disabled="selectedActorDelete" @click="handleActorDelete">删除</a-button>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-table
              :columns="actorColumns"
              :data-source.sync="this.actorData"
              rowKey="actorId"
              size="small"
              :row-selection="{ selectedRowKeys: selectedActorRowKeys, onChange: onSelectActorChange }"
              :pagination="{
                pageSize: 3
              }"
            >

            </a-table>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>

    <a-modal
      :title="episodesModalTitle"
      :visible="episodesModalVisible"
      @ok="handleSubmitEpisodes"
      @cancel="handleCancelEpisodes"
    >
      <a-form-model
        :model="movieEpisodesForm"
        ref="movieEpisodesRef"
        :rules="episodesRules"
      >
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-model-item label="剧集名" prop="title">
              <a-input v-model="movieEpisodesForm.title" placeholder="请输入剧集名"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-model-item label="剧集对应视频" prop="movieUrl">
              <a-upload v-model="movieEpisodesForm.movieUrl" :file-list="movieFileList" :remove="handleMovieFileRemove" :before-upload="beforeMovieFileUpload">
                <a-button> <a-icon type="upload" /> 请选择视频文件 </a-button>
              </a-upload>
              <a-button
                type="primary"
                :disabled="movieFileList.length === 0"
                :loading="uploading"
                style="margin-top: 16px"
                @click="handleMovieFileUpload"
              >
                {{ uploading ? '上传中...' : '开始上传' }}
              </a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>

    <a-modal
      :title="actorModalTitle"
      :visible="actorModalVisible"
      @ok="handleSubmitActor"
      @cancel="handleCancelActor"
    >
      <a-form-model
        :model="movieActorForm"
        ref="movieActorRef"
        :rules="actorRules"
      >
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-model-item>
              <a-select placeholder="请选择演员" v-model="movieActorForm.actorId">
                <a-select-option v-for="actor in allActor" :value="actor.id" :key="actor.id">
                  {{ actor.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="职位" prop="posts">
              <a-input v-model="movieActorForm.posts" placeholder="请输入演员职位"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-model-item label="剧中人物" prop="posts">
              <a-input v-model="movieActorForm.cosplayName" placeholder="请输入扮演人物"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-model-item label="剧中照片" prop="cosplayPhoto">
              <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                v-model="movieActorForm.cosplayPhoto"
                :show-upload-list="false"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              >
                <img v-if="movieActorForm.cosplayPhoto" width="200" height="200" :src="movieActorForm.cosplayPhoto" alt="bannerImg" />
                <div v-else>
                  <a-icon :type="actorLoading ? 'loading' : '添加'" />
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
import TagSelectOption from '@/components/TagSelect/TagSelectOption'
import {
  addMovieInfo,
  deleteMovieInfo,
  getMovieActor,
  getMovieInfo,
  movieInfoListPage,
  updateMovieInfo
} from '@/api/movie/movieinfo'
import {
  addEpisodes,
  deleteEpisodes,
  episodesListForMovie,
  getMovieEpisodes,
  updateEpisodes
} from '@/api/movie/episodes'
import { getTags } from '@/api/movie/movietag'
import { allActor } from '@/api/movie/movieactor'

export default {
  name: 'Index',
  components: { TagSelectOption },
  data () {
    return {
      actorLoading: false,
      actorModalTitle: '',
      actorModalVisible: false,
      allActor: [],
      selectedActorRowKeys: [],
      actorColumns: [
        {
          title: '演员名字',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '照片',
          dataIndex: 'photoUrl',
          key: 'photoUrl'
        },
        {
          title: '职位',
          dataIndex: 'posts',
          key: 'posts'
        },
        {
          title: '扮演角色',
          dataIndex: 'cosplayName',
          key: 'cosplayName'
        },
        {
          title: '剧中照片',
          dataIndex: 'cosplayPhoto',
          key: 'cosplayPhoto'
        }
      ],
      actorData: [],
      selectedActorEdit: false,
      selectedActorDelete: false,
      selectedActorIds: [],
      episodesModalTitle: '',
      episodesModalVisible: false,
      uploading: false,
      movieFileList: [],
      movieEpisodesForm: {
        title: '',
        movieUrl: '',
        id: null,
        movieId: null
      },
      selectedEpisodesRowKeys: [],
      episodeIds: [],
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
      movieInfoIds: [],
      selectedMovieRowKeys: [],
      selectedMovieInfoEdit: true,
      selectedMovieInfoDelete: true,
      selectedEpisodesEdit: true,
      selectedEpisodesDelete: true,
      movieInfoForm: {
        id: null,
        name: null,
        type: 1,
        introduction: null,
        bannerUrl: null,
        episodesList: [],
        movieActor: [],
        tagId: []
      },
      movieInfoFormRules: {
        name: [
          { required: true, message: '请输入影视名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择影视类型', trigger: 'change' }
        ],
        tagId: [
          { required: true, message: '请选择影视相关标签', trigger: 'change' }
        ]
      },
      episodesRules: {
        title: [
          { required: true, message: '请输入剧集标题', trigger: 'blur' }
        ]
      },
      tagList: [],
      movieActorForm: {
        actorId: null,
        movieId: null,
        posts: null,
        cosplayName: null,
        cosplayPhoto: null
      },
      actorRules: {
        actorId: [
          { required: true, message: '请选择演员!', trigger: 'change' }
        ],
        cosplayName: [
          { required: true, message: '请输入扮演任务', trigger: 'blur' }
        ]
      }
    }
  },
  beforeCreate () {
    this.queryForm = this.$form.createForm(this, { name: 'queryForm' })
    this.movieInfoForm = this.$form.createForm(this, { name: 'movieInfoForm' })
    this.movieEpisodesForm = this.$form.createForm(this, { name: 'movieEpisodesForm' })
  },
  created () {
    this.getList()
  },
  watch: {
    selectedMovieRowKeys (newVal) {
      this.selectedMovieInfoEdit = newVal.length !== 1
      this.selectedMovieInfoDelete = !(newVal.length > 0)
    },
    selectedActorRowKeys (newVal) {
      this.selectedActorEdit = newVal.length !== 1
      this.selectedActorDelete = !(newVal.length > 0)
    },
    selectedEpisodesRowKeys (newVal) {
      this.selectedEpisodesEdit = newVal.length !== 1
      this.selectedEpisodesDelete = !(newVal.length > 0)
    }
  },
  methods: {
    tagChanged () {
      console.log(this.movieInfoForm.tagId)
    },
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
            getTags().then(res => {
              if (res.code === 200) {
                this.tagList = res.data
              }
            })
            allActor().then(res => {
              if (res.code === 200) {
                this.allActor = res.data
              }
            })
          }
        }
      )
    },
    resetForm () {
      this.movieInfoForm = {
        id: null,
        name: null,
        type: 1,
        introduction: null,
        bannerUrl: null,
        episodesList: [],
        movieActor: [],
        tagId: []
      }
    },
    handleAdd () {
      this.resetForm()
      this.modalTitle = '添加影视'
      this.modalVisible = true
    },
    handleEdit (record) {
      this.resetForm()
      this.movieInfoForm.id = record.id || this.movieInfoIds
      console.log(this.movieInfoForm.id, record.id, this.movieInfoIds)
      getMovieInfo(this.movieInfoForm.id).then(
        res => {
          const result = res.data
          this.movieInfoForm = {
            id: this.movieInfoForm.id,
            name: result.movieName,
            type: result.movieType,
            introduction: result.introduction,
            bannerUrl: result.bannerUrl,
            movieActor: result.movieActor,
            tagId: result.tagList.map(value => value.id.toString())
          }
          episodesListForMovie(record.id).then(
            res => {
              if (res.code === 200) {
                this.episodesData = res.data
              }
            }
          )
          getMovieActor(this.movieActorForm.movieId).then(
            res => {
              if (res.code === 200) {
                this.actorData = res.data
              }
            }
          )
          this.modalTitle = '修改影视信息'
          this.modalVisible = true
        }
      )
    },
    handleDelete (record) {
      const that = this
      this.movieInfoForm.id = record.id || this.movieInfoIds
      deleteMovieInfo(this.movieInfoForm.id).then(
        res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
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
      this.$refs.queryForm.resetFields()
    },
    handleSubmitMovieInfo () {
      this.$refs.movieInfoRef.validate(
        valid => {
          if (valid) {
            console.log(this.movieInfoForm.id)
            if (this.movieInfoForm.id === null) {
              addMovieInfo(this.movieInfoForm).then(res => {
                if (res.code === 200) {
                  this.movieInfoForm.movieActor = this.actorData
                  this.$message.success('添加影视成功!')
                  this.modalVisible = false
                  this.getList()
                }
              })
            } else {
              updateMovieInfo(this.movieInfoForm).then(res => {
                if (res.code === 200) {
                  this.movieInfoForm.movieActor = this.actorData
                  this.$message.success('修改影视成功!')
                  this.modalVisible = false
                  this.getList()
                }
              })
            }
          }
        }
      )
    },
    handleCancelMovieInfo () {
      this.resetForm()
      this.modalVisible = false
    },
    onSelectChange (selectedRowKeys) {
      this.selectedMovieRowKeys = selectedRowKeys
      this.movieInfoIds = this.selectedMovieRowKeys
    },
    innerExpandedRowsChange (expandedRows) {

    },
    onSelectEpisodesChange (selectedRowKeys) {
      this.selectedEpisodesRowKeys = selectedRowKeys
      this.episodeIds = this.selectedEpisodesRowKeys
    },
    handleMovieFileRemove (file) {
      const index = this.movieFileList.indexOf(file)
      const newFileList = this.movieFileList.slice()
      newFileList.splice(index, 1)
      this.movieFileList = newFileList
    },
    beforeMovieFileUpload (file) {
      this.movieFileList = [...this.movieFileList, file]
      return false
    },
    handleMovieFileUpload () {

    },
    handleSubmitEpisodes () {
      this.$refs.movieEpisodesRef.validate(
        valid => {
          if (valid) {
            if (this.movieEpisodesForm.id === null) {
              this.movieEpisodesForm.movieId = this.movieInfoForm.id
              console.log(this.movieEpisodesForm.movieId, this.movieInfoForm.id)
              addEpisodes(this.movieEpisodesForm).then(res => {
                if (res.code === 200) {
                  this.$message.success('添加影视成功!')
                  this.episodesModalVisible = false
                  episodesListForMovie(this.movieInfoForm.id).then(
                    res => {
                      if (res.code === 200) {
                        this.episodesData = res.data
                      }
                    }
                  )
                }
              })
            } else {
              updateEpisodes(this.movieEpisodesForm).then(res => {
                if (res.code === 200) {
                  this.$message.success('修改影视成功!')
                  this.episodesModalVisible = false
                  episodesListForMovie(this.movieInfoForm.id).then(
                    res => {
                      if (res.code === 200) {
                        this.episodesData = res.data
                      }
                    }
                  )
                }
              })
            }
          }
        }
      )
    },
    handleCancelEpisodes () {
      this.resetEpisodesForm()
      this.episodesModalVisible = false
    },
    handleEpisodesAdd () {
      this.resetEpisodesForm()
      this.episodesModalTitle = '添加剧集'
      this.episodesModalVisible = true
    },
    resetEpisodesForm () {
      this.movieEpisodesForm = {
        title: '',
        movieUrl: '',
        id: null,
        movieId: null
      }
    },
    handleEpisodesEdit () {
      this.resetEpisodesForm()
      this.movieEpisodesForm.id = this.episodeIds
      getMovieEpisodes(this.movieEpisodesForm.id).then(
        res => {
          if (res.code === 200) {
            this.movieEpisodesForm = res.data
            this.episodesModalTitle = '修改剧集信息'
            this.episodesModalVisible = true
          }
        }
      )
    },
    handleEpisodesDelete () {
      const that = this
      deleteEpisodes(this.episodeIds).then(
        res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            that.onSelectEpisodesChange([])
            episodesListForMovie(this.movieInfoForm.id).then(
              res => {
                if (res.code === 200) {
                  this.episodesData = res.data
                }
              }
            )
          }
        }
      )
    },
    handleActorAdd () {
      this.actorModalTitle = '添加演职员'
      this.actorModalVisible = true
    },
    handleActorEdit () {
      // this.movieActorForm.movieId = this.selectedActorIds

    },
    handleActorDelete () {

    },
    onSelectActorChange (selectedRowKeys) {
      this.selectedActorRowKeys = selectedRowKeys
      this.selectedActorIds = this.selectedActorRowKeys
    },
    handleSubmitActor () {
      this.$refs.movieActorRef.validate(
        valid => {
            if (valid) {
              if (this.movieActorForm.movieId === null || this.movieActorForm.actorId === null) {
                const actorD = {
                  actorId: this.movieActorForm.actorId,
                  posts: this.movieActorForm.posts,
                  cosplayName: this.movieActorForm.cosplayName,
                  cosplayPhoto: this.movieActorForm.cosplayPhoto,
                  name: this.allActor.find((value) => value.id === this.movieActorForm.actorId).name,
                  photoUrl: this.allActor.find((value) => value.id === this.movieActorForm.actorId).photoUrl
                }
                console.log(actorD)
                this.actorData.push(actorD)
                this.actorModalVisible = false
              }
            }
        }
      )
    },
    handleCancelActor () {
      this.actorModalVisible = false
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
