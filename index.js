const { readFileSync, writeFileSync } = require('fs')
const { get } = require('superagent')

const CWD = process.cwd()

; (async () => {
  const waka = await get('https://wakatime.com/share/@PMH/4b833144-380e-4c3b-a0ec-5917c17ba03e.json')
  const wakadata = waka.body.data
  const wakatoday = wakadata.find((data) => data.range.text === 'Today')

  const wakalang = await get('https://wakatime.com/share/@PMH/27fab207-0cd4-4572-8493-664ed8c35736.json')
  const prefer = wakalang.body.data

  const template = readFileSync(CWD + '/templates/status.md').toString('utf-8')

  const followings = await get('https://api.github.com/users/pmh-only/following?per_page=100').set('User-Agent', 'Github Action').set('Accept', 'application/vnd.github.v3+json')
  const followers = await get('https://api.github.com/users/pmh-only/followers?per_page=100').set('User-Agent', 'Github Action').set('Accept', 'application/vnd.github.v3+json')

  const friends = followers.body.filter((follower) => followings.body.find((following) => following.login === follower.login))

  const result = template
    .replace(
      '{{wakatoday.total_total_seconds}}',
      Math.floor(wakatoday.grand_total.total_seconds * 1000)
    )
    .replace('{{prefer[0].name}}', prefer[0].name)
    .replace('{{prefer[1].name}}', prefer[1].name)
    .replace('{{prefer[2].name}}', prefer[2].name)
    .replace('{{prefer[3].name}}', prefer[3].name)
    .replace('{{prefer[4].name}}', prefer[4].name)
    .replace('{{prefer[0].percent}}', prefer[0].percent)
    .replace('{{prefer[1].percent}}', prefer[1].percent)
    .replace('{{prefer[2].percent}}', prefer[2].percent)
    .replace('{{prefer[3].percent}}', prefer[3].percent)
    .replace('{{prefer[4].percent}}', prefer[4].percent)
    .replace('{{prefer.all}}',
      prefer.slice(5).map((curr) => `\`${curr.name} (${curr.percent}%)\``).join(' • '))
    .replace('{{friend.table}}', createTable(friends))

  writeFileSync(CWD +'/README.md', result)
})()

function createTable (array) {
  let table = '<table><tr>'
  let c = 0

  for (const item of array) {
    table += `<td align="center"><a href="${item.html_url}"><img src="${item.avatar_url}&s=100" width="100px;"><br />${item.login}</a></td>`
    c++

    if (c % 5 === 0) {
      table += '</tr><tr>'
    }
  }

  table += '</tr></table>'
  return table
}
