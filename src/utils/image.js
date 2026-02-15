export function getImageUrl(url) {
  if (!url) return ''
  
  if (url.startsWith('data:')) {
    return url
  }
  
  if (url.startsWith('cloud://')) {
    return convertCloudUrl(url)
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  if (url.startsWith('/')) {
    return url
  }
  
  return `/api${url.startsWith('/') ? '' : '/'}${url}`
}

function convertCloudUrl(url) {
  if (!url) return ''
  if (!url.startsWith('cloud://')) return url
  const match = url.match(/cloud:\/\/[^/]+\/(.+)/)
  if (match) {
    return `https://636c-cloud1-0gijmolxd270849e-1306863978.tcb.qcloud.la/${match[1]}`
  }
  return url
}
