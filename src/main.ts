import { readFileSync, writeFileSync } from 'fs'
import { FriendsFetcher } from './fetchers/github/FriendsFetcher'
import { LangListFetcher } from './fetchers/wakatime/LangListFetcher'
// import { TodayWorkFetcher } from './fetchers/wakatime/TodayWorkFetcher'
import { TableRenderer } from './renderers/TableRenderer'
import { TemplateRenderer } from './renderers/TemplateRenderer'

void (async () => {
  const template = readFileSync('./templates/README.md')
  const renderer = new TemplateRenderer()

  // const worksData = await new TodayWorkFetcher().fetch()
  const langListData = await new LangListFetcher().fetch()
  const friendsData = await new FriendsFetcher().fetch()

  for (const [langIndex, lang] of langListData.langs.entries()) {
    renderer
      .setData(`prefer[${langIndex}].name`, lang.name)
      .setData(`prefer[${langIndex}].color`, lang.color)
      .setData(`prefer[${langIndex}].percent`, lang.percent)
  }

  const friendsTable = new TableRenderer()
    .setImageWidth(100)
    .setTableWidth(6)
    .setTableData(friendsData.friends.map((v) => ({
      linkHref: v.html_url,
      imageUrl: v.avatar_url,
      label: v.login
    })))
    .render()

  const rendered = renderer
    .setTemplate(template.toString())
    // .setData('wakatoday.total_seconds', Math.floor(worksData.today * 1000))
    .setData('age', new Date().getFullYear() - 2005)
    .setData('friend.table', friendsTable)
    .render()

  writeFileSync('./README.md', rendered)
})()
