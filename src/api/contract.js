// @ 符号在build/webpack.base.conf.js 中配置 表示 'src' 路径
import request from '@/utils/request'

export default {

  list() {
    return request({
      url:  '/admin/sb4u/contract/list',
      method: 'get'
    })
  },

  pageList(pageNo, pageSize, queryContractBaseDto) {
    return request({
      url:  `/admin/sb4u/contract/listpage/${pageNo}/${pageSize}`,
      method: 'get',
      params: queryContractBaseDto
    })
  },

  removeById(id) {
    return request({
      url: `/admin/sb4u/contract/remove/${id}`,
      method: 'delete'
    })
  },

  save(contract) {
    return request({
      url: '/admin/sb4u/contract/save',
      method: 'post',
      data: contract
    })
  },

  getById(id) {
    return request({
      url: `/admin/sb4u/contract/get/${id}`,
      method: 'get'
    })
  },

  updateById(contract) {
    return request({
      url: '/admin/sb4u/contract/update',
      method: 'put',
      data: contract
    })
  },

  getDownloadUrl(id) {
    return request ({
      url: 'http://localhost:8120/admin/contract/media-files/download?contractId=' + id,
      method: 'get',
    })
  },

  detectContract(params, fileId) {
    // 将 params 序列化为 JSON 字符串
  const jsonData = JSON.stringify({
    bugType: params,
    fileId: fileId
  });
    return request ({
      url: 'http://localhost:5000/predict',
      method: 'post',
      headers: {
        'Content-Type': 'application/json' // 设置请求头，指定发送的数据为 JSON 格式
      },
      data: jsonData
    })
  },

}
