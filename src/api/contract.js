// @ 符号在build/webpack.base.conf.js 中配置 表示 'src' 路径
import request from '@/utils/request'

export default {

  list() {
    return request({
      url:  '/contract/list',
      method: 'get'
    })   
  },

  pageList(pageNo, pageSize, queryContractBaseDto) {
    return request({
      url:  `/contract/listpage/${pageNo}/${pageSize}`,
      method: 'get',
      params: queryContractBaseDto
    })
  },

  removeById(id) {
    return request({
      url: `/contract/remove/${id}`,
      method: 'delete'
    })
  },

  save(contract) {
    return request({
      url: '/contract/save',
      method: 'post',
      data: contract
    })
  },

  getById(id) {
    return request({
      url: `/contract/get/${id}`,
      method: 'get'
    })
  },

  updateById(contract) {
    return request({
      url: '/contract/update',
      method: 'put',
      data: contract
    })
  },

  getDownloadUrl(id) {
    return request ({
      url: '/minio/download?id=' + id,
      method: 'get',
    })
  },

  getDetectFileDownloadUrl(id) {
    console.log()
    return request ({
      url: 'minio/downloaddetectfile?id=' + id,
      method: 'get',
    })
  },

  detectContract(params, fileId) {
    // 将 params 序列化为 JSON 字符串
    const jsonData = JSON.stringify({
      toolType: params,
      fileId: fileId
    });
    return request ({
      url: 'http://localhost:5000/predict',
      method: 'post',
      timeout: 120000, // 设置超时时间为120000毫秒（120秒）
      headers: {
        'Content-Type': 'application/json' // 设置请求头，指定发送的数据为 JSON 格式
      },
      data: jsonData
    })
  },

  saveDetectResultFile(uploadFileParamsDto) {
    return request({
      url: 'minio/savemediainfo',
      method: 'post',
      timeout: 15000, // 设置超时时间为15000毫秒（15秒）
      headers: {
        'Content-Type': 'application/json' // 设置请求头，指定发送的数据为 JSON 格式
      },
      data: uploadFileParamsDto
    })
  },


  saveDetectResult(id, DetectResultList, detectFileId) {
    //console.log("jjjjjjjjjjjj:" + detectFileId)
    // 遍历列表，为每个元素添加 resultId 属性
    DetectResultList.forEach((item) => {
      item.resultId = detectFileId;
    });
    return request({
      url: `/contract/detect-result/save/${id}`,
      method: 'post',
      data: DetectResultList
    })
  },


  detectResPageList(pageNo, pageSize, queryDetectResultDto) {
    return request({
      url:  `/contract/detect-result/listpage/${pageNo}/${pageSize}`,
      method: 'get',
      params: queryDetectResultDto
    })
  },

  removeDetectRecordAndFile(id) {
    return request({
      url:  `/contract/detect-result/delete/${id}`,
      method: 'delete',
    })
  },


}
