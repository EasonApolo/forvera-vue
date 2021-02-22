const t = require('image-thumbnail')
const fs = require('fs').promises

const path = './dist/assets/602e1f6c2f53644419577f51/'
const filename = '602e1f6c2f53644419577f53.jpg'
const options = { width: 100, height: 100, fit: 'cover' }

async function main () {
  const thumb = await t(`${path+filename}`, options);
  await fs.writeFile(`${path}thumb_${filename}`, thumb)
  console.log(`Done`)
}

main()