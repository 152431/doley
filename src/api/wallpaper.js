import request from './request'

export function getWallpaperList(params) {
  return request.get('/pub/wallpapers', { params })
}

export function getWallpaperDetail(id) {
  return request.get(`/pub/wallpapers/${id}`)
}

export function toggleLike(id) {
  return request.put(`/wallpapers/${id}/toggle-like`)
}

export function toggleCollect(id) {
  return request.put(`/wallpapers/${id}/toggle-collect`)
}

export function getUserCollections(params) {
  return request.get('/users/collections', { params })
}

export function getUserUploads(params) {
  return request.get('/wallpapers/user', { params })
}

export function getCategories() {
  return request.get('/pub/categories')
}

export function getHotWallpapers() {
  return request.get('/pub/wallpapers/hot')
}

export function getNewWallpapers() {
  return request.get('/pub/wallpapers/new')
}

export function getBanners() {
  return request.get('/pub/wallpapers/banners')
}

export function searchWallpapers(keyword, params = {}) {
  return request.get('/pub/wallpapers', { params: { ...params, keyword } })
}

export function getWallpaperComments(id) {
  return request.get(`/wallpapers/${id}/comments`)
}

export function addComment(id, content) {
  return request.post(`/wallpapers/${id}/comments`, { content })
}

export function deleteComment(wallpaperId, commentId) {
  return request.delete(`/wallpapers/${wallpaperId}/comments/${commentId}`)
}

export function getRankList(type) {
  return request.get(`/pub/statistics/${type}`)
}
